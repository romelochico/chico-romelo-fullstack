import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess } from '../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { supabase } = auth
  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    const { label, url, category } = req.body
    const { data, error } = await supabase
      .from('links')
      .update({ label, url, category })
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  return res.status(405).end()
}

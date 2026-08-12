import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess } from '../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { supabase } = auth
  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    const { name, role } = req.body
    const patch: Record<string, unknown> = {}
    if (name !== undefined) patch.name = name.trim()
    if (role !== undefined) patch.role = role?.trim() || null
    const { data, error } = await supabase
      .from('show_staff')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('show_staff').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  return res.status(405).end()
}

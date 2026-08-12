import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess } from '../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { supabase } = auth

  if (req.method === 'POST') {
    const { label, url, category, order, active } = req.body
    const { data, error } = await supabase
      .from('links')
      .insert({ label, url, category, order, active })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
}

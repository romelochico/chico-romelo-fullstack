import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess } from '../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { supabase } = auth

  if (req.method === 'POST') {
    const { category, subcategory, name, quantity, condition, notes } = req.body
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        category,
        subcategory: subcategory || null,
        name,
        quantity,
        condition,
        notes: notes || null,
      })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess, canManageEventos } from '../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { tier, supabase } = auth

  if (req.method !== 'GET' && !canManageEventos(tier)) {
    return res.status(403).json({ error: 'Acesso somente leitura a eventos.' })
  }

  if (req.method === 'GET') {
    const { event_id } = req.query
    if (!event_id) return res.status(400).json({ error: 'event_id required' })
    const { data, error } = await supabase
      .from('show_gear')
      .select('*, inventory(*)')
      .eq('event_id', event_id)
      .order('created_at')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { event_id, inventory_id, quantity_taken } = req.body
    const { data, error } = await supabase
      .from('show_gear')
      .upsert({ event_id, inventory_id, quantity_taken }, { onConflict: 'event_id,inventory_id' })
      .select('*, inventory(*)')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
}

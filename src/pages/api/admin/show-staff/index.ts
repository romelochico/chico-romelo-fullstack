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
      .from('show_staff')
      .select('*')
      .eq('event_id', event_id)
      .order('created_at')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { event_id, name, role } = req.body
    if (!event_id || !name?.trim())
      return res.status(400).json({ error: 'event_id e name são obrigatórios' })
    const { data, error } = await supabase
      .from('show_staff')
      .insert({ event_id, name: name.trim(), role: role?.trim() || null })
      .select('*')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
}

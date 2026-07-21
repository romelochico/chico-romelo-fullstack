import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function getUser(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await adminClient().auth.getUser(token)
  return user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Não autenticado.' })

  const supabase = adminClient()

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
    if (!event_id || !name?.trim()) return res.status(400).json({ error: 'event_id e name são obrigatórios' })
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

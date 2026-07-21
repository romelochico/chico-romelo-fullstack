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

interface ReorderUpdate {
  id: string
  block_id: string
  position: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Não autenticado.' })

  if (req.method !== 'POST') return res.status(405).end()

  const { updates } = req.body as { updates: ReorderUpdate[] }
  if (!Array.isArray(updates)) return res.status(400).json({ error: 'updates array required' })

  const supabase = adminClient()
  const results = await Promise.all(
    updates.map(u =>
      supabase.from('show_setlist_songs').update({ block_id: u.block_id, position: u.position }).eq('id', u.id)
    )
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return res.status(500).json({ error: failed.error.message })

  return res.status(200).json({ ok: true })
}

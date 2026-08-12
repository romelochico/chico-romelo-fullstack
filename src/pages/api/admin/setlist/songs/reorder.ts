import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess } from '../../../../../lib/api-auth'

interface ReorderUpdate {
  id: string
  block_id: string
  position: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { supabase } = auth

  if (req.method !== 'POST') return res.status(405).end()

  const { updates } = req.body as { updates: ReorderUpdate[] }
  if (!Array.isArray(updates)) return res.status(400).json({ error: 'updates array required' })

  const results = await Promise.all(
    updates.map(u =>
      supabase
        .from('show_setlist_songs')
        .update({ block_id: u.block_id, position: u.position })
        .eq('id', u.id)
    )
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return res.status(500).json({ error: failed.error.message })

  return res.status(200).json({ ok: true })
}

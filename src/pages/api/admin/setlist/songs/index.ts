import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess, canManageEventos } from '../../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { tier, supabase } = auth

  if (!canManageEventos(tier)) {
    return res.status(403).json({ error: 'Acesso somente leitura a eventos.' })
  }

  if (req.method === 'POST') {
    const { block_id, title } = req.body
    if (!block_id || !title?.trim())
      return res.status(400).json({ error: 'block_id e title são obrigatórios' })

    const { count } = await supabase
      .from('show_setlist_songs')
      .select('id', { count: 'exact', head: true })
      .eq('block_id', block_id)

    const { data, error } = await supabase
      .from('show_setlist_songs')
      .insert({ block_id, title: title.trim(), position: count ?? 0 })
      .select('*')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ...data, speeches: [] })
  }

  return res.status(405).end()
}

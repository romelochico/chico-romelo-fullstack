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
    const { song_id, timing, speaker, text } = req.body
    if (!song_id || !timing || !speaker?.trim() || !text?.trim()) {
      return res.status(400).json({ error: 'song_id, timing, speaker e text são obrigatórios' })
    }
    if (timing !== 'before' && timing !== 'after') {
      return res.status(400).json({ error: 'timing deve ser "before" ou "after"' })
    }

    const { count } = await supabase
      .from('show_setlist_speeches')
      .select('id', { count: 'exact', head: true })
      .eq('song_id', song_id)
      .eq('timing', timing)

    const { data, error } = await supabase
      .from('show_setlist_speeches')
      .insert({ song_id, timing, speaker: speaker.trim(), text: text.trim(), position: count ?? 0 })
      .select('*')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  return res.status(405).end()
}

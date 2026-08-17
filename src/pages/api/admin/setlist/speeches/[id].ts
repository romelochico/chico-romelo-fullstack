import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess, canManageEventos } from '../../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { tier, supabase } = auth
  const { id } = req.query as { id: string }

  if (!canManageEventos(tier)) {
    return res.status(403).json({ error: 'Acesso somente leitura a eventos.' })
  }

  if (req.method === 'PUT') {
    const { speaker, text } = req.body
    const patch: Record<string, unknown> = {}
    if (speaker !== undefined) patch.speaker = speaker.trim()
    if (text !== undefined) patch.text = text.trim()
    const { data, error } = await supabase
      .from('show_setlist_speeches')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('show_setlist_speeches').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(204).end()
  }

  return res.status(405).end()
}

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

    const { data: blocks, error: blocksErr } = await supabase
      .from('show_setlist_blocks')
      .select('*')
      .eq('event_id', event_id)
      .order('position')
    if (blocksErr) return res.status(500).json({ error: blocksErr.message })

    const blockIds = (blocks ?? []).map(b => b.id)
    const { data: songs, error: songsErr } = blockIds.length
      ? await supabase.from('show_setlist_songs').select('*').in('block_id', blockIds).order('position')
      : { data: [] as { id: string; block_id: string }[], error: null }
    if (songsErr) return res.status(500).json({ error: songsErr.message })

    const songIds = (songs ?? []).map(s => s.id)
    const { data: speeches, error: speechesErr } = songIds.length
      ? await supabase.from('show_setlist_speeches').select('*').in('song_id', songIds).order('position')
      : { data: [] as { id: string; song_id: string }[], error: null }
    if (speechesErr) return res.status(500).json({ error: speechesErr.message })

    const tree = (blocks ?? []).map(block => ({
      ...block,
      songs: (songs ?? [])
        .filter(s => s.block_id === block.id)
        .map(song => ({
          ...song,
          speeches: (speeches ?? []).filter(sp => sp.song_id === song.id),
        })),
    }))

    return res.status(200).json(tree)
  }

  if (req.method === 'POST') {
    const { event_id, name } = req.body
    if (!event_id) return res.status(400).json({ error: 'event_id required' })

    const { count } = await supabase
      .from('show_setlist_blocks')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', event_id)

    const { data, error } = await supabase
      .from('show_setlist_blocks')
      .insert({ event_id, name: name?.trim() || null, position: count ?? 0 })
      .select('*')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ...data, songs: [] })
  }

  return res.status(405).end()
}

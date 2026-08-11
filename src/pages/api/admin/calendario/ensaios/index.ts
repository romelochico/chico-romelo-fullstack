import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { listRehearsals, createRehearsal, toCalendarioEvento, calendarioFormToPayload, NboxesApiError } from '../../../../../lib/nboxes'

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
  const {
    data: { user },
  } = await adminClient().auth.getUser(token)
  return user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'Não autenticado.' })

  try {
    if (req.method === 'GET') {
      const { from, to } = req.query as { from?: string; to?: string }
      const rehearsals = await listRehearsals(from, to)
      return res.status(200).json(rehearsals.map(toCalendarioEvento))
    }

    if (req.method === 'POST') {
      const { nome, data_inicio, hora_inicio, hora_fim } = req.body
      if (!nome || !data_inicio || !hora_inicio) {
        return res.status(400).json({ error: 'Nome, data e hora inicial são obrigatórios.' })
      }
      const created = await createRehearsal(calendarioFormToPayload({ nome, data_inicio, hora_inicio, hora_fim }))
      return res.status(201).json(toCalendarioEvento(created))
    }

    return res.status(405).end()
  } catch (err) {
    if (err instanceof NboxesApiError) {
      return res.status(err.status).json({ error: err.message, details: err.details })
    }
    console.error(err)
    return res.status(500).json({ error: 'Erro ao comunicar com nboxes.' })
  }
}

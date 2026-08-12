import type { NextApiRequest, NextApiResponse } from 'next'
import {
  listRehearsals,
  createRehearsal,
  toCalendarioEvento,
  calendarioFormToPayload,
  NboxesApiError,
} from '../../../../../lib/nboxes'
import { requireAccess } from '../../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { tier } = auth

  try {
    if (req.method === 'GET') {
      const { from, to } = req.query as { from?: string; to?: string }
      const rehearsals = await listRehearsals(from, to)
      return res.status(200).json(rehearsals.map(toCalendarioEvento))
    }

    if (req.method === 'POST') {
      if (tier !== 'admin' && tier !== 'membro_da_banda') {
        return res.status(403).json({ error: 'Apenas membros da banda podem adicionar eventos.' })
      }
      const { nome, data_inicio, hora_inicio, hora_fim } = req.body
      if (!nome || !data_inicio || !hora_inicio) {
        return res.status(400).json({ error: 'Nome, data e hora inicial são obrigatórios.' })
      }
      const created = await createRehearsal(
        calendarioFormToPayload({ nome, data_inicio, hora_inicio, hora_fim })
      )
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

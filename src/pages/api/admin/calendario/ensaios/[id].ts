import type { NextApiRequest, NextApiResponse } from 'next'
import {
  updateRehearsal,
  deleteRehearsal,
  toCalendarioEvento,
  calendarioFormToPayload,
  NboxesApiError,
} from '../../../../../lib/nboxes'
import { requireAccess } from '../../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return

  const { id } = req.query as { id: string }

  try {
    if (req.method === 'PATCH' || req.method === 'PUT') {
      const { nome, data_inicio, hora_inicio, hora_fim } = req.body
      if (!nome || !data_inicio || !hora_inicio) {
        return res.status(400).json({ error: 'Nome, data e hora inicial são obrigatórios.' })
      }
      const updated = await updateRehearsal(
        id,
        calendarioFormToPayload({ nome, data_inicio, hora_inicio, hora_fim })
      )
      return res.status(200).json(toCalendarioEvento(updated))
    }

    if (req.method === 'DELETE') {
      await deleteRehearsal(id)
      return res.status(204).end()
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

import type { NextApiRequest, NextApiResponse } from 'next'
import { checkAvailability, NboxesApiError } from '../../../../../lib/nboxes'
import { requireAccess } from '../../../../../lib/api-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return

  if (req.method !== 'GET') return res.status(405).end()

  const { date, time, end_time } = req.query as { date?: string; time?: string; end_time?: string }
  if (!date) return res.status(400).json({ error: "Parâmetro 'date' é obrigatório." })

  try {
    const result = await checkAvailability(date, time, end_time)
    return res.status(200).json(result)
  } catch (err) {
    if (err instanceof NboxesApiError) {
      return res.status(err.status).json({ error: err.message, details: err.details })
    }
    console.error(err)
    return res.status(500).json({ error: 'Erro ao comunicar com nboxes.' })
  }
}

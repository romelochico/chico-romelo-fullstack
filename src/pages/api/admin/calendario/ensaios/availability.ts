import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { checkAvailability, NboxesApiError } from '../../../../../lib/nboxes'

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

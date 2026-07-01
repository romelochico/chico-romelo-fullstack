import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ResponseData {
  ok?: boolean
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, subject, message } = req.body as Record<string, string>

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta.' })
  }

  const { error } = await supabase.from('contatos').insert({
    name,
    email,
    subject: subject || 'outro',
    message,
    read: false,
  })

  if (error) {
    console.error('[api/contatos]', error)
    return res.status(500).json({ error: 'Erro ao guardar mensagem. Tente novamente.' })
  }

  return res.status(200).json({ ok: true })
}

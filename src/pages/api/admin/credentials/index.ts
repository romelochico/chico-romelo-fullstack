import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAccess, canAccessCredentials } from '../../../../lib/api-auth'
import { encrypt, decrypt } from '../../../../lib/crypto'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireAccess(req, res)
  if (!auth) return
  const { supabase, tier } = auth
  if (!canAccessCredentials(tier)) {
    return res.status(403).json({ error: 'Acesso negado.' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    const decrypted = (data ?? []).map(row => ({ ...row, password: decrypt(row.password) }))
    return res.status(200).json(decrypted)
  }

  if (req.method === 'POST') {
    const { site_url, label, login, password } = req.body
    const { data, error } = await supabase
      .from('credentials')
      .insert({ site_url, label, login, password: encrypt(password) })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ ...data, password })
  }

  return res.status(405).end()
}

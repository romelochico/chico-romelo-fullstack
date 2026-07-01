import { createClient } from '../../../lib/supabase/server'
import { getProfile } from '../../../lib/user-profiles'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const supabase = createClient(req, res)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return res.status(401).json({ error: 'Não autenticado.' })

  const profile = getProfile(user.email)
  return res.status(200).json(profile ?? { nome: user.email, papel: null })
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '../../../lib/supabase/server'
import { getProfile } from '../../../lib/user-profiles'
import type { UserProfile } from '../../../types'

type ResponseData = UserProfile | { error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'GET') return res.status(405).end()

  const supabase = createClient(req, res)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return res.status(401).json({ error: 'Não autenticado.' } as { error: string })

  const profile = getProfile(user.email)
  return res.status(200).json(profile ?? { nome: user.email ?? '', papel: null })
}

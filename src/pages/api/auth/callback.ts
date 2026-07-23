import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '../../../lib/supabase/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

  if (typeof code === 'string') {
    const supabase = createClient(req, res)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[api/auth/callback]', error)
      return res.redirect(302, '/admin/login?error=oauth')
    }
  }

  return res.redirect(302, '/admin/dashboard')
}

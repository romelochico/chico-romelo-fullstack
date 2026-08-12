import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export type Tier = 'admin' | 'diretoria' | 'marketing' | 'equipe' | 'membro_da_banda'

const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL ?? '').toLowerCase()

export function adminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

interface AccessAuth {
  user: User
  supabase: SupabaseClient
  tier: Tier
}

/**
 * Validates the caller's Bearer token AND resolves their permission tier —
 * independently of the /admin middleware gate. The SUPER_ADMIN_EMAIL env var
 * is always tier 'admin' regardless of the database (bootstrap safety net,
 * so a bad row can never lock the admin out). Everyone else needs a row in
 * team_members with a tier assigned; no row/no tier means they haven't been
 * invited yet and are denied. Writes the 401/403 response itself and returns
 * null when unauthorized, so route handlers can just `if (!auth) return`.
 */
export async function requireAccess(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AccessAuth | null> {
  const supabase = adminClient()
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ error: 'Não autenticado.' })
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) {
    res.status(401).json({ error: 'Não autenticado.' })
    return null
  }

  const email = user.email?.toLowerCase() ?? ''
  if (SUPER_ADMIN_EMAIL && email === SUPER_ADMIN_EMAIL) {
    return { user, supabase, tier: 'admin' }
  }

  const { data: row } = await supabase
    .from('team_members')
    .select('tier')
    .eq('email', email)
    .maybeSingle()

  const tier = row?.tier as Tier | undefined
  if (!tier) {
    res.status(403).json({ error: 'Acesso negado. Peça um convite ao administrador.' })
    return null
  }

  return { user, supabase, tier }
}

/** Only admin/diretoria/marketing can see or manage saved site credentials. */
export function canAccessCredentials(tier: Tier): boolean {
  return tier === 'admin' || tier === 'diretoria' || tier === 'marketing'
}

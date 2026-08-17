import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL ?? '').toLowerCase()

// percussao_e_metais is a view-only tier: Calendário, Eventos (plus its
// gear/staff/setlist detail page) and Banda e Equipe only. Everyone else
// (any other assigned tier) keeps full page access, unchanged.
const RESTRICTED_TIER = 'percussao_e_metais'
const RESTRICTED_TIER_HOME = '/admin/calendario'
const RESTRICTED_TIER_ALLOWED_PREFIXES = [
  '/admin/calendario',
  '/admin/eventos',
  '/admin/equipe',
  '/api/admin/calendario',
  '/api/admin/show-gear',
  '/api/admin/show-staff',
  '/api/admin/setlist',
]

/**
 * The super admin's email (env var, never in source) is always allowed in,
 * regardless of the database — a bootstrap safety net so a bad row can never
 * lock the admin out. Everyone else needs a tier assigned in team_members
 * (get_my_tier() RPC); no tier means they haven't been invited yet.
 */
async function resolveTier(supabase: SupabaseClient, email: string): Promise<string | null> {
  if (SUPER_ADMIN_EMAIL && email === SUPER_ADMIN_EMAIL) return 'admin'
  const { data } = await supabase.rpc('get_my_tier')
  return (data as string | null) ?? null
}

function homeFor(tier: string): string {
  return tier === RESTRICTED_TIER ? RESTRICTED_TIER_HOME : '/admin/dashboard'
}

function isAllowedForTier(tier: string, pathname: string): boolean {
  if (tier !== RESTRICTED_TIER) return true
  return RESTRICTED_TIER_ALLOWED_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`))
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Login page: redirect to the tier's home page if already authenticated
  if (pathname === '/admin/login') {
    if (user) {
      const email = user.email?.toLowerCase() ?? ''
      const tier = await resolveTier(supabase, email)
      if (tier) {
        return NextResponse.redirect(new URL(homeFor(tier), request.url))
      }
    }
    return supabaseResponse
  }

  // All other /admin/* routes: require auth + an assigned tier
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
    const email = user.email?.toLowerCase() ?? ''
    const tier = await resolveTier(supabase, email)
    if (!tier) {
      await supabase.auth.signOut()
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (!isAllowedForTier(tier, pathname)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
      }
      return NextResponse.redirect(new URL(homeFor(tier), request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/admin/show-gear/:path*'],
}

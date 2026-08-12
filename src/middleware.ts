import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'

const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL ?? '').toLowerCase()

/**
 * The super admin's email (env var, never in source) is always allowed in,
 * regardless of the database — a bootstrap safety net so a bad row can never
 * lock the admin out. Everyone else needs a tier assigned in team_members
 * (get_my_tier() RPC); no tier means they haven't been invited yet.
 */
async function hasAccess(supabase: SupabaseClient, email: string): Promise<boolean> {
  if (SUPER_ADMIN_EMAIL && email === SUPER_ADMIN_EMAIL) return true
  const { data } = await supabase.rpc('get_my_tier')
  return !!data
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

  // Login page: redirect to dashboard if already authenticated
  if (pathname === '/admin/login') {
    if (user) {
      const email = user.email?.toLowerCase() ?? ''
      if (await hasAccess(supabase, email)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
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
    if (!(await hasAccess(supabase, email))) {
      await supabase.auth.signOut()
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/admin/show-gear/:path*'],
}

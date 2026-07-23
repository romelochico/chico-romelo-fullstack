import { createServerClient } from '@supabase/ssr'
import { serialize } from 'cookie'
import type { IncomingMessage, ServerResponse } from 'http'
import type { SupabaseClient } from '@supabase/supabase-js'

export function createClient(
  req: IncomingMessage & { cookies: Partial<{ [key: string]: string }> },
  res: ServerResponse
): SupabaseClient {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(req.cookies).map(([name, value]) => ({ name, value: value ?? '' }))
        },
        setAll(cookiesToSet) {
          const existing = res.getHeader('Set-Cookie')
          const existingCookies = Array.isArray(existing)
            ? existing.map(String)
            : existing
              ? [String(existing)]
              : []
          const newCookies = cookiesToSet.map(({ name, value, options }) =>
            serialize(name, value, { path: '/', ...options })
          )
          res.setHeader('Set-Cookie', [...existingCookies, ...newCookies])
        },
      },
    }
  )
}

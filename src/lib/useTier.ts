import { useEffect, useState } from 'react'
import { createClient } from './supabase/client'
import type { Tier } from '../types'

// Module-scoped, so it survives client-side page navigations (no full
// reload in Next.js) and each admin page only pays for the RPC once per
// session instead of re-fetching — and re-rendering — on every mount.
let cachedTier: Tier | null | undefined
let inFlight: Promise<Tier | null> | null = null

function fetchTier(): Promise<Tier | null> {
  if (!inFlight) {
    inFlight = Promise.resolve(createClient().rpc('get_my_tier')).then(({ data }) => {
      cachedTier = (data as Tier | null) ?? null
      return cachedTier
    })
  }
  return inFlight
}

export function useTier(): { tier: Tier | null; loading: boolean } {
  const [tier, setTier] = useState<Tier | null>(cachedTier ?? null)
  const [loading, setLoading] = useState(cachedTier === undefined)

  useEffect(() => {
    if (cachedTier !== undefined) return
    fetchTier().then(t => {
      setTier(t)
      setLoading(false)
    })
  }, [])

  return { tier, loading }
}

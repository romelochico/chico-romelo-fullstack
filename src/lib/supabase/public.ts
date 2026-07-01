import { createClient } from '@supabase/supabase-js'

// Lightweight client for getStaticProps / server-side public reads.
// Uses anon key — RLS restricts to published rows for unauthenticated requests.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

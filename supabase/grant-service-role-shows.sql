-- Run this in the Supabase SQL editor
-- The `shows` table was created without a grant for service_role, so
-- server-side admin API routes (which use the service role key to bypass RLS)
-- get "permission denied for table shows" even though the table exists.
grant all on table shows to authenticated, service_role;

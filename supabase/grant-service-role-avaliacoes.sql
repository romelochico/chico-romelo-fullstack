-- Run this in the Supabase SQL editor
-- Same issue as shows: avaliacoes was created without a grant for service_role,
-- so server-side admin API routes get "permission denied for table avaliacoes".
grant all on table avaliacoes to authenticated, service_role;

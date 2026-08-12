-- Run this in the Supabase SQL editor.
-- Locks the credentials table down to the service-role key only. Previously
-- any authenticated user (all 7 band/crew logins) could query this table
-- directly from the browser and read every saved site password in plain
-- text. All reads/writes now go through /api/admin/credentials, which
-- independently re-checks the ADMIN_EMAILS whitelist (see
-- src/lib/api-auth.ts) and decrypts on the way out (src/lib/crypto.ts) —
-- so direct client access is no longer needed and is removed entirely.
drop policy if exists "admin all credentials" on credentials;

revoke all on table credentials from authenticated, anon;
grant all on table credentials to service_role;

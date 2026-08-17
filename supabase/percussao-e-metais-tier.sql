-- Run this in the Supabase SQL editor, after team-tiers.sql and
-- calendario-tier-restrict.sql.
--
-- Adds a new tier: percussao_e_metais. View-only access to Calendário,
-- Eventos (including the gear/staff/setlist detail page) and Banda e
-- Equipe (team roster) — same self-only edit rule as every other non-admin
-- tier already has on their own team_members row (team-tiers.sql). No
-- other admin page is reachable for this tier (enforced in
-- src/middleware.ts, not here).
--
-- The show_gear/show_setlist_*/show_staff API routes
-- (src/pages/api/admin/show-gear, show-staff, setlist) use a service-role
-- client that bypasses RLS entirely, so their write lockout for this tier
-- lives in application code (canManageEventos() in src/lib/api-auth.ts),
-- not here.

alter table team_members drop constraint if exists team_members_tier_check;
alter table team_members add constraint team_members_tier_check
  check (tier in (
    'admin', 'diretoria', 'marketing', 'equipe', 'membro_da_banda', 'percussao_e_metais'
  ));

-- events: eventos.tsx + eventos/[id].tsx write directly via the browser
-- client, so RLS is the actual enforcement point here (unlike show_gear
-- etc. above).
drop policy if exists "admin write events" on events;
create policy "admin write events" on events for all
  using (auth.role() = 'authenticated' and coalesce(get_my_tier(), '') <> 'percussao_e_metais')
  with check (auth.role() = 'authenticated' and coalesce(get_my_tier(), '') <> 'percussao_e_metais');

-- calendario_eventos: insert is already admin/membro_da_banda-only
-- (calendario-tier-restrict.sql), so percussao_e_metais is already
-- excluded there. Tighten update/delete, which were open to any
-- authenticated user.
drop policy if exists "calendario_eventos update" on calendario_eventos;
create policy "calendario_eventos update" on calendario_eventos
  for update
  using (auth.role() = 'authenticated' and coalesce(get_my_tier(), '') <> 'percussao_e_metais')
  with check (auth.role() = 'authenticated' and coalesce(get_my_tier(), '') <> 'percussao_e_metais');

drop policy if exists "calendario_eventos delete" on calendario_eventos;
create policy "calendario_eventos delete" on calendario_eventos
  for delete
  using (auth.role() = 'authenticated' and coalesce(get_my_tier(), '') <> 'percussao_e_metais');

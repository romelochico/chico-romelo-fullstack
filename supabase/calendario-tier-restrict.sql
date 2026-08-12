-- Run this in the Supabase SQL editor, after team-tiers.sql (needs get_my_tier()).
--
-- Restricts CREATING new calendario_eventos rows (shows/publicidade/suporte
-- de eventos — ensaios live in nboxes and are gated separately in
-- src/pages/api/admin/calendario/ensaios/index.ts) to admin + membro_da_banda.
-- Viewing/editing/deleting stays open to everyone with admin panel access,
-- unchanged.

drop policy if exists "admin all calendario_eventos" on calendario_eventos;
drop policy if exists "calendario_eventos select" on calendario_eventos;
drop policy if exists "calendario_eventos insert" on calendario_eventos;
drop policy if exists "calendario_eventos update" on calendario_eventos;
drop policy if exists "calendario_eventos delete" on calendario_eventos;

create policy "calendario_eventos select" on calendario_eventos
  for select
  using (auth.role() = 'authenticated');

create policy "calendario_eventos insert" on calendario_eventos
  for insert
  with check (get_my_tier() in ('admin', 'membro_da_banda'));

create policy "calendario_eventos update" on calendario_eventos
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "calendario_eventos delete" on calendario_eventos
  for delete
  using (auth.role() = 'authenticated');

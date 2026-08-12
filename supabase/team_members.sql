-- Run this in the Supabase SQL editor
create table if not exists team_members (
  id              uuid        primary key default gen_random_uuid(),
  email           text        not null unique,
  nome            text,
  sobrenome       text,
  avatar_url      text,
  telefone        text,
  data_nascimento date,
  redes_sociais   text,
  papel           text,
  delete_requested_at timestamptz,
  created_at      timestamptz default now()
);

alter table team_members add column if not exists delete_requested_at timestamptz;

alter table team_members enable row level security;

-- Everyone authenticated can see the roster.
drop policy if exists "admin all team_members" on team_members;
drop policy if exists "team_members select" on team_members;
create policy "team_members select" on team_members
  for select
  using (auth.role() = 'authenticated');

-- Bootstrap policies — intentionally self-scoped only. team-tiers.sql (run
-- right after this file) supersedes these with the real "admin can manage
-- anyone" policies once get_my_tier() exists, so there's no hardcoded admin
-- email here at all.
--
-- Self-only insert/update is what lets the Google-login sync seed a brand
-- new member's own row on first sign-in. Delete is blocked entirely until
-- team-tiers.sql adds the admin-only delete policy.
drop policy if exists "team_members insert" on team_members;
create policy "team_members insert" on team_members
  for insert
  with check ((auth.jwt() ->> 'email') = email);

drop policy if exists "team_members update" on team_members;
create policy "team_members update" on team_members
  for update
  using ((auth.jwt() ->> 'email') = email)
  with check ((auth.jwt() ->> 'email') = email);

drop policy if exists "team_members delete" on team_members;
create policy "team_members delete" on team_members
  for delete
  using (false);

grant all on table team_members to authenticated, service_role;

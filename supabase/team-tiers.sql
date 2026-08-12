-- Run this in the Supabase SQL editor, after team_members.sql.
--
-- Adds a permission-tier system on top of team_members:
--   admin            - the band lead's own account. Not assignable via the
--                       UI (see ASSIGNABLE_TIERS in equipe.tsx) — a row only
--                       gets this tier from the one-time backfill below, or
--                       by editing the database directly. The app also has a
--                       SUPER_ADMIN_EMAIL env var (src/lib/api-auth.ts,
--                       src/middleware.ts) as a bootstrap fallback that
--                       works even if this table is broken — it is NOT
--                       stored here or anywhere else in the repo.
--   diretoria        - full access, including Credenciais.
--   marketing        - same as diretoria.
--   equipe           - full access, EXCEPT Credenciais.
--   membro_da_banda  - full access except Credenciais, AND can only see
--                       other membro_da_banda rows in the team roster.
--
-- A row with tier = null has NOT been invited yet and cannot log into
-- /admin/* at all (see middleware + requireAccess()).

alter table team_members
  add column if not exists tier text
  check (tier in ('admin', 'diretoria', 'marketing', 'equipe', 'membro_da_banda'));

-- One-time seed: replace the email below with the band lead's own email
-- before running, then everyone else already in the table defaults to
-- membro_da_banda. Reassign via the Equipe admin page as needed. This line
-- is the only place an admin email needs to be named — everything after it
-- is tier-based, no hardcoded email anywhere else.
update team_members set tier = 'admin' where email = 'romelochico@gmail.com';
update team_members set tier = 'membro_da_banda' where tier is null;

-- security definer so it can read team_members regardless of the caller's
-- own row-level visibility — used by RLS + middleware + API routes to look
-- up "what tier am I" without a recursive/self-referential policy.
create or replace function get_my_tier()
returns text
language sql
security definer
stable
as $$
  select tier from team_members where email = (auth.jwt() ->> 'email') limit 1;
$$;

grant execute on function get_my_tier() to authenticated;

-- Blocks anyone whose own tier isn't 'admin' (or the service-role key) from
-- changing the tier column — including on their own row. Without this, RLS
-- alone would let a member self-promote by editing their own row directly.
create or replace function enforce_tier_admin_only()
returns trigger
language plpgsql
as $$
begin
  if (new.tier is distinct from old.tier)
     and auth.role() <> 'service_role'
     and coalesce(get_my_tier(), '') <> 'admin' then
    raise exception 'Apenas o admin pode alterar o tier.';
  end if;
  return new;
end;
$$;

drop trigger if exists team_members_tier_guard on team_members;
create trigger team_members_tier_guard
  before update on team_members
  for each row
  execute function enforce_tier_admin_only();

-- Everyone sees their own row. Anyone whose own tier isn't membro_da_banda
-- (including admin) sees everyone. A membro_da_banda viewer only sees other
-- membro_da_banda rows (plus their own, covered above).
drop policy if exists "team_members select" on team_members;
create policy "team_members select" on team_members
  for select
  using (
    email = (auth.jwt() ->> 'email')
    or get_my_tier() is distinct from 'membro_da_banda'
    or tier = 'membro_da_banda'
  );

-- Supersedes team_members.sql's self-only insert/update and no-delete
-- policies: the admin can also manage anyone's row, tier-checked instead of
-- by a hardcoded email.
drop policy if exists "team_members insert" on team_members;
create policy "team_members insert" on team_members
  for insert
  with check ((auth.jwt() ->> 'email') = email or get_my_tier() = 'admin');

drop policy if exists "team_members update" on team_members;
create policy "team_members update" on team_members
  for update
  using ((auth.jwt() ->> 'email') = email or get_my_tier() = 'admin')
  with check ((auth.jwt() ->> 'email') = email or get_my_tier() = 'admin');

drop policy if exists "team_members delete" on team_members;
create policy "team_members delete" on team_members
  for delete
  using (get_my_tier() = 'admin');

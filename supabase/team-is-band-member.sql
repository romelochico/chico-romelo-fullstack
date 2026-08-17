-- Run this in the Supabase SQL editor.
--
-- Lets the Equipe page separate band members from crew/staff. Defaults to
-- true so every existing row keeps showing under "Banda" until someone
-- flips it — covered by the same self-only / admin RLS policies as every
-- other profile field (team_members.sql, team-tiers.sql), no new policy
-- needed.
alter table team_members
  add column if not exists is_band_member boolean not null default true;

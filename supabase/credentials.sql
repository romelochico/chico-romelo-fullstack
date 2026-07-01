-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists credentials (
  id         uuid        primary key default gen_random_uuid(),
  site_url   text        not null,
  label      text        not null,
  login      text        not null,
  password   text        not null,
  created_at timestamptz default now()
);

alter table credentials enable row level security;

-- Only authenticated admins can access credentials (never public)
create policy "admin all credentials" on credentials
  for all using (auth.role() = 'authenticated');

grant all on table credentials to authenticated, service_role;

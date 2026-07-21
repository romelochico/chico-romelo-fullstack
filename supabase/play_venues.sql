-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists play_venues (
  id                 uuid        primary key default gen_random_uuid(),
  name               text        not null,
  venue_contact_name text,
  band_contact_name  text,
  contact_type       text        check (contact_type in ('email', 'telefone', 'whatsapp')),
  contact_value      text,
  location           text,
  description        text,
  feedback           text,
  created_at         timestamptz default now()
);

alter table play_venues enable row level security;

create policy "admin all play_venues" on play_venues
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table play_venues to authenticated, service_role;

-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists open_calls (
  id                  uuid        primary key default gen_random_uuid(),
  name                text        not null,
  website_url         text,
  application_period  text,
  application_date    date        not null,
  form_url            text,
  prizes              text,
  created_at          timestamptz default now()
);

alter table open_calls enable row level security;

create policy "admin all open_calls" on open_calls
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table open_calls to authenticated, service_role;

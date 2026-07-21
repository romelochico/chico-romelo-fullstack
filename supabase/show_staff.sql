-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists show_staff (
  id         uuid        primary key default gen_random_uuid(),
  event_id   uuid        not null references events(id) on delete cascade,
  name       text        not null,
  role       text,
  created_at timestamptz default now()
);

alter table show_staff enable row level security;

create policy "admin all show_staff" on show_staff
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table show_staff to authenticated, service_role;

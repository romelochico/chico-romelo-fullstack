-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists show_gear (
  id                uuid        primary key default gen_random_uuid(),
  event_id          uuid        not null references events(id) on delete cascade,
  inventory_id      uuid        not null references inventory(id) on delete cascade,
  quantity_taken    int         not null default 1,
  quantity_returned int         not null default 0,
  created_at        timestamptz default now(),
  unique(event_id, inventory_id)
);

alter table show_gear enable row level security;

create policy "admin all show_gear" on show_gear
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table show_gear to authenticated, service_role;

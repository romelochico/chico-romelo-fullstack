-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists inventory (
  id          uuid        primary key default gen_random_uuid(),
  category    text        not null,
  subcategory text,
  name        text        not null,
  quantity    int         not null default 1,
  condition   text        not null default 'good',
  notes       text,
  created_at  timestamptz default now()
);

alter table inventory enable row level security;

create policy "admin all inventory" on inventory
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table inventory to authenticated, service_role;

-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists novidades (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  created_by  text        not null,
  title       text        not null,
  image_url   text,
  paragraph   text        not null,
  link_href   text,
  link_label  text,
  tag         text        not null,
  published   boolean     not null    default true
);

-- Row Level Security
alter table novidades enable row level security;

-- Public: read published novidades (anon key is safe)
create policy "public_read_novidades"
  on novidades for select
  using (published = true);

-- Authenticated admin: full access
create policy "auth_manage_novidades"
  on novidades for all
  to authenticated
  using (true)
  with check (true);

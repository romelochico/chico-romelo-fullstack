-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists show_setlist_blocks (
  id         uuid        primary key default gen_random_uuid(),
  event_id   uuid        not null references events(id) on delete cascade,
  position   int         not null default 0,
  name       text,
  created_at timestamptz default now()
);

create table if not exists show_setlist_songs (
  id         uuid        primary key default gen_random_uuid(),
  block_id   uuid        not null references show_setlist_blocks(id) on delete cascade,
  position   int         not null default 0,
  title      text        not null,
  created_at timestamptz default now()
);

create table if not exists show_setlist_speeches (
  id         uuid        primary key default gen_random_uuid(),
  song_id    uuid        not null references show_setlist_songs(id) on delete cascade,
  timing     text        not null check (timing in ('before', 'after')),
  position   int         not null default 0,
  speaker    text        not null,
  text       text        not null,
  created_at timestamptz default now()
);

alter table show_setlist_blocks   enable row level security;
alter table show_setlist_songs    enable row level security;
alter table show_setlist_speeches enable row level security;

create policy "admin all show_setlist_blocks" on show_setlist_blocks
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin all show_setlist_songs" on show_setlist_songs
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin all show_setlist_speeches" on show_setlist_speeches
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table show_setlist_blocks   to authenticated, service_role;
grant all on table show_setlist_songs    to authenticated, service_role;
grant all on table show_setlist_speeches to authenticated, service_role;

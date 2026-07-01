-- Media library (all images/files)
create table media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  storage_path text not null,
  bucket text not null default 'media',
  alt_text text,
  width int,
  height int,
  created_at timestamptz default now()
);

-- Page hero images + metadata
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  hero_image_id uuid references media(id) on delete set null,
  title text,
  subtitle text,
  updated_at timestamptz default now()
);

-- Events (upcoming + past shows)
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time text,
  venue text not null,
  city text not null,
  tags text[] default '{}',
  link_url text,
  link_label text,
  badge text,
  created_by text,
  show_day boolean default true,
  "order" int default 0,
  created_at timestamptz default now()
);

-- News / Novidades
create table news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  strap text,
  date_label text,
  body text not null,
  image_id uuid references media(id) on delete set null,
  link_url text,
  link_label text,
  "order" int default 0,
  published boolean default true,
  created_by text,
  created_at timestamptz default now()
);

-- Releases (singles, EPs, albums)
create table releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('single', 'ep', 'album')),
  release_date date not null,
  cover_id uuid references media(id) on delete set null,
  spotify_url text,
  apple_url text,
  youtube_url text,
  deezer_url text,
  "order" int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

-- Hub page links
create table links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon text,
  category text,
  "order" int default 0,
  active boolean default true
);

-- Contact form submissions
create table contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS policies: public read for content tables
alter table media enable row level security;
alter table pages enable row level security;
alter table events enable row level security;
alter table news enable row level security;
alter table releases enable row level security;
alter table links enable row level security;
alter table contacts enable row level security;

-- Public can read content
create policy "public read media" on media for select using (true);
create policy "public read pages" on pages for select using (true);
create policy "public read events" on events for select using (true);
create policy "public read news" on news for select using (true);
create policy "public read releases" on releases for select using (true);
create policy "public read links" on links for select using (true);

-- Only authenticated users (admins) can write
create policy "admin write media" on media for all using (auth.role() = 'authenticated');
create policy "admin write pages" on pages for all using (auth.role() = 'authenticated');
create policy "admin write events" on events for all using (auth.role() = 'authenticated');
create policy "admin write news" on news for all using (auth.role() = 'authenticated');
create policy "admin write releases" on releases for all using (auth.role() = 'authenticated');
create policy "admin write links" on links for all using (auth.role() = 'authenticated');

-- Contacts: public can insert, only admins can read
create policy "public insert contacts" on contacts for insert with check (true);
create policy "admin read contacts" on contacts for select using (auth.role() = 'authenticated');
create policy "admin update contacts" on contacts for update using (auth.role() = 'authenticated');

-- Grants (SQL Editor does not add these automatically)
grant all on table media    to anon, authenticated, service_role;
grant all on table pages    to anon, authenticated, service_role;
grant all on table events   to anon, authenticated, service_role;
grant all on table news     to anon, authenticated, service_role;
grant all on table releases to anon, authenticated, service_role;
grant all on table links    to anon, authenticated, service_role;
grant all on table contacts to anon, authenticated, service_role;

-- Storage bucket for media
insert into storage.buckets (id, name, public) values ('media', 'media', true);

create policy "public read media storage" on storage.objects
  for select using (bucket_id = 'media');

create policy "admin upload media storage" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "admin delete media storage" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- Seed default pages
insert into pages (slug) values
  ('home'),
  ('sobre'),
  ('lancamentos'),
  ('novidades'),
  ('agenda'),
  ('imprensa'),
  ('contatos');

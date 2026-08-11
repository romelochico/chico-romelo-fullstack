-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql
-- Single consolidated script for the calendario_eventos table.
-- Safe to run multiple times: creates the table if it doesn't exist yet,
-- and adds hora_inicio/hora_fim if the table already exists without them.

create table if not exists calendario_eventos (
  id            uuid        primary key default gen_random_uuid(),
  nome          text        not null,
  tipo          text        not null check (tipo in ('ensaio', 'show', 'publicidade', 'suporte_eventos')),
  data_inicio   date        not null,
  data_fim      date,
  hora_inicio   time,
  hora_fim      time,
  descricao     text,
  created_by    text,
  created_at    timestamptz default now()
);

alter table calendario_eventos add column if not exists hora_inicio time;
alter table calendario_eventos add column if not exists hora_fim time;

alter table calendario_eventos enable row level security;

drop policy if exists "admin all calendario_eventos" on calendario_eventos;
create policy "admin all calendario_eventos" on calendario_eventos
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table calendario_eventos to authenticated, service_role;

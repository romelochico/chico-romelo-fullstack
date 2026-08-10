-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zciisuujazkhroixldvv/sql

create table if not exists calendario_eventos (
  id            uuid        primary key default gen_random_uuid(),
  nome          text        not null,
  tipo          text        not null check (tipo in ('ensaio', 'show', 'publicidade', 'suporte_eventos')),
  data_inicio   date        not null,
  data_fim      date,
  descricao     text,
  created_by    text,
  created_at    timestamptz default now()
);

alter table calendario_eventos enable row level security;

create policy "admin all calendario_eventos" on calendario_eventos
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table calendario_eventos to authenticated, service_role;

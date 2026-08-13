-- Run this in the Supabase SQL editor, after team-tiers.sql.
--
-- Adds the SMS-reminder feature: each calendar event can opt in to a text
-- reminder sent to every team member with a phone number, a configurable
-- number of hours before the event starts (default 5). Rehearsals default
-- to on; everything else defaults to off. The actual sending happens in
-- src/pages/api/cron/sms-reminders.ts, triggered by an external scheduler
-- (see that file's header comment).

-- Local events (show/publicidade/suporte_eventos) live in calendario_eventos.
alter table calendario_eventos
  add column if not exists enviar_sms boolean not null default false;
alter table calendario_eventos
  add column if not exists sms_hours_before integer not null default 5;

-- Ensaios (rehearsals) live in nboxes, not our database, so there's no row
-- of ours to add a column to. This table stores the bits we need per
-- ensaio: whether to send its reminder, and how many hours before. No row
-- = default on / 5h (see the fallback logic in the ensaios API and the
-- cron job).
create table if not exists ensaio_sms_overrides (
  ensaio_id        text primary key,
  enviar_sms       boolean not null default true,
  sms_hours_before integer not null default 5,
  updated_at       timestamptz default now()
);

alter table ensaio_sms_overrides
  add column if not exists sms_hours_before integer not null default 5;

alter table ensaio_sms_overrides enable row level security;

drop policy if exists "ensaio_sms_overrides all" on ensaio_sms_overrides;
create policy "ensaio_sms_overrides all" on ensaio_sms_overrides
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

grant all on table ensaio_sms_overrides to authenticated, service_role;

-- Prevents sending the same event's reminder twice across cron runs. Only
-- the cron job (service role) ever touches this — no policies for
-- authenticated/anon means RLS denies them by default.
create table if not exists sms_log (
  id         uuid primary key default gen_random_uuid(),
  event_key  text not null unique,
  sent_at    timestamptz default now()
);

alter table sms_log enable row level security;

grant all on table sms_log to service_role;

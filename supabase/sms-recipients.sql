-- Run this in the Supabase SQL editor, after sms-reminders.sql and
-- team-tiers.sql (needs get_my_tier()).
--
-- Lets each event pick specific recipients for its SMS reminder instead of
-- always texting everyone with a phone number. Null/empty = default
-- behaviour (send to everyone with a phone), unchanged from before.
-- Choosing recipients is restricted to admin + diretoria — everyone else
-- can still see/toggle enviar_sms and sms_hours_before as before, they just
-- don't get the recipient picker in the UI.

alter table calendario_eventos
  add column if not exists sms_recipients uuid[];

alter table ensaio_sms_overrides
  add column if not exists sms_recipients uuid[];

-- Defense in depth: calendario_eventos' insert/update policies
-- (calendario-tier-restrict.sql) are open to admin+membro_da_banda /
-- any authenticated user respectively, neither of which matches the
-- admin+diretoria bar for this column. Block changes to sms_recipients
-- specifically unless the caller is admin/diretoria. Mirrors
-- team-tiers.sql's enforce_tier_admin_only trigger.
create or replace function enforce_sms_recipients_tier()
returns trigger
language plpgsql
as $$
begin
  if (
    (tg_op = 'INSERT' and new.sms_recipients is not null)
    or (tg_op = 'UPDATE' and new.sms_recipients is distinct from old.sms_recipients)
  )
     and auth.role() <> 'service_role'
     and coalesce(get_my_tier(), '') not in ('admin', 'diretoria') then
    raise exception 'Apenas admin e diretoria podem editar os destinatários do SMS.';
  end if;
  return new;
end;
$$;

drop trigger if exists calendario_eventos_sms_recipients_guard on calendario_eventos;
create trigger calendario_eventos_sms_recipients_guard
  before insert or update on calendario_eventos
  for each row
  execute function enforce_sms_recipients_tier();

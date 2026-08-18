-- Run this in the Supabase SQL editor.
--
-- Ensaios (rehearsals) live in nboxes, which has no "description" field at
-- all — so descricao was being silently dropped on save for that event
-- type. Same fix as sms_recipients/sms_hours_before before it: carry the
-- bit nboxes can't store in our own override table instead.
alter table ensaio_sms_overrides
  add column if not exists descricao text;

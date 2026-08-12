-- Run this in the Supabase SQL editor, after team_members.sql.
-- One-time seed from the hardcoded roster in src/lib/user-profiles.ts so the
-- whole band/crew shows up immediately, instead of waiting for each person to
-- log into the admin panel themselves.
--
-- Safe to re-run: on conflict it only fills in sobrenome/papel if those are
-- still empty, so it never clobbers anything already edited via the UI or
-- already synced from someone's Google login.
insert into team_members (email, nome, sobrenome, papel)
values
  ('almeida.gbrl.pt@gmail.com', 'Gabriel', 'Almeida', 'Baixo'),
  ('danillovieira7@gmail.com', 'Danillo', 'Vieira', 'Guitarra Solo e Vocal'),
  ('kikoprata@gmail.com', 'Cris', 'Prata', 'Teclado e Vocal'),
  ('markintela182@gmail.com', 'Marcus', 'Quintela', 'Guitarra Base e Vocal'),
  ('rcastro.drummer@gmail.com', 'Renan', 'Castro', 'Bateria e Vocal'),
  ('romelochico@gmail.com', 'Chico', 'Romelo', null),
  ('wev3rttonwtec@gmail.com', 'Wevertton', 'Trajano', 'Direção')
on conflict (email) do update set
  sobrenome = coalesce(team_members.sobrenome, excluded.sobrenome),
  papel = coalesce(team_members.papel, excluded.papel);

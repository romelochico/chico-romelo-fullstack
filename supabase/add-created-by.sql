-- Run this after the main schema migration
alter table news add column if not exists created_by text;

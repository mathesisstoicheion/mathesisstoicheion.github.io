-- ============================================================================================
-- Mathesis Stoicheion: the site's own translations (Aristotle, Galen…), private to the moderator.
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query), after 20260928120000_town_hall.sql.
--
-- The translations are kept only here. The site's code is public (anyone can read the repository and
-- download the built site), so the text must never be in either: the page /admin/translations reads it
-- from this table, and only the moderator can.
--
-- Security model
--   * One row per document: its id, the whole translation file as JSON, and when it was last saved.
--   * Row Level Security is on. Reading, adding, changing and removing are allowed only when
--     public.is_moderator() is true (profiles.role = 'moderator', see the Town Hall migration). Anyone
--     else, signed in or not, sees no rows at all and can change nothing.
--   * Visitors who are not signed in (anon) get no grant whatsoever; signed-in accounts (authenticated)
--     get the four ordinary rights, which the policies then narrow to the moderator alone.
--   * updated_at is set by the database (a trigger) whenever a row is added or changed, whatever the
--     page sends.
-- ============================================================================================

begin;  -- all or nothing

create table public.private_translations (
  id         text primary key check (id ~ '^[a-z0-9-]{1,80}$'),   -- lowercase letters, digits and hyphens, at most 80
  doc        jsonb not null,                                       -- the translation file, as uploaded
  updated_at timestamptz not null default now()
);
alter table public.private_translations enable row level security;

create policy "only the moderator reads the private translations" on public.private_translations
  for select to authenticated using (public.is_moderator());
create policy "only the moderator adds private translations" on public.private_translations
  for insert to authenticated with check (public.is_moderator());
create policy "only the moderator changes private translations" on public.private_translations
  for update to authenticated using (public.is_moderator()) with check (public.is_moderator());
create policy "only the moderator removes private translations" on public.private_translations
  for delete to authenticated using (public.is_moderator());

-- keep updated_at current: the time of the last save, set here rather than trusted from the browser
create function public.private_translations_touch() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger private_translations_touch before insert or update on public.private_translations
  for each row execute function public.private_translations_touch();
-- a trigger's function is never called directly
revoke execute on function public.private_translations_touch() from public, anon, authenticated;

-- ------------------------------------------------------------------------------ what the API may touch
-- New tables are not exposed automatically (project setting), so every grant is written here. Anything a
-- default might have given is taken back first; then signed-in accounts get the four ordinary rights (the
-- policies above let only the moderator use them). Nothing at all for anon.
revoke all on table public.private_translations from public, anon, authenticated;
grant select, insert, update, delete on table public.private_translations to authenticated;

commit;

-- ------------------------------------------------------------------------------ to check afterwards
-- Signed in on the site as the moderator, /admin/translations shows the (empty) list; as anyone else it says
-- "This page is private." In the SQL editor (which runs as the database owner, so it sees every row):
--   select id, updated_at, doc ->> 'title' as title from public.private_translations order by updated_at desc;

-- A bare stand-in for what Supabase provides before the site's migrations run: the two API roles and auth.users, and
-- auth.uid() read from the request's claims as Supabase does. Only for testing the migrations on a local, empty Postgres.
-- (roles belong to the whole server, so they may be there from an earlier run)
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;
create schema auth;
create table auth.users (id uuid primary key, raw_user_meta_data jsonb not null default '{}');
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;

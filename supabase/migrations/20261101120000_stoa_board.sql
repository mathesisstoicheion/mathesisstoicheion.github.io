-- ============================================================================================
-- Mathesis Stoicheion: the Painted Stoa's board (/stoa/board), where readers put up what they
-- thought and made: a thought, a painted pot, a tune played on the lyre. Run once in the Supabase
-- SQL editor (Dashboard → SQL → New query), after 20260928120000_town_hall.sql.
--
-- Security model (the owner, 2026-10-30: "Noa approves each post before it shows")
--   * Row Level Security is on. Anyone may read what the moderator has approved (status 'shown').
--     A member also sees their own items, waiting or not; the moderator sees everything.
--   * Only signed-in members who are not banned may put something up, and only as themselves.
--     The status column is never granted to members: a new item waits (status 'waiting') until
--     the moderator shows or declines it with decide_board_item(). The moderator's own items go up
--     at once.
--   * Members cannot change an item once it is up (no update grant); they may take it down.
--   * What an item may carry is checked here, whatever the page sends: a pot's link and picture,
--     a tune's link, a thought's link to an entry or a passage, each of a bounded size.
--   * At most 6 items an hour, and at most 10 waiting at once, per member (the moderator is not limited).
--   * Deleting an account removes its items ("on delete cascade" from profiles).
-- ============================================================================================

begin;  -- all or nothing

create table public.board_items (
  id         bigint generated always as identity primary key,
  author_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind       text not null check (kind in ('thought', 'pot', 'tune')),
  title      text not null check (char_length(title) between 3 and 120),
  body       text not null default '' check (char_length(body) <= 4000),
  -- where it opens on the site: the pot or the tune packed into its address, or the entry or passage a thought is about
  link       text check (link is null or char_length(link) <= 41000),
  -- a pot's picture, small (the page makes it about 40 KB)
  picture    text check (picture is null or (char_length(picture) <= 200000
                         and picture ~ '^data:image/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$')),
  status     text not null default 'waiting' check (status in ('waiting', 'shown', 'declined')),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  constraint board_items_fit check (
    case kind
      when 'pot'     then picture is not null and (link is null or link ~ '^/stoa/pot#v=[A-Za-z0-9_-]+$')
      when 'tune'    then picture is null and link ~ '^/stoa/lyre#tune=[A-Za-z0-9_-]+$'
      when 'thought' then picture is null and char_length(body) >= 1
                          and (link is null or (char_length(link) <= 300
                               and link ~ '^/(stoa/[a-z0-9-]+|read\?[A-Za-z0-9._~=&%:,-]+)$'))
    end)
);
create index board_items_shown on public.board_items (status, created_at desc);
create index board_items_author on public.board_items (author_id, created_at desc);
alter table public.board_items enable row level security;

create policy "approved items are public" on public.board_items for select
  using (status = 'shown' or author_id = auth.uid() or public.is_moderator());
create policy "members put up items" on public.board_items for insert to authenticated
  with check (author_id = auth.uid() and public.can_write());
create policy "authors and the moderator take items down" on public.board_items for delete to authenticated
  using (author_id = auth.uid() or public.is_moderator());

-- a new item waits for the moderator (theirs go up at once); the limits hold whatever the page does
create function public.board_item_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform public.check_rate('board_items', 6, 60);
  if public.is_moderator() then
    new.status := 'shown'; new.decided_at := now();
  else
    if (select count(*) from public.board_items where author_id = auth.uid() and status = 'waiting') >= 10 then
      raise exception 'You have 10 things waiting to be approved already. Please wait until they are looked at.'
        using errcode = 'P0001';
    end if;
    new.status := 'waiting'; new.decided_at := null;
  end if;
  new.created_at := now();
  return new;
end $$;
create trigger board_items_before_insert before insert on public.board_items
  for each row execute function public.board_item_before_insert();

-- the moderator shows an item on the board, or declines it (also to take down one already shown)
create function public.decide_board_item(p_id bigint, p_show boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'Only the moderator can do this.'; end if;
  update public.board_items
    set status = case when p_show then 'shown' else 'declined' end, decided_at = now()
    where id = p_id;
  if not found then raise exception 'That item is no longer there.'; end if;
end $$;

-- ------------------------------------------------------------------------------ what the API may touch
grant select on public.board_items to anon, authenticated;
grant insert (kind, title, body, link, picture) on public.board_items to authenticated;
grant delete on public.board_items to authenticated;

revoke execute on function public.board_item_before_insert(), public.decide_board_item(bigint, boolean) from public, anon, authenticated;
grant execute on function public.decide_board_item(bigint, boolean) to authenticated;

commit;

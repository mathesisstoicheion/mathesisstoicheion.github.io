-- The board's rules (migrations/20261101120000_stoa_board.sql), tested as each kind of visitor would meet them.
-- Run by run.sh on a throwaway database. Every check raises an error if the rule does not hold.

-- four people: the moderator (the owner), two members, and a banned member
insert into auth.users (id, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000001', '{"display_name":"Owner"}'),
  ('00000000-0000-0000-0000-00000000000a', '{"display_name":"Alpha"}'),
  ('00000000-0000-0000-0000-00000000000b', '{"display_name":"Beta"}'),
  ('00000000-0000-0000-0000-00000000000c', '{"display_name":"Gamma"}');
update public.profiles set role = 'moderator' where display_name = 'Owner';
update public.profiles set banned_until = now() + interval '1 day' where display_name = 'Gamma';

create schema t;
create function t.expect_refused(stmt text, why text) returns void language plpgsql as $$
begin
  begin execute stmt; exception when others then return; end;
  raise exception 'NOT REFUSED (%): %', why, stmt;
end $$;
create function t.expect(ok boolean, what text) returns void language plpgsql as $$
begin if not coalesce(ok, false) then raise exception 'FAILED: %', what; end if; end $$;
grant usage on schema t to anon, authenticated;
grant execute on all functions in schema t to anon, authenticated;

-- ---------------------------------------------------------------- a member puts up a thought: it waits
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
insert into public.board_items (kind, title, body) values ('thought', 'On the word logos', 'It means more than word.');
select t.expect((select status from public.board_items where title = 'On the word logos') = 'waiting', 'a member''s item waits');
select t.expect_refused($$insert into public.board_items (kind, title, body, status) values ('thought', 'Sneaky', 'x', 'shown')$$, 'a member sets the status');
select t.expect_refused($$insert into public.board_items (kind, title, body, author_id) values ('thought', 'As someone else', 'x', '00000000-0000-0000-0000-00000000000b')$$, 'a member writes as another');
select t.expect_refused($$update public.board_items set status = 'shown'$$, 'a member approves');
select t.expect_refused($$select public.decide_board_item(1, true)$$, 'a member calls decide');

-- what each kind may carry
select t.expect_refused($$insert into public.board_items (kind, title, body) values ('thought', 'Empty', '')$$, 'a thought with no words');
select t.expect_refused($$insert into public.board_items (kind, title, body, link) values ('thought', 'Elsewhere', 'x', 'https://example.org')$$, 'a thought linking off the site');
select t.expect_refused($$insert into public.board_items (kind, title, body, link) values ('thought', 'Script', 'x', '/stoa/a"><script>')$$, 'a link with markup');
select t.expect_refused($$insert into public.board_items (kind, title) values ('pot', 'No picture')$$, 'a pot without its picture');
select t.expect_refused($$insert into public.board_items (kind, title, picture) values ('pot', 'Bad picture', 'javascript:alert(1)')$$, 'a picture that is not one');
select t.expect_refused($$insert into public.board_items (kind, title, link) values ('tune', 'No tune', '/stoa/lyre')$$, 'a tune without its notes');
select t.expect_refused($$insert into public.board_items (kind, title, link) values ('tune', 'Wrong page', '/stoa/pot#tune=AAAA')$$, 'a tune on the wrong page');
select t.expect_refused($$insert into public.board_items (kind, title, body) values ('poem', 'Unknown', 'x')$$, 'an unknown kind');
insert into public.board_items (kind, title, picture, link) values ('pot', 'My amphora', 'data:image/webp;base64,UklGRg==', '/stoa/pot#v=AbC-_9');
insert into public.board_items (kind, title, link) values ('tune', 'Seikilos, slowly', '/stoa/lyre#tune=AbC-_9');
insert into public.board_items (kind, title, body, link) values ('thought', 'About an entry', 'Yes.', '/stoa/melos');
insert into public.board_items (kind, title, body, link) values ('thought', 'About a line', 'Yes.', '/read?w=tlg0012.tlg001&at=1.1');

-- ---------------------------------------------------------------- nobody else sees what waits
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
select t.expect((select count(*) from public.board_items) = 0, 'another member sees nothing waiting');
select t.expect_refused($$select public.decide_board_item(1, true)$$, 'another member approves');
delete from public.board_items;  -- allowed, but touches nothing of Alpha's
reset role;
select t.expect((select count(*) from public.board_items) = 5, 'another member cannot take down Alpha''s items');
set role anon;
select set_config('request.jwt.claim.sub', '', false);
select t.expect((select count(*) from public.board_items) = 0, 'a visitor sees nothing waiting');
select t.expect_refused($$insert into public.board_items (kind, title, body) values ('thought', 'Anonymous', 'x')$$, 'a visitor posts');

-- ---------------------------------------------------------------- the banned cannot post
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000c', false);
select t.expect_refused($$insert into public.board_items (kind, title, body) values ('thought', 'Banned', 'x')$$, 'a banned member posts');

-- ---------------------------------------------------------------- the moderator sees all, approves, declines
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', false);
select t.expect((select count(*) from public.board_items where status = 'waiting') = 5, 'the moderator sees what waits');
select public.decide_board_item((select id from public.board_items where title = 'On the word logos'), true);
select public.decide_board_item((select id from public.board_items where title = 'My amphora'), true);
select public.decide_board_item((select id from public.board_items where title = 'Seikilos, slowly'), false);
insert into public.board_items (kind, title, body) values ('thought', 'Welcome', 'The board is open.');
select t.expect((select status from public.board_items where title = 'Welcome') = 'shown', 'the moderator''s own item goes up at once');

-- ---------------------------------------------------------------- after the decisions
set role anon;
select set_config('request.jwt.claim.sub', '', false);
select t.expect((select string_agg(title, ',' order by title) from public.board_items) = 'My amphora,On the word logos,Welcome', 'a visitor sees only what was approved');
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select t.expect((select status from public.board_items where title = 'Seikilos, slowly') = 'declined', 'the author sees a declined item as declined');
delete from public.board_items where title = 'Seikilos, slowly';
select t.expect((select count(*) from public.board_items where title = 'Seikilos, slowly') = 0, 'the author takes down their own item');

-- ---------------------------------------------------------------- the limits
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
insert into public.board_items (kind, title, body) select 'thought', 'Note ' || g, 'x' from generate_series(1, 6) g;
select t.expect_refused($$insert into public.board_items (kind, title, body) values ('thought', 'Seventh', 'x')$$, 'more than six an hour');
reset role;
update public.board_items set created_at = now() - interval '2 hours' where title like 'Note %';
set role authenticated;
insert into public.board_items (kind, title, body) select 'thought', 'More ' || g, 'x' from generate_series(1, 4) g;
select t.expect_refused($$insert into public.board_items (kind, title, body) values ('thought', 'Eleventh waiting', 'x')$$, 'more than ten waiting');

-- ---------------------------------------------------------------- deleting an account takes its items with it
reset role;
delete from auth.users where id = '00000000-0000-0000-0000-00000000000a';
select t.expect((select count(*) from public.board_items where title = 'On the word logos') = 0, 'a deleted account''s items go');

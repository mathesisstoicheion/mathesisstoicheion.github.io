# CLAUDE.md — Mathesis Stoicheion (this folder)

**Author drafts:** `pipeline/drafts/old-site-author-articles.json` (on this computer only, not in git) holds articles
from an earlier site. Nothing from them goes on a live page until each claim is checked against a real source and the
source is recorded.

## Start of every session
1. Read `SPEC.md` (what the site is, and what is frozen or cut), `CONTEXT.md` (the site's own words) and the top of
   `PROGRESS.md` (where things stand). Where older files in `_archive/` (`PLAN.md`, `Handoff.md`, the brief) disagree with
   `SPEC.md`, `SPEC.md` wins.
2. Check the site still builds and runs.
3. Tell the owner, in two or three plain-English sentences, where things stand and what you plan to do.

## How to work
- **One step at a time.** Show the result and wait for the owner's go before the next step.
- **Bugs:** first build a check that reliably detects that kind of bug, prove it catches it, then fix it.
- **Never delete files.** Move them into `_archive/`; the owner deletes later.
- **Frozen features** (the forum, the map, the everyday-life wiki): fix bugs only, add nothing. Sign-in stays working.
- **The translation tool** is a separate project (`Documents/greek-translation-tool`). Build none of it here.
- Use the strongest model for planning and judgment, a lighter one for moving files and editing text.

## How we work
- **Home.** The work lives in this folder on the owner's computer, in Claude Code. Nobody uses the online copy in the
  claude.ai Project. The GitHub branch `claude/project-thread-wj81cr` is out of date. Never merge it.
- **Skills.** Use Matt Pocock's skills only.
  - A new idea goes through `/grill-with-docs`.
  - Once decisions are made, run `/to-spec`, then `/to-tickets`.
  - To build, use `/tdd` on one ticket at a time, and wait for the owner's go before the next.
  - For a bug, use `/diagnosing-bugs`. Build a check that catches the bug before fixing it.
  - About every five tickets, run `/improve-codebase-architecture`.
  - For a design question, use `/prototype`.
  - When a message is confusing, use `/wait-what`.
  - At the end of a session, run `/handoff`, then update the top of `PROGRESS.md`.
- **Tickets.** Tickets live in `.scratch/`. `PROGRESS.md` stays the owner's plain-English summary of where things stand.
- **Models.** Sonnet does routine edits, file moves and test runs. Opus does grilling, design, hard bugs and
  architecture. The owner is on the Max x5 plan, so keep usage low. Keep outputs short, and never redo work that
  passed.
- **Publishing.** Never push unless the owner says so. A push to `main` republishes https://mathesisstoicheion.com/.

## Priorities the owner has stressed
- **The reader's word look-up comes first.** Every feature serves reading real Greek.
- **Visual beauty and purposeful animation**, never a generic template look.
- **Real facts only**: never invent quotations, dates, citations or sources.

## The owner is not a coder
Write every progress message in plain English. Explain any unavoidable technical term in a short phrase.

## Git and the live site
Commit a snapshot before and after each piece of work. **Do not push unless the owner asks**: every push to `main`
republishes the live site, https://mathesisstoicheion.com/ (see `DEPLOYMENT.md`).

## Accounts (Supabase)
Accounts run on Supabase and stay on while the forum is frozen: the owner signs in to open her private texts. The owner signs in to Supabase, GitHub and the site
themselves when asked; never type or read their passwords, app passwords or secret keys. Test posts made in the
real database must be deleted afterwards.

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

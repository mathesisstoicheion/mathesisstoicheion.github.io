# PROGRESS.md — where Mathesis Stoicheion stands

Condensed on 2026-10-18. The full history is in `_archive/PROGRESS-to-2026-10-17.md`. Vision (owner, 2026-10-17): "Read real Ancient Greek from the first week, with every word explained on the line." The old file's last dated entry is 2026-10-10, when the site was published at https://mathesisstoicheion.com/.

On 2026-10-20 the laptop clean-up (branch `cleanup-from-laptop`) was merged with the online `main` on branch `claude/project-thread-ska87k`. It went live on the owner's "Publish" at 20:59 UTC that day. The online log of 2026-10-11 to 2026-10-20 (the redesign rounds, the lyre, the reading path) is kept whole in `_archive/PROGRESS-online-to-2026-10-20.md`.

## The site is closed for a redesign (2026-10-21)
The owner, 08:25 UTC: "Take the website offline, temporarily. We're doing a full revision of the design". Since then
https://mathesisstoicheion.com/ shows only a holding page ("closed for a redesign, back soon"), on every address, including
the owner's private pages. Returning visitors' old offline copies are cleared on their next visit. Nothing was deleted: the
site's code is unchanged and the last live version is tagged `site-before-redesign`. To bring the site back, see
DEPLOYMENT.md, "Closed for a redesign". The data packs at /packs/ and the accounts (Supabase) are untouched.

## The home page's red everywhere; animation at 3x; the home page stripe (2026-10-20, round 4; LIVE on the owner's "Publish", 21:03 UTC)
The owner, 16:47–16:51 UTC: "Everything on the website needs to follow the Gold and lamplight with the red colour scheme",
"Every page must follow the design choices of the homepage", "All little submenus and buttons"; the Museion, Explore, Talk and
Read were named, and the Treasury "seems inconsistent and and boring". 16:27: "They need to animate faster, try twice as fast,
then 3 times as fast and give me a video preview". 16:40: "There's a stripe on the bottom of the homepage".
- **Colours and type**: the semantic tokens in `styles/tokens.css` ARE the home page's doorway now (Pompeian red surfaces,
  gold accents and lines, bone ink, EB Garamond); the separate `main[data-screen="home"]` block is gone and `a.module.css`
  `.screen` carries the doorway roles on every page. Menus, panels, dialogs, chips and buttons all follow from the tokens
  (chosen state = the home page's red chip; solid button = bone with red letters). The Daylight page keeps its own values; the
  reader's typeface settings still override. The lamp room's amber, parchment, Literata and scan lines are gone.
- **Floating letters on every page**: `components/Page.tsx` adds the home page's drifting letters behind every "room" page
  (not the library or reader, which have their own).
- **Windows**: frameless until their iris opens, as on the home page.
- **The Treasury**: its nine sections are laid out as the home page's grid of rooms, each with a small red window onto a
  gilded Met piece (credits at the foot), its count in tall gold numerals; the windows stay on a phone, smaller.
- **Tempo**: `--tempo` in `tokens.css` (and `lib/tempo.ts`) divides every animation that plays out once. Video of 1x, 2x and 3x:
  `/mnt/project-files/previews/animation-speed.mp4` (sent 16:58 UTC). The owner, 20:15 UTC: "I like the speed of 3x. Just redo
  the Animation so it opens at that speed, whilst having a pretty opening animation". `--tempo` is 3, and the openings were
  re-shaped for it: windows open in one continuous breath (a quick bloom, then a long soft widening, no hold), the head of each
  page brightens in turn from dim (never from black), headings settle on an eased curve, the floating letters fade in, the
  engravings draw in on an eased curve, and the Mouseion's red window blooms in as Socrates' letters gather. A new easing,
  `--ease-enter` (quick away, long soft glide), carries every page's opening. Round 4 ships with it (owner's choice, 20:19 UTC).
  Built on `claude/project-thread-ska87k` (the clean-up); on "publish", that branch goes to main first, then this one.
- **The stripe** (not reproduced here): most likely the floating-letters canvas a fraction of a pixel row short of the window
  on the owner's PC, showing the page beneath; its drawing buffer now follows its own on-screen size and is cleared fully.
- The Museion keeps Socrates (dropping him was not asked for plainly).
- The Mouseion's Socrates opening, its famous books and the reader's cover emblem are red windows too: the stage's letters show
  through a red field (`.lib-hero .win::before`, mix-blend lighten) and the emblems are drawn on red (`field` in `Letters`).
- Checks: typecheck clean, lint only the 16 known errors; overlap sweep (45 pages x 6 sizes) shows only the known findings
  (author pages at computer sizes, Eras of Greek on phones, library list on tablet); layer memory at 3x 56-109 MB; mid-scroll
  shots all drawn. Browser tests (with the packs and the public Supabase values at build time, as on the clean-up's run): every
  remaining failure (22) is also on the clean-up's list of failures on main. Tests changed to follow the look: the header's
  square buttons stand beside the doors only from 1440 px, so `e2e/header.ts` opens the menu for them where it must; the
  Treasury test now looks for the Mine door in the site's banner, not the page's own path.

## Live since the clean-up began (online, 2026-10-16 to 2026-10-20)
- **The look: Gold and lamplight, round 3** (live 2026-10-20 15:35 UTC). Design A's doorway on every page: black, Pompeian red and
  gold, round windows onto real objects engraved in gold, faint Greek letters floating behind the page. The square ΣΤΟΙΧΕΙΑ mark
  replaced the owl. The library keeps Socrates, spelled from the Apology, turning into a papyrus roll. Three animation levels in
  Settings: Full beauty, Balanced, Performance. Design notes: `DESIGN.md` and `docs/adr/`.
- **The lyre** (live 2026-10-17): `/stoa/lyre`, played with the keyboard, mouse, touch or a MIDI keyboard, with ten real Greek
  melodies, sheet music and recordings. `music-sources/` and `fetch-music.yml` must never go to `main`.
- **Learn by reading**: a guided path that teaches Greek through real lines, `/academy/reading` (Beginner level live 2026-10-18).
- **Private pages for the owner**: the private collection (`/library/private`) and the private translations in Mine.

## Live now
- **Library and reader:** 373 authors, 1,837 works, 2,816 texts, taken unchanged from the Perseus and First1KGreek files. Greek with English beside it; word look-up (GLAUx, LSJ); sentence structure; Find in text; Echoes; metre; compare two editions; Listen (English only); notes and highlights; Places and Manuscript panels; a phone reading bar. Library rows open to show an author's works.
- **Academy:** alphabet, 18 lessons (to infinitives, the future, pronouns), daily review, tables, vocabulary, practice, 4 guides.
- **Search and counting:** quick search, the Oracle (concordance, statistics, "near"), the Census.
- **Explore (Painted Stoa):** 35 entries, 38 checked author articles, pages for Authors, Eras, Editions, Manuscripts & transmission, Textual variants, the Periplus map (satellite picture) and the Kerameikos.
- **Mine (Treasury):** notes, anthology, bookmarks, notebooks with citations; download and restore as one file.
- **Home page and Guide:** first-visit question, "Your desk", a Guide with "Show me" tours.
- **Site:** works offline once visited, installs as an app, light and dark, phone edition, accessibility tested. 422 unit tests passed on 2026-10-09; 449 of 451 browser tests passed (the other two timed out under load).
- **Built but now frozen:** Town Hall, Pnyx, accounts (see below).

## Open work: next publish (the merged branch)
Do these in order.
1. Add the repository variables `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` on GitHub (Settings → Secrets and variables →
   Actions → Variables), or the live site will have no accounts.
2. Republish the data packs from the owner's computer: `python pipeline/publish_packs.py --push`. The packs (last published
   2026-10-06) do not yet hold `noncommercial/venetus-a-iliad.json`, so the reader's Venetus A pages need this first.
3. Show the owner the merged branch. Check that the forum is hidden and Coptic Mark is gone.
4. Merge into `main` only when the owner says so.
5. Check the live site: in `web/`, run `node scripts/live-check.mjs`.

## Open work: the clean-up first (owner's go for all of it, 2026-10-18)
Do these in order, one at a time, committing before and after each. Never delete: move into `_archive/`, except the
old website, which the owner has scrapped (D).

**A. Snapshot.** Commit the document changes of 17 and 18 October as one snapshot.

**B. Folder clean-up** (done 2026-10-18)
1. Move `PLAN.md`, `Handoff.md` and `greek-reader-website-prompt.md` into `_archive/`. Their still-valid decisions are
   in `SPEC.md` and this file.
2. Move `author-article-preview/`, `design-study/`, `flow-preview/`, `map-preview/` and `tutorial-shots/` into
   `_archive/`, after checking nothing in `web/` or the tests links to them.
3. Check `README.md` and `DEPLOYMENT.md` still match the folders; fix any line that points at a moved file.

**C. Licences and privacy** (the site's repository `mathesisstoicheion/mathesisstoicheion.github.io` is public).
All done on 2026-10-18, not yet published. Before the next site publish, republish the packs
(`python pipeline/publish_packs.py --push`): the Venetus A line index now lives there (C2).
1. **Coptic Mark** (`tlg0031.tlg002.1st1K-cop1`): its licence says "for academic use only", which is not open. Remove
   it from the catalogue so the site neither lists nor serves it.
2. **Venetus A index**: CC BY-NC 4.0 (non-commercial only). Stop committing it to the public repository and list it
   in a `NOTICE` file as an exception, or leave it out.
3. **Personal Gmail in commits**: set this repository's git email to the owner's GitHub no-reply address for all
   future commits. Do not rewrite past history unless the owner asks.
4. Add `NOTICE` with the credits and exceptions, from §6 of
   `Documents/greek-translation-tool/research/MATHESIS-TRANSLATION-PLAN-2026-10-03.md`.
5. Keep `pipeline/drafts/old-site-author-articles.json` (unchecked, known errors) out of the public repository.
6. Move the Supabase address and key into build settings, so copies of the project don't write to the owner's database.

**D. The old website, scrapped (owner, 2026-10-18)**. All done 2026-10-18. D1: the owner deleted the Vercel project and the GitHub repository; both old addresses return 404. `Documents/Mathesis`,
`Documents/docs-mathesis` and `Documents/CLAUDE.md` went to the Recycle Bin with her OK; CLAUDE.md lost the old-app
paragraph; the owner keeps the two text collections and their zips (about 1.35 GB, not 290 MB; nothing in the project
uses them).
1. The owner deletes or archives its GitHub repository herself (it serves `ladygagastani.github.io/Mathesis`, still
   online on 2026-10-18). Show her where: the repository's Settings, at the bottom.
2. Remove `Documents/Mathesis`, `Documents/docs-mathesis` and the old-app `Documents/CLAUDE.md`, with the owner's OK
   at the moment of removal. The author drafts already live in `pipeline/drafts/`.
3. Then remove the old-app paragraph from `CLAUDE.md`.
4. Ask the owner whether `Documents/canonical-greekLit-master`, `Documents/OpenGreekAndLatin-First1KGreek-…` and
   their two zip files (about 290 MB) are still needed.

**E. The forum, frozen.** Done 2026-10-18, not yet published: one switch, `FORUM_OPEN` in `web/src/config/areas.ts`, hides it; `/town-hall` pages say "Closed for now"; `web/e2e/forum-hidden.spec.ts` checks every page. Hide it everywhere: the menus, the reader's "Talk about it" panel, "Ask in the Town Hall"
at the end of lessons, the Bug reports and Suggestions boards, and the home page's forum activity. **Sign-in keeps
working**: the owner signs in to open her private texts. Build, run all tests, and show the owner before publishing.

## Open work: after the clean-up
1. Redesign, starting with three very different prototypes of the reader screen (owner, 2026-10-17).
2. Author articles: 47 old drafts are left (85 minus 38 done). Only drafts whose texts are in the library get checked and published. Method: write, second independent check, verify each finding, register the article in both lists.
3. Academy: lessons on contract verbs and -μι verbs are not written (contract-verb tables exist).
4. Short descriptions for the 18 authors that have none; each needs a source.
5. Audio: convert the owner's WebM recordings to M4A before launch (older iPhones). Play buttons show only where a recording exists.

## Frozen or dropped (2026-10-17 and 18)
- Forum and debates (Town Hall, Pnyx): frozen for now, hidden, data kept. Accounts stay (the owner's private texts).
- Showing the site to scholars (Lady Babylon and Perseus comparison, Dr. Hillman): cut until the site is finished.
- The old website: scrapped (clean-up D).
- "Talk where you read" (Phase 11 idea 5): dropped.
- Map (Periplus) and everyday-life wiki entries: frozen at what exists. Written so far: drugs and poisons, love/sex/marriage, the household, slavery, women's lives. Food, clothes, burial, music and the rest of that list: not started.
- 8,000-text import: dropped.
- Translation tool: its own project in `Documents/greek-translation-tool`, to join the site later.

## Only the owner can do
- Record audio in `/academy/studio` (letters, diphthongs, the 100 commonest words). Not known how many exist.
- Add the site to Google Search Console and Bing Webmaster Tools, verify it, and submit https://mathesisstoicheion.com/sitemap.xml. Not recorded as done.
- Try the site on an iPhone (tilting the vase asks permission; iPhones cannot vibrate).
- Say when to publish. Pushing to `main` republishes the live site; push only on the owner's word, then run `node scripts/live-check.mjs` in `web/`.
- Approve the GitHub sign-in window if the data packs are republished (`python pipeline/publish_packs.py --push`).

## Known problems
- 1,135 of 1,270 English work titles are this site's own unchecked translations, labelled as such.
- Map data: a fresh rebuild would re-choose about a dozen tied places. Check `git diff` of `places.json` after any rebuild.
- A long book opens slowly on a slow phone (the Iliad about 10 s, 830 KB of XML from GitHub).
- A shared link to the reader shows the general preview, not the work's. The `/work/...` pages have their own.
- Metre: iambic trimeter was checked only against Aeschylus and Lycophron; Sophocles, Euripides and Aristophanes are unchecked by a metre expert.
- GLAUx analyses cover 1,186 of 1,837 works; the rest have no word analysis.
- Faults in the source files, not the site: Perseus New Testament (1 John 5.7, John 8.11), Andocides' English, tlg0541.tlg042, the Marcus Aurelius header.
- Sign-up and reset emails may land in spam. Matters only if accounts stay.
- Local Windows builds need `--webpack`.

## Decisions that still hold
- 2026-09-26: Never commercial; free for everybody. Non-commercial image and font licences are fine if recorded.
- 2026-09-26: No trackers, no analytics; fonts and libraries self-hosted; any outside request is listed on the Credits page.
- 2026-09-26: Texts come from the original collections, unchanged; translations are never altered.
- 2026-09-27: Real facts only. Quotations copied from the corpus with `scripts/passage.ts`; every book or article checked on a real page; nothing from memory.
- 2026-09-27: Default pronunciation is reconstructed Classical Attic; Erasmian and Modern are selectable.
- 2026-09-27: The owner records the Greek audio; no faked audio. 2026-10-02: no machine voice reads Greek; Listen is English only.
- 2026-09-28: "Vocabulary", not "difficulty", for the common-words measure.
- 2026-09-28: Author pages show only what the data holds.
- 2026-09-28: No browser pop-up boxes; questions open as in-page boxes.
- 2026-09-30: Author articles: full for famous authors, shorter for the lesser known; a claim goes live only once checked.
- 2026-09-30: The site lives at mathesisstoicheion.com, free hosting on GitHub Pages.
- 2026-10-01: Map: one finger moves, two zoom.
- Local git commits at the end of each piece of work are allowed. Write to the owner in plain English; they are not a coder.

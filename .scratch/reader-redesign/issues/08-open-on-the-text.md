# 08. A book opens on its text

Status: ready-for-agent
Type: HITL
Blocked by: 02
Spec: `../spec.md`, "First opening". User stories 1, 2, 7

## What to build

- **The one-line title.** A book opens on a one-line title ("Ἰλιάς · Homer, Iliad, book 1") with the first passage
  straight under it. There is no empty band of paper above the first line on a phone.
- **The title page** (`ReaderCover.tsx`) and its photograph show only the first time a book is opened on this device.
  A small store, kept with the reader's settings, remembers which books have been opened.
- **Line numbers.** Red line numbers mark the start of each passage, as in mockup B.

## Acceptance criteria

- [ ] A unit test checks the first-opening store: the first opening shows the cover, and every later one does not.
- [ ] `check-reader` checks that, on a second opening, the first Greek line is within the first 200 px of the page on a
      phone and on a computer.
- [ ] The owner has looked at it and given the go.

## Comments
- DONE early, with ticket 04 (2026-10-26). Added 2026-10-25 (the owner, in the project chat, 04:38 UTC: "Get rid of all random photos, placed everywhere. Photos
  should only load where they are relevant"): with this ticket, drop the reader's two decorative photographs as well,
  the title page's frontispiece (`ReaderCover.tsx`, the Plate from WORK_PLATES / AUTHOR_PLATES) and the empty reader's
  head (`Reader.tsx`, PageHead piece "hand-with-scroll"). The rest of the site is done on branch
  claude/project-thread-5yqpfi.

## Comment, 2026-10-30: built (Noa: "Now, fix the reader, the reader tools and the word lookup")

- **The title page only the first time.** `lib/opened.ts` keeps the books opened on this device (its own key in the browser,
  `mathesis:opened`; the last 500, the oldest forgotten first; listed on the Privacy page). A book counts as opened once its
  text is up. A reader who already has a place saved in a book counts as having opened it (the list is new). The choice is made
  once when the pane first shows the book, so nothing flickers. A book of the private collection is treated the same. Two books
  side by side and the floating window keep their own head and never show the title page.
- **The one-line title** (`ReaderTitle.tsx`): "Ἰλιάς · Homer, Iliad, Book 1" on a computer, the Greek title in the Greek face and
  ink, the rest in the body face and ink-2, the author a quiet link to the author's page; "Ἰλιάς · Iliad, Book 1" on a phone
  (the author dropped, as in mockup B). It starts where the Greek's words start (past the line numbers'
  column when the first passage is in verse). The first passage follows straight under it; there is no band above it.
- **Change stays reachable.** The title page keeps its own Change. Tools has a first group, "Edition and translation", with the same
  choices (Greek text, Translation, Compare with, a second book, the private collection). Tools is not renamed here (ticket 09).
- **Numbers.** When the page is one book, the margin shows the passage's number in its book ("1", "580"; "20.3" for a text cited
  book, chapter and section). The whole reference stays in `data-row`, `aria-label` and every jump, mark and link, and a line's
  own number no longer repeats the margin's (`repeats` in `Blocks.tsx` knows every ending of the reference). Figures are oldstyle.
- **Phone.** On a phone, and in a pane or the floating window narrower than 520 px, the passage number has a narrow column of its
  own at the left, level with the first line (on its baseline), the Greek takes the rest, and the marks stack under the number.
  The column is as wide as the widest number on the page needs (three figures at least; `--num-n`, counted in `Reader.tsx`),
  wider while the metre is on (the rhythm button stands at its far side). The numbers of every fifth line moved out of the text
  into the same column, small and in ink-2. "Show the English" starts at the Greek's own edge. A page 521 to 760 px wide keeps the
  number above its passage as before. Texts cited by verse (the New Testament, the Septuagint) are not touched.
- check-reader "first", "numbers" and "phone". Each was shown to fail on the bug it guards against: the title page on every opening,
  the whole reference in the margin, and the number above its passage (17 problems; all gone when put back).
- Found, not fixed (it was so before this ticket): on a phone the New Testament's verse numbers hang at the page's left edge level with the
  verse's last lines, and the verses stand far apart. The rules written for texts cited by verse (`.verses`, in `Reader.module.css`) are
  overridden by the one-book phone rules that come later in the file. Wants its own check and fix.
- Two end-to-end specs fail on the site as it was before this ticket too: `compare.spec.ts` "choose an edition to compare with" (after
  "Next difference" the page goes back to the first passage) and `reading-tools.spec.ts` "Places lists the places" (a place named "Σάρδεις"
  is expected first under "Most named"). The Places spec also depended on where the pointer was left; it now moves it away first.
- The Treasury spec "downloads as one readable file" failed about one run in three, on the site as it was before this ticket too: it left
  the reader the instant after pressing Bookmark, sometimes before the browser had finished writing the mark. It now waits for the
  "Bookmarked" notice first (16 runs in a row pass).
- The private-collection specs (25) and the account page's "Join" specs (2) cannot run on a build made without the database settings
  (`NEXT_PUBLIC_SUPABASE_URL` and `..._PUBLISHABLE_KEY`; the specs pretend the database, so a placeholder key is enough). Built that way,
  19 of the 25 passed and the other six failed exactly as on the site as it was before this ticket: ticket 07 made a book open on Greek
  alone, and the spec still saved the old settings, so the English was hidden. `pretend()` now saves "Both" in the new shape
  (`e2e/both-columns.ts` does the same for the other specs); all 25 pass on this build, and so do the two "Join" specs. A private book was also
  opened twice in a throw-away test: the title page the first time, then the one-line title (its author not a link), the number "1" in the
  margin with "1.1" on the button, and the same choices, the private collection among them, under Tools.
- Still failing here, and the same on the site as it was before this ticket: the two Word Study specs (they ask Wiktionary, which this
  sandbox cannot reach) and the two trackpad specs (a 3D vase and a manuscript photograph, which need a graphics card and outside
  websites). Everything else in the reading, notebook, Treasury, echoes, listening, library, home, phone and accessibility specs passes
  on this build.

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

# 01. One panel shell for the reader, and ADR 0009

Status: done (2026-10-25), waiting for the owner's go before 02
Type: AFK (no visible change meant)
Blocked by: none
Spec: `../spec.md`, "Building order" and "The decision record"

## What to build

- Write `docs/adr/0009-the-quiet-desk.md`. It records what the spec changes in ADR 0008:
  - decision 4: one look-up placement per device
  - decision 5: Greek alone by default
  - decision 7, for the reader: the title page shows only on a book's first opening
  - the reader's own bar at the foot
- Make one panel shell that every reader panel, sheet and dialog uses. It handles the frame, the heading, the close
  button, Escape, the focus trap and giving focus back.
- Move the reader's panels onto the shell one by one:
  - Find, Compare, Sentence, Vocabulary, Places, Talk, Manuscript, Echoes
  - Mine, Share, the work picker, the note editor
  - the look-up's side and sheet frames
- Nothing should look different yet. Any difference that cannot be avoided is listed in the ticket's comments.

## Acceptance criteria

- [x] ADR 0009 exists and is linked from ADR 0008's "Follows" chain.
- [x] Every panel or dialog under `web/src/components/reader/` renders through the one shell. A check (a grep or a test)
      fails if a new reader panel skips it.
- [x] `check-overlays` passes: overlays hold the page, close on Escape and give focus back.
- [x] `check-reader` and `check-lookup` pass as they do on main.
- [x] The build passes.

## Comments

2026-10-25, built:
- `web/src/components/reader/Panel.tsx` holds the shell: `SidePanel` (the asides: at the side, in the margin, the
  sheet) and `ModalDialog` (Share, Open a second book, the private collection).
- `panels.test.ts` is the check. It failed on 12 files before the change and passes after.
- Moved onto the shell: Vocabulary, Talk, Manuscript, Places, Sentence, Echoes, Find, Compare, the look-up (margin
  note, side panel and sheet), Share, the work picker and the private collection.
- Left out on purpose:
  - The floating reader is a second reader in its own window, not a panel.
  - The Tools, Aa, Marks and More menus go in ticket 09.
  - The notebook picker lives in `components/notebook/`, outside the reader.
- One small change in behaviour: Escape inside any panel now stops at that panel. Before, it also reached the reader's
  own Escape (which closes the look-up and the keys help) for six of them.
- Looks: before and after screenshots match pixel for pixel for the look-up (1440, 1000 and 390 px), Vocabulary, Find,
  Places and Manuscript (1440) and Vocabulary (390). Share opens, and closes on Escape and on ×, the same before and
  after.
- Checks: `check-overlays`, `check-reader` and `check-lookup` pass before and after. tsc is clean. eslint shows the same
  10 errors in the reader as on main, all in older code. vitest shows the same 2 failing files as on main, which need
  data from the laptop. `check-tokens` fails only on PathStepView and PracticeView, as on main; ticket 03 fixes those.

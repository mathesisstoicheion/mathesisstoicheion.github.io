# 01. One panel shell for the reader, and ADR 0009

Status: ready-for-agent
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

- [ ] ADR 0009 exists and is linked from ADR 0008's "Follows" chain.
- [ ] Every panel or dialog under `web/src/components/reader/` renders through the one shell. A check (a grep or a test)
      fails if a new reader panel skips it.
- [ ] `check-overlays` passes: overlays hold the page, close on Escape and give focus back.
- [ ] `check-reader` and `check-lookup` pass as they do on main.
- [ ] The build passes.

## Comments

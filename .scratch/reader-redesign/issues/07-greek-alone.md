# 07. Greek alone by default, the English one tap away

Status: ready-for-agent
Type: HITL
Blocked by: 02
Spec: `../spec.md`, "Defaults and saved settings". User stories 3, 4, 5

## What to build

- The default for columns becomes "greek" in `lib/settings.ts`.
- A saved "both" changes once to "greek", through the settings upgrade. "Both" stays in Aa.
- Each passage gets a quiet "Show the English" under it, which opens Murray's (or the edition's) English for that
  passage only, with its credit line. "Hide the English" closes it again.

## Acceptance criteria

- [ ] A unit test checks the upgrade: a saved "both" becomes "greek" once, and a later choice of "both" is kept.
- [ ] `check-reader` checks that a book opens with no English column.
- [ ] `check-reader` checks that the English for one passage shows and hides, and the other passages stay Greek.
- [ ] The owner has looked at it and given the go.

## Comments

## Comment, 2026-10-29: built (Noa: "Next step")

- The reader now follows the saved columns setting (it used to keep a choice per book, always opening on "Both"). The
  default is "greek". Settings version 3: a "both" saved at version 2 or 1 becomes "greek" once (`greekAlone` in
  `lib/settings.ts`), and a "both" chosen afterwards is kept. Both panes and the floating reader share the one choice.
- "Show the English" under each passage's Greek, starting where the Greek's words start: the translation of that passage
  and its credit ("Murray, 1924, from the Perseus Digital Library. CC BY-SA 4.0.", from the catalogue and the footer's
  wording). "Hide the English" closes it. Open passages reset when the book, translation or columns change.
- check-reader "alone": opens on Greek alone; show and hide one passage, neighbours stay Greek, the English sits under
  the Greek and clear of the look-up's margin, lines up with the Greek's words, no sideways scroll, a tap in the English
  opens no look-up; the version 2 and 3 saves. Each check was shown to fail on the bug it guards against.
- Tests that read the English column now pick "Both" first (`e2e/both-columns.ts`); `columns.spec.ts` rewritten.
- All the site's checks pass, apart from the Learn page's older one.

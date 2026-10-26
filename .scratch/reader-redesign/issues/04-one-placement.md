# 04. The look-up in one place per device

Status: built (2026-10-25), waiting for the owner to look at it on the computer and the OnePlus
Type: HITL (the owner looks at it before the next ticket)
Blocked by: 03
Spec: `../spec.md`, "Placement". User stories 10 to 15, 22

## What to build

- One rule decides where the look-up opens:
  - at 1100 px or wider, the margin note
  - below that, the sheet
  - Reader.tsx asks this rule in every place it opens the look-up. The 400 px side-panel note and the in-between sheet
    go.
- **Computer.** The margin note is about 300 px wide, level with the tapped line, and joined to the word by a thin
  line, as in mockup B.
- **Phone.** The sheet rests at about a quarter of the screen. It drags up for more and down to close. The text scrolls
  so that the tapped line stays above it.
- **The tapped word** gets the soft paper-tone highlight in Paper and the matching tone in Night.
- **Content.** The note still shows what the look-up shows today. Ticket 05 changes the content.

## Acceptance criteria

- [x] A unit test checks the rule: 1099 px gives the sheet, 1100 px gives the note.
- [x] `check-lookup` checks that, on a computer at 1440 × 900:
  - [x] the note is at least 280 px wide, beside the tapped line, and never covers it
  - [x] the note is in the same place with another panel open
- [x] `check-lookup` checks that, on a phone at 390 × 844:
  - [x] the sheet rests at or below 27% of the screen height
  - [x] the sheet never covers the tapped line
- [x] Escape closes the look-up and gives focus back to the word, and Previous and Next still step between words.
- [ ] The owner has looked at it on the computer and on the OnePlus and given the go.

## Comments
- The rule is `lookupPlace` in `web/src/lib/lookup/placement.ts` (test beside it). It takes the room the reader has: the
  window for one book, and the book's own box when two stand side by side or the reader floats in its small window, so
  those always use the sheet.
- Computer: the margin is 300 px (`--margin-note` in tokens.css), at 1100 px and wider, whether a panel is open or not.
  The look-up no longer takes the place of the panel beside the text; Find, Vocabulary and the rest stay open beside
  it. With a panel open, the English goes under the Greek, so that the Greek is not squeezed between the note and the
  panel (at 1440 px with Find open the Greek is about 470 px wide; at 1100 px, about 250).
- The sheet rests at a quarter of the screen (`clamp(calc(2.25 * var(--space-8)), 25dvh, 400px)`, 180 to 400 px): 211 px on a 390 × 844 phone. It still
  drags up for more and down to close; it still never rises over the tapped line.
- The tapped word: `--word-on`, a soft tone of the paper (#e4d8c2, from mockup B) in Paper and #3a3127 in Night, in
  place of the red with a red rule under it.
- `check-lookup` failed on the old code with 19 problems (240 px note, the look-up in the side panel's place, a sheet
  46% of the screen tall), and passes now.
- Found on the way, not changed (older): at 1100 to 1279 px the Find panel's content is about 60 px wider than the
  panel, so its right edge is cut off. For ticket 11.
- The owner's look, 2026-10-26: "It looks good", with these changes, all made:
  - "the lookup itself should open from the right side of the page and hold its place, so to let you scroll the text,
    whilst still having the word look-up". The note is now a window fixed to the screen over the right margin, under
    the reader's bar; it slides in from the right. It is no longer level with the tapped line, so the thin line to it
    is gone; the word keeps its highlight. Only the look-up changed: the other panels stay as they were.
  - "make the word look-up pretty": mockup B's order and type in the window (the tapped form small with its arrows,
    the dictionary form large, the grammar, the meaning in the reading type, the certainty label unboxed, each part
    under a hairline, the links as quiet words). The two layers and "More about it" are still ticket 05.
  - "why is the first sentence red?": the red first line (the printed page's rubric) is gone from the reader.
  - "no useless photos plastered everywhere": the title page's photograph and the empty reader's are gone now, not
    with ticket 08. `check-reader` fails on a photograph in the reader (it found both on the old code).
  - `check-lookup` now fails on a look-up that scrolls away with the text or covers the reader's bar.


# 10. Homer's lines fit whole on a phone

Status: built (2026-10-30), waiting for the owner's look
Type: HITL
Blocked by: 03
Spec: `../spec.md`, "Sizes". User story 6

## What to build

- **Verse fit.** A function from a passage's longest line and the width of the screen to the Greek size for verse:
  about 16.5 to 18 px, never below 16 px.
- **Wrapping.** A line that still does not fit wraps with a hanging indent.
- **Scope.** Prose keeps the reader's size setting. The old "Fit lines" switch is replaced by this and moves to
  `_archive/` if nothing else uses it. (It was code inside Reader, Study and the settings, not a file of its own, so there was
  nothing to move: it is removed, and a saved "Fit lines" is dropped.)

## Acceptance criteria

- [x] A unit test checks the size for a page of verse, with the numbers measured on the built site (`web/src/lib/verseFit.test.ts`): the
      reader's 26 px stays where the widest line fits (1440), it is 22 px or a little more at 1100, it is 16 px at 390 (where the Iliad's
      widest lines are the ones that wrap), and it is never below 16 px, even with a room of 100 px.
- [x] ~~A check on the built site confirms that every line of Iliad 1 fits whole at 390 × 844.~~ **Replaced** (see the comment of
      2026-10-30: it cannot hold together with the 16 px floor). `check-reader` "verse" checks Iliad 1 (611 lines): at 390 × 844 and
      412 × 915 the Greek is 16 to 18 px, a line wraps only if its words are wider than its room, every wrapped line's second row starts at
      least 1 em in from its first, and at most 5% of the lines wrap (the count is printed); at 1440 × 900 and 1100 × 800 no line wraps, and
      the Greek is 26 px and at least 22 px; and Plato's Republic at 390 × 844 keeps the reader's 18 px.
- [ ] The owner has read a page of Homer on the OnePlus and given the go.

## Comments

## Comment, 2026-10-30: built (the owner: "fix the reader, the reader tools and the word lookup … intuitive button placement and order for both pc and phone")

- **The acceptance line "every line of Iliad 1 fits whole at 390 × 844" is replaced, because it cannot hold with the 16 px floor.** Measured
  (Chromium, Gentium Book Plus): Iliad 1 has 611 lines; the widest is 456 px at 20 px, so 365 px at 16 px; the median is 381 px at 20 px. At 390 px
  wide the words had 323 px of room, and every line stands whole only below 14.2 px. The spec's own rule decides: "It never goes below 16 px. A line
  that still does not fit wraps with a hanging indent." The floor wins over wholeness, so the check asks for the floor, for few wrapped lines (5% at
  most) and for a good turnover, not for no wrapped line. Before: 598 of 611 lines wrapped at 390 px and 560 at 412 px.
- **What a reader sees now** (Iliad 1, from `check-reader` "verse"): 390 px wide, the Greek 16 px, the words 342 px wide (they had 323), 26 lines
  wrap (4.3%), each with its second row 1.5 em in; 412 px, 16 px, 364 px, 1 line wraps; 1100 px, 22.05 px (the widest line has 504 px and takes
  503), none wrap; 1440 px, 26 px, none wrap. Plato's prose at 390 px keeps the reader's 18 px.
- **A size that suits the device.** The Greek's size is a number the reader chose or "auto" (the default): `--greek-auto` in `tokens.css`, 18 px at
  390 px wide, 26 px from 1100 px on (a cap of 26 px in px, not 1.625rem: above 1600 px the page's rem grows to 18 px, and the Greek was 29.25 px at
  1920 px until the review found it; `check-reader` "verse" now also opens 1920 × 1080 and 2560 × 1440 and asks for 26 px and no wrapped line), set in
  the reader only; the rest of the site keeps 20 px until a size is chosen. Settings version 5: a saved 1.25 (the old default) becomes "auto", any
  other size stays, and "Fit lines" is dropped. The boot script keeps to the same rule. Aa's stepper, Settings' stepper, the search's "bigger text"
  and the two-finger pinch all start from the size on the screen (`lib/greekSize.ts`); the first step saves a number, and "Restore default settings"
  brings "auto" back.
- **The fit** (`lib/verseFit.ts`, measured once per page and per change of width, size or columns, not as the page scrolls): the reader's size, made
  smaller only as far as the widest line needs, never below 16 px, one size for the whole page, in one book, two books side by side and the floating
  window. The English beside the verse is 0.9 of it. On a computer the column of line numbers is 2.4 em wide, so a smaller size gives the words more
  room; `verseSizeWhere` takes that into account (read at 26 px alone, 1100 px would have given 21.5 px).
- **More room on a phone, for verse only:** side gutters of 12 px (16 before), the number column as wide as its figures need, set at the small step,
  3 px between it and the words; the numbers stay level with their lines, in their own column, and the touch area reaches into the gutter.
- **The page does not slide when the Greek is set again.** Opening a side panel at 1280 px narrowed the text, and the fit took the Greek down with it
  (26 px to 16 px with the Echoes panel open; it no longer does, see the comment of the panel follow-up below); the passage at the top is held where it was
  through any such change (`Reader.tsx`, the fit), which
  `reading-tools.spec.ts` "opening and closing a side panel keeps the passage being read at the top" asks for (it failed on the first build of this ticket:
  the passage at the top moved from 1.200 to 1.210).
- **The Greek typeface is asked for as the reader opens** (`Reader.tsx`, an effect at mount), while the book is being fetched. Without it the first measure of the verse was
  made in the stand-in face and a second one when Gentium arrived a moment later, 0.75% smaller at 1280 px with both columns; the page moved up 7 px, the header, which
  returns at any movement up, came back, and `continuity.spec.ts` "the floating reader follows the reader around the site" failed in 2 of 5 runs (it expects the header away
  once the reader has brought 1.40 to the top). Replaying that opening six times on the build with the early request: the header stays away every time.
- **Aa in the foot bar is its drawn sign** (`text-size`, a large and a small a), not the letters, so that `check-clickable` finds the button marked as
  something to press (it named the plain letters "Aa" at 1440 and 1024 px); its name for a screen reader, "Aa, page and text", and its title are as they were.
- **"Fit lines" is gone** (its Study row, its place in Study's count of modes, the setting, `.fitLines` and `data-fit-wrap`, the effect).
- **The look-up's meaning is never smaller than the Greek it explains** (25.6 px against a Greek of 26): `max()` of its step and the Greek as shown.
  Settings' sample is set as the reader sets verse (a turnover hangs).
- Judgment calls: the fit applies only while the size is "auto" (a size the reader chose, by Aa, by pinching or by Settings, is kept exactly, so that
  "+" always makes the Greek bigger, and verse can be made bigger than 16 px on a phone); Aa names the size on the screen, so on a phone's Iliad it
  says 16 px, on a phone's Plato 18 px; two books side by side and the floating window keep 20 px as their "auto" size.
- check-reader "verse" was shown to fail on the code before this ticket and on each fault put in by hand (see the report of the build).
- The space check (`check-room`) on the reader at 1440 and 1920 px, which found 63% of the column empty beside Homer's lines at 20 px, passes now by the
  larger Greek alone (26 px fills more of the column); nothing in the layout was changed for it. Its limit is 45% of the column in a stretch 300 px tall; the
  emptiest stretch of lines is a little over 40%.
- `echoes.spec.ts` now waits for the page to settle after opening a passage, as `reading-tools.spec.ts` does: the reader holds the page at its start for its
  first moments (`holdAtTop`), and the test's own scroll, made in the first frame or two, was put back; the Greek at 26 px makes those first frames longer.

## Comment, 2026-10-30: a side panel no longer takes the Greek down (a follow-up from the review; the owner's rule, passed on by the lead)

- **What was wrong.** With a side panel open on a computer (Find, Vocabulary, Places, the manuscript, Echoes, the sentence, the list of differences) the
  margin kept for the look-up stayed in each passage's grid beside the panel, and the Greek gave way to both: at 1280 px it fell from 26 px to 16 px (the
  floor), at 1440 px to 18.5 px.
- **The rule now** (the reader's older one, "it is written in the margin, rises from the foot of the screen, or takes a side panel's place", the comment by
  `topAnchor` in `Reader.tsx`). While a side panel is open on a computer (1100 px and up, one book) the margin's room is not kept: a passage's grid has two
  columns, the number and the text (`.single.withPanel .row`, `Reader.module.css`). A look-up opened then takes the panel's box exactly: the panel's left and right
  edges and width (400 px, 340 px below 1280), the panel's top (under the header when that is showing) and down to the foot bar, so that the panel is wholly behind it
  and nothing of it shows. It keeps its own look and its own × (the panel's edge is its frame there), it is fixed to the screen, and it is never over the text or the
  tapped line. Its × puts it away and the panel shows again, where it was and as it was (Find's words and its place in the list stay); no "Back to Find" is added, since
  the × already does that, and two buttons must not do the same thing. `Reader.tsx` `placeWord` gives its left edge and width from the text's right margin (the panel's own
  width, the figure that keeps the text clear of it); `.withPanel .panel.wordNote` gives its top and foot; a layout effect on a panel opening or closing moves a look-up that
  is standing between the margin and the panel's box before the page is drawn. While it stands the panel under it is put out of the keyboard's and a screen reader's reach
  (`.lookOver`, `visibility` after the window has inked in, so that the one is seen to take the place of the other), and it is back at once when the look-up closes.
- **The Greek with a panel open** (Iliad 1; Find opened by Ctrl+F, the manuscript from Study): 1440 px, 26 px (26 without a panel); 1280 px, 26 px (26 without);
  1200 px, 26 px (25.35 without); 1100 px, 23.09 px (22.05 without: with the margin kept the words had less room). The passage at the top moves 0 px. Before: 18.53 px
  at 1440 px and 16.00 px at 1280 px.
- **Checks.** `check-reader` "verse" (also alone with `ONLY=panel`): opening Find and the manuscript at 1440 × 900 and 1280 × 800 changes the Greek by 10% at most,
  closing brings the size back, and the passage at the top (1.200) stays. On the code of d2f8239 it failed with 4 problems (26 px to 18.53 at 1440 and to 16.00 at 1280, with
  each panel). `check-lookup` "margin" (also alone with `ONLY=margin`): with Find open at 1440 × 900 and at 1200 × 900 the look-up's four edges are on the panel's (within
  1 px), it is not over the text or the tapped word, a control of the panel under it does not take the keyboard, it is fixed while the text scrolls, on the next word and with More about it
  open (the window does not change height: it is the panel's whole box from the first layer), and closing it shows the panel again where it was, its controls taking the keyboard
  again. On d2f8239 the first version of this part (the look-up's edges within the panel's) failed with 6 problems; on the build that floated a 300 px window over the panel it
  failed with 20 (the top at 16 px, not the panel's 0; the right edge 100 px short; the foot far above the panel's; the covered panel's control taking the keyboard). All pass now,
  with the whole of check-reader and check-lookup, check-overlays, check-tokens, tsc and the reading-tools, continuity, echoes, find, sentence and compare specs (the one known
  failure, Places, is the same as before).
- **Judgment calls.** The first version kept the look-up's own 300 px at the panel's left edge, with 100 px of the panel showing beside it; the lead found that untidy and corrected "same
  width": the look-up now takes the panel's whole box. A first layer therefore stands at the top of a full-height column with blank paper below it, and "More about it" fills the same column
  (the window no longer grows). Opening a panel by its usual ways (Study, Ctrl+F, the list of differences) closes the look-up as it always did, so the move between margin and panel's box
  happens only when a panel is given up while a look-up stands.
- **Seen, not changed.** In Both columns (the English beside the Greek) the Greek is smaller to begin with (16.48 px at 1280, 19.21 at 1440, 25.34 at 1920) and, since a panel puts the English
  under it (as it did before), it becomes 26 px when a panel opens. The 10% rule holds in the default view, Greek alone.
- **Found on the way.** `check-tokens` found a hardcoded `20px` in the font request this ticket added at the reader's mount (the Greek typeface, committed in d2f8239);
  it now asks with the page's own size (the face does not depend on it).

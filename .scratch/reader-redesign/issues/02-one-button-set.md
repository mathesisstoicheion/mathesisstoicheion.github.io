# 02. One button set and one switch in the reader

Status: done (2026-10-25), waiting for the owner's go before 03
Type: AFK (no visible change meant)
Blocked by: 01
Spec: `../spec.md`, "Building order"

## What to build

- Bring the reader's button styles (chip with a switch, chip as an action, floatBtn, btn ghost and the rest) down to
  one set:
  - a quiet text button
  - a red text button for the one main action in a place
  - an icon button, at least 44 px on a phone
  - one switch, for on and off settings
- Move every button and switch in `web/src/components/reader/` onto the set.

## Acceptance criteria

- [x] A check lists the button classes in the reader's files and fails on any outside the set.
- [x] Every reader control is at least 44 px on a phone (390 px wide), checked on the built site.
- [x] `check-design` (one primary button) and `check-a11y` pass in Paper and Night.
- [x] The build passes.

## Comments

2026-10-25, built:
- The set lives in `web/src/app/globals.css`, next to the site's `.btn` and `.chip`. It has:
  - `.btn` (with `ghost` and `small`)
  - `.chip`, with the one switch already in it
  - `.segmented` for choices
  - three new classes:
    - `.icon-btn` (with `.framed`): ×, ‹ ›, +, play. 44 px on touch screens.
    - `.text-btn`: a button that reads as a link.
    - `.row-btn`: an entry of a list, drawn by its list.
- `web/src/components/reader/buttons.test.ts` is the check. It failed on 34 buttons and passes now.
- The check also allows a few buttons on purpose:
  - Buttons that are the text itself, tapped: the passage number, your marks, a beat of the metre, a word in the
    sentence or Share, a place on the map, a book on the shelf.
  - Buttons that ticket 09 replaces, named in the test: the top bar, the Tools, Aa and More menus, and the passage
    actions.
- Moved onto the set:
  - every ×, the look-up's ‹ › and ∧
  - Find's arrows and links
  - Compare's +
  - the Listen bar
  - the manuscript viewer's buttons
  - the links in the private collection and Talk
  - the rows of Find, Compare, Vocabulary, the book picker and Places
- Old classes removed: `.x` (Reader and Mine, now placement and size only), `.linkBtn`, `.talkRef`, and the look of
  `.step` and `.add`.
- What looks different:
  - On a phone, the × of Vocabulary, Places, the manuscript and the other side panels is 44 px tall instead of 36. It
    is easier to tap, and the panel's heading sits 8 px lower.
  - Compare's + is a round hairline frame instead of a shaded disc.
  - Everything else matched pixel for pixel: the look-up at three sizes, the side panels on a computer, and the Listen
    bar.
- Checks before and after are the same:
  - `check-overlays`, `check-reader`, `check-lookup` and `check-design` pass.
  - `check-a11y` has one complaint, the words of a Learn page at 375 px (`/academy/reading/desire-to-know`). It was
    there before this change and is outside the reader.
  - tsc is clean, and eslint shows the same 10 older errors.

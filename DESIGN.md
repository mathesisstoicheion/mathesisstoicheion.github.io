# Design

The look of the site: **the printed page with real photographs**, chosen by the owner on 2026-10-22 ("Printed page with
real photos is our new design choice") and built across the whole site and the Android app on 2026-10-22 and 23 ("Now, do
the full redesign for the whole website/app. No corners missed."). The owner's twelve decisions are in
`docs/adr/0008-the-printed-page.md`; the working spec and the sample page are in the project's files
(`redesign/printed-page/SPEC.md`, `DECISIONS.md`, and `redesign/templates-2026-10-21/printed-photos.html`). The looks
before it, Gold and lamplight (design A) and Stone and torch (design B), are described in
`_archive/old-look-2026-10-22/DESIGN.md`, and their files are kept in the same folder.

## Character
- A fine two-language edition: warm paper, black ink, red for what matters, wide margins, and real colour photographs
  set as numbered plates, photographs of works in stone among them.
- The owner's rule for taste: don't mix designs, and nothing flashy. No lamps, torches, stone textures, carved letters,
  glow, grain or floating letters.
- The reader's word look-up comes first. Every part of the look serves reading real Greek.

## Paper and Night (decision 2)
The site follows the device: **Paper** when the phone or computer is in light mode, **Night** when it is in dark mode.
Settings can choose for good: Follow device, Paper or Night. The reader follows it too (its old Daylight page is gone).

| Role | Paper | Night |
|---|---|---|
| Page | `#f3ece0` | `#1b1814` |
| Second surface (a plate's mount, a margin) | `#e9dfcd` | `#24201a` |
| Ink | `#1e1a15` | `#ebe1cf` |
| Captions | `#5c5043` | `#b7a891` |
| Small print and credits | `#675846` | `#9a8c77` |
| Faint marks that are not words | `#8a7b68` | `#8c7f6c` |
| Hairline rules | the ink at 20% | the ink at 20% |
| Red: headings' numbers, the Σ, links, the chosen thing | `#a3301a` | `#e0805f` |

- The spec's faint ink, `#8a7b68`, reads under 4.5 : 1 as small print, so small print takes `#675846`; the faint ink is
  kept for marks that are not words.
- `web/src/styles/tokens.css` names every colour in two layers: the raw colours, then the roles the pages use (`--bg`,
  `--ink`, `--ink-2`, `--rubric`, `--rule`…). The roles follow `prefers-color-scheme` unless Settings has set
  `data-theme="paper"` or `"night"` on `<html>`; the boot script in `lib/settings.ts` sets it before the first paint, so
  a page never shows the wrong paper first, and the browser's own bar takes the page's colour.

## Type
- **EB Garamond** for all English: 19 px on a computer, 18 px on a phone, with old-style figures as a book has.
- **GFS Didot** for titles, Greek room names, numerals set large and the logo's letters.
- **Gentium Book Plus** for the Greek being read and the Greek in the look-up.
- No other typeface. The arrows and signs, and the phonetic letters, come from the site's own copies of the three
  (`web/src/fonts/`), so no device draws a sign in a font of its own.
- Every size of words is a step of the type scale in `tokens.css` (`--step--2` to `--step-4`); only lettering in GFS Didot
  and the reader's own Greek size stand outside it.
- Labels are small capitals spaced wide. Greek is never put in capitals by a style: accented Greek capitals are not set in
  print. Greek a title page writes in capitals drops its accents (`titleCaps`, `components/reader/ReaderCover.tsx`).

## The logo (decision 1)
The printer's device: a round seal, ΜΣ in the middle (Μ in ink, Σ in red), ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ round the ring; below
64 px the ring's words are dropped. The header and the foot of the page draw it (`components/a/Mark.tsx`);
`web/scripts/make-logo.mjs` makes the tab icon, the install icons and the Android app's icon from it, and
`make-share-card.mjs` the picture shown when a link is shared.

## Movement (decision 3)
- **One movement: the ink-in.** A thing arrives faint, a little soft and 8 px low, and settles onto the page over 1.4 s
  (`@keyframes ink` in `app/globals.css`; `--ink-in`, `--ink-step`). A page's head inks in line by line, 0.12 s apart;
  anything marked `.rv` inks in as it comes into view (`components/Reveal.tsx`); a photograph inks in as it arrives.
  Between pages the old page fades away in 0.22 s and the new one fades in over 0.6 s while its head inks in
  (`components/Page.tsx`, the page-turn).
- **Then nothing moves.** Every ink-in ends with `backwards`, never `both`, so nothing of its rise or blur stays on the
  element, and no graphics layer is held for it.
- A colour changing under the hand (0.2 to 0.4 s) is not movement.
- The device's reduced-motion setting turns all of it off, page-turns and smooth scrolling included: everything is simply
  there.
- The three animation levels, the floating letters, the lamplight, the gliding and settling text and the opening windows
  are gone (their files are in the archive folder).

## Plates and photographs (decision 6)
- **Every page opens with its head** (`components/PageHead.tsx`): the path as a small-capital kicker after a red rule, the
  title, its Greek name in red, one line on what the page is for, and the page's own plate, a museum's colour photograph
  numbered Plate I with its credit. The plate stands at the right of the title on a computer, and after the page's main
  action on a phone.
- **A plate** (`components/plate/Plate.tsx`): the photograph in its real colours, in a fine double frame on the page's
  second surface, numbered and credited beneath. Photographs are never tinted, turned grey or filtered.
- **Every photograph shows its credit** from `web/src/data/images.json`: where the object is, who made the photograph, the
  licence and the source. Small pictures in a page's rows are credited in the list of plates at the foot of the page
  (`PlateList`). Only openly licensed photographs are used, each recorded with its source before it goes on a page.
- In the library, pointing at a work shows its picture as a plate in the margin (`MarginPlate.tsx`); on a phone each work
  has a small picture in its row.

## The header and the phone's bar (decisions 8 to 10)
- **The header** (`components/Header.tsx`): the device and the name at the left; on a computer the four rooms, Learn, Read,
  Explore and Mine, each with its Greek name in small italic beneath (Ἀκαδήμεια, Μουσεῖον, Στοὰ Ποικίλη, Θησαυρός), the
  current one in red; Search, the account, Settings and the connection light at the right; a double rule beneath it, as on
  a title page. It stands at the top of the page and scrolls away with it. On a phone, and on a narrow computer screen, a
  Menu button opens the same things in a panel. Talk stays hidden while the forum is frozen.
- **The bar along a phone's foot** (`components/TabBar.tsx`, new for the printed page; the owner: "Don't keep the old
  template. It looks cheap and clunky."): the paper, a thin rule of ink above, the four rooms in Garamond with their Greek
  names, the current one in red. No pills, no shadows, no icons in boxes. It slips away as you read on and comes back when
  you scroll up; there is no setting for it, and it is never in the reader. It keeps clear of the phone's gesture bar, and
  whatever floats at the foot of the screen (Back to top, a message, Listen, the offline sign) stands above it.

## The reader (decisions 4 and 5)
- With one book open it has its own bar along the top (the mark, the way back to the library, the book and its page, then
  the columns, Both / Greek / English, then Aa, Tools and your marks); the site's header and foot stand aside.
- The book's **title page** (`components/reader/ReaderCover.tsx`) is set as a two-language edition sets it: the author in
  red spaced capitals, the Greek title large, the English title in italic, a fleuron between two red rules, the editions
  in small print. A book with its own picture opens with it as a plate, its frontispiece.
- **Greek and English side by side**, like a two-language edition; on a phone they take turns, paragraph by paragraph.
  Both / Greek / English switch it, and the choice is remembered.
- **The word look-up** is written in the margin beside its line on a computer, like a printed note; on a phone it slides up
  from the foot and stops below the line being read. It never covers the Greek being read.

## Space and shape
- Spacing steps of 4, 8, 12, 16, 24, 36, 56 and 80 px. Pages are up to 1180 px wide, with a margin of 16 to 56 px.
- Hairline rules and square corners. No shadows, no rounded cards.
- Buttons are small capitals spaced wide: the main one in ink with paper letters, turning red under the hand; the others a
  hairline frame. A chip is a hairline frame, filled with ink when pressed. A field to type in has a rule beneath it.
- On a touch screen everything a finger presses is at least 44 px tall (`--tap`, `--tap-pad`).
- Phones are up to 760 px wide: one column, the Menu button and the bar of rooms, and nothing scrolls sideways.

## Before anything goes live: the checks
`.github/workflows/checks.yml` runs every check on the built site. Each script's first lines say what it guards and how it
was shown to catch what it is for. The ones the printed page added or changed:
- `check-look.mjs`: Paper or Night follows the device and the choice in Settings wins, from the first paint.
- `check-design.mjs`: only the three typefaces, sizes on the type scale, colours from the tokens, one main button.
- `check-photos.mjs` and `check-credits.mjs`: every photograph has its record, its file and real colour, and its credit on
  the page.
- `check-lookup.mjs`: the look-up never covers the line being read, on a computer and on a phone.
- `check-bar.mjs`: the bar along a phone's foot hides as you read on, comes back as you scroll up, and is not in the reader.
- `check-still.mjs`: nothing moves after the ink-in, nothing at all with reduced motion, and no finished ink-in holds on
  to its last frame.
- `sideways.mjs` at 390 px: nothing scrolls sideways; a page that fails to open fails the check.
- `check-a11y.mjs`: contrast in Paper and Night, names for every control, and finger-sized targets.

By hand, for every change to the look before the owner sees it (since 2026-10-19, when a release that the test browsers
had passed stopped drawing on phones, because test browsers never run out of graphics memory):
1. **Graphics memory per page**, on a phone at 3x: `node web/scripts/check-layers.mjs <url>`.
2. **Screenshots mid-scroll under a phone's memory limit**: `node web/scripts/check-midscroll.mjs <url> <out> 128`.
   Every part drawn, nothing blank.
3. **Nothing overlaps** (the owner, 2026-10-19: "fix these kinds of overlaps"): `node web/scripts/check-overlaps.mjs <url>
   <out.json>` opens every page at three phone widths, a tablet and two computer widths and lists text running out of its
   box, text drawn over text, and pages that scroll sideways. The list should be empty or every entry explained.

## Avoid
- Mixing designs, and anything flashy: glow, grain, lamps or torches, stone textures, carved letters, floating letters,
  sparks, bounces.
- Snapping or gliding the page into place after scrolling.
- Tinting photographs, or turning them grey.
- Anything invented for decoration: every picture is a real, licensed object with its credit shown.

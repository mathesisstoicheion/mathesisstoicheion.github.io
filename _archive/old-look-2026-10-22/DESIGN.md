# Design

The look of the site: **design A, "Gold and lamplight"**, rebuilt on 2026-10-19 straight from the sample the owner chose
(`redesign/design-a/design-a.html` in the project files, round 11; shown in https://claude.ai/artifact/DKDa9aW9GVkicDQnh2GmnH).
The owner, 2026-10-19: "Just take the template of the original gold and lamplight design and don't make any changes to
speed or anything." A first Gold and lamplight release earlier that day broke on phones (see "Before anything goes live");
Stone and torch (design B), live from 2026-10-16 until then, is kept for reference at the end of this file.

## Character
- **In design A's own words:** "a dark room where a single lamp, or the glint of old gold, lets you see the Greeks".
- **Is:** beautiful, mysterious, insightful. **Is not:** bright, busy, flashy, or like a template.
- Pages are black, and pictures appear through framed openings: windows onto real objects, engraved in gold lines on
  Pompeian red. The black frame (header and footer) is the same everywhere.

## What is A's, and what is the site's own (the owner's answers, 2026-10-19)
1. **A only.** The home page, the library and the reader are A's own screens with the site's real content
   (components/a/, lib/a/lamplight.js, components/a/a.module.css). Every other page keeps its own layout, dressed in A's
   colours, type, buttons and engraved windows (components/a/PageWin.tsx). The page flows of 2026-10-18 and the art
   growing behind pages were dropped. A "mixed" version with a letter figure for every area was live 2026-10-19 21:20 to
   2026-10-20; the owner then chose "gold and lamp everything" (2026-10-20 14:38): only the library keeps its figure.
2. **No Muses.** The home page is A's without the nine Muses and their lamps.
3. **The coin's rays turn by themselves,** slowly, as in A.
4. **No settling.** The wheel is slow and smooth on the home page and in the library, as in A, but the page stops exactly
   where you stop ("no snapping", 2026-10-16).
5. **No bottom bar on phones.** The header's search button and menu take you everywhere, as in A. The reader has A's own bar
   at the top. On a phone that is offline, a small sign at the foot says what still works.
6. **Weak devices start a level down** (lib/settings.ts, deviceLevel): very little memory starts on Performance, two
   gigabytes or two processor cores on Balanced; everyone else on Full beauty. Anyone can change it in Settings.
- The header scrolls away with the page, as in A. A light mode comes after the dark design is approved.
- **Things play once, on view, and stay** (the owner, 2026-10-19: "when scrolling, the animations should play automatically
  when they come into view. And should stay expanded, even if you scroll back up"). A window opens by itself once it is
  well in view and a heading's letters settle by themselves; neither goes back when you scroll up. In design A these followed
  the scroll position, so a page left mid-scroll showed half-open windows and scrambled titles.
- **The library's Socrates is the exception** (the owner, 2026-10-20: "The figures should grow into the background, as you
  scroll, then stay there, until you scroll back to the top, then it animates into the face again"). He gathers into his
  face in the opening the page marks (`data-face-anchor`); once you scroll a fifth of the window, his letters become the
  papyrus roll, large behind the page; back at the top they become the face again. Every line of text over it sits on a soft
  dark band drawn under the words, so text never sits on bright letters (the overlap rule below).
- **Pages are as wide as the frame** (1240 px; the owner, 2026-10-20: "Everything is stuck to the left, and doesn't fill out
  the page"). The doors (components/a/Door.tsx) have blocks across the page and a tall red window beside the name.
- **Every page follows the home page** (the owner, 2026-10-20: "Every page must follow the design choices of the homepage",
  "All little submenus and buttons"). Every page is the doorway: black, with the home page's floating letters behind it
  (components/Page.tsx; the library and the reader draw their own), windows with no frame until their iris opens, gold
  lines and accents, words in bone, panels washed in Pompeian red, chosen chips and hovers in the red chip colour, the main
  button a bone plate with red capitals, reading text in EB Garamond. No scan lines (the home page never had them). The
  Treasury's nine sections are laid out as the home page's grid of rooms, each with a small red window.

## The three animation levels (the owner, 2026-10-19)
"One with the full beauty and intricate design and animation. One with a few visual sacrifices for better performance,
and a full performance mode, for older computers and older phones. Main focus is the beauty." The switch is in Settings and
remembered.
- **Full beauty:** design A exactly. Nothing in it is trimmed for speed.
- **Balanced:** drawn at the screen's own sharpness rather than 1.5 times it, at half the frame rate while nothing moves, with
  fewer floating letters and dust motes.
- **Performance:** everything drawn once and holding still (A's own "reduce motion" path): a window, the floating letters and
  the library's Socrates are drawn again only at a new size or a change of colours, the reader's cover only fades, headings
  stand settled, and pages open without animation.

## Type and colour
- Display: Noto Serif Display (narrow, light). Reading text and Greek: EB Garamond, the home page's (Literata until
  2026-10-20); Settings also offers Gentium Book Plus or Noto Sans for the Greek and Alegreya Sans for the English. Labels: Noto Sans Mono in spaced capitals. The ΣΤΟΙΧΕΙΑ mark:
  Noto Sans Display. All are served by the site itself (next/font).
- Colours are design A's doorway, named in `web/src/styles/tokens.css`: the black frame #070504 and page #050403; words in
  bone #f2e0c6 (quieter #c39f83, #9c7d66); gold #e8bd70 (bright #f6dca6) for accents and lines; Pompeian red #5c1910, its
  raised surface #26100c and its chip #6d2216. The lamp room's parchment and amber are no longer used. The reader's Daylight
  page is the one light surface.
- Thin 1px lines instead of shadows; square corners. Greek capitals in labels and inscriptions carry no accents.
- Contrast (4.5:1 for text): the Daylight page's sienna is #8c460a, a shade deeper than A's #a8550f, which read 4.0:1 in
  small labels. A's dimming of the lines away from the reader's lamp stays as A drew it, below the rule on purpose; Aa,
  "Lamp on the passage: Off", gives every line full contrast (the accessibility tests read the page with it off).

## Before anything goes live: the checks (since 2026-10-19)
The first Gold and lamplight release gave every window its own full-screen copy of the engraving, with a turning flare
twice the screen's size. On the library that was about 35 screen-sized layers, some 700 MB of graphics memory at a phone's
3x sharpness (the Stoa about 990 MB), and phones stopped drawing parts of the page while scrolling: blank tan panels,
half-drawn art, a black screen. The frame-rate tests had said 51 to 60 fps: they ran in a test browser that never runs out of
memory, at 2x. So, for every change to the look, before the owner sees it:
1. **Graphics memory per page,** on a phone at 3x (`node web/scripts/check-layers.mjs <url>`). Pages stay near design A's own
   80 to 170 MB; none holds a full-screen layer per window. After the rebuild: 45 to 140 MB on every page measured.
2. **Screenshots mid-scroll under a phone's memory limit** (`node web/scripts/check-midscroll.mjs <url> <out> 128`): every
   part drawn, nothing blank.
3. **Smoothness per animation level** (Full, Balanced, Performance), on a phone with the processor slowed, side by side
   with design A where A drew the screen.
4. **Built from A's own code, compared side by side with A's screenshots,** not re-imagined.
5. No element holds a layer it does not need: an entrance animation whose last frame is the element's own look ends with
   `backwards`, not `both`; no lasting `will-change`.
6. **Nothing overlaps** (the owner, 2026-10-19: "fix these kinds of overlaps"):
   `node web/scripts/check-overlaps.mjs <url> <out.json>` opens every page at three phone widths, a tablet and two computer
   widths, scrolls through it a screenful at a time and lists text running out of its card, text drawn over text, and pages
   that scroll sideways. Look at each finding in a screenshot; the list should be empty or every entry explained.

## Avoid
- Flashy motion: sparks, flashes, bounces and springy overshoot ("It's horrible", 2026-10-16).
- Snapping or gliding the page into place after scrolling.
- Effects that follow the pointer uninvited; show them on press and hold (the library's reading glass).
- Anything invented for decoration: every picture is a real, licensed object with its credit shown.

## Stone and torch (design B, live 2026-10-16 to 2026-10-19; replaced by A)
Kept for reference. The owner compared three designs on 2026-10-16 and chose B (`docs/adr/0006-stone-and-torch.md`); on
2026-10-19 the site moved to A. Its sources are in the project files under `redesign/prototype/abc/b-sources/`.

### Character
- **Is:** beautiful, mysterious, insightful.
- **Is not:** bright, busy, flashy, or like a template (no default blue, no cards everywhere, no stock icons as decoration).
- **In one sentence:** a wall of warm, dark stone in a sanctuary at night, read by the light of a torch you carry.

### Principles
1. **Darkness is the frame.** The site is dark only. The one light surface is the reader's "Daylight" page, a reading aid against eye strain.
2. **Every page has something to touch, except the reader.** The home page, the library and every other page carry art that the torch lights. The reader is for reading: once you scroll into the text nothing moves.
3. **Greek is carved as Plato's Athens wrote it.** Capitals set in a strict grid (the stoichedon style), with no accents or spaces, for carved Greek. Reading Greek is set in full polytonic type.
4. **Real things only.** Every picture is a licensed image of a real object, and its credit is shown. Every Greek text is a real edition, and the edition is named. Every quotation is checked against its source. Nothing is invented for decoration.
5. **Greek comes first, English beside it.** Greek is set as carefully as English, in fonts that carry every accent and breathing.
6. **All movement is calm.** Things ease and settle. Nothing bounces, sparks or flashes. The owner: "Remember when I say movement it has to be calm" (2026-10-16). A quick, springy, flashy trial the same day was rejected: "Get rid of the flashy animations. It's horrible. I liked the way it was before."
7. **On a phone, scrolling is the torch.** Nothing needs touching: the light stands in the middle of the screen, so carvings and reliefs light up as they reach the middle and dim as they scroll away (the owner, 2026-10-16: lighting by touch "is a bit distracting"; earlier that day each finger carried its own light). Things a finger works directly, such as the vase, still answer every finger at once.

### Type
| Role | Family | Notes |
|---|---|---|
| Headings and Greek | GFS Didot | Polytonic Greek. |
| Reading text, wide-spaced capital labels | EB Garamond | |
| Letters carved on canvas | Noto Serif Display 500 | |
| Third Greek choice in the reader | Noto Serif | |

- All are Google Fonts under the SIL Open Font Licence, so they can be bundled for offline use.
- Greek text is stored precomposed (Unicode NFC). Greek apostrophes are ’ (U+2019).
- Greek capitals in labels are written without accents (ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ); where a label must keep its accents it is set in lower case.

### Colour
| Role | Value |
|---|---|
| Stone, darkest to lightest | #0b0907, #14100d, #1b1612, #251f19, #332a21 |
| Text, ivory | #efe5d2; quieter lines #bfb09a and #93856f |
| Torchlight: honey | #efc27a (brighter #f9dfae) |
| Torchlight: amber, ember | #f0a24c, #c8622c |
| Second accent, faded red ochre | #a65d40 (labels #d4917a) |
| Daylight page (reader only) | pale limestone #e8e0cf, dark ink #2a221a, burnt-sienna accent #8a3e1e |

Light text is never pure white.

### Texture and light
- The stone has a still (never moving) mottled, pitted texture. There is no film grain.
- The pointer is a torch. It eases along behind the hand, and drifts by itself when the hand leaves the page. On a phone the torch stands in the middle of the screen (a little higher at the top of a page and lower at its foot, so the first and last things are lit too) and fingers carry no light. Nothing blocks scrolling.
- Carved letters are V-shaped grooves lit from the side the flame is on (each letter is prepared lit from 16 directions; the page blends the two nearest).
- Real sculpture is lit in its own colour, its carving read from a height map, and the torch casts its real shadows (see "A sculpture on every page"). The books' medallions are re-lit greyscale copies, bright parts treated as raised.
- With "reduce motion" switched on, everything is drawn once and holds still.

### Motion
- **Scrolling (Home and Library):**
  - The wheel is a little slowed (0.8 of the browser's distance per notch) and smooth: the page eases towards where the wheel sends it and keeps up with the hand (about 0.11 s). The owner wanted the slow scroll kept, "just not THAT slow" (2026-10-16).
  - **No snapping.** The page stops exactly where the wheel or the finger leaves it; nothing pulls it to a section. The owner: "no snapping. it's annoying" (2026-10-16). Until then the page glided to a nearby section after it stopped.
  - As the page nears a section, its carvings and reliefs brighten a little, and heading letters settle gently into line as they rise into view.
  - Each part is cut in (it fades in and rises a few pixels) the first time you reach it.
- **The reader** opens on a torch-lit cover (ΑΠΟΛΟΓΙΑ·ΣΩΚΡΑΤΟΥΣ carved in stone, with the Socrates portrait as a medallion). The cover fades as you scroll into the text; after that nothing moves, and scrolling is completely normal.
- Nothing loops fast, flashes or throws sparks.
- **One tempo for everything that plays out once** (the owner, 2026-10-20: "They need to animate faster"): `--tempo` in
  `styles/tokens.css`. Write each animation at its natural, calm time; stylesheets divide it by the tempo
  (`calc(0.6s / var(--tempo))`), scripts use `lib/tempo.ts`, and the engine (`lib/a/lamplight.js`) reads it for the windows,
  the headings and Socrates. Quick hover responses (under half a second), endless loops and the letter-writing lessons keep
  their own pace.

### Space and shape
- Spacing steps of 4, 8, 12, 16, 24, 36, 56 and 80 px. Sections breathe; lists are compact.
- Thin rules and cut lines instead of drop shadows. No rounded cards.
- One column on phones, with a 16px gutter. Pictures sit above the text on phones.

### Everything on a page is stone
The owner (2026-10-16): "All pages and content must match the theme", "Except for photos and text and buttons"; then
(2026-10-17): "Make every page and page element match the theme", choosing stone buttons too. So every panel, card, table,
list, chart, map, form field, button, chip, tick box, frame, empty-state box and the footer is cut from the wall; only photos
and the text keep their own look. No outlined boxes: nothing is drawn round with a thin line. The torch's light lies on the wall behind everything, so a see-through stone panel is lit as the torch passes.
The pieces (all in `web/src/styles/tokens.css`; a module uses only these names):
| Thing | Token |
|---|---|
| A panel sunk into the wall (most boxes, lists, tables, figures, forms, empty states) | `--field`, `--field-edge` |
| A slab set on the wall (a card that is a link, a featured item, a summary of numbers, a tip); lit when hovered or chosen | `--slab`, `--slab-edge`, `--slab-lit` |
| An inner panel cut just inside a big panel's edge (upper and left edges in shadow, the others lit; an inset outline) | `--moulding` with `--moulding-in` (a moulded link card gets its focus ring back); on a pseudo-element, `--panel-cut` (`--panel-cut-lit` under the hand) |
| The main button: a gilded plate, lit from above, sinking when pressed | `.btn`: `--inlay`, `--inlay-edge`, `--inlay-drop`, `--inlay-press` |
| Any other button, a chip, a tag: a small slab (chosen: lit, with a gilded foot); a tag or badge is a small channel | `.btn.ghost`, `.chip`: `--slab`…, `--chosen-foot`; `.tag`: `--channel`, `--channel-edge` |
| A row of choices: a channel sunk in the stone, the chosen one standing up in it (as in Settings) | `.segmented` |
| A tick box or a choice: a small hollow; checked, a gilded tick or stone is set in it. A drop-down has a gilded chevron | global input styles, `--select-arrow` |
| A small map: cut in the stone, the land its face, the sea sunk and darker, the coast the cut's lit edge | `--map-land-wash`, `--map-sea-wash`, `--map-coast` |
| Architecture: a column is a round shaft with flutes and a capital; a gable is solid stone round a sunk tympanum; a triglyph is a grooved block | `--shaft`, `--flutes`, `--capital`, `--capital-shadow`, `--stylobate`, `--block-light`, `--tympanum`, `--lip-hi` |
| A line between rows, above something, at the left | `--cut-under`, `--cut-over`, `--cut-left` (shadows, so a row's own background stays free) |
| A slim gilded inlay at a slab's left or top, laid in a cut (gold, green for right, ochre, blue, the legend's colour) | `--inlay-left`, `--inlay-left-ok`, `--inlay-left-ochre`, `--inlay-left-blue`, `--inlay-left-legend`, `--inlay-top`, `--inlay-top-blue` |
| A bar or meter: a channel cut in the stone, filled with gilding | `--channel`, `--channel-edge`, `--inlay`, `--inlay-side`, `--inlay-dim`, `--inlay-edge` |
| A field to type in: a hollow cut in the stone (the global style; focus adds a gold line) | `--hollow`, `--hollow-edge`, `--hollow-focus` |
| A frame round a photo or map | `--frame` |
| The foot of every page: a plinth with the site's name carved along it | `--plinth-edge` |
| The page that has not survived (404): a broken piece of stone carved ΥΔ, 404 in Greek numerals | `--broken-edge` |
- Pop-overs, menus, dialogs and sticky bars stay opaque (the page would show through them); only their edges are stone.
- **The header and the phone's bars** (the owner, 2026-10-17: "The text and buttons at the top are ugly and they overlap.
  Match the theme, and do the same for the buttons at the bottom"). The header is a lintel of the wall's own stone across
  the top (`--lintel`, `--lintel-foot`, `--lintel-shadow`), solid, with a fine fillet along its foot and its shadow on the
  wall; the phone's bar is the same stone turned over, a sill along the foot (`--sill`, `--sill-head`, `--sill-shadow`), and
  the reader's phone bar is one more course of it. Neither blurs what scrolls beneath it.
  - The site's name beside the logo is cut in capitals in a grid, each letter in its own square (stoichedon), ΜΑΘΗΣΙΣ over
    the middle of ΣΤΟΙΧΕΙΩΝ, and laid with gold like the logo (`--gilt`, `--gilt-cut`). On a phone the letters take the
    room the buttons leave, so the two never meet; on a computer the Latin name is under them.
  - The header's buttons are one slab, its places parted by lines cut across it; the connection light is a small polished
    stone in a gold bezel (`--bezel`, `--gem-shine`).
  - On the phone's bar the place you are in stands on a lit slab with a gilded foot, which slides to the place you go to;
    Search, in the middle, is a round boss ringed with gold (`--boss`, `--boss-edge`) rising a little above the sill, and
    so is Back to top. The reader's bar has its buttons as slabs, an open one lit with a gilded foot.
- A page inside an area carves its own Greek name above its title (`components/art/NameCarving.tsx`): ΛΕΞΕΙΣ, ΑΝΑΜΝΗΣΙΣ, a
  lesson's or an entry's Greek name. The Oracle, which has no Greek name of its own, carves ΓΝΩΘΙΣΑΥΤΟΝ, "Know thyself", one of the
  maxims written in the fore-temple at Delphi (Pausanias 10.24.1, tr. Jones and Ormerod), with its source under it.
- On the Daylight page the same names give limestone and burnt sienna.

### A sculpture on every page
The owner (2026-10-16): a dedicated lit sculpture on every page, lit by the mouse on a computer and by the light in the middle of
the screen on a phone. Every page but Home (which has its three reliefs) and the reader has one.
- **The pieces** are photographs from the Metropolitan Museum's Open Access collection (CC0), one chosen for each page
  (`web/src/data/pieces.ts`; the credits page lists them all). A portrait stands only where it is the person the page is about or
  the caption says why it is there; an author's page has a marble hand holding a book roll, not someone else's face.
- **The niche** (`components/art/PagePiece.tsx`): cut into the wall at the right of the title, the words flowing round it; a
  round-headed niche for a statue or a head, a plain window for a slab or a relief. On a phone it stands after the title, so the
  title keeps the whole width. Pages with no title on show (a form, a private page) have theirs at the foot instead.
- **The light** (`lib/art/piece.ts`, WebGL2): the photograph in its own colour, its carving read from a height map
  (`pipeline/pieces.py` cuts each piece out of its photo and removes the museum's modern mounts). The torch casts the piece's
  real shadow onto the back of the niche, like the gnomon's shadow of στοιχεῖον. Marble lets a little light through at its
  edges; bronze shines and stays dark where it faces away.
- **Arrival**: the first time a piece comes into view, the light arrives from far off, so its shadows shorten to their length
  over two seconds.
- **The lamp**: clicking a piece (tapping it, on a phone) sets a steady lamp before it, high on one side, so it can be seen
  clearly; clicking again gives it back to the torch (the owner, 2026-10-16). The home page's reliefs do the same.

### Never laggy
The owner (2026-10-16): "The site is not allowed to be laggy." Every new feature has its frame rate measured before it is shown.
- A piece is drawn only while it is on screen and only when a light moves; a torch too far off to reach it draws nothing.
- Its shadows are traced in steps of about 2.5 px (at most 32; 16 on a phone), so a short shadow costs little.
- Each piece watches its own frames. If they keep coming slower than 42 a second, it steps down (fewer pixels, shorter shadow
  traces), at most twice, and stays so. At most 1.2 million pixels a piece on a computer, 640,000 on a phone.
- Change only `transform` and `opacity` in animations where possible; animating sizes and margins makes the browser lay out
  the page again on every frame.
- Never change a CSS variable on `<html>` (or `<body>`) in answer to scrolling or any other frequent event: every element of
  the page is restyled, a pause of a tenth of a second on a computer and more on a phone. The header's slide sets only
  `data-hdr` on `<html>`; each rule that sits below the header sets `--hdr-vis` (and `--tabbar-vis`, `--readbar-vis`) to 0 on
  its own element under `html[data-hdr="hidden"]` (lib/header.ts). The stone texture is a ready-made picture
  (`public/images/stone.webp`, from `scripts/make-stone.mjs`), not drawn and set on `<html>` on every visit.
- Each frame of the torch first lets every piece read the page, then makes every change (lib/torch.ts: a piece's frame
  function returns its changes), so the page is laid out at most once a frame.
- No element is a layer of its own for the graphics unless it must be. No `translate3d` on small things (each settling letter
  was a layer); no lasting `will-change`; and an entrance animation whose last frame is the element's own look ends with
  `backwards`, not `both`: a held last frame keeps the element a layer for as long as the page is open.
- The torch's pool of light changes in steps too small to see (its brightness in hundredths, its place on a two-pixel grid),
  so its flicker and drift no longer redraw the whole screen on every frame.

### A to Z
- **Author pages** with six or more works have an "A to Z" button. It opens the works in alphabetical order, under a row of
  letters to jump by. The list is cut open like a carving: a fine line is cut across the top with a glint at the chisel's point,
  the panel sinks beneath it, then the letters and the groups are cut in from left to right; closing runs it back, faster. On a
  phone the letters are a strip down the right-hand edge: press and slide (the owner, 2026-10-16).
- **The library** has no button and no separate block: one slim scroller of letters runs down the right of the list, on a
  computer and a phone, and stays beside it as the page scrolls (the owner, 2026-10-16: "the A to Z should just be the side
  scroller"; 2026-10-17: "give the A to Z scroll smooth animation and match its theme better. Also, move it to the right
  side"). Press and slide on a phone, with the letter shown beside the finger. It is hidden when the list is ordered by period,
  or holds fewer than 20 authors.
- Both A to Z rails are a channel cut in the stone with carved letters; a lit slab with a gilded edge marks the letter you are
  reading under, and slides (by transform) as you scroll. A tap jumps to the last stretch and glides the rest (lib/header.ts,
  `glideTo`: about half a second), so it reads as smooth without the browser drawing the whole list on the way; any wheel,
  touch or key stops the glide. A finger sliding along the letters goes straight to each one (gliding there too measured
  37 to 25 fps on a slowed phone).
- **The settings panel**: every control is cut in the same stone (slabs, with the chosen one lit and gilded at its foot).

### The screens
**Home.** (Shortened on 2026-10-17: see "Calmer pages" below for the new, shorter order. The older order was:)
1. The hero: a wall of the opening of Plato's *Apology*, carved in the stoichedon grid (Burnet's text with accents and breathings removed, iota subscript carved as a full Ι), cut in diagonally when the page opens and read by carrying the torch over it.
2. "The name" (see Signature details).
3. The Passage of the day, Greek and English, beside the Great Eleusinian Relief, re-lit.
4. Hesiod's line carved in the wall, above nine Muse niches that cast real shadows; their names light as a torch passes.
5. A wide window holding a cast of the Parthenon's east frieze.
6. The five rooms as carved panels.
7. "Why Stoics are called Stoics", beside a grave stele cut out of its background and re-lit.

The vase to paint yourself, which stood on the old home page, moved to the Kerameikos (the potters' quarter, `/stoa/kerameikos`).

**Library ("The Mouseion").** ΜΟΥΣΕΙΟΝ is carved at the top; search and filters are cut stone. The books stand as stelai (gravestones), each with its picture in a round medallion re-lit by the torch, then the author, the title, the Greek title and the picture's credit. A stele's words light up as a torch passes. On a phone each group of stelai is one row to swipe sideways (it does not snap), so the wall costs a screen or two of scrolling, not six.

**Reader.** Greek and English side by side on a computer, one above the other on a phone. Controls: Both / Greek / English; Aa (Night or Daylight, the Greek typeface, the text size); Tools. Dotted words open a word panel.

### Calmer pages, and pages that open calmly (2026-10-17)
The owner (2026-10-17): bigger windows with a statue on each page, a less cluttered home page, a clearer flow on every page, and
a page that opens beautifully with nothing white while it loads. Not live until the owner says "Publish".
- **Home, in a shorter order:** the hero; the name (sources folded); the passage of the day; the letters; the Muses; "Find
  something to read"; the frieze; the Stoa; sources folded. The rooms, the Stoa cards, forum activity and offline actions moved to
  the pages they belong to (`app/page.tsx`, `app/home.module.css`).
- **Bigger windows:** `.piece-head` and `.piece-wide` in `globals.css`. On a phone the piece is 74vw wide, under the title and its
  subtitle. A broad window in a narrow page head takes at most 45% of it.
- **The library's flow:** the search and filters stand on the list they filter ("Every work in the library"), not apart from it;
  levels and reading paths sit in a fold, "Not sure where to begin?". The same rule holds elsewhere: a control sits with what it
  controls.
- **The page entrance:** `@keyframes enter` in `globals.css` (zero-specificity `:where`) for `.area-head .wrap`, `.page-head`,
  headers with a piece, and `.enter`. In order: the name, the Greek, the purpose, then the niche rises. Timings are tokens
  (`--dur-enter`, `--enter-step`).
- **The niche placeholder:** a niche is a dark hollow until its piece is drawn (`.piece > .piece-niche::before`); `PagePiece.tsx`
  sets `data-ready` when the piece is ready. `<html>` has the stone colour from the first byte (`layout.tsx`), so nothing
  flashes white. The library's medallions do the same.
- **The wait light:** while the next page is fetched (`instrumentation-client.ts`, `components/NavWait.tsx`, `.navwait`), a gilded
  light travels along the header's foot. It fades in after 0.25 s, so a fast page shows nothing.
- **`.tool-page`** (practice, test, review, today's session): on a computer the piece stands beside the tool, so the first
  question is on the first screen; on a phone it stays under the title.
- **Phone pixel limit:** on phones the big windows are drawn with at most 220,000 pixels (`lib/art/piece.ts` `layout()`).
  At full sharpness, scrolling past one fell from 49 to 25 fps in the slowed-phone test (now about 33). The owner is being asked
  whether to keep this balance of sharpness and smoothness.

### Signature details
1. **The name, and its emblem.** Μάθησις στοιχείων, *Learning the elements*. The owner asked what object goes with the name, liked all three suggestions and asked for them together (2026-10-16). The emblem is one still life:
   - a **wax tablet**, on which Greek children learned their letters, for στοιχεῖον as a letter: "a simple sound of speech, as the first component of the syllable" (LSJ, citing Plato, Cratylus 424d);
   - the **stylus** standing upright in the wax like a sundial's pointer, for στοιχεῖον as "the shadow of the gnomon, the length of which in feet indicated the time of day" (LSJ); Aristophanes, Assemblywomen 652: ὅταν ᾖ δεκάπουν τὸ στοιχεῖον, "when the shadow is ten feet long";
   - a **compass** and Euclid's first proposition scratched in the wax, for the Στοιχεῖα, Euclid's *Elements*: ἐπὶ τῆς δοθείσης εὐθείας πεπερασμένης τρίγωνον ἰσόπλευρον συστήσασθαι, "On a given finite straight line to construct an equilateral triangle" (Elements 1.1, Heiberg's text, tr. Heath). The points are lettered Α Β Γ Δ Ε as Euclid letters them, and the given line ΑΒ is the stylus's shadow.
   - It draws itself slowly (about four seconds) when it comes into view, and every light casts its own shadows across it. The site's logo is no longer the small form of this emblem: since 2026-10-18 it is Athena's owl, as on the silver coins of Athens, in a few gold lines (`web/public/logo/owl.svg`, under 1 KB) cut into the stone, in the header and footer; `web/scripts/make-logo.mjs` draws the tab, iPhone and install icons from it (heavier lines in the tab). The owner found the tablet logo ugly and chose the owl over an oil lamp, an alpha in laurel and a round seal. Earlier logos: the gilded tablet (2026-10-16), the flat honey mark and the Stoichedon mark of 2026-10-11.
2. **The carved Apology.** The home page's wall is the speech Socrates gave, as Plato wrote it, cut in the stoichedon grid.
3. **Reliefs lit by the torch.** Real ancient reliefs (the Great Eleusinian Relief, the Parthenon frieze, a grave stele from Attica), drawn like every page's sculpture: in colour, casting their shadows away from the flame; click one to set a lamp before it.
4. **The Muses' niches.** Hesiod: "Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν", "From the Heliconian Muses let us begin to sing" (Theogony 1, tr. Evelyn-White), above the nine Muses he names (Theogony 76–79), each in her own lit niche. The arts given to each Muse are later tradition, and the page says so.
5. **Every book has its medallion.** The author's face or the thing the text is best known for, a licensed image re-lit in a round medallion on its stele, credited beside it.

### Avoid
- Light mode anywhere but the reader's Daylight page.
- Moving or interactive art inside the reader's text.
- Stock photos, invented quotations, uncredited images, or images without a clear licence.
- Default system fonts, pure white text, rounded cards, and bright saturated blues or greens.
- Accents on Greek capitals in labels, and Greek set in a font that drops its accents or breathings.
- Blend modes (overlay, multiply) on full-screen layers; they halved the frame rate in testing.
- Moving film grain or noise ("super distracting").
- Flashy motion: sparks, flares, flashes, bounces and springy overshoot ("It's horrible", 2026-10-16).
- Snapping or gliding the page into place after scrolling ("no snapping. it's annoying", 2026-10-16).
- Effects that follow the pointer uninvited, such as a magnifying glass on hover. Show them on press and hold.
- Reading colours from styles inside an animation frame. Draw only what is on screen, and only when a light moves.

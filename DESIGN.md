# Design

The look of the redesigned site. The owner compared three complete designs on 2026-10-16 and chose **B, "Stone and torch"**
(thread "Site redesign"; `docs/adr/0006-stone-and-torch.md`). The earlier direction, A ("Gold and lamplight"), is kept for
reference at the end of this file and in `docs/adr/0001`–`0005`.
The working samples: https://claude.ai/artifact/DKDa9aW9GVkicDQnh2GmnH (version 15 is the current one; it opens on B, with A
and C a tab away). Their source files are in the project files, under `redesign/prototype/` (B in `abc/b-sources/`, the
emblem in `emblem/`).

## Character
- **Is:** beautiful, mysterious, insightful.
- **Is not:** bright, busy, flashy, or like a template (no default blue, no cards everywhere, no stock icons as decoration).
- **In one sentence:** a wall of warm, dark stone in a sanctuary at night, read by the light of a torch you carry.

## Principles
1. **Darkness is the frame.** The site is dark only. The one light surface is the reader's "Daylight" page, a reading aid against eye strain.
2. **Every page has something to touch, except the reader.** The home page, the library and every other page carry art that the torch lights. The reader is for reading: once you scroll into the text nothing moves.
3. **Greek is carved as Plato's Athens wrote it.** Capitals set in a strict grid (the stoichedon style), with no accents or spaces, for carved Greek. Reading Greek is set in full polytonic type.
4. **Real things only.** Every picture is a licensed image of a real object, and its credit is shown. Every Greek text is a real edition, and the edition is named. Every quotation is checked against its source. Nothing is invented for decoration.
5. **Greek comes first, English beside it.** Greek is set as carefully as English, in fonts that carry every accent and breathing.
6. **All movement is calm.** Things ease and settle. Nothing bounces, sparks or flashes. The owner: "Remember when I say movement it has to be calm" (2026-10-16). A quick, springy, flashy trial the same day was rejected: "Get rid of the flashy animations. It's horrible. I liked the way it was before."
7. **On a phone, scrolling is the torch.** Nothing needs touching: the light stands in the middle of the screen, so carvings and reliefs light up as they reach the middle and dim as they scroll away (the owner, 2026-10-16: lighting by touch "is a bit distracting"; earlier that day each finger carried its own light). Things a finger works directly, such as the vase, still answer every finger at once.

## Type
| Role | Family | Notes |
|---|---|---|
| Headings and Greek | GFS Didot | Polytonic Greek. |
| Reading text, wide-spaced capital labels | EB Garamond | |
| Letters carved on canvas | Noto Serif Display 500 | |
| Third Greek choice in the reader | Noto Serif | |

- All are Google Fonts under the SIL Open Font Licence, so they can be bundled for offline use.
- Greek text is stored precomposed (Unicode NFC). Greek apostrophes are ’ (U+2019).
- Greek capitals in labels are written without accents (ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ); where a label must keep its accents it is set in lower case.

## Colour
| Role | Value |
|---|---|
| Stone, darkest to lightest | #0b0907, #14100d, #1b1612, #251f19, #332a21 |
| Text, ivory | #efe5d2; quieter lines #bfb09a and #93856f |
| Torchlight: honey | #efc27a (brighter #f9dfae) |
| Torchlight: amber, ember | #f0a24c, #c8622c |
| Second accent, faded red ochre | #a65d40 (labels #d4917a) |
| Daylight page (reader only) | pale limestone #e8e0cf, dark ink #2a221a, burnt-sienna accent #8a3e1e |

Light text is never pure white.

## Texture and light
- The stone has a still (never moving) mottled, pitted texture. There is no film grain.
- The pointer is a torch. It eases along behind the hand, and drifts by itself when the hand leaves the page. On a phone the torch stands in the middle of the screen (a little higher at the top of a page and lower at its foot, so the first and last things are lit too) and fingers carry no light. Nothing blocks scrolling.
- Carved letters are V-shaped grooves lit from the side the flame is on (each letter is prepared lit from 16 directions; the page blends the two nearest).
- Real sculpture is lit in its own colour, its carving read from a height map, and the torch casts its real shadows (see "A sculpture on every page"). The books' medallions are re-lit greyscale copies, bright parts treated as raised.
- With "reduce motion" switched on, everything is drawn once and holds still.

## Motion
- **Scrolling (Home and Library):**
  - The wheel is a little slowed (0.8 of the browser's distance per notch) and smooth: the page eases towards where the wheel sends it and keeps up with the hand (about 0.11 s). The owner wanted the slow scroll kept, "just not THAT slow" (2026-10-16).
  - **No snapping.** The page stops exactly where the wheel or the finger leaves it; nothing pulls it to a section. The owner: "no snapping. it's annoying" (2026-10-16). Until then the page glided to a nearby section after it stopped.
  - As the page nears a section, its carvings and reliefs brighten a little, and heading letters settle gently into line as they rise into view.
  - Each part is cut in (it fades in and rises a few pixels) the first time you reach it.
- **The reader** opens on a torch-lit cover (ΑΠΟΛΟΓΙΑ·ΣΩΚΡΑΤΟΥΣ carved in stone, with the Socrates portrait as a medallion). The cover fades as you scroll into the text; after that nothing moves, and scrolling is completely normal.
- Nothing loops fast, flashes or throws sparks.

## Space and shape
- Spacing steps of 4, 8, 12, 16, 24, 36, 56 and 80 px. Sections breathe; lists are compact.
- Thin rules and cut lines instead of drop shadows. No rounded cards.
- One column on phones, with a 16px gutter. Pictures sit above the text on phones.

## Everything on a page is stone
The owner (2026-10-16): "All pages and content must match the theme", "Except for photos and text and buttons". So every panel,
card, table, list, chart, form field, frame, empty-state box and the footer is cut from the wall; photos, text and buttons keep
their own look. The torch's light lies on the wall behind everything, so a see-through stone panel is lit as the torch passes.
The pieces (all in `web/src/styles/tokens.css`; a module uses only these names):
| Thing | Token |
|---|---|
| A panel sunk into the wall (most boxes, lists, tables, figures, forms, empty states) | `--field`, `--field-edge` |
| A slab set on the wall (a card that is a link, a featured item, a summary of numbers, a tip); lit when hovered or chosen | `--slab`, `--slab-edge`, `--slab-lit` |
| A fine line cut just inside a big panel's edge | `--moulding` with `--moulding-in` (a moulded link card gets its focus ring back) |
| A line between rows, above something, at the left | `--cut-under`, `--cut-over`, `--cut-left` (shadows, so a row's own background stays free) |
| A slim gilded inlay at a slab's left or top (gold, green for right, ochre, blue, the legend's colour) | `--inlay-left`, `--inlay-left-ok`, `--inlay-left-ochre`, `--inlay-left-blue`, `--inlay-left-legend`, `--inlay-top` |
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

## A sculpture on every page
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

## Never laggy
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

## A to Z
- **Author pages** with six or more works have an "A to Z" button. It opens the works in alphabetical order, under a row of
  letters to jump by. The list is cut open like a carving: a fine line is cut across the top with a glint at the chisel's point,
  the panel sinks beneath it, then the letters and the groups are cut in from left to right; closing runs it back, faster. On a
  phone the letters are a strip down the right-hand edge: press and slide (the owner, 2026-10-16).
- **The library** has no button and no separate block: one slim scroller of letters runs down the left of the list, on a
  computer and a phone, and stays beside it as the page scrolls (the owner, 2026-10-16: "the A to Z should just be the side
  scroller. On the left side"). Press and slide on a phone, with the letter shown beside the finger. It is hidden when the list
  is ordered by period, or holds fewer than 20 authors.
- **The settings panel**: every control is cut in the same stone (slabs, with the chosen one lit and gilded at its foot).

## The screens
**Home.** In order:
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

## Signature details
1. **The name, and its emblem.** Μάθησις στοιχείων, *Learning the elements*. The owner asked what object goes with the name, liked all three suggestions and asked for them together (2026-10-16). The emblem is one still life:
   - a **wax tablet**, on which Greek children learned their letters, for στοιχεῖον as a letter: "a simple sound of speech, as the first component of the syllable" (LSJ, citing Plato, Cratylus 424d);
   - the **stylus** standing upright in the wax like a sundial's pointer, for στοιχεῖον as "the shadow of the gnomon, the length of which in feet indicated the time of day" (LSJ); Aristophanes, Assemblywomen 652: ὅταν ᾖ δεκάπουν τὸ στοιχεῖον, "when the shadow is ten feet long";
   - a **compass** and Euclid's first proposition scratched in the wax, for the Στοιχεῖα, Euclid's *Elements*: ἐπὶ τῆς δοθείσης εὐθείας πεπερασμένης τρίγωνον ἰσόπλευρον συστήσασθαι, "On a given finite straight line to construct an equilateral triangle" (Elements 1.1, Heiberg's text, tr. Heath). The points are lettered Α Β Γ Δ Ε as Euclid letters them, and the given line ΑΒ is the stylus's shadow.
   - It draws itself slowly (about four seconds) when it comes into view, and every light casts its own shadows across it. The small version (tablet, circles, triangle and stylus) is the site's logo: cut into the stone and laid with gold, lit by the torch, in the header and footer and as the tab, iPhone and install icons (heavier lines at small sizes). The pictures are drawn once by `web/scripts/make-logo.mjs` (renderer `web/scripts/logo/render.js`), which can also draw the two options the owner passed over (2026-10-16), cut in the stone and a seal-stone. It replaced the flat honey mark (2026-10-16) and the Stoichedon mark of 2026-10-11.
2. **The carved Apology.** The home page's wall is the speech Socrates gave, as Plato wrote it, cut in the stoichedon grid.
3. **Reliefs lit by the torch.** Real ancient reliefs (the Great Eleusinian Relief, the Parthenon frieze, a grave stele from Attica), drawn like every page's sculpture: in colour, casting their shadows away from the flame; click one to set a lamp before it.
4. **The Muses' niches.** Hesiod: "Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν", "From the Heliconian Muses let us begin to sing" (Theogony 1, tr. Evelyn-White), above the nine Muses he names (Theogony 76–79), each in her own lit niche. The arts given to each Muse are later tradition, and the page says so.
5. **Every book has its medallion.** The author's face or the thing the text is best known for, a licensed image re-lit in a round medallion on its stele, credited beside it.

## Avoid
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

## Earlier direction A, "Gold and lamplight" (not chosen; kept for reference)
Pompeian red and gold on the home page, amber lamplight elsewhere. Each home window opened as a round iris onto its own
real object engraved in gold lines (an Athenian coin, the Parthenon frieze, Socrates, a cup by Douris, an amphora by the
Berlin Painter, the Antikythera mechanism, an ostrakon of Themistocles, the Mask of Agamemnon, Crates and Hipparchia).
The library's Socrates was spelled out of the whole Apology, gathered as you scrolled, then fell apart into a papyrus roll
of capitals; a reading glass appeared on press and hold. Nine Muses' oil lamps could be fanned. Its decisions are in
`docs/adr/0001`–`0005`, and its sources in `redesign/prototype/round3/` to `round9/`. A third design, C ("Clay and glaze",
black glaze and terracotta, a turning prize amphora), is in `redesign/prototype/abc/`.

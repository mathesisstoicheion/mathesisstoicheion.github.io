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
7. **Every finger counts.** On a phone every finger on the glass carries its own light, all at once, and goes on doing so while the page scrolls (the owner: the site should track "where your finger is when scrolling", 2026-10-16).

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
- The pointer is a torch. It eases along behind the hand, and drifts by itself when the hand leaves the page. On a phone each finger carries its own light, up to five; a light fades in when a finger touches and fades out when it lifts. Nothing blocks scrolling.
- Carved letters are V-shaped grooves lit from the side the flame is on (each letter is prepared lit from 16 directions; the page blends the two nearest).
- Real reliefs are re-lit pixel by pixel, bright parts treated as raised, so the light rakes across the marble from the torch's side.
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
   - It draws itself slowly (about four seconds) when it comes into view, and every light casts its own shadows across it. The small flat version (tablet, circles, triangle and stylus) is the header's mark, in honey, and the tab and app icons (honey on the stone, with heavier lines; `web/src/lib/logo.ts`). It replaced the Stoichedon mark of 2026-10-11.
2. **The carved Apology.** The home page's wall is the speech Socrates gave, as Plato wrote it, cut in the stoichedon grid.
3. **Reliefs re-lit by the torch.** Real ancient reliefs (the Great Eleusinian Relief, the Parthenon frieze, a grave stele from Attica) lit from the side the flame is on.
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

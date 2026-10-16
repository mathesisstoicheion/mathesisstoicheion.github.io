# Design

The look of the redesigned site, agreed with the owner on 2026-10-15 (thread "Site redesign").
The decisions and the options weighed are in `docs/adr/` (0001 the look, 0002 the scroll styles, 0003 the hearth and the side-by-side layout, 0004 the owner's verdict on it).
The working samples: https://claude.ai/artifact/DKDa9aW9GVkicDQnh2GmnH. Version 5 is the current one.
Their source files are in the project files, under `redesign/prototype/`.

## Character
- **Is:** beautiful, mysterious, insightful.
- **Is not:** bright, busy, or like a template (no default blue, no cards everywhere, no stock icons as decoration).
- **In one sentence:** a dark room where a single lamp, or the glint of old gold, lets you see the Greeks and read them in their own words.

## Principles
1. **Darkness is the frame.** The site is dark only. The one light surface is the reader's "Daylight" page, which is a reading aid against eye strain.
2. **Every page has something to touch, except the reader.** The home page, the library and every other page carry interactive art. The reader is for reading: it opens in lamplight with a little drifting dust, but once you scroll into the text nothing moves on its own.
3. **Art is seen through windows, and nothing moves behind the page.** Pages are black, and pictures appear through framed openings. Each page has its own way of moving as you scroll (see Motion). A full-screen moving background distracts from the page (the owner, 2026-10-16), so there is none. In the library, where Socrates stands behind the page, wide screens give the text a left-hand column and set him beside it, so nothing covers him.
4. **Real things only.** Every picture is a licensed image of a real object, and its credit is shown. Every Greek text is a real edition, and the edition is named. Nothing is invented for decoration.
5. **Greek comes first, English beside it.** Greek is set as carefully as English, in fonts that carry every accent and breathing.

## Type
| Role | Family | Notes |
|---|---|---|
| Display (big titles) | Noto Serif Display | Condensed (width axis 62.5%) and thin (weights 100–300). Tall, narrow capitals. Italic for the words that matter. |
| Reading text, library and reader | Literata | Also the reader's default Greek face. |
| Reading text, home page | EB Garamond | EB Garamond has no archaic letters (digamma, koppa, sampi), so Greek falls back to Gentium Book Plus for those. |
| Greek fallback, and reader choice | Gentium Book Plus | Full polytonic plus archaic letters, in all four styles. The reader offers Literata, Gentium or Garamond for Greek. |
| Labels, captions, numbers | Noto Sans Mono | Small, upper case, widely spaced. Greek labels in capitals are written without accents (ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ). |
| Logo mark | Noto Sans Display | The ΣΤΟΙΧΕΙΑ block in the header. |

- All of these fonts are under the SIL Open Font Licence, so they can be bundled for offline use.
- Greek text is stored precomposed (Unicode NFC). Google's font files leave out the combining breathings and accents.
- Greek apostrophes are ’ (U+2019), not ʼ (U+02BC).
- Reading size is about 1.3rem, with lines of 55–75 characters and line height 1.5–1.6.

## Colour
Each page lives in one of two rooms. The black frame (`--black` #050403) is the same everywhere.

**The doorway** (home page): Pompeian red and gold, like an engraved coin.
| Role | Token | Value |
|---|---|---|
| Art field | `--red` | #5c1910 |
| Deep background | `--red-deep` | #1b0907 |
| Accent, engraving | `--gold` | #e8bd70 |
| Highlight | `--gold-hi` | #f6dca6 |
| Text | `--bone` | #f2e0c6 |
| Muted text | `--bone-2` | #c39f83 |

**The lamp room** (library, reader and most other pages): near-black with amber lamplight.
| Role | Token | Value |
|---|---|---|
| Background | `--room` | #0b0806 |
| Raised surface | `--room-2` | #140f0a |
| Text | `--parch` | #ecca97 |
| Muted text | `--parch-2` | #8f7556 |
| Accent, lamplight | `--amber` | #ffad45 |
| Highlight | `--amber-hi` | #ffd59a |

**Daylight** (reader only): warm paper, never white. Background #ece0c9, surface #f3e9d6, text #2a1c10, muted #6d5539, accent #a8550f.

Lines and borders are the accent at about 20% strength. Light text is never pure white.

## Texture and light
- Film grain and faint scan lines sit over the whole site.
- Art is drawn in fine lines, dots, Greek letters or light, never as flat photographs:
  - the Athenian coin in the home page's windows is engraved in gold lines, with turning rays;
  - the library's Socrates is written in Greek letters.
- The pointer acts as a lamp, or bends the engraved lines. On a phone a finger does the same, and without one the lamp drifts slowly.
- With "reduce motion" switched on, everything is drawn once and holds still.

## Motion
Each page has its own scroll effect. The owner chose (2026-10-15, see `docs/adr/0002-scroll-per-page.md`):
- **Shutters** for the home page and most other pages:
  - Windows open like shutters as they arrive, and the art inside moves more slowly than the page.
  - Nothing moves behind the page. The only sparks are the ones a Muse's lamp throws when you fan it.
- **Stage** for the library:
  - Socrates is pinned behind the page, and his face comes together out of loose letters only as you scroll down (the owner: it "was cooler when his face only was revealed when you scrolled").
  - On wide screens he stands to the right of the shelves, so nothing covers him as you scroll. On phones he stands behind the page, and the blocks over him are partly see-through.
  - The Apology rises slowly through his face.
  - While you wait, loose letters circle the stage, the lamp flickers, and now and then a band of light passes over it, as if someone carried a lamp by. None of this gathers his face. Once he has gathered, a light reads the speech across his face, a few words at a time.
- **The reader** opens on a cover: the title large, lamplight, a shaft of light with dust drifting in it, and the title's letters faint in the dark. "Scroll to begin reading" waits at the foot. As you scroll into the text the cover fades out, and from then on nothing moves.

Other motion:
- Titles rise line by line on arrival.
- Emblems gather out of loose letters, and brighten when the pointer is over them.
- Nothing loops fast or flashes.

## Space and shape
- Spacing steps of 4, 8, 12, 16, 24, 36, 56 and 80 px. Sections breathe; lists are compact.
- Square corners. Thin 1px rules and borders instead of shadows. No rounded cards.
- One column on phones, with a 16px gutter. Windows sit above the text on phones.

## Signature details
1. **Socrates spelled out of the Apology.** The library's face of Socrates is made of the whole Greek text of Plato's Apology, in reading order, from "ὅτι μὲν ὑμεῖς, ὦ ἄνδρες Ἀθηναῖοι" to "τῷ θεῷ" (Burnet's Oxford text, via the Perseus Digital Library). Socrates wrote nothing, which is why the face is drawn from the speech Plato gave him.
   - The brightness and size of each letter draw the face. The letters are fine enough for the features to show clearly.
   - The speech slowly rises through the face.
   - The pointer carries a lamp and a reading glass that enlarges the letters under it, so the speech can be read.
2. **Every text has its own emblem.** It shows the author's face, the thing the text is best known for, or one of its themes, drawn in Greek letters inside an oval. It appears on the book's row in the library and at the top right of the reader. Each emblem is a licensed image with its credit beside it. The Socrates emblem is also spelled out of the Apology.
3. **The engraved coin.** In the home page's windows, Athena's head is engraved in gold lines on Pompeian red. It comes from a silver tetradrachm of Athens, c. 440–404 BC, in the Metropolitan Museum of Art (2021.40.80, CC0).
4. **The Muses' flames.** A section of the home page opens with Hesiod: "Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν", "From the Heliconian Muses let us begin to sing" (Theogony 1, tr. Evelyn-White).
   - Below it, the nine Muses he names (Theogony 76–79) each have a small oil lamp.
   - Fanning a flame with the pointer makes it flare, throw sparks and light up her name.
   - The arts given to each Muse are later tradition, and the page says so.

## Avoid
- Light mode anywhere but the reader's Daylight page.
- Moving or interactive art inside the reader's text.
- Stock photos, invented quotations, uncredited images, or images without a clear licence.
- Default system fonts, pure white text, rounded cards, drop shadows, and bright saturated blues or greens.
- Accents on Greek capitals in labels, and Greek set in a font that drops its accents or breathings.
- Blend modes (overlay, multiply) on full-screen layers. In testing, the grain's overlay halved the frame rate. Grain and scan lines use plain transparency.
- Moving art that the page's own blocks or windows cover. Put it beside the text on wide screens.
- Full-screen moving backgrounds (drifting sparks, a fire behind the page). The owner found them "super distracting".
- Reading colours from styles inside an animation frame, and drawing thousands of letters as text every frame. Read colours once per page. Stamp letters from a prepared sheet of letters. Keep a still picture of anything that has not changed.

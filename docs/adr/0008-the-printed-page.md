# 8. The printed page with real photographs
Date: 2026-10-22
Follows: 0001 to 0007, whose look it replaces.

Context:
- The owner closed the site for a full redesign on 2026-10-21 and compared complete samples. On 2026-10-22 they chose
  "the printed page with real photos", and asked for the whole site and the Android app to be redesigned in it.
- The owner's rule for taste: don't mix designs, nothing flashy. No lamps, torches, stone textures, glow, grain or
  floating letters.

Decision (the owner's twelve decisions of 2026-10-22, in brief):
1. The logo is the printer's device: a round seal with ΜΣ (the Σ in red) and ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ round the ring. It is
   the site's icons, its share picture and the Android app's icon too.
2. Paper or Night follows the device, light or dark. Settings can override it (Follow device, Paper, Night). This
   replaces "dark everywhere" (ADR 1).
3. One movement only, the ink-in: words and photographs fade in gently as they arrive, then nothing moves. Reduced
   motion turns it off. The three animation levels go (ADR 5).
4. The word look-up is written in the margin beside the line on a computer, and slides up from the foot on a phone. It
   never covers the line being read.
5. A text opens with Greek and English side by side, like a two-language edition; Both, Greek and English switch it.
6. Every page opens with a numbered photo plate beside its title, and photographs appear wherever they illustrate
   something, in their real colours, each with its credit. This replaces the sepia treatment of ADR 7.
7. The home page: the title page, "Where are you starting?", the passage of the day, the contents, the credits.
8. The rooms: Learn, Read, Explore and Mine, each with its Greek name in small italic under it. Talk stays hidden
   while the forum is frozen.
9. On a phone, a new bar along the foot of the screen, set like the foot of a printed page.
10. The bar slips away as you read on and comes back as you scroll up. It is never in the reader.
11. The library: search first, then the catalogue by kind, authors A to Z in each; a switch gives one A to Z list.
12. The site stays closed while it is built, and opens again only when the owner says "publish".

The type: EB Garamond for English, GFS Didot for titles, Greek room names and the logo's letters, Gentium Book Plus
for the Greek being read and looked up. No other typeface: the arrows and signs, and the phonetic letters, come from the
site's own copies of the three (`web/src/fonts/`).

Consequences:
- The checks in `.github/workflows/checks.yml` test the new rules: `check-look` (Paper or Night), `check-design` (the
  three typefaces, the type scale, the colours, one primary button), `check-credits`, `check-lookup`, `check-bar`,
  `check-still`, `sideways.mjs` at 390 px, and `check-a11y` in Paper and Night. Older checks that tested the old look
  were changed to test the new rule, not switched off.
- Code comments cite "decision N" for the twelve above, and "the redesign's SPEC.md" for the working spec kept with
  the project's files, outside the repository.
- The old look's files are in `_archive/old-look-2026-10-22/`.
- ADRs 1 to 7 stay as the record of earlier rounds. Where they disagree with this one, this one wins.

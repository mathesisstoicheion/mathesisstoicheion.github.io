// Fetches the arrows and signs of the site's typefaces that Google Fonts leaves out of the parts it serves for whole
// alphabets (Latin, Greek): "→", "⋯", "❦", "✓" and the like. Without them a phone or computer draws these signs in a
// font of its own, a fourth typeface (redesign SPEC.md 3.2: three and no more; scripts/check-design.mjs finds them).
// Google Fonts makes a font of just the letters asked for (its "text=" parameter); these are saved in src/fonts/ and
// added to the typefaces in app/layout.tsx and styles/tokens.css. Run it again after adding a sign to SIGNS, and commit
// the fonts. GFS Didot has none of these signs; signs that none of the three has are drawn instead (an SVG), or
// written another way.
//   node scripts/fetch-sign-fonts.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "fonts");
// a browser's own name, so that Google Fonts answers with WOFF2 files
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
// the letters of plain English and the IPA's own: its letters, the length mark, the marks above and below a letter
const IPA = [...Array(95)].map((_, i) => String.fromCharCode(32 + i)).join("")
  + "çðŋɑɐɒæəɛɔɡɣɪɲɾʃʊʌʎʒʔʝβθφχʰʲʷˈˌː" + "\u0300\u0301\u0302\u0303\u0304\u0306\u0308\u0325\u0329\u032a\u032f";
const SIGNS = {
  // EB Garamond: the arrows, the dots of an ellipsis between Greek words, the fleuron, the pointing hand, the lozenge,
  // the breve, two superscript figures, angle brackets and "about"
  "eb-garamond-signs": ["EB Garamond:ital,wght@0,400..800;1,400..800", "→←↗↔⋯❦☞◆˘⁵⁶〈〉≈"],
  // Gentium Book Plus: the same arrows for Greek, and the tick, the list sign, sharp and flat, the editor's double
  // brackets and aleph (the siglum of the Codex Sinaiticus)
  "gentium-book-plus-signs": ["Gentium Book Plus:ital,wght@0,400;0,700;1,400;1,700", "→←↗↔˘✓≡♯♭⟦⟧ℵ⁵⁶≈"],
  // Gentium Book Plus for the sounds written in the IPA (the alphabet's [ai̯], [r̥]): a letter and the mark under it are
  // drawn from one font, and no part Google Fonts serves has the marks, so the IPA's letters come with them. It is used
  // only where the IPA is written (--face-ipa).
  "gentium-book-plus-ipa": ["Gentium Book Plus:ital,wght@0,400", IPA],
};
for (const [name, [family, text]] of Object.entries(SIGNS)) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+").replace(/%3A/g, ":").replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%40/g, "@")}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  for (const face of css.match(/@font-face\s*\{[^}]*\}/g) ?? []) {
    const style = face.match(/font-style:\s*(\w+)/)[1], weight = face.match(/font-weight:\s*([\d ]+)/)[1].trim().replace(/ /g, "-");
    const src = face.match(/url\((https:[^)]+)\)/)[1];
    const file = `${name}-${style}-${weight}.woff2`;
    writeFileSync(join(out, file), Buffer.from(await (await fetch(src, { headers: { "User-Agent": UA } })).arrayBuffer()));
    console.log("saved", file);
  }
}

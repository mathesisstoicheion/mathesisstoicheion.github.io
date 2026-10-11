/**
 * The site's mark, "Stoichedon" (owner's choice, 2026-10-11): the word ΣΤΟΙΧΕΙΑ ("letters") in a 3 × 3 grid, every
 * letter under the one above, as Athenian inscriptions of the fifth and fourth centuries BC were laid out (the style
 * called stoichedon), with the mason's faint guide lines and an ancient three-dot word-divider in the last square.
 * Drawn on a 100 × 100 square. Small sizes (the tab icon, phone and install icons) use its first letter alone, SIGMA.
 */

/** monoline inscription capitals, centred on (x, y), 16 units tall */
const LETTER: Record<string, (x: number, y: number) => string> = {
  Σ: (x, y) => `M${x + 7} ${y - 8}L${x - 7} ${y - 6}L${x + 4} ${y}L${x - 7} ${y + 6}L${x + 7} ${y + 8}`,
  Τ: (x, y) => `M${x - 8} ${y - 8}H${x + 8}M${x} ${y - 8}V${y + 8}`,
  Ο: (x, y) => `M${x} ${y - 7.5}a7.5 7.5 0 1 1 0 15a7.5 7.5 0 1 1 0-15`,
  Ι: (x, y) => `M${x} ${y - 8}V${y + 8}`,
  Χ: (x, y) => `M${x - 7} ${y - 8}L${x + 7} ${y + 8}M${x + 7} ${y - 8}L${x - 7} ${y + 8}`,
  Ε: (x, y) => `M${x + 7} ${y - 8}H${x - 6}V${y + 8}H${x + 7}M${x - 6} ${y}H${x + 5}`,
  Α: (x, y) => `M${x - 8} ${y + 8}L${x} ${y - 8}L${x + 8} ${y + 8}M${x - 5} ${y + 2}H${x + 5}`,
};

const CELL = [26, 50, 74];

/** the eight letters, each one path, in reading order */
export const LOGO_LETTERS: string[] = [..."ΣΤΟΙΧΕΙΑ"].map((ch, i) => LETTER[ch](CELL[i % 3], CELL[Math.floor(i / 3)]));
/** the three dots of the word-divider, in the last square */
export const LOGO_DOTS: [number, number][] = [[74, 68], [74, 74], [74, 80]];
/** the mason's guide lines between the rows and columns */
export const LOGO_GUIDES = "M14 38H86M14 62H86M38 14V86M62 14V86";
/** the stone the letters are cut in */
export const LOGO_TILE = { x: 4, y: 4, size: 92, r: 5 };

/** the small mark: the first letter, SIGMA, large */
export const SIGMA = "M73 16L27 23L62 50L27 77L73 84";

/** the colours of the small icons (the light theme's black gloss and clay, from globals.css) */
export const ICON_INK = "#1B1410";
export const ICON_CLAY = "#E6C39B";

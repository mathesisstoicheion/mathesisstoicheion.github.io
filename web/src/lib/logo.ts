/**
 * The site's mark: the flat form of the name's emblem (DESIGN.md, Signature details 1) on a 48 × 40 drawing. A wax
 * tablet in its frame, Euclid's first proposition scratched in the wax (the two circles and the equilateral triangle on
 * the line ΑΒ), and the stylus standing upright in it like a sundial's pointer. It replaced the Stoichedon mark of
 * 2026-10-11 when design B was chosen (2026-10-16). The header draws it in the current colour (EmblemMark.tsx); the tab,
 * phone and install icons draw it in torchlight on the stone, with heavier lines so it holds at 16 pixels (app-icon.tsx).
 */

export const MARK_BOX = { w: 48, h: 40 };

/** one stroke of the mark: its shape, and how heavy it is in the header and in the small icons */
export interface MarkPart { el: "rect" | "circle" | "path"; a: Record<string, number | string>; w: number; icon: number; faint?: boolean; join?: boolean }

export const MARK: MarkPart[] = [
  { el: "rect", a: { x: 2.5, y: 10.5, width: 43, height: 27 }, w: 1.6, icon: 3.2 },          // the tablet's frame
  { el: "rect", a: { x: 6.5, y: 14.5, width: 35, height: 19 }, w: 0.7, icon: 0, faint: true }, // the wax's edge (too fine for icons)
  { el: "circle", a: { cx: 20, cy: 27, r: 7 }, w: 0.9, icon: 1.7 },                             // the two circles
  { el: "circle", a: { cx: 27, cy: 27, r: 7 }, w: 0.9, icon: 1.7 },
  { el: "path", a: { d: "M20 27 L27 27 L23.5 20.94 Z" }, w: 1.1, icon: 1.5, join: true },        // the triangle
  { el: "path", a: { d: "M20 27 L27 27" }, w: 2, icon: 2.6 },                                    // the line ΑΒ
  { el: "path", a: { d: "M20 27 V5.5" }, w: 1.3, icon: 2.6 },                                    // the stylus
];
/** the stylus's flat head, filled */
export const MARK_HEAD = "M18.4 1.5 h3.2 l-.7 4 h-1.8 z";
export const MARK_HEAD_ICON = "M17.6 0.6 h4.8 l-1 5.4 h-2.8 z";

/** the colours of the icons: the stone of the wall, and the torchlight (styles/tokens.css, --stone-1 and --honey) */
export const ICON_STONE = "#14100d";
export const ICON_LIGHT = "#efc27a";

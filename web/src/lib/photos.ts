/**
 * Every photograph the printed page sets as a plate (redesign SPEC.md 3.7): the pictures of data/images.json and the
 * museum photographs of the pages' pieces (data/piece-images.json; the originals are kept in pipeline/pieces-src/, and
 * public/images/ holds them with their smaller copies). Each comes with its credit, as recorded from the museum's or
 * Wikimedia Commons' own record; nothing is shown without one. Photographs are shown in their real colours, never tinted.
 */
import { IMAGES, srcSet, type ImageCredit } from "@/wiki/images";
import { PIECE_CREDITS } from "@/data/pieces";
import { bcAd } from "@/lib/bc-ad";

export type Photo = ImageCredit;
export const PHOTOS: Record<string, Photo> = { ...IMAGES, ...PIECE_CREDITS };

export const photo = (id: string): Photo | undefined => PHOTOS[id];
export { srcSet };

/** The date of the object, where the record gives one; a photograph's own date (a camera's "2015-10-29", "according to
 *  Exif data") is not the object's and is left out. */
export function objectDate(p: Photo): string | null {
  const d = p.date?.trim();
  if (!d || /Exif|\d{4}-\d\d-\d\d|^\d{1,2} [A-Z][a-z]+ \d{4}$/.test(d)) return null;
  return bcAd(d);
}

/** The maker or the photographer, where the record names one ("Unknown" is not a credit). */
export const maker = (p: Photo) => (p.creator && !/^unknown$/i.test(p.creator.trim()) ? p.creator.trim() : null);

/** A plate's number, as a book numbers them: I, II, III… */
export function roman(n: number): string {
  const R: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = "";
  for (const [v, r] of R) while (n >= v) { s += r; n -= v; }
  return s;
}

/** The shape a plate is set in: the photograph's own, kept between a little wider than square and a tall 3 by 4, so a long
 *  inscription is never cut down to a sliver and a standing figure never fills a column. */
export const plateRatio = (p: Photo) => Math.min(4 / 3, Math.max(0.62, p.height / p.width));

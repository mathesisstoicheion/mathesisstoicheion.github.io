/**
 * The Greek's size for a page set in verse (the quiet desk, ticket 10; the owner, 2026-10-30: "Homer's lines stand whole on a phone, and the Greek
 * has its proper size on a computer"). A line of Homer is one line of metre and meaning, so it should not break in two where the screen can give
 * it room. Reader.tsx measures a page once (not while it scrolls): the width its widest line has at the reader's size, and the room the words of
 * a line have; this function turns them into the size the page's verse is set in. One size for the whole page, never one per passage.
 *
 * The reader's size, made smaller only as far as the widest line needs to stand whole, and never below VERSE_FLOOR. Where the widest line
 * already fits (a computer: about 26 px) the reader's size stays. Where it cannot fit even at the floor (a phone, with the Iliad: 16 px) the floor
 * wins over wholeness, and the few lines wider than their room wrap with a hanging indent (Reader.module.css, .lt).
 *
 * A line's width grows in step with the size, so one measure (the widest line at the reader's size) is enough to find the size at which it fits. The
 * numbers the tests use were measured on the built site: in Chromium with Gentium Book Plus the widest lines of Iliad 1 are 456, 454 and 452 px at 20 px.
 */

/** The smallest the Greek is ever set for the sake of fitting a line: the spec's floor ("It never goes below 16 px"). */
export const VERSE_FLOOR = 16;

/** The part of its room the widest line may take: a hair is left over, so that a measure a pixel out (the canvas and the page do not shape text to
 *  the last hundredth; on the built site they differ by at most 0.04%) never breaks the very line the size was chosen for. */
const ROOMY = 0.998;

/**
 * @param readerPx  the reader's size, in px, as it is shown without any fitting (what Aa says)
 * @param widestPx  the width of the page's widest verse line at that size, on one row
 * @param roomPx    the room the words of a line have (the first row, from where the words start to the edge of their column)
 * @returns         the size, in px, the page's verse is set in: never above the reader's size, never below VERSE_FLOOR (a reader's size already
 *                  under it, with the browser's type set small, is kept, not enlarged); the reader's size too if nothing was measured
 */
export function verseSize(readerPx: number, widestPx: number, roomPx: number): number {
  if (!(readerPx > 0) || !(widestPx > 0) || !(roomPx > 0)) return readerPx;
  const needed = (readerPx * roomPx * ROOMY) / widestPx;
  return Math.min(readerPx, Math.max(VERSE_FLOOR, needed));
}

/**
 * The same, where the room itself depends on the size: on a computer the column of line numbers is 2.4 em wide, so a smaller size leaves the words more room
 * (at 1100 px the Iliad's lines have 495 px at 26 px and 504 px at 22 px). `roomAt` gives the room at a size in px (Reader.tsx sets the size on the page and reads
 * the box of a line); the size is looked for again at the room it leaves until it stops moving. The sizes found alternate around the right one (a smaller size
 * gives more room, which allows a bigger size, which gives less), so the smaller of the last two is kept: the widest line stands whole, never a hair too wide.
 */
export function verseSizeWhere(readerPx: number, widestPx: number, roomAt: (sizePx: number) => number): number {
  let last = readerPx, size = verseSize(readerPx, widestPx, roomAt(readerPx));
  for (let i = 0; i < 6 && Math.abs(size - last) > 0.02; i++) {
    const next = verseSize(readerPx, widestPx, roomAt(size));
    last = size;
    size = next;
  }
  return Math.min(size, last);
}

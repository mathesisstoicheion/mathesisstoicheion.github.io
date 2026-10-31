/**
 * The Painted Stoa's board (/stoa/board): what a reader puts up, and how a pot or a tune travels from where it was made to
 * the form that puts it up. The database checks the same shapes again (supabase/migrations/20261101120000_stoa_board.sql),
 * whatever a page sends; these are the page's own copy, so a reader is told before anything is sent.
 */

export type BoardKind = "thought" | "pot" | "tune";
export type BoardStatus = "waiting" | "shown" | "declined";

/** What each kind is called, in the filters, on the cards and in the form. */
export const KINDS: Record<BoardKind, { one: string; many: string; icon: "note" | "pots" | "lyre" }> = {
  thought: { one: "A thought", many: "Thoughts", icon: "note" },
  pot: { one: "A painted pot", many: "Pots", icon: "pots" },
  tune: { one: "A tune on the lyre", many: "Tunes", icon: "lyre" },
};

export const TITLE_MIN = 3, TITLE_MAX = 120, BODY_MAX = 4000;
/** a pot's picture as the database takes it, and the size the page aims for */
export const PICTURE_MAX = 200_000;
const LINK_MAX = 41_000, ABOUT_MAX = 300;

const POT_LINK = /^\/stoa\/pot#v=[A-Za-z0-9_-]+$/;
const TUNE_LINK = /^\/stoa\/lyre#tune=[A-Za-z0-9_-]+$/;
/** what a thought may be about: an entry of the Painted Stoa, or a passage in the reader */
const ABOUT_LINK = /^\/(stoa\/[a-z0-9-]+|read\?[A-Za-z0-9._~=&%:,-]+)$/;
const PICTURE = /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/;

/** What a reader is putting up, before it is sent. */
export interface BoardDraft {
  kind: BoardKind;
  title: string;
  body: string;
  /** the pot or tune packed into its address, or the entry or passage a thought is about */
  link: string | null;
  /** a pot's picture */
  picture: string | null;
  /** the name of the entry or passage a thought is about, to show in the form */
  aboutTitle?: string;
}

/** Why a draft cannot be put up yet, in words for the reader; null when it can. */
export function draftProblem(d: BoardDraft): string | null {
  const title = d.title.trim(), body = d.body.trim();
  if (title.length < TITLE_MIN) return `Give it a title of at least ${TITLE_MIN} letters.`;
  if (title.length > TITLE_MAX) return `Keep the title to ${TITLE_MAX} letters.`;
  if (body.length > BODY_MAX) return `Keep the words to ${BODY_MAX.toLocaleString("en-GB")} letters.`;
  if (d.link && d.link.length > LINK_MAX) return "This is too long to put up.";
  switch (d.kind) {
    case "thought":
      if (!body) return "Write your thought first.";
      if (d.picture) return "A thought has no picture.";
      if (d.link && (d.link.length > ABOUT_MAX || !ABOUT_LINK.test(d.link))) return "A thought can only be about an entry or a passage on this site.";
      return null;
    case "pot":
      if (!d.picture || d.picture.length > PICTURE_MAX || !PICTURE.test(d.picture)) return "The picture of the pot is missing.";
      if (d.link && !POT_LINK.test(d.link)) return "The pot's link is damaged.";
      return null;
    case "tune":
      if (d.picture) return "A tune has no picture.";
      if (!d.link || !TUNE_LINK.test(d.link)) return "The tune is missing.";
      return null;
  }
}

/** The address a link on the board opens: only the site's own pages (the database allows no other). */
export function safeLink(link: string | null | undefined): string | null {
  if (!link) return null;
  return POT_LINK.test(link) || TUNE_LINK.test(link) || ABOUT_LINK.test(link) ? link : null;
}

/** What a thought's link leads to, in words. */
export const aboutWords = (link: string) => (link.startsWith("/read") ? "Read the passage" : "Read the entry");

/** A picture safe to show: one of the three kinds of picture the database takes, nothing else. */
export const safePicture = (p: string | null | undefined): string | null => (p && PICTURE.test(p) ? p : null);

// ------------------------------------------------------------------------------ from the potter or the lyre to the form
// A pot or a tune is handed to the form (/stoa/board/new) through this tab's session storage: a pot's link and picture are
// far too long for an address. It lasts while the tab is open, and is dropped once put up.
const DRAFT_KEY = "mathesis:board-draft";

export function handOver(d: Partial<BoardDraft> & { kind: BoardKind }): void {
  try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* storage blocked: the form opens empty */ }
}

export function takeOver(): (Partial<BoardDraft> & { kind: BoardKind }) | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<BoardDraft>;
    return d && (d.kind === "thought" || d.kind === "pot" || d.kind === "tune") ? (d as Partial<BoardDraft> & { kind: BoardKind }) : null;
  } catch { return null; }
}

export function dropHandOver(): void {
  try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* nothing kept */ }
}

/** The form's address, for a link or button that hands something over first. */
export const NEW_ITEM = "/stoa/board/new";
/** An item's own page, to open and share. */
export const itemHref = (id: number) => `/stoa/board/item?id=${id}`;

// ------------------------------------------------------------------------------ a pot's picture
/**
 * A small picture of a pot for the board, from the potter's full-size one (drawn on a clear ground): cut to the pot with
 * a little room round it, at most `size` pixels across, as WebP with its clear ground kept where the browser can write
 * WebP, otherwise as JPEG on the page's paper. About 20 to 60 KB.
 */
export async function smallPicture(src: string, size = 560): Promise<string | null> {
  const img = new Image();
  img.src = src;
  try { await img.decode(); } catch { return null; }
  // where the pot is: the box round everything not clear, read from a copy at most 400 pixels across
  const k0 = Math.min(1, 400 / Math.max(img.naturalWidth, img.naturalHeight));
  const sw = Math.max(1, Math.round(img.naturalWidth * k0)), sh = Math.max(1, Math.round(img.naturalHeight * k0));
  const probe = document.createElement("canvas");
  probe.width = sw; probe.height = sh;
  const pg = probe.getContext("2d", { willReadFrequently: true });
  if (!pg) return null;
  pg.drawImage(img, 0, 0, sw, sh);
  const px = pg.getImageData(0, 0, sw, sh).data;
  let x0 = sw, y0 = sh, x1 = -1, y1 = -1;
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
    if (px[(y * sw + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) { x0 = 0; y0 = 0; x1 = sw - 1; y1 = sh - 1; }
  const pad = Math.round(0.08 * Math.max(x1 - x0, y1 - y0));
  const cx = Math.max(0, x0 - pad) / k0, cy = Math.max(0, y0 - pad) / k0;
  const cw = (Math.min(sw - 1, x1 + pad) + 1) / k0 - cx, ch = (Math.min(sh - 1, y1 + pad) + 1) / k0 - cy;

  const k = Math.min(1, size / Math.max(cw, ch));
  const w = Math.max(1, Math.round(cw * k)), h = Math.max(1, Math.round(ch * k));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  if (!g) return null;
  g.imageSmoothingQuality = "high";
  g.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
  const webp = c.toDataURL("image/webp", 0.85).startsWith("data:image/webp");
  if (!webp) {
    // the page's paper in its light look (styles/tokens.css), behind the pot
    g.globalCompositeOperation = "destination-over";
    g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
    g.fillRect(0, 0, w, h);
  }
  for (const q of [0.85, 0.72, 0.58, 0.45]) {
    const out = c.toDataURL(webp ? "image/webp" : "image/jpeg", q);
    if (out.length <= PICTURE_MAX) return out;
  }
  return null;
}

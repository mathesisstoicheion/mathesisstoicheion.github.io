import { getPosition } from "./position";

/**
 * The books opened on this device, by work id ("tlg0012.tlg001", or "mine:…" for one of the private collection), so that a book's
 * title page shows only the first time it is opened (the quiet desk, ticket 08, the owner, 2026-10-30: "the title page shows only
 * on a book's first opening"). Kept only in this browser (localStorage), never sent anywhere; listed on the Privacy page. Newest
 * last; only the last MAX_OPENED are kept, the oldest forgotten first.
 */
const KEY = "mathesis:opened";
export const MAX_OPENED = 500;

function read(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch { return []; }
}
function write(list: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable: the title page shows again next time */ }
}

/** The list with this book added as the newest: one already in it moves to the end instead of repeating, and only the last MAX_OPENED stay. */
export function addOpened(list: string[], id: string): string[] {
  return id ? [...list.filter((x) => x !== id), id].slice(-MAX_OPENED) : list;
}

export const wasOpened = (id: string): boolean => read().includes(id);

/** Remember that this book has been opened (a book that is already the newest is not written again). */
export function markOpened(id: string) {
  const list = read();
  if (id && list[list.length - 1] !== id) write(addOpened(list, id));
}

/**
 * Is this the first time the book is opened here? Then its title page shows. A reader who has a place saved in the book (lib/position.ts)
 * has opened it before this list was kept, so it is not shown the title page again for that.
 */
export const firstOpening = (id: string): boolean => !wasOpened(id) && getPosition(id) === null;

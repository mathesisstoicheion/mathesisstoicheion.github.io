/**
 * Get a text's XML from the best available place: local copies first, then the texts read lately,
 * then GitHub. Texts are asked for at a pinned commit, so a copy never goes out of date: the last
 * RECENT_KEEP texts read from GitHub are kept (Cache API, "texts-recent"; public/sw.js leaves it
 * alone), which makes a book open at once the next time, and offline too.
 */
import { rawUrl, type CatalogIndex, type CatText } from "@/lib/catalog";
import { readLocal, type Origin } from "./local";

export type From = Origin | "github";

export class TextUnavailable extends Error {}

const memory = new Map<string, { xml: string; from: From }>();

/** Give up on a step that never answers (a browser store that hangs, a download that stalls) rather than wait for ever. */
function within<T>(ms: number, p: Promise<T>, fallback: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { try { resolve(fallback()); } catch (e) { reject(e); } }, ms);
    p.then((v) => { clearTimeout(timer); resolve(v); }, (e) => { clearTimeout(timer); reject(e); });
  });
}
const STALL = 30_000;   // no data for this long: the download has stalled

export async function getXml(idx: CatalogIndex, t: CatText, onProgress?: (got: number, total: number) => void): Promise<{ xml: string; from: From }> {
  const hit = memory.get(t.urn);
  if (hit) return hit;
  const local = await within(6000, readLocal(idx, t).catch(() => null), () => null);
  if (local) return remember(t, local);
  const url = rawUrl(idx, t);
  const kept = await within(4000, readRecent(url), () => null);
  if (kept) return remember(t, { xml: kept, from: "github" });
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new TextUnavailable("You are offline and this text is not in your downloaded library.");
  }
  const abort = new AbortController();
  const stalled = () => { abort.abort(); return new TextUnavailable("GitHub stopped sending this text before it was complete. Check your connection and try again, or read from a downloaded copy."); };
  let res: Response;
  try { res = await within(STALL, fetch(url, { signal: abort.signal }), () => { throw stalled(); }); }
  catch (e) {
    if (e instanceof TextUnavailable) throw e;
    throw new TextUnavailable("GitHub could not be reached. Check your connection, or read from a downloaded copy.");
  }
  if (!res.ok) throw new TextUnavailable(`GitHub answered ${res.status} for this file.`);
  const xml = await readBody(res, t.size, onProgress, stalled);
  keepRecent(url, xml);
  return remember(t, { xml, from: "github" });
}

/** The file's text, reporting progress as it arrives (the catalogue gives its full size), and failing if it stalls. */
async function readBody(res: Response, total: number, onProgress: ((got: number, total: number) => void) | undefined, stalled: () => Error): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return within(STALL * 4, res.text(), () => { throw stalled(); });
  const parts: Uint8Array[] = [];
  let got = 0;
  try {
    for (;;) {
      const { done, value } = await within(STALL, reader.read(), () => { throw stalled(); });
      if (done) break;
      parts.push(value);
      got += value.length;
      onProgress?.(got, Math.max(total, got));
    }
  } catch (e) {
    if (e instanceof TextUnavailable) throw e;
    throw new TextUnavailable("The connection dropped while the text was downloading. Try again, or read from a downloaded copy.");
  }
  const all = new Uint8Array(got);
  let at = 0;
  for (const p of parts) { all.set(p, at); at += p.length; }
  return new TextDecoder().decode(all);
}

export const RECENT_CACHE = "texts-recent";
const RECENT_KEEP = 30;

async function readRecent(url: string): Promise<string | null> {
  try {
    const hit = await (await caches.open(RECENT_CACHE)).match(url);
    return hit ? await hit.text() : null;
  } catch { return null; }   // no Cache API (an old browser, or a private window that refuses it)
}

async function keepRecent(url: string, xml: string) {
  try {
    const c = await caches.open(RECENT_CACHE);
    await c.put(url, new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } }));
    const keys = await c.keys();   // oldest first
    for (const k of keys.slice(0, Math.max(0, keys.length - RECENT_KEEP))) await c.delete(k);
  } catch { /* keeping a copy is only a convenience */ }
}

function remember(t: CatText, v: { xml: string; from: From }) {
  if (memory.size > 12) memory.delete(memory.keys().next().value!);
  memory.set(t.urn, v);
  return v;
}

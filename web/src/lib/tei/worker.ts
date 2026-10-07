/// <reference lib="webworker" />
/** Parses TEI off the main thread so the page stays smooth, even for large texts. */
import { parseTei } from "./parse";
import { placePieces, translationPieces } from "./align";
import { renumber, type Scheme } from "./versification";

export interface ParseRequest { id: number; grc: string; tr?: string | null; scheme?: Scheme; trUrn?: string }

self.onmessage = (e: MessageEvent<ParseRequest>) => {
  const { id, grc, tr, scheme, trUrn } = e.data;
  try {
    const doc = parseTei(grc);
    let placed = null, trLevels = null;
    if (tr) {
      const t0 = parseTei(tr);
      const t = scheme ? renumber(scheme, doc, t0, trUrn) : t0;
      placed = placePieces(doc, translationPieces(doc, t));
      trLevels = t.levels;
    }
    (self as unknown as Worker).postMessage({ id, doc, placed, trLevels });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: (err as Error).message });
  }
};

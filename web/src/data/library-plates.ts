/**
 * The library's pictures (redesign decision 11: "pointing at a work shows its picture as a plate in the margin"; on a
 * phone, a small picture in its row). A famous book has its own (the books of data/medallions.ts); an author whose portrait survives,
 * or to whom a collection of letters is ascribed, has theirs; any other work shows the plate of its kind of writing.
 * Every one is a photograph in lib/photos.ts with its credit. `why` says only what the photograph's record or a named
 * source says.
 */
import { pieceFor } from "./pieces";

export interface Pic { pic: string; why?: string }

/** The kind of writing for works the catalogue has not sorted into any (Library.tsx). */
export const OTHER_KIND = "Other writings";

/** One plate for each kind of writing (lib/works-meta.ts, FAMILIES), and for the works filed under none. */
export const KIND_PLATES: Record<string, Pic> = {
  "Epic": { pic: "mask-of-agamemnon", why: "Schliemann tied it to Homer’s king; it is centuries older than the date usually given for the Trojan War." },
  "Lyric and elegy": { pic: "berlin-painter-amphora", why: "A young man singing to the kithara." },
  "Drama": { pic: "mytilene-theatre", why: "Greek plays were performed in open-air theatres like this one." },
  "History and biography": { pic: "herodotos-bust", why: "Herodotus, whom Cicero called the father of history (On the Laws 1.5)." },
  "Philosophy": { pic: "philosopher-head" },
  "Oratory and rhetoric": { pic: "boy-orator" },
  "Letters": { pic: "hand-with-scroll" },
  "Medicine": { pic: "asklepios-epidaurus", why: "Asclepius was the god of healing." },
  "Science and mathematics": { pic: "antikythera-fragment-a", why: "Part of a geared bronze device for working out the movements of the sun and moon." },
  "Novels, myths and marvels": { pic: "themis-aigeus" },
  "Religion": { pic: "hand-with-scroll" },
  "Scholarship": { pic: "douris-school-cup", why: "Lessons in writing, reading and music." },
  [OTHER_KIND]: { pic: "hand-with-scroll" },
};

/** The famous books' own pictures (data/medallions.ts, whose `why` is the whole credit; here only why each belongs). */
export const WORK_PLATES: Record<string, Pic> = {
  "tlg0012.tlg001": { pic: "mask-of-agamemnon", why: "Schliemann tied it to Homer’s king; it is centuries older than the date usually given for the Trojan War." },
  "tlg0012.tlg002": { pic: "melian-relief" },
  "tlg0003.tlg001": { pic: "pericles-bust", why: "Pericles, whose Funeral Oration is in book 2." },
  "tlg0059.tlg002": { pic: "socrates-louvre", why: "Socrates, the speaker of the whole work." },
  "tlg0627.tlg006": { pic: "asklepios-epidaurus", why: "Asclepius was the god of healing." },
  "tlg0004.tlg001": { pic: "gerome-diogenes", why: "Diogenes the Cynic with his lamp: Diogenes Laertius tells how he lit a lamp in daylight and went about saying he was looking for a human being (Lives 6.41)." },
};

/** Authors with a portrait of their own, or of the person their writings are about or ascribed to. */
export const AUTHOR_PLATES: Record<string, Pic> = {
  tlg0016: { pic: "herodotos-bust" },
  tlg0003: { pic: "pericles-bust", why: "Pericles, whose Funeral Oration is in book 2." },
  tlg0014: { pic: "demosthenes-head" },
  tlg1264: { pic: "chrysippos-head" },
  tlg0059: { pic: "socrates-louvre", why: "Socrates, the chief speaker of most of Plato’s dialogues." },
  tlg0004: { pic: "gerome-diogenes", why: "Diogenes the Cynic with his lamp: Diogenes Laertius tells how he lit a lamp in daylight and went about saying he was looking for a human being (Lives 6.41)." },
  tlg1325: { pic: "gerome-diogenes", why: "The letters are ascribed to Diogenes the Cynic." },
  tlg0623: { pic: "crates-hipparchia", why: "The letters are ascribed to Crates the Cynic." },
  tlg0636: { pic: "socrates-louvre", why: "The letters are ascribed to Socrates." },
  tlg0632: { pic: "pythagoras-capitoline", why: "The letters are ascribed to Pythagoras." },
};

/** Every picture on the library's page, in the order they are numbered as plates: the page's own (Plate I, data/pieces.ts),
 *  the famous books', the kinds', then the portraits'. The colophon at the foot of the page credits them in this order. */
export const LIBRARY_PLATES: string[] = [...new Set([
  pieceFor("/library")?.piece ?? "muse-head",
  ...Object.values(WORK_PLATES).map((p) => p.pic),
  ...Object.values(KIND_PLATES).map((p) => p.pic),
  ...Object.values(AUTHOR_PLATES).map((p) => p.pic),
])];
export const plateNo = (pic: string) => LIBRARY_PLATES.indexOf(pic) + 1;

/** A picture named the way the catalogue's rows carry it ("w:tlg0012.tlg001", "a:tlg0016", "k:Epic"). */
export function picByRef(ref: string): Pic {
  const [t, id] = [ref.slice(0, 1), ref.slice(2)];
  return (t === "w" ? WORK_PLATES[id] : t === "a" ? AUTHOR_PLATES[id] : KIND_PLATES[id]) ?? KIND_PLATES[OTHER_KIND];
}
/** The reference a row carries for its picture (picByRef): the work's own, the author's, or the kind's. */
export const picRef = (workId: string | null, authorId: string, kind: string) =>
  workId && WORK_PLATES[workId] ? `w:${workId}` : AUTHOR_PLATES[authorId] ? `a:${authorId}` : `k:${KIND_PLATES[kind] ? kind : OTHER_KIND}`;

/**
 * A melody as modern sheet music, written in ABC notation (a plain-text music notation) for abcjs to engrave.
 *
 * - Pitches are spelled in the key signature that needs the fewest accidentals. A note in the ancient tuning that is a
 *   few cents from a modern one is written as that note (the lyre still plays it in the old tuning); a note close to a
 *   quarter-tone between two (the enharmonic genus) gets a quarter-tone sharp.
 * - One beat, the χρόνος πρῶτος, is an eighth note. Lengths are rounded to the nearest half beat, since a player's
 *   small lengthenings in the rendering are not part of the written rhythm.
 * - The Seikilos song is barred in 6/8, as its usual transcription is. The other pieces have no regular bar: a bar
 *   line marks the end of each phrase, and each sung line starts a new staff.
 * - The words go under the notes, a syllable held over several notes with an extender line. A silence in the rendering
 *   (often where the source is broken) is written as a rest.
 */
import type { MelodyNote } from "@/data/melodies/types";

const SHARP_KEYS = ["C", "G", "D", "A", "E", "B"];
const FLAT_KEYS = ["F", "Bb", "Eb", "Ab"];
// the pitch classes of each major key's scale
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const TONIC: Record<string, number> = { C: 0, G: 7, D: 2, A: 9, E: 4, B: 11, F: 5, Bb: 10, Eb: 3, Ab: 8 };
const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const NATURAL = [0, 2, 4, 5, 7, 9, 11];

interface Spelled { letter: number; octave: number; acc: "" | "^" | "_" | "=" | "^/" }

function keyFor(pcs: number[]) {
  let best = "C", bestMiss = 1e9;
  for (const k of [...SHARP_KEYS, ...FLAT_KEYS]) {
    const scale = new Set(MAJOR.map((x) => (x + TONIC[k]) % 12));
    const miss = pcs.filter((p) => !scale.has(p)).length * 10 + (SHARP_KEYS.indexOf(k) >= 0 ? SHARP_KEYS.indexOf(k) : FLAT_KEYS.indexOf(k) + 1);
    if (miss < bestMiss) { bestMiss = miss; best = k; }
  }
  return best;
}

/** The letters the key sharpens or flattens (by letter index), from its signature. */
function signature(key: string): Map<number, "^" | "_"> {
  const m = new Map<number, "^" | "_">();
  const sharpOrder = [3, 0, 4, 1, 5, 2, 6], flatOrder = [6, 2, 5, 1, 4, 0, 3];   // F C G D A E B / B E A D G C F
  const ns = SHARP_KEYS.indexOf(key), nf = FLAT_KEYS.indexOf(key);
  if (ns > 0) for (let i = 0; i < ns; i++) m.set(sharpOrder[i], "^");
  if (nf >= 0) for (let i = 0; i <= nf; i++) m.set(flatOrder[i], "_");
  return m;
}

function spell(semi: number, key: string, quarter: boolean, used: Set<number>): Spelled {
  const sig = signature(key), flats = FLAT_KEYS.includes(key);
  const pc = ((semi % 12) + 12) % 12, oct = Math.floor(semi / 12) - 1;
  // as a letter of the key (with its signature), if one fits
  for (let L = 0; L < 7; L++) {
    const s = sig.get(L), v = NATURAL[L] + (s === "^" ? 1 : s === "_" ? -1 : 0);
    if (((v % 12) + 12) % 12 === pc) {
      const o = oct + (v < 0 ? 1 : v > 11 ? -1 : 0);
      return { letter: L, octave: o, acc: quarter ? "^/" : "" };
    }
  }
  // a natural against the signature
  for (let L = 0; L < 7; L++) if (NATURAL[L] === pc) return { letter: L, octave: oct, acc: quarter ? "^/" : "=" };
  // a black key outside the key: as a sharp or a flat, whichever does not share its letter with a note the piece also
  // uses (F♯ beside G, not G♭), else as the key prefers
  const up = NATURAL.indexOf((pc + 1) % 12), down = NATURAL.indexOf((pc + 11) % 12);
  const flatClash = used.has((pc + 1) % 12), sharpClash = used.has((pc + 11) % 12);
  const useFlat = flatClash !== sharpClash ? sharpClash : flats && !flatClash;   // both letters taken: a sharp, as a leading note
  if (useFlat) return { letter: up, octave: oct + (pc === 11 ? 1 : 0), acc: "_" };
  return { letter: down, octave: oct, acc: "^" };
}

function abcPitch({ letter, octave, acc }: Spelled) {
  let s = LETTERS[letter];
  if (octave >= 5) s = s.toLowerCase() + "'".repeat(octave - 5);
  else s = s + ",".repeat(4 - octave);
  return acc + s;
}

/** A length in beats as ABC lengths (in eighths), split into parts a note value can show: 4½ beats is a half note
 *  tied to a sixteenth. */
function parts(beats: number): string[] {
  let h = Math.max(1, Math.round(beats * 2));      // in half beats (sixteenth notes)
  const out: string[] = [];
  for (const v of [16, 12, 8, 6, 4, 3, 2, 1]) while (h >= v) { out.push(v === 2 ? "" : v % 2 === 0 ? String(v / 2) : v === 1 ? "/" : `${v}/2`); h -= v; }
  return out;
}

export interface Score {
  abc: string;
  key: string;
  /** for each note of the melody, the indexes of the engraved notes that show it (more than one when it is tied) */
  map: number[][];
}

export function toAbc(notes: MelodyNote[], { id, sung, bpm }: { id: string; sung: boolean; bpm: number }): Score {
  // where each note sits on its nearest semitone, and whether it is a quarter-tone above it
  const placed = notes.map((n) => {
    const fl = Math.floor(n.m), frac = n.m - fl;
    const quarter = frac > 0.32 && frac < 0.68;
    return { n, semi: quarter ? fl : Math.round(n.m), quarter };
  });
  const key = keyFor([...new Set(placed.filter((p) => !p.quarter).map((p) => ((p.semi % 12) + 12) % 12))]);
  const metre = METRE[id] ?? 0;

  const staves: { notes: string[]; words: string[] }[] = [];
  let cur = { notes: [] as string[], words: [] as string[] };
  const flush = () => { if (cur.notes.length) staves.push(cur); cur = { notes: [], words: [] }; };
  let pos = 0, bar = 0, sincePhrase = 0, engraved = 0;
  const map: number[][] = [];
  const used = new Set(placed.filter((p) => !p.quarter).map((p) => ((p.semi % 12) + 12) % 12));
  for (let i = 0; i < placed.length; i++) {
    const { n, semi, quarter } = placed[i];
    if (sung && n.br) flush();
    const start = Math.round(n.t * 2) / 2;
    const gap = start - pos;
    if (gap >= 0.75) {                                   // a silence
      cur.notes.push(parts(gap).map((x) => `z${x}`).join(" "));
      if (!metre) cur.notes.push("|");
      else { bar += Math.round(gap * 2) / 2; while (bar >= metre - 0.01) { cur.notes.push("|"); bar -= metre; } }
    }
    pos = Math.max(pos, start);
    const len = Math.max(0.5, Math.round(n.d * 2) / 2);
    const p = abcPitch(spell(semi, key, quarter, used)), ps = parts(len);
    cur.notes.push(ps.map((x) => `${p}${x}`).join("-"));
    map.push(ps.map(() => engraved++));
    // the words: a syllable that goes on in the same word ends with a hyphen; a held syllable (or a tied note) is
    // extended with "_"
    if (sung) { cur.words.push(n.syl ? n.syl.replace(/\s/g, "~") : "_"); for (let k = 1; k < ps.length; k++) cur.words.push("_"); }
    pos += len; sincePhrase++;
    const next = notes[i + 1];
    if (metre) {
      bar += len;
      while (bar >= metre - 0.01) { cur.notes.push("|"); bar -= metre; }
    } else if (!next || next.t - (n.t + n.d) > 0.75 || n.d >= 3) {
      cur.notes.push("|");
      // a piece with no words starts a new staff every few phrases, so the lines are of a readable length
      if (!sung && sincePhrase >= 10) { flush(); sincePhrase = 0; }
    }
  }
  flush();
  const head = ["X:1", "L:1/8", metre ? `M:${metre}/8` : "M:none", `Q:1/8=${Math.round(bpm)}`, `K:${key}`];
  const body = staves.map((st) => {
    const line = st.notes.join(" ").replace(/(\|\s*)+$/, "|").replace(/\|(\s*\|)+/g, "|");
    return sung && st.words.length ? `${line}\nw: ${joinWords(st.words)}` : line;
  });
  return { abc: `${head.join("\n")}\n${body.join("\n")}\n`, key, map };
}

/** Lyric tokens for ABC: "Ὅ-" + "σον" is written "Ὅ-σον"; other syllables are separated by spaces. */
function joinWords(ws: string[]) {
  let out = "";
  for (const w of ws) out += out && !out.endsWith("-") ? ` ${w}` : w;
  return out;
}

/** Pieces with a regular bar: the Seikilos song in 6/8, as its usual transcription. */
const METRE: Record<string, number> = { seikilos: 6 };

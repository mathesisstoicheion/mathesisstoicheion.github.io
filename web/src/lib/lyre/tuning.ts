/**
 * How the lyre is strung, and which computer key plucks which string.
 *
 * For playing freely the strings follow the Greater Perfect System (σύστημα τέλειον μεῖζον), the two-octave diatonic
 * scale of the Greek music theorists: four tetrachords (ὑπατῶν, μέσων, διεζευγμένων, ὑπερβολαίων) and an added note at
 * the bottom (προσλαμβανόμενος). The names are those of strings: LSJ calls ὑπάτη "the highest of the three strings which
 * formed the framework of the musical scale ... but the lowest in pitch", and νεάτη (νήτη) "the lowest of the three
 * strings ... but the highest in pitch"; μέση was "originally the middle string of the seven-stringed (or of an earlier
 * three-stringed) lyre". The theorists' notes have no fixed pitch; μέση is set here as A (220 Hz).
 *
 * For a song the lyre is strung, as a player retuned it, with just the notes that song uses.
 */

export interface LyreString { midi: number; name?: string; greek?: string }

const GPS: [string, string][] = [
  ["Proslambanomenos", "προσλαμβανόμενος"],
  ["Hypatē hypatōn", "ὑπάτη ὑπατῶν"],
  ["Parhypatē hypatōn", "παρυπάτη ὑπατῶν"],
  ["Lichanos hypatōn", "λιχανὸς ὑπατῶν"],
  ["Hypatē mesōn", "ὑπάτη μέσων"],
  ["Parhypatē mesōn", "παρυπάτη μέσων"],
  ["Lichanos mesōn", "λιχανὸς μέσων"],
  ["Mesē", "μέση"],
  ["Paramesē", "παραμέση"],
  ["Tritē diezeugmenōn", "τρίτη διεζευγμένων"],
  ["Paranētē diezeugmenōn", "παρανήτη διεζευγμένων"],
  ["Nētē diezeugmenōn", "νήτη διεζευγμένων"],
  ["Tritē hyperbolaiōn", "τρίτη ὑπερβολαίων"],
  ["Paranētē hyperbolaiōn", "παρανήτη ὑπερβολαίων"],
  ["Nētē hyperbolaiōn", "νήτη ὑπερβολαίων"],
];
// A B C D E F G a b c d e f g a', with μέση on A3 (220 Hz)
const EQUAL = [45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69];
// the same notes in Pythagorean tuning (Ptolemy's "ditonic" diatonic): whole tones of 9:8 and semitones of 256:243, in
// cents above A: B 204, C 294, D 498, E 702, F 792, G 996
const PYTH_CENTS = [0, 203.91, 294.13, 498.04, 701.96, 792.18, 996.09];
const PYTH = EQUAL.map((_, i) => 45 + 12 * Math.floor(i / 7) + PYTH_CENTS[i % 7] / 100);

export type Tuning = "ancient" | "modern";
/** The two-octave scale for playing freely, in the ancient (Pythagorean) tuning or the modern equal one. */
export const freeStrings = (t: Tuning): LyreString[] => (t === "ancient" ? PYTH : EQUAL).map((midi, i) => ({ midi, name: GPS[i][0], greek: GPS[i][1] }));
export const FREE_STRINGS = freeStrings("ancient");

/** The strings for a song: every pitch it uses, low to high. */
export function stringsFor(midis: number[]): LyreString[] {
  return [...new Set(midis)].sort((a, b) => a - b).map((midi) => ({ midi }));
}

/**
 * The computer keyboard is a piano, as on most online pianos and in music programs: the row A S D F G H J K L ; ' gives
 * the white keys from C, the row above it (W E, T Y U, O P) the black keys between them, and Z and X move all of them an
 * octave down or up. Keys go by their place on the keyboard (event.code), so they work on any layout.
 */
export const PIANO_KEYS: Record<string, number> = {
  KeyA: 0, KeyW: 1, KeyS: 2, KeyE: 3, KeyD: 4, KeyF: 5, KeyT: 6, KeyG: 7, KeyY: 8, KeyH: 9, KeyU: 10, KeyJ: 11,
  KeyK: 12, KeyO: 13, KeyL: 14, KeyP: 15, Semicolon: 16, Quote: 17,
};
/** The key at each step above the lowest C the keys reach. */
export const CODE_AT: string[] = [];
for (const [c, k] of Object.entries(PIANO_KEYS)) CODE_AT[k] = c;
export const OCTAVE_DOWN = "KeyZ", OCTAVE_UP = "KeyX";
/** How far above their lowest C the keys reach (C to the F an octave up). */
export const KEYS_SPAN = 17;

/**
 * The piano key (a whole MIDI note) each string answers to, low to high: the nearest key, but never one key for two
 * strings, so that a string tuned between two keys (the ancient tunings have steps smaller than a semitone) takes the
 * key beside its neighbour's. The strings are in order, low to high.
 */
export function keysOf(strings: LyreString[]): number[] {
  const ps = strings.map((s) => s.midi);
  if (!ps.length) return [];
  const cand = ps.map((p) => [0, -1, 1, -2, 2].map((d) => Math.round(p) + d));
  let cost = cand[0].map((k) => Math.abs(ps[0] - k));
  const from: number[][] = [];
  for (let i = 1; i < ps.length; i++) {
    const next = cand[i].map(() => Infinity), back = cand[i].map(() => -1);
    cand[i].forEach((k, a) => cand[i - 1].forEach((kp, b) => {
      const c = cost[b] + Math.abs(ps[i] - k);
      if (kp < k && c < next[a]) { next[a] = c; back[a] = b; }
    }));
    cost = next;
    from.push(back);
  }
  let a = cost.indexOf(Math.min(...cost));
  if (!Number.isFinite(cost[a])) return ps.map(Math.round);
  const out = new Array<number>(ps.length);
  for (let i = ps.length - 1; i >= 0; i--) { out[i] = cand[i][a]; if (i > 0) a = from[i - 1][a]; }
  return out;
}

/** The lowest C for the keys that reaches the most of these keys (each counted `weight` times), the higher if tied. */
export function bestOctave(keys: number[], weight: (i: number) => number = () => 1): number {
  let best = 48, most = -1;
  for (const c of octaves(keys)) {
    let n = 0;
    keys.forEach((k, i) => { if (k >= c && k <= c + KEYS_SPAN) n += weight(i); });
    if (n >= most) { most = n; best = c; }
  }
  return best;
}

/** The lowest Cs the keys may start from: those from which at least one string can be reached. */
export function octaves(keys: number[]): number[] {
  if (!keys.length) return [48];
  const lo = Math.min(...keys), hi = Math.max(...keys), out: number[] = [];
  for (let c = 12 * Math.ceil((lo - KEYS_SPAN) / 12); c <= hi; c += 12) out.push(c);
  return out;
}

const QWERTY: Record<string, string> = {
  KeyA: "A", KeyS: "S", KeyD: "D", KeyF: "F", KeyG: "G", KeyH: "H", KeyJ: "J", KeyK: "K", KeyL: "L", Semicolon: ";", Quote: "'",
  KeyW: "W", KeyE: "E", KeyT: "T", KeyY: "Y", KeyU: "U", KeyO: "O", KeyP: "P", KeyZ: "Z", KeyX: "X",
};

/** What each key is labelled on this person's keyboard (where the browser can tell), else on an English one. */
export async function keyLabels(): Promise<Record<string, string>> {
  const labels = { ...QWERTY };
  try {
    const kb = (navigator as Navigator & { keyboard?: { getLayoutMap(): Promise<Map<string, string>> } }).keyboard;
    const map = kb && (await kb.getLayoutMap());
    if (map) for (const c of Object.keys(QWERTY)) { const v = map.get(c); if (v) labels[c] = v.toUpperCase(); }
  } catch { /* not allowed here: keep the English labels */ }
  return labels;
}

const NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
/** A pitch in modern letters, with its octave (A3 is 220 Hz), and how many cents it is from the modern note. */
export function noteName(m: number) {
  const n = Math.round(m), c = Math.round((m - n) * 100);
  const base = `${NAMES[((n % 12) + 12) % 12]}${Math.floor(n / 12) - 1}`;
  return Math.abs(c) >= 3 ? `${base} ${c > 0 ? "+" : "−"}${Math.abs(c)} cents` : base;
}

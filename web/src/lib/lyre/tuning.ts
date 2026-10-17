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

/** The string a MIDI key (a whole semitone) plays: the nearest string within a little over half a semitone, else none. */
export function nearestString(strings: LyreString[], note: number) {
  let best = -1, bd = 0.62;
  strings.forEach((s, i) => { const d = Math.abs(s.midi - note); if (d < bd) { bd = d; best = i; } });
  return best;
}

/**
 * Computer keys, by their place on the keyboard (so they work on any layout): the home row from left to right, then the
 * row above it. Fifteen strings take the whole home row and the first four keys above it.
 */
export const KEY_CODES = [
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote",
  "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight",
];
const QWERTY: Record<string, string> = {
  KeyA: "A", KeyS: "S", KeyD: "D", KeyF: "F", KeyG: "G", KeyH: "H", KeyJ: "J", KeyK: "K", KeyL: "L", Semicolon: ";", Quote: "'",
  KeyQ: "Q", KeyW: "W", KeyE: "E", KeyR: "R", KeyT: "T", KeyY: "Y", KeyU: "U", KeyI: "I", KeyO: "O", KeyP: "P", BracketLeft: "[", BracketRight: "]",
};

/** What each key is labelled on this person's keyboard (where the browser can tell), else on an English one. */
export async function keyLabels(): Promise<Record<string, string>> {
  const labels = { ...QWERTY };
  try {
    const kb = (navigator as Navigator & { keyboard?: { getLayoutMap(): Promise<Map<string, string>> } }).keyboard;
    const map = kb && (await kb.getLayoutMap());
    if (map) for (const c of KEY_CODES) { const v = map.get(c); if (v) labels[c] = v.toUpperCase(); }
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

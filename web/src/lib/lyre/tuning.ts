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
 * The computer keyboard plays the strings in order, as they are seen: A is the lowest string, S the next, and so on
 * along the row (A S D F G H J K L ; '). A lyre with more strings than that row has keys puts its lower half there and
 * its higher half on the row above, from Q (Q W E R T Y U I O P [ ]). Keys go by their place on the keyboard
 * (event.code), so they work on any layout.
 */
export const HOME_ROW = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"];
export const TOP_ROW = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"];

/** The key for each of `n` strings, low to high. */
export function stringKeys(n: number): string[] {
  if (n <= HOME_ROW.length) return HOME_ROW.slice(0, n);
  const low = Math.ceil(n / 2);
  return [...HOME_ROW.slice(0, low), ...TOP_ROW.slice(0, Math.min(TOP_ROW.length, n - low))];
}

/**
 * The key of a MIDI keyboard (a whole MIDI note) each string answers to, low to high: the nearest key, but never one
 * key for two strings, so that a string tuned between two keys (the ancient tunings have steps smaller than a semitone) takes the
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

/**
 * Keyboard layouts: the letter printed on each key of the two rows, in the order of the keys (A S D F… and Q W E R…
 * on an English keyboard). The keys are found by their place, so only their letters change from one layout to another.
 * Keyboards for Greek, Cyrillic, Hebrew and Arabic print the English letters too; the language's own are shown.
 */
export interface Layout { id: string; name: string; home: string[]; top: string[]; latin: boolean }
const layout = (id: string, name: string, home: string, top: string): Layout =>
  ({ id, name, home: home.split(" "), top: top.split(" "), latin: /^[\x20-\x7E\u00C0-\u024F]+$/.test(home.replace(/[´º§]/g, "")) });
export const LAYOUTS: Layout[] = [
  layout("qwerty", "English (QWERTY)", "A S D F G H J K L ; '", "Q W E R T Y U I O P [ ]"),
  layout("dvorak", "English (Dvorak)", "A O E U I D H T N S -", "' , . P Y F G C R L / ="),
  layout("colemak", "English (Colemak)", "A R S T D H N E I O '", "Q W F P G J L U Y ; [ ]"),
  layout("azerty", "French or Belgian (AZERTY)", "Q S D F G H J K L M Ù", "A Z E R T Y U I O P ^ $"),
  layout("qwertz", "German or Austrian (QWERTZ)", "A S D F G H J K L Ö Ä", "Q W E R T Z U I O P Ü +"),
  layout("ch-de", "Swiss German", "A S D F G H J K L Ö Ä", "Q W E R T Z U I O P Ü ¨"),
  layout("ch-fr", "Swiss French or Luxembourgish", "A S D F G H J K L É À", "Q W E R T Z U I O P È ¨"),
  layout("es", "Spanish (Spain)", "A S D F G H J K L Ñ ´", "Q W E R T Y U I O P ` +"),
  layout("latam", "Spanish (Latin America)", "A S D F G H J K L Ñ {", "Q W E R T Y U I O P ´ +"),
  layout("it", "Italian", "A S D F G H J K L Ò À", "Q W E R T Y U I O P È +"),
  layout("pt", "Portuguese (Portugal)", "A S D F G H J K L Ç º", "Q W E R T Y U I O P + ´"),
  layout("br", "Portuguese (Brazil)", "A S D F G H J K L Ç ~", "Q W E R T Y U I O P ´ ["),
  layout("se", "Swedish or Finnish", "A S D F G H J K L Ö Ä", "Q W E R T Y U I O P Å ¨"),
  layout("no", "Norwegian", "A S D F G H J K L Ø Æ", "Q W E R T Y U I O P Å ¨"),
  layout("dk", "Danish", "A S D F G H J K L Æ Ø", "Q W E R T Y U I O P Å ¨"),
  layout("tr", "Turkish", "A S D F G H J K L Ş İ", "Q W E R T Y U I O P Ğ Ü"),
  layout("cz", "Czech", "A S D F G H J K L Ů §", "Q W E R T Z U I O P Ú )"),
  layout("sk", "Slovak", "A S D F G H J K L Ô §", "Q W E R T Z U I O P Ú Ä"),
  layout("hu", "Hungarian", "A S D F G H J K L É Á", "Q W E R T Z U I O P Ő Ú"),
  layout("hr", "Croatian, Slovenian or Bosnian", "A S D F G H J K L Č Ć", "Q W E R T Z U I O P Š Đ"),
  layout("sr", "Serbian (Cyrillic)", "А С Д Ф Г Х Ј К Л Ч Ћ", "Љ Њ Е Р Т З У И О П Ш Ђ"),
  layout("el", "Greek", "Α Σ Δ Φ Γ Η Ξ Κ Λ ; '", "; ς Ε Ρ Τ Υ Θ Ι Ο Π [ ]"),
  layout("ru", "Russian", "Ф Ы В А П Р О Л Д Ж Э", "Й Ц У К Е Н Г Ш Щ З Х Ъ"),
  layout("ua", "Ukrainian", "Ф І В А П Р О Л Д Ж Є", "Й Ц У К Е Н Г Ш Щ З Х Ї"),
  layout("he", "Hebrew", "ש ד ג כ ע י ח ל ך ף ,", "/ ' ק ר א ט ו ן ם פ [ ]"),
  layout("ar", "Arabic", "ش س ي ب ل ا ت ن م ك ط", "ض ص ث ق ف غ ع ه خ ح ج د"),
  layout("fa", "Persian", "ش س ی ب ل ا ت ن م ک گ", "ض ص ث ق ف غ ع ه خ ح ج چ"),
  layout("jp", "Japanese", "A S D F G H J K L ; :", "Q W E R T Y U I O P @ ["),
];
const byId = (id: string) => LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];

const BY_LANGUAGE: Record<string, string> = {
  en: "qwerty", nl: "qwerty", pl: "qwerty", ro: "qwerty", ko: "qwerty", zh: "qwerty",
  fr: "azerty", de: "qwertz", it: "it", es: "es", pt: "pt",
  sv: "se", fi: "se", nb: "no", nn: "no", no: "no", da: "dk",
  tr: "tr", cs: "cz", sk: "sk", hu: "hu", hr: "hr", sl: "hr", bs: "hr", sr: "sr",
  el: "el", ru: "ru", uk: "ua", he: "he", iw: "he", ar: "ar", fa: "fa", ja: "jp",
};

/** The layout most keyboards have where this language is used (a language tag such as "fr-CA"), or null if not known. */
export function layoutForLanguage(tag: string): string | null {
  const [lang, ...rest] = tag.toLowerCase().split(/[-_]/), region = rest.find((p) => p.length === 2) ?? "";
  if (lang === "lb" || (region === "lu" && (lang === "fr" || lang === "de"))) return "ch-fr";
  if (region === "ch") return lang === "fr" ? "ch-fr" : "ch-de";
  if (region === "be" && (lang === "fr" || lang === "nl")) return "azerty";
  if (lang === "fr" && region === "ca") return "qwerty";
  if (lang === "es" && region && region !== "es") return "latam";
  if (lang === "pt" && region === "br") return "br";
  if (lang === "sr" && rest.includes("latn")) return "hr";
  return BY_LANGUAGE[lang] ?? null;
}

const labelsOf = (l: Layout): Record<string, string> =>
  Object.fromEntries([...HOME_ROW.map((c, i) => [c, l.home[i]]), ...TOP_ROW.map((c, i) => [c, l.top[i]])]);

export interface KeyLetters {
  labels: Record<string, string>;
  /** where the letters came from: the keyboard itself (as the browser reports it), the browser's language, or a choice */
  from: "keyboard" | "language" | "choice";
  layout: Layout;
}

/**
 * The letters printed on the keys. Chosen: that layout. Otherwise the keyboard's own, where the browser can tell
 * (Chrome, Edge and Opera on a computer), else the layout of the browser's language. Browsers report only English
 * letters for a Greek, Cyrillic, Hebrew or Arabic keyboard, so for those languages the language's letters are kept.
 */
export async function keyLetters(choice = "auto"): Promise<KeyLetters> {
  if (choice !== "auto") return { labels: labelsOf(byId(choice)), from: "choice", layout: byId(choice) };
  const langs = typeof navigator === "undefined" ? [] : navigator.languages?.length ? navigator.languages : [navigator.language];
  const guess = byId(langs.map(layoutForLanguage).find(Boolean) ?? "qwerty");
  const labels = labelsOf(guess);
  try {
    const kb = (navigator as Navigator & { keyboard?: { getLayoutMap(): Promise<Map<string, string>> } }).keyboard;
    const map = kb && (await kb.getLayoutMap());
    if (map && map.size) {
      const own = HOME_ROW.map((c) => map.get(c) ?? "");
      if (!guess.latin && own.every((v) => /^[\x20-\x7E]?$/.test(v))) return { labels, from: "language", layout: guess };
      for (const c of [...HOME_ROW, ...TOP_ROW]) {
        const v = map.get(c);
        if (v && v.length <= 2) labels[c] = v.toLocaleUpperCase(langs[0]);
      }
      return { labels, from: "keyboard", layout: guess };
    }
  } catch { /* not allowed here: keep the language's letters */ }
  return { labels, from: "language", layout: guess };
}

const NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "G♯", "A", "B♭", "B"];
/** A pitch in modern letters, with its octave (A3 is 220 Hz), and how many cents it is from the modern note. */
export function noteName(m: number) {
  const n = Math.round(m), c = Math.round((m - n) * 100);
  const base = `${NAMES[((n % 12) + 12) % 12]}${Math.floor(n / 12) - 1}`;
  return Math.abs(c) >= 3 ? `${base} ${c > 0 ? "+" : "−"}${Math.abs(c)} cents` : base;
}

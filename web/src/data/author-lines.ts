/**
 * A line on who or what an entry is, for the entries of the library that Wikidata does not describe and whose works GLAUx
 * gives no kind of writing (review fix list, slice 6: no author's row is left without a line). Most are not one author but a
 * collection catalogued under a name ("Scholia on Pindar", "Letters of Socrates"); their line follows from the name. The
 * few written by hand say only what the standard reference works say of them.
 */

const BY_NAME: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Pseudo-(.+)$/, (m) => `Writings once credited to ${m[1]}`],
  [/^Scholia on (.+)$/, (m) => `Old notes on ${m[1]}, from the margins of the manuscripts`],
  [/^Letters of (.+)$/, (m) => `Letters that go under the name of ${m[1]}`],
  [/^Part of a Life of (.+)$/, (m) => `Part of an ancient life of ${m[1]}`],
  [/^Lives of (.+?)(?:, and Other Writings on .+)?$/, (m) => `Ancient lives of ${m[1]}`],
  [/^Acts of (.+)$/, (m) => `An early Christian story of the apostle ${m[1]}`],
  [/^Anonymous\b/, () => "The writer’s name has not come down to us"],
];

const BY_ID: Record<string, string> = {
  tlg1482: "A book of the healing and magical powers of stones, plants and animals",           // Cyranides
  tlg2655: "Writer of a book on the powers of stones",                                          // Damigeron
  tlg1309: "Arguments on both sides of moral questions, by an unnamed writer among the sophists", // Dialexeis (Dissoi logoi)
  stoa0121: "Roman historian, author of a short history of Rome",                               // Eutropius
  tlg0572: "Christian writer at Rome, known from fragments",                                    // Gaius
  heb0001: "Books of the Hebrew Bible in the Greek of the Septuagint",
  stoa0146d: "Christian writer, named as the author of the Acts of Archelaus, against the Manichaeans",
  tlg1802: "Lines of hexameter verse, printed with Homer’s works in T. W. Allen’s Oxford edition",
  tlg2140: "Alchemical writing under the name of Iamblichus",
  tlg0579: "Poems and sayings under the name of the mythical singer Orpheus",
  tlg4174: "Prose paraphrases of Dionysius’ description of the world in verse",
  tlg9007: "A collection of Greek proverbs",
  tlg4102: "Chains of excerpts from the Church Fathers, set beside the books of the New Testament",
  ogl0001: "Bishop of Knossos in Crete",
  tlg1669: "Greek astrologer, known from fragments",
  tlg0362: "Hymns to Apollo cut in stone at Delphi, with their musical notes",
  tlg1463: "A Jewish apocalypse told in the name of Enoch",
  tlg2371: "A Byzantine chronicle of the world from Adam",
  tlg1551: "Prophecies in hexameter verse under the name of the Sibyl",
  tlg0055: "Athenian statesman; the letters under his name were written long after him",       // Themistocles
};

/** The line for an entry no source describes, or undefined. */
export function entryLine(id: string, name: string, works: { title: string }[]): string | undefined {
  if (BY_ID[id]) return BY_ID[id];
  for (const [re, line] of BY_NAME) { const m = name.match(re); if (m) return line(m); }
  if (works.length && works.every((w) => /^Fragments\b/.test(w.title))) return "Known only from fragments quoted by later writers";
  return undefined;
}

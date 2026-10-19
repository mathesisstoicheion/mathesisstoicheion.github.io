/**
 * The letter figures: one for each area of the site, as the library has Socrates (the owner, 2026-10-19: "I like the
 * transparency and the texts that morph into Socrates' face, that turns into a scroll"). In each, the letters of a real
 * Greek text gather into a face, and further down they become an object that belongs to the area (lib/a/lamplight.js,
 * FigScene and TARGETS). The door of each area shows its figure on a stage behind the page, as the library does; every
 * page inside the area shows it once more at its foot (components/a/FigStage.tsx, FootFigure.tsx).
 *
 * The texts are cut from the Perseus Digital Library's files at the version the catalogue pins, by
 * scripts/make-figure-texts.py, which names each passage by the edition's own numbers; the faces are cut out of the same
 * photographs the site's pieces use (scripts/prepare-figures.py), and each credit below is the museum's own record
 * (data/piece-images.json) or the photograph's licence.
 */
import type { AreaId } from "@/config/areas";

export type FigureId = "read" | "learn" | "explore" | "talk" | "mine" | "search";
export type Target = "roll" | "tablet" | "colonnade" | "kleroterion" | "coin" | "lyre";

export interface Figure {
  id: FigureId;
  /** the area whose door shows it */
  area: AreaId;
  /** the face, greyscale on black */
  face: string;
  /** the Greek text it is spelled out of */
  text: string;
  /** the object its letters become */
  target: Target;
  /** the object's own picture, where it has one */
  img2?: string;
  /** who the face is, and what the object is, in a few words */
  who: string;
  object: string;
  /** the text, named for a reader: "Plato’s Apology" */
  from: string;
  /** the passage's first and last words, as the file has them */
  first: string;
  last: string;
  /** the passage in the edition's numbering, and the edition */
  passage: string;
  edition: string;
  /** the face's photograph, and the object's source where it is a real one */
  faceCredit: string;
  objectNote?: string;
}

export const FIGURES: Record<FigureId, Figure> = {
  read: {
    id: "read", area: "library", face: "/images/a/soc.jpg", text: "/data/a/apology.txt", target: "roll",
    who: "Socrates", object: "a papyrus roll", from: "Plato’s Apology",
    first: "ὅτι μὲν ὑμεῖς, ὦ ἄνδρες Ἀθηναῖοι", last: "τῷ θεῷ", passage: "the whole speech",
    edition: "Platonis Opera, ed. John Burnet, Oxford, 1905",
    faceCredit: "a Roman marble portrait of Socrates, 1st century AD, Musée du Louvre; photograph by Eric Gaba, public domain",
    objectNote: "Greek books were written on rolls of papyrus, in columns of capitals, as in Plato’s time.",
  },
  learn: {
    id: "learn", area: "study", face: "/images/a/fig-philosopher-head.jpg", text: "/data/a/republic-cave.txt", target: "tablet",
    who: "a philosopher", object: "a pupil’s writing tablet", from: "Plato’s story of the cave",
    first: "μετὰ ταῦτα δή, εἶπον, ἀπείκασον τοιούτῳ", last: "πάνυ μὲν οὖν, ἔφη", passage: "Republic 7, 514a–519a",
    edition: "Platonis Opera, ed. John Burnet, Oxford, 1905",
    faceCredit: "a marble head of a philosopher, 1st or 2nd century CE, The Metropolitan Museum of Art, New York (26.269), CC0",
    objectNote: "Plato opens the story by likening our nature, in its education and its lack of it, to prisoners in a cave. Greek pupils wrote on wax tablets: two wooden leaves, tied together.",
  },
  explore: {
    id: "explore", area: "wiki", face: "/images/a/fig-chrysippos-head.jpg", text: "/data/a/chrysippus-life.txt", target: "colonnade",
    who: "Chrysippus", object: "the painted colonnade", from: "Diogenes Laertius’ life of Chrysippus",
    first: "Χρύσιππος Ἀπολλωνίου Σολεὺς ἢ Ταρσεύς", last: "μολύνειν τὸ στόμα εἴποι ἄν", passage: "Lives of Eminent Philosophers 7.179–187",
    edition: "ed. R. D. Hicks, Loeb Classical Library, 1925",
    faceCredit: "a marble portrait head of the philosopher Chrysippos, 1st century CE, The Metropolitan Museum of Art, New York (24.243), CC0",
    objectNote: "Chrysippus was the third head of the Stoic school, named after the Painted Stoa where Zeno taught.",
  },
  talk: {
    id: "talk", area: "forum", face: "/images/a/fig-pericles-bust.jpg", text: "/data/a/funeral-oration.txt", target: "kleroterion",
    who: "Pericles", object: "an allotment machine", from: "Pericles’ Funeral Oration",
    first: "οἱ μὲν πολλοὶ τῶν ἐνθάδε ἤδη", last: "ἀπολοφυράμενοι ὃν προσήκει ἑκάστῳ ἄπιτε", passage: "Thucydides 2.35–46",
    edition: "Thucydidis Historiae, ed. Henry Stuart Jones, Oxford, 1910",
    faceCredit: "a bust of Pericles, a Roman copy of a portrait of c. 440–430 BC, British Museum; photograph by Marie-Lan Nguyen, CC BY 2.5",
    objectNote: "Athenians picked jurors by lot with a kleroterion, a stone slab with rows of slots for their name tickets and a tube for black and white balls (Aristotle, Constitution of the Athenians 63–64).",
  },
  mine: {
    id: "mine", area: "treasury", face: "/images/a/fig-athena-head.jpg", text: "/data/a/treasure-of-athens.txt", target: "coin",
    img2: "/images/a/fig-owl-coin.jpg",
    who: "Athena", object: "an Athenian silver coin", from: "Pericles’ count of the city’s treasure",
    first: "ἔτι δὲ τῶν Πελοποννησίων ξυλλεγομένων", last: "ἀπόδειξιν τοῦ περιέσεσθαι τῷ πολέμῳ", passage: "Thucydides 2.13",
    edition: "Thucydidis Historiae, ed. Henry Stuart Jones, Oxford, 1910",
    faceCredit: "a marble head of Athena, ca. 27 BCE–68 CE, The Metropolitan Museum of Art, New York (12.157), CC0",
    objectNote: "Pericles counts the silver kept on the Acropolis and the forty talents of pure gold on Athena’s statue. The coin is a silver tetradrachm of Athens, c. 440–404 BC, The Metropolitan Museum of Art, New York (2021.40.80), CC0.",
  },
  search: {
    id: "search", area: "search", face: "/images/a/fig-apollo-head.jpg", text: "/data/a/hymn-to-apollo-pythian.txt", target: "lyre",
    who: "Apollo", object: "his lyre", from: "the Homeric Hymn to Apollo",
    first: "εἶσι δὲ φορμίζων Λητοῦς ἐρικυδέος υἱὸς", last: "σεῖο καὶ ἄλλης μνήσομ’ ἀοιδῆς", passage: "lines 182–546, Apollo at Pytho",
    edition: "ed. Hugh G. Evelyn-White, Loeb Classical Library, 1914",
    faceCredit: "a marble head of Apollo, 1st or 2nd century CE, The Metropolitan Museum of Art, New York (1980.303.2), CC0",
    objectNote: "The passage opens with Apollo going to Pytho playing his lyre, and goes on to his founding of the oracle at Delphi.",
  },
};

/** Which figure belongs to a page, by its address; none for the home page, the reader and the pages outside the areas. */
export function figureFor(path: string): Figure | null {
  const p = path.replace(/\/+$/, "") || "/";
  const under = (base: string) => p === base || p.startsWith(base + "/");
  if (under("/academy")) return FIGURES.learn;
  if (under("/stoa")) return FIGURES.explore;
  if (under("/town-hall")) return FIGURES.talk;
  if (under("/treasury")) return FIGURES.mine;
  if (under("/search")) return FIGURES.search;
  if (under("/library") || under("/author") || under("/work") || under("/downloads")) return FIGURES.read;
  return null;
}

/** The figure's credit in one sentence, for the foot of the page that shows it. */
export const figureCredit = (f: Figure) =>
  `${f.who[0].toUpperCase()}${f.who.slice(1)}, spelled out of ${f.from} (${f.passage}; ${f.edition}, via the Perseus Digital Library), from “${f.first}” to “${f.last}”. The face is ${f.faceCredit}.${f.objectNote ? ` ${f.objectNote}` : ""}`;

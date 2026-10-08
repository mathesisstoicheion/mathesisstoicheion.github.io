/**
 * Every area of the site and its name from Greek culture.
 * Change names here only; the rest of the site reads from this file.
 *
 * `origin` explains the original place or thing; `fit` says why the name suits the area.
 * Both are shown in each area's header and on the About page, so they must stay factual.
 */
export type AreaId =
  | "home" | "library" | "reader" | "search" | "study" | "wiki" | "archaeology"
  | "census" | "map" | "forum" | "debates" | "treasury" | "downloads";

export interface Area {
  id: AreaId;
  name: string;        // "The Mouseion"
  greek?: string;      // the Greek word, where there is a natural one
  english: string;     // plain English subtitle
  door?: string;       // its one plain word in the menu and the phone bar, for the five doors (Learn, Read…)
  href: string;
  origin: string;
  fit: string;
  phase: number;       // build phase that delivers it
}

export const AREAS: Record<AreaId, Area> = {
  home: {
    id: "home", name: "The Propylaea", greek: "Προπύλαια", english: "Home", href: "/",
    origin: "The monumental gateway to the Acropolis of Athens, built in the 430s BC under Pericles.",
    fit: "Every visit starts at the gate.", phase: 1,
  },
  library: {
    id: "library", name: "The Mouseion", greek: "Μουσεῖον", english: "Library", door: "Read", href: "/library",
    origin: "The \"shrine of the Muses\" at Alexandria, a research institution founded under the first Ptolemies, closely linked to the great Library.",
    fit: "It holds the texts.", phase: 2,
  },
  reader: {
    id: "reader", name: "The Scroll", english: "Reader", href: "/read",
    origin: "Greek books were written on rolls of papyrus, unrolled with one hand and rolled up with the other as you read.",
    fit: "This is where you read.", phase: 2,
  },
  search: {
    id: "search", name: "The Oracle", english: "Search", href: "/search",
    origin: "At Delphi, Apollo's priestess, the Pythia, answered the questions of cities and individuals.",
    fit: "Ask a question, get an answer, and a clearer one than Delphi was remembered for.", phase: 4,
  },
  study: {
    id: "study", name: "The Academy", greek: "Ἀκαδήμεια", english: "Learn Greek", door: "Learn", href: "/academy",
    origin: "Plato's school, founded in the early 4th century BC in the grove of the hero Akademos outside Athens.",
    fit: "This is where you learn.", phase: 3,
  },
  wiki: {
    id: "wiki", name: "The Painted Stoa", greek: "Στοὰ Ποικίλη", english: "Wiki", door: "Explore", href: "/stoa",
    origin: "A colonnade on the Athenian Agora hung with great paintings of battles and myths. Zeno taught there, and his followers were named Stoics after it.",
    fit: "Stories, pictures and argument in one place.", phase: 7,
  },
  archaeology: {
    id: "archaeology", name: "The Kerameikos", greek: "Κεραμεικός", english: "Archaeology", href: "/stoa/kerameikos",
    origin: "Athens' potters' quarter and its main cemetery, one of the city's most important excavations.",
    fit: "Pots and graves are much of what archaeology has to work with.", phase: 7,
  },
  census: {
    id: "census", name: "The Census", english: "Most Mentioned", href: "/stoa/census",
    origin: "A counting.",
    fit: "Every word, person, god and place in the texts, counted.", phase: 7,
  },
  map: {
    id: "map", name: "The Periplus", greek: "Περίπλους", english: "Map", href: "/stoa/periplus",
    origin: "Ancient sailing guides that listed coasts, harbours and distances, such as the Periplus of the Erythraean Sea.",
    fit: "A guide to the places of the Greek world.", phase: 7,
  },
  forum: {
    id: "forum", name: "The Town Hall", english: "Forum", door: "Talk", href: "/town-hall",
    origin: "The community's meeting place.",
    fit: "Questions, answers and conversation.", phase: 8,
  },
  debates: {
    id: "debates", name: "The Pnyx", greek: "Πνύξ", english: "Debates", href: "/town-hall/pnyx",
    origin: "The hill in Athens where the citizen Assembly met to argue and vote.",
    fit: "Argue a motion, then vote on it.", phase: 8,
  },
  treasury: {
    id: "treasury", name: "The Treasury", greek: "θησαυρός", english: "My Library", door: "Mine", href: "/treasury",
    origin: "Cities built small treasuries at Delphi to hold their precious offerings. A thesauros is also a store of words.",
    fit: "Your notes, saved words and favourite passages.", phase: 5,
  },
  downloads: {
    id: "downloads", name: "The Scroll Case", english: "Downloads", href: "/downloads",
    origin: "Book rolls were stored and carried in cylindrical cases.",
    fit: "Pack the library to read offline.", phase: 2,
  },
};

/**
 * The five doors of the site, in order (Phase 11, owner's decision 2026-10-08): the header's menu on wide screens.
 * Each shows its plain word (`door`) with the area's Greek name beneath. Home is the site's name in the header.
 */
export const NAV: AreaId[] = ["study", "library", "wiki", "forum", "treasury"];

/**
 * The bar along the bottom of the screen on phones, left to right: the five doors with Search in the middle
 * (owner's decision 2026-10-08, replacing Library, Learn Greek, Search, Wiki, My Library). Talk, the forum, is a
 * button in the phone's header. `also` lists other paths that belong to a place.
 */
export const TABS: { id: AreaId; also?: string[] }[] = [
  { id: "study" },
  { id: "library", also: [AREAS.reader.href, "/work", "/author"] },
  { id: "search" },       // a button: opens the universal search (Quick search) rather than a page
  { id: "wiki" },
  { id: "treasury" },
];

/** A door's plain word, or the area's English name for places that are not doors. */
export const doorWord = (id: AreaId) => AREAS[id].door ?? AREAS[id].english;

export const SITE = {
  greek: "Μάθησις Στοιχείων",
  latin: "Mathesis Stoicheion",
  english: "Learning the letters",
  tagline: "Learn to read Ancient Greek, and meet the world that wrote it.",
};

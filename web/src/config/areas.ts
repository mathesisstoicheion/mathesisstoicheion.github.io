/**
 * The forum (the Agora and the Pnyx) is frozen and hidden (SPEC.md, owner 2026-10-18): its data is kept, nothing
 * links to it, and its pages say it is closed. Accounts and sign-in keep working. Set to true to open it again.
 */
export const FORUM_OPEN = false;

/**
 * Every area of the site and its name from Greek culture.
 * Change names here only; the rest of the site reads from this file.
 *
 * One name per room (the owner, 2026-10-20, review fixes slice 2), and one word for each of the rooms you move between
 * (Learn, Read, Explore, Mine). The printed page sets the English first and the Greek name after it, or under it in small
 * italic (redesign SPEC.md 3.5), in that order everywhere (the header, the menu, the home page, titles, paths, tab
 * titles); scripts/check-names.mjs keeps it so.
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
  english?: string;    // a plain English gloss, where it adds something (never a second name)
  door?: string;       // its one verb, for the rooms: what you do there (Learn, Read…), shown small on its own door page
  menu?: string;       // its plain word in the header's menu, for a place there that is not one of the doors
  parent?: AreaId;     // the door it stands inside, for places that are not doors themselves
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
    id: "reader", parent: "library", name: "The reader", href: "/read",
    origin: "Greek books were written on rolls of papyrus, unrolled with one hand and rolled up with the other as you read.",
    fit: "This is where you read.", phase: 2,
  },
  search: {
    id: "search", name: "The Oracle", greek: "Μαντεῖον", english: "Search", href: "/search",
    origin: "At Delphi, Apollo's priestess, the Pythia, answered the questions of cities and individuals.",
    fit: "Ask a question, get an answer, and a clearer one than Delphi was remembered for.", phase: 4,
  },
  study: {
    id: "study", name: "The Academy", greek: "Ἀκαδήμεια", english: "Learn Greek", door: "Learn", href: "/academy",
    origin: "Plato's school, founded in the early 4th century BC in the grove of the hero Akademos outside Athens.",
    fit: "This is where you learn.", phase: 3,
  },
  wiki: {
    id: "wiki", name: "The Painted Stoa", greek: "Στοὰ Ποικίλη", door: "Explore", href: "/stoa",
    origin: "A colonnade on the Athenian Agora hung with great paintings of battles and myths. Zeno taught there, and his followers were named Stoics after it.",
    fit: "Stories, pictures and argument in one place.", phase: 7,
  },
  archaeology: {
    id: "archaeology", parent: "wiki", name: "The Kerameikos", greek: "Κεραμεικός", english: "Archaeology", href: "/stoa/kerameikos",
    origin: "Athens' potters' quarter and its main cemetery, one of the city's most important excavations.",
    fit: "Pots and graves are much of what archaeology has to work with.", phase: 7,
  },
  census: {
    id: "census", parent: "wiki", name: "The Census", english: "Most Mentioned", href: "/stoa/census",
    origin: "A counting.",
    fit: "Every word, person, god and place in the texts, counted.", phase: 7,
  },
  map: {
    id: "map", parent: "wiki", name: "The Periplus", greek: "Περίπλους", english: "Map", href: "/stoa/periplus",
    origin: "Ancient sailing guides that listed coasts, harbours and distances, such as the Periplus of the Erythraean Sea.",
    fit: "A guide to the places of the Greek world.", phase: 7,
  },
  forum: {
    id: "forum", name: "The Agora", greek: "Ἀγορά", door: "Talk", href: "/town-hall",
    // the senses of ἀγορά as LSJ gives them (A, II, II.2)
    origin: "Ἀγορά, from ἀγείρω “to gather”: first an assembly of the people, then the place where it met, and later the market-place (LSJ).",
    fit: "Questions, answers and conversation.", phase: 8,
  },
  debates: {
    id: "debates", parent: "forum", name: "The Pnyx", greek: "Πνύξ", english: "Debates", href: "/town-hall/pnyx",
    origin: "The hill in Athens where the citizen Assembly met to argue and vote.",
    fit: "Argue a motion, then vote on it.", phase: 8,
  },
  treasury: {
    id: "treasury", name: "The Treasury", greek: "Θησαυρός", door: "Mine", href: "/treasury",
    origin: "Cities built small treasuries at Delphi to hold their precious offerings. A thesauros is also a store of words.",
    fit: "Your notes, marks and favourite passages.", phase: 5,
  },
  downloads: {
    id: "downloads", parent: "library", name: "The Scroll Case", english: "Downloads", href: "/downloads",
    origin: "Book rolls were stored and carried in cylindrical cases.",
    fit: "Pack the library to read offline.", phase: 2,
  },
};

/**
 * The five doors of the site, in order (Phase 11, owner's decision 2026-10-08): the header's menu on wide screens.
 * Each shows its plain word (`door`) with the area's Greek name beneath. Home is the site's name in the header.
 */
export const NAV: AreaId[] = (["study", "library", "wiki", "forum", "treasury"] as AreaId[]).filter((id) => shown(id));

/**
 * The header's menu on wide screens: the five doors, then the Oracle, so its research tools (concordance,
 * statistics, constructions) have a button of their own rather than only the quick search (owner's request, 2026-10-11).
 */
export const MENU: AreaId[] = [...NAV, "search"];

/**
 * The rooms of the site, in the order of the printed page's menu (redesign decision 8): Learn, Read, Explore, (Talk,) Mine.
 * The header shows them on a computer and the bar along the foot of the screen on a phone (decision 9). `also` lists other
 * paths that belong to a room (the reader, a work's and an author's pages belong to Read).
 */
export const TABS: { id: AreaId; also?: string[] }[] = ([
  { id: "study" },
  { id: "library", also: [AREAS.reader.href, "/work", "/author", "/downloads"] },
  { id: "wiki" },
  { id: "forum" },
  { id: "treasury", also: ["/account"] },
] as { id: AreaId; also?: string[] }[]).filter((t) => shown(t.id));

/** Whether an area is offered anywhere on the site: everything but the forum's two while it is closed (FORUM_OPEN). */
export function shown(id: AreaId): boolean {
  return FORUM_OPEN || (id !== "forum" && id !== "debates");
}

/** A place's English name: the same in the header, the menu, paths and headings (its Greek name goes before it). */
export const doorWord = (id: AreaId) => AREAS[id].name;
/** A place's name in the header's menu. */
export const menuWord = (id: AreaId) => AREAS[id].menu ?? doorWord(id);
/** A page's tab title for a place: its English name, then its Greek name ("The Academy · Ἀκαδήμεια"). */
export const areaTitle = (id: AreaId) => {
  const a = AREAS[id];
  return a.greek ? `${a.name} · ${a.greek}` : a.english ? `${a.name} · ${a.english}` : a.name;
};

/** One step of a page's path (PAGE-RULES.md, rule 4): its words, and where it leads (none for the page itself). */
export interface Step { label: string; href?: string }

/**
 * The path shown above a page's title (PAGE-RULES.md, rule 4): the room, then the places inside it down to the page, by
 * their one English name, e.g. THE PAINTED STOA › AUTHORS. A room's own page shows its name alone. `more` adds the page's
 * own steps after the area's.
 */
export function trail(id: AreaId, ...more: (Step | string)[]): Step[] {
  const chain: AreaId[] = [];
  for (let a: AreaId | undefined = id; a; a = AREAS[a].parent) chain.unshift(a);
  const door = chain[0];
  const steps: Step[] = [{ label: AREAS[door].name, href: AREAS[door].href }];
  const rest = more.map((m) => (typeof m === "string" ? { label: m } : m));
  // then each place inside the room (The Scroll Case)
  for (const a of chain.slice(1)) steps.push({ label: AREAS[a].name, href: AREAS[a].href });
  steps.push(...rest);
  return steps;
}

export const SITE = {
  greek: "Μάθησις Στοιχείων",
  latin: "Mathesis Stoicheion",
  english: "Learning the letters",
  tagline: "Learn to read Ancient Greek, and meet the world that wrote it.",
};

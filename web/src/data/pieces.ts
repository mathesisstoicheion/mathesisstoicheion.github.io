/**
 * Every page's own piece of ancient sculpture (DESIGN.md: "A piece on every page"; the owner, 2026-10-16: "Every page
 * needs its own dedicated piece"). Each stands in a niche cut into the wall and is lit by the torch
 * (components/art/PagePiece.tsx, lib/art/piece.ts). All are from The Metropolitan Museum of Art's Open Access collection
 * (CC0); their credits are in data/piece-images.json (fetched by scripts/fetch-images.ts from the Met's own records),
 * their sizes and shapes in data/piece-shapes.json (written by pipeline/pieces.py).
 *
 * `why`, where given, says in a few words why the piece belongs to its page; it states only what the museum's record or
 * a named ancient source says.
 */
import credits from "./piece-images.json";
import shapes from "./piece-shapes.json";
import type { Material } from "@/lib/art/piece";

export interface PieceCredit {
  file: string; width: number; height: number; alt: string; title: string; date: string; place: string; creator: string;
  licence: string; licenceUrl: string; source: string; sourceName: string;
}
export interface PieceShape { w: number; h: number; form: "round" | "slab" | "relief" | "lathe" | "coin"; material: Material }

export const PIECE_CREDITS = credits as Record<string, PieceCredit>;
export const PIECE_SHAPES = shapes as Record<string, PieceShape>;

interface PageSpec { piece: string; why?: string }

/** Pages, most particular first: a [name] stands for any one word of the address. */
const PAGES: [string, PageSpec][] = [
  ["/library/private", { piece: "togatus" }],
  // every author's page: a hand holding a book roll (a portrait would seem to be the author's own)
  ["/library/author", { piece: "hand-with-scroll" }],
  ["/library", { piece: "seated-muse", why: "The Mouseion was the seat of the Muses." }],
  ["/author/[id]", { piece: "hand-with-scroll" }],
  ["/work/[id]", { piece: "seated-man" }],
  ["/search", { piece: "apollo-bronze", why: "Delphi was Apollo’s oracle." }],
  // the learn-by-reading path, its list and its steps
  ["/academy/reading/[id]", { piece: "teacher-and-pupil" }],
  ["/academy/reading/letters", { piece: "teacher-and-pupil" }],
  ["/academy/reading", { piece: "teacher-and-pupil" }],
  ["/academy/lesson/[id]/practice", { piece: "boxer-statuette" }],
  ["/academy/lesson/[id]/test", { piece: "nike-relief", why: "Nike is Victory." }],
  ["/academy/lesson/[id]", { piece: "girl-with-doves" }],
  ["/academy/checkpoint/[id]", { piece: "bronze-herm", why: "Herms stood at boundaries and by the roads." }],
  ["/academy/guide/[id]", { piece: "hermes-bronze", why: "Hermes was the guide of travellers." }],
  ["/academy/alphabet", { piece: "decree-fragment", why: "Athenian letters, cut in rows and columns." }],
  ["/academy/practice", { piece: "diskos-thrower", why: "ἄσκησις was first an athlete’s training." }],
  ["/academy/review", { piece: "muse-head", why: "The Muses were daughters of Memory, Mnemosyne (Hesiod, Theogony 53–54)." }],
  ["/academy/studio", { piece: "harp-player" }],
  ["/academy/tables", { piece: "tribute-list", why: "A table cut in stone: Athens’ tribute lists." }],
  ["/academy/today", { piece: "athletic-prizes" }],
  ["/academy/vocabulary", { piece: "arsinoe-base" }],
  ["/academy", { piece: "philosopher-head" }],
  ["/account", { piece: "strategos-head" }],
  ["/credits", { piece: "hero-relief" }],
  ["/downloads", { piece: "hermes-seated" }],
  ["/guide", { piece: "hermes-marble", why: "Hermes was the guide of travellers." }],
  ["/about", { piece: "eukleia-stele" }],
  ["/stoa/authors", { piece: "portrait-bust" }],
  ["/stoa/census", { piece: "herakles-bronze" }],
  ["/stoa/editions", { piece: "eirene", why: "A Roman copy of a lost Greek bronze by Kephisodotos." }],
  ["/stoa/eras", { piece: "kouros" }],
  ["/stoa/kerameikos", { piece: "funerary-lekythos", why: "Marble vases like this stood over graves in Attica." }],
  ["/stoa/manuscripts", { piece: "herodotos-bust", why: "Herodotus’ name is carved on the front of the bust." }],
  ["/stoa/periplus", { piece: "neptune-bronze" }],
  ["/stoa/lyre", { piece: "harp-player" }],
  ["/stoa/variants", { piece: "diadoumenos-terracotta", why: "Polykleitos’ bronze Diadoumenos is lost; it lives on in copies that differ." }],
  ["/stoa/[slug]", { piece: "banquet-relief" }],
  ["/stoa", { piece: "chrysippos-head", why: "Chrysippus was the third head of the Stoic school." }],
  ["/town-hall/pnyx/debate", { piece: "boy-orator" }],
  ["/town-hall/pnyx", { piece: "demosthenes-head", why: "Demosthenes addressed the Athenian Assembly, which met on the Pnyx." }],
  ["/town-hall/thread", { piece: "woman-stele" }],
  ["/town-hall/new", { piece: "teacher-and-pupil" }],
  ["/town-hall/member", { piece: "elderly-man" }],
  ["/town-hall/moderation", { piece: "apollo-head" }],
  ["/town-hall", { piece: "family-stele" }],
  ["/treasury/translations", { piece: "bilingual-plaque", why: "One text in two languages, Latin and Greek." }],
  ["/treasury/word", { piece: "red-base" }],
  ["/treasury", { piece: "athena-votive" }],
  ["/admin/translations", { piece: "athena-torso" }],
];
/** The page that has not survived (the 404 page): a head that has outlived the rest of its stele. */
export const LOST_PAGE: PageSpec = { piece: "stele-youth-head", why: "The head is all that survives of its grave stele." };

/** The pieces that stand on some page (the credits list these). */
export const USED_PIECES = [...new Set([...PAGES.map(([, s]) => s.piece), LOST_PAGE.piece])];

const RX = PAGES.map(([p, spec]) => [new RegExp("^" + p.replace(/\[[a-z]+\]/g, "[^/]+") + "$"), spec] as const);

/** The piece for this page's address (none for the home page and the reader, which have their own). */
export function pieceFor(path: string): PageSpec | null {
  const p = path.replace(/\/+$/, "") || "/";
  for (const [rx, spec] of RX) if (rx.test(p)) return PIECE_SHAPES[spec.piece] ? spec : null;
  return null;
}

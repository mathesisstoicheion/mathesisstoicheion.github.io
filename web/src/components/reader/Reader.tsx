"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, memo, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  loadCatalog, greekEditions, translations, describe, versionOf, OUT_OF_STEP,
  type CatalogIndex, type CatText, type CatWork, type CollectionId,
} from "@/lib/catalog";
import { getXml, type From } from "@/lib/texts/source";
import { readerBusy } from "@/lib/texts/priority";
import { parseInWorker, type Parsed } from "@/lib/tei/client";
import { schemeFor } from "@/lib/tei/versification";
import { alignChunk, untranslated, type Row } from "@/lib/tei/align";
import { findRef, chunkOf } from "@/lib/tei/refs";
import type { EnglishHit, FindHit } from "@/lib/find";
import type { FindMarks } from "./FindPanel";
import type { SentenceMarks } from "./SentencePanel";
import type { NewItem } from "@/lib/notebooks";
import { compareAll, readingHunks, wordKey, type RowDiff, type Strictness } from "@/lib/tei/compare";
import { getPosition, savePosition } from "@/lib/position";
import { firstOpening, markOpened } from "@/lib/opened";
import { useSettings, LIMITS, type Columns, scrollBehavior } from "@/lib/settings";
import { inRem, shownGreekSize } from "@/lib/greekSize";
import { verseSizeWhere } from "@/lib/verseFit";
import { useUI } from "@/lib/ui";
import { AREAS, SITE, trail } from "@/config/areas";
import { Blocks } from "./Blocks";
import WordPanel, { type WordContext } from "./WordPanel";
import { norm } from "@/lib/lookup/words";
import { useMarks, cmp, type Mark, type Colour, type Point } from "@/lib/annotations";
import type { Block } from "@/lib/tei/types";
import PassageToolbar, { type Selection } from "./PassageToolbar";
import NoteEditor from "./NoteEditor";
import type { ShareData } from "./ShareDialog";
import OrigTitle from "@/components/library/OrigTitle";
import { greekKey } from "@/lib/search/codec";
import PanelGuard from "@/components/PanelGuard";
import type { EchoMarks, EchoQuery, EchoTarget } from "./EchoesPanel";
import MetreBar from "./MetreBar";
import ReaderCover from "./ReaderCover";
import ReaderTitle from "./ReaderTitle";
import PageHead from "@/components/PageHead";
import ScrollMarkers, { type MarkerItem } from "./ScrollMarkers";
import Icon from "@/components/Icon";
import { useFloat } from "@/lib/float";
import { ASK_KEY } from "@/lib/community/ask";
import { lastOtherPage } from "@/lib/resume";
import { isMine, mineBook, mineId, mineParsed, type MineVersion } from "@/lib/mine";
import { useIsModerator, useMineBook, type MineState } from "@/lib/mine-load";
import { workOf } from "@/lib/private-translations";
import { PRIVATE_TRANSLATIONS } from "@/config/admin";
import { metreIndex, publishedFor, loadLengths } from "@/lib/metre/load";
import { renderPassages, type LineRender } from "@/lib/metre/render";
import { lineHash, type MetreIndex } from "@/lib/metre/text";
import { playLine as playLineRhythm } from "@/lib/metre/beat";
import { loadWordPack } from "@/lib/lookup/words";
import { caseOf } from "@/lib/lookup/postag";
import { placeAnalyses, positionsFor } from "@/lib/lookup/placed";
import { lookupPlace } from "@/lib/lookup/placement";
import { headerVisible, holdFoot, scrollBelowHeader, showFoot } from "@/lib/header";
import { buzz } from "@/lib/haptics";
import ReaderBar, { AaStudy, GotoMenu, Where } from "./ReaderBar";
import AaMenu from "./AaMenu";
import StudyMenu, { type StudyPanel } from "./StudyMenu";
import { rangeLabel } from "./refs";
import type { Back } from "./Panel";
import styles from "./Reader.module.css";

// The panels open only when asked for, so each is fetched then, not with the reader: the page comes up sooner,
// and the Talk panel's connection to the forum (the Supabase library) is not loaded for every reader.
/** Where the look-up is set (Reader's placeWord; the one rule is lookupPlace): a window floating over the right margin (or, with a side
 *  panel open, in the panel's own box), at this place across the screen and this wide, which holds its place while the text scrolls; or as a sheet that rises no
 *  higher than this many pixels (so that it stops below the line), or with no limit (null) for a word that is not in the
 *  text. */
type WordAt = { note: { left: number; width: number } } | { sheet: number | null };
const FindPanel = dynamic(() => import("./FindPanel"), { ssr: false });
const ComparePanel = dynamic(() => import("./ComparePanel"), { ssr: false });
const SentencePanel = dynamic(() => import("./SentencePanel"), { ssr: false });
const NotebookPicker = dynamic(() => import("@/components/notebook/NotebookPicker"), { ssr: false });
const ShareDialog = dynamic(() => import("./ShareDialog"), { ssr: false });
const WorkPicker = dynamic(() => import("./WorkPicker"), { ssr: false });
const VocabPanel = dynamic(() => import("./VocabPanel"), { ssr: false });
const PlacesPanel = dynamic(() => import("./PlacesPanel"), { ssr: false });
const TalkPanel = dynamic(() => import("./TalkPanel"), { ssr: false });
const ManuscriptPanel = dynamic(() => import("./ManuscriptPanel"), { ssr: false });
const Listen = dynamic(() => import("./Listen"), { ssr: false });
const EchoesPanel = dynamic(() => import("./EchoesPanel"), { ssr: false });
const MineDialog = dynamic(() => import("./MineDialog"), { ssr: false });
import BackToTop from "@/components/BackToTop";

type Load = { state: "loading"; step: string } | { state: "error"; message: string } | { state: "ready" };
/** The small menu open now, if any: from the foot bar of one book, or the top bar of each of two books (Aa, Study, and Go to in the foot bar's middle). */
type Dropped = "aa" | "study" | "goto";

type Src = From | "private";
/** A book's texts as loaded and parsed, or why they could not be. */
type Loaded = { key: string; parsed?: Parsed; from?: { grc: Src; tr: Src | null }; error?: string };
const FROM_TEXT: Record<Src, string> = { github: "GitHub", browser: "your browser storage", folder: "your folder", private: "your private collection" };

function pickEdition(w: CatWork, ed: string | null, remembered: string | null): CatText | undefined {
  const eds = greekEditions(w);
  const all = eds.length ? eds : w.texts.filter((t) => t.kind === "edition");
  return all.find((t) => versionOf(t.urn) === ed) ?? all.find((t) => versionOf(t.urn) === remembered) ?? all.find((t) => t.col === "perseus") ?? all[0];
}
function pickTranslation(w: CatWork, tr: string | null, remembered: string | null | undefined): CatText | null {
  if (tr === "none") return null;
  const all = translations(w);
  if (!all.length) return null;
  if (tr) return all.find((t) => versionOf(t.urn) === tr) ?? all[0];
  if (remembered === null) return null;
  return all.find((t) => versionOf(t.urn) === remembered) ?? all[0];
}

const NO_MARKS: Mark[] = [];
const NO_KEYS: ReadonlySet<string> = new Set();
/** The collections the library's texts come from, as the footer names them. */
const COLLECTION_NAME: Record<CollectionId, string> = { perseus: "the Perseus Digital Library", first1k: "the First Thousand Years of Greek project" };
const blockText = (bs: Block[]) => bs.map((b) => b.c.map((x) => (typeof x === "string" ? x : "")).join("")).join(" ").replace(/\s+/g, " ").trim();

const MARK_ICON: Record<string, React.ReactNode> = {
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  favourite: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  note: <path d="M4 4h16v12H8l-4 4z" />,
  xref: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
};

/** What the margin shows for a passage: the whole reference, its number in its book ("580", not "1.580") when the page is one book, or the verse's number
 *  (the whole reference stays in aria-label, data-row and every jump, find, mark and link; the quiet desk, ticket 08, the owner, 2026-10-30). */
const marginNo = (row: Row, verses: boolean, inBook: boolean) => (verses ? row.key.split(".").pop()! : inBook ? row.greek[0].ref.slice(1).join(".") : row.key);

/** One passage row: reference and your marks in the margin, Greek, translation, and any notes. */
const RowView = memo(function RowView({ row, marks, openNote, onCloseNote, translit, metre, verses, inBook, tryFirst, trGreek, english }: {
  row: Row; marks: Mark[]; openNote: string | null; onCloseNote: () => void; translit: boolean; metre: Map<string, (LineRender | null)[]> | null;
  /** a text cited by verse: the margin shows only the verse number, as in a printed Bible (the chapter is in the bar) */
  verses: boolean;
  /** the page is one book of a work cited by book and passage: the margin shows the passage's number in its book ("580", not "1.580");
   *  the title line and the page's name say which book (the quiet desk, ticket 08, the owner, 2026-10-30) */
  inBook: boolean;
  /** "Try it first": the translation stays hidden until it is tapped */
  tryFirst: boolean;
  /** the second column is another Greek edition, being compared with this one */
  trGreek: boolean;
  /** the Greek stands alone and the book has a translation: this passage offers "Show the English" (opened or not), and the
   *  translation's credit; null when it does not (the quiet desk, ticket 07, the owner, 2026-10-29) */
  english: { open: boolean; credit: string; onToggle: () => void } | null;
}) {
  const notes = marks.filter((m) => m.kind === "note");
  const [shown, setShown] = useState(false);
  const veiled = tryFirst && !shown && row.trans.length > 0;
  const front = /(^|\.)0$/.test(row.key);
  // what the margin shows: the whole reference, or the shorter number; the whole one stays in aria-label and data-row, and in every jump, find, mark and link
  const no = marginNo(row, verses, inBook);
  return (
    <section className={styles.row} data-key={row.key}>
      <div className={styles.ref}>
        {/* Perseus's line 0 (only the first speaker's name, before line 1) has no number to show (review fix list, slice 8) */}
        {front
          ? <button type="button" data-row={row.key} className={styles.front} title="Actions for the heading before the first line" aria-label="Before the first line" />
          : <button type="button" data-row={row.key} title="Actions for this passage" aria-label={no !== row.key ? row.key : undefined}>{no}</button>}
        <span className={styles.grip} draggable data-drag={row.key} data-tip="Drag into a note to quote" title="Drag into a note to quote this passage with its citation" aria-hidden="true" />
        {marks.some((m) => m.kind !== "highlight") && (
          <span className={styles.marks}>
            {marks.filter((m) => m.kind !== "highlight").map((m) => (
              <button key={m.id} type="button" className={styles[`mk-${m.kind}`]} data-mark={m.id} title={m.kind === "note" ? (m.text || "Note") : m.kind === "xref" ? `Cross-reference to ${m.link?.label ?? "another passage"} (click to open it beside this one)` : m.kind === "bookmark" ? "Bookmark (click to remove)" : "Favourite (click to remove)"}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{MARK_ICON[m.kind]}</svg>
              </button>
            ))}
          </span>
        )}
      </div>
      <div className={styles.grc} lang="grc">
        {/* the margin shows the passage's number: the start of its first part does not say it again */}
        {row.greek.map((u, i) => <div key={u.ref.join(".")} data-u={u.ref.join(".")}><Blocks blocks={u.blocks} greek keyPrefix={u.ref.join(".")} translit={translit} metre={metre?.get(u.ref.join("."))} margin={i === 0 ? row.key : undefined} /></div>)}
        {/* Greek alone: the English of this passage alone, one tap away, under its Greek and in the Greek's column. It is in
            English (no word of it opens the Greek look-up) and so is set apart from the Greek by lang. */}
        {english && (
          <div className={styles.oneBox} lang="en">
            <button type="button" className={`text-btn ${styles.oneBtn}`} aria-expanded={english.open} onClick={english.onToggle}>{english.open ? "Hide the English" : "Show the English"}</button>
            {english.open && (
              <div className={styles.one} data-one="">
                {row.trans.length
                  ? <Blocks blocks={row.trans} greek={false} keyPrefix={`o${row.key}`} margin={row.key} />
                  : row.cont ? <span className={styles.untr}>The English for these lines begins on the page before.</span>
                  : <span className={styles.untr} data-untranslated=""><b>Not translated.</b> This translation leaves this passage out.</span>}
                <p className={styles.oneCredit} data-silent="">{english.credit}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.tr} data-tr="" data-veiled={veiled || undefined} data-greek={trGreek || undefined} lang={trGreek ? "grc" : undefined}>
        {veiled && <button type="button" className={styles.reveal} onClick={() => setShown(true)}>Tap to see the translation</button>}
        {row.trans.length
          ? <Blocks blocks={row.trans} greek={trGreek} keyPrefix={`t${row.key}`} translit={trGreek ? translit : undefined} margin={row.key} />
          : trGreek ? <span className={styles.none} aria-label="Not in the other edition">—</span>
          : row.cont ? <span className={styles.untr}>The English for these lines begins on the page before.</span>
          : <span className={styles.untr} data-untranslated=""><b>Not translated.</b> This translation leaves this passage out.</span>}
      </div>
      {notes.length > 0 && (
        <div className={styles.notes}>
          {notes.map((m) => <NoteEditor key={`${m.id}-${openNote === m.id}`} mark={m} startOpen={openNote === m.id} onClose={onCloseNote} />)}
        </div>
      )}
    </section>
  );
});

/** (a window opened from a row of Study says so, with `true`, and has "Back to Study": the quiet desk, ticket 09, the owner, 2026-10-30) */
export interface PaneProps { pane: 1 | 2; split: boolean; onOpenSecond: (fromStudy?: boolean) => void; onOpenMine: (fromStudy?: boolean) => void }

/**
 * Where the reader keeps what it shows. On the reader's page that is the address bar (/read?w=…);
 * in the floating window it is the window's own state (lib/float.ts). Both use the same keys.
 */
export interface ReaderNav {
  params: URLSearchParams;
  go: (q: URLSearchParams, how?: "replace" | "push") => void;
  floating: boolean;
  /** the passage now at the top of the first book (the floating window remembers it) */
  onPosition?: (at: string) => void;
}
export const ReaderNavContext = createContext<ReaderNav | null>(null);
/** The passage at the top of each pane of the reader's page (for floating both books at once). */
const paneTops: Record<1 | 2, string | null> = { 1: null, 2: null };
const useNav = () => useContext(ReaderNavContext)!;

/** One reading pane. With two panes, pane 2 uses the same query keys with a "2" on the end. */
function ReaderPane({ pane, split, onOpenSecond, onOpenMine }: PaneProps) {
  const nav = useNav();
  const params = nav.params;
  const floating = nav.floating;
  const contained = split || floating;   // the pane scrolls inside its own box, not the page
  // one book on the reader's page: its own bar along the top of the window and the book's title page beneath it
  const single = !contained;
  const P = (k: string) => params.get(pane === 1 ? k : `${k}2`);
  const rootRef = useRef<HTMLDivElement>(null);
  const root = () => rootRef.current ?? document;
  const active = useUI((s) => s.activePane === pane);
  const pendingXref = useUI((s) => s.pendingXref);
  const router = useRouter();
  const toast = useUI((s) => s.showToast);
  const setSettings = useSettings((s) => s.set);
  // which columns show is the reader's saved choice (Aa): a book opens with its Greek alone unless "Both" was chosen (the quiet
  // desk, ticket 07, the owner, 2026-10-29)
  const savedColumns = useSettings((s) => s.columns);
  const translit = useSettings((s) => s.translit);
  const cases = useSettings((s) => s.cases);
  const metreOn = useSettings((s) => s.metre);
  const tryFirst = useSettings((s) => s.tryFirst);
  const [vocabOpen, setVocabOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [msOpen, setMsOpen] = useState(false);
  const [listenOpen, setListenOpen] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [findQ, setFindQ] = useState("");
  const [findMarks, setFindMarks] = useState<FindMarks | null>(null);
  // how a sentence is built: the word asked about (its passage and place there), and its words to mark on the page
  const [sentenceAt, setSentenceAt] = useState<Point | null>(null);
  const [synMarks, setSynMarks] = useState<SentenceMarks | null>(null);
  // "Add to a notebook": what is being added, while the window is open
  const [nbPick, setNbPick] = useState<{ items: NewItem[]; what: string } | null>(null);
  const [topRow, setTopRow] = useState<string | null>(null);
  const [placeMarks, setPlaceMarks] = useState<Map<string, Set<string>> | null>(null);

  const workId = P("w") ?? "";
  const at = P("at");
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [result, setResult] = useState<Loaded | null>(null);
  const [step, setStep] = useState<{ key: string; text: string } | null>(null);
  // `more`: opened in the second layer ("More about it"), as on the way back from the sentence or Echoes
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null; at: Point | null; more?: boolean } | null>(null);
  // the word whose look-up opened the sentence panel or Echoes, for their "‹ Back to μῆνις" (the quiet desk, back routes, the
  // owner, 2026-10-29): where it was tapped and the name to show; empty when they were opened some other way (a row of Study)
  const [cameFrom, setCameFrom] = useState<{ to: "sentence" | "echoes"; at: Point; label: string } | null>(null);
  const [wordAt, setWordAt] = useState<WordAt | null>(null);
  const [echo, setEcho] = useState<EchoQuery | null>(null);
  const [echoMarks, setEchoMarks] = useState<EchoMarks | null>(null);
  const [sel, setSel] = useState<Selection | null>(null);
  const [share, setShare] = useState<ShareData | null>(null);
  const [openNote, setOpenNote] = useState<string | null>(null);
  // one small menu at a time (Drop.tsx); each has its own id for its button's aria-controls
  const [drop, setDrop] = useState<Dropped | null>(null);
  const uid = useId();
  const dropOf = (d: Dropped) => ({ id: `${uid}-${d}`, open: drop === d, onOpen: (o: boolean) => setDrop((cur) => (o ? d : cur === d ? null : cur)) });
  const allMarks = useMarks((s) => s.byWork[workId]) ?? NO_MARKS;
  useEffect(() => { if (workId) useMarks.getState().load(workId); }, [workId]);
  const [help, setHelp] = useState(false);
  const [retry, setRetry] = useState(0);
  const gotoRef = useRef<HTMLInputElement>(null);
  // the key (g) that asks for the Go to field: counted, so that each press takes the keyboard to it (ReaderBar.tsx, Where)
  const [gotoWant, setGotoWant] = useState(0);
  // the panel that was opened from a row of the Study menu, if one is open: it shows "Back to Study" (the owner's rule, 2026-10-30; a panel opened any
  // other way, by a key or from the look-up, shows none)
  const [studyFor, setStudyFor] = useState<StudyPanel | null>(null);
  // the row of Study the keyboard goes back to once "Back to Study" has opened the menu again
  const [studyRow, setStudyRow] = useState<string | null>(null);
  /** Open Find in this text (or, if open, go back to its box). */
  const openFind = (fromStudy = false) => {
    setFindOpen(true); setWord(null); setEcho(null); setVocabOpen(false); setPlacesOpen(false); setTalkOpen(false); setMsOpen(false);
    setStudyFor(fromStudy ? "find" : null);
    // already open: back to its box
    requestAnimationFrame(() => (rootRef.current ?? document).querySelector<HTMLInputElement>("[aria-label='Find in this text'] input")?.focus());
  };
  const openFindRef = useRef(openFind);
  useEffect(() => { openFindRef.current = openFind; });

  useEffect(() => { loadCatalog().then(setIdx, (e: Error) => setCatalogError(e.message)); }, []);

  // where the reader stopped last time, read once when a work opens
  const [snap, setSnap] = useState<{ work: string; pos: ReturnType<typeof getPosition> } | null>(null);
  if (idx && snap?.work !== workId) setSnap({ work: workId, pos: getPosition(workId) });
  const remembered = snap?.work === workId ? snap.pos : null;
  // the title page is for a book's first opening on this device (lib/opened.ts; the quiet desk, ticket 08, the owner, 2026-10-30): decided
  // once, when this pane first shows the book, so that it does not go while the reader is on it, though the book is marked opened as its
  // text arrives (below). Every other time the book opens on the one-line title.
  const [opening, setOpening] = useState<{ work: string; first: boolean } | null>(null);
  if (workId && opening?.work !== workId) setOpening({ work: workId, first: firstOpening(workId) });
  const showCover = single && opening?.work === workId && opening.first;

  // a book of the private collection (lib/mine.ts) comes from the database, not the catalogue
  const mine = useMineBook(workId, retry);
  const mineDoc = mine.state === "ready" ? mine.doc : null;
  const mineBk = useMemo(() => (mineDoc ? mineBook(mineDoc) : null), [mineDoc]);
  const isPrivate = isMine(workId);
  const moderator = useIsModerator();
  const work = isPrivate ? mineBk?.work : idx?.work.get(workId);
  const author = isPrivate ? mineBk?.author : idx?.authorOf.get(workId);
  // the word analyses (GLAUx) are per work: a private book uses those of the work it is a text of, if it names one
  const lexWork = mineDoc ? workOf(mineDoc.urn)?.work ?? workId : workId;
  // the browser tab names the book being read ("Iliad · Homer"), on the reader's own page (not the floating window)
  const tabTitle = work && !floating && pane === 1 ? `${work.title}${author ? ` · ${author.name}` : ""} · ${SITE.latin}` : null;
  useEffect(() => {
    if (!tabTitle) return;
    const before = document.title;
    const set = () => { if (document.title !== tabTitle) document.title = tabTitle; };
    set();
    // Next.js writes the page's own <title> when its metadata arrives, which can be after this: put the book back
    const watch = new MutationObserver(set);
    watch.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => { watch.disconnect(); if (document.title === tabTitle) document.title = before; };
  }, [tabTitle]);
  const grcText = work ? pickEdition(work, P("ed"), remembered?.ed ?? null) : undefined;
  const trText = work ? pickTranslation(work, P("tr"), remembered ? remembered.tr : undefined) : null;
  // comparing two Greek editions (?cmp=the other's version): the second stands where the translation would
  const editions = work ? (greekEditions(work).length ? greekEditions(work) : work.texts.filter((t) => t.kind === "edition")) : [];
  const cmpText = editions.find((t) => versionOf(t.urn) === P("cmp") && t.urn !== grcText?.urn) ?? null;
  const strict: Strictness = P("cmpx") === "1" ? "spelling" : "readings";
  const second = cmpText ?? trText;
  // with no translation, only the Greek can show (an "English only" choice would leave the page empty)
  const columns: Columns = !trText ? "greek" : savedColumns;
  // "Show the English" (Greek alone, a translation, no comparison): the passages whose English is open now, for this book, this
  // translation and these columns; it starts over when any of them changes, and is not kept across a reload
  const oneScope = `${workId}|${trText?.urn ?? ""}|${columns}`;
  const [oneOpen, setOneOpen] = useState<{ scope: string; keys: ReadonlySet<string> }>({ scope: "", keys: new Set() });
  const openOnes = oneOpen.scope === oneScope ? oneOpen.keys : NO_KEYS;
  const toggleOne = (key: string) => setOneOpen((cur) => {
    const keys = new Set(cur.scope === oneScope ? cur.keys : NO_KEYS);
    if (!keys.delete(key)) keys.add(key);
    return { scope: oneScope, keys };
  });
  // Listen, with the Greek alone, opens the English of the passage it is reading and closes it when it moves on; what the reader opened by hand
  // (openOnes) it never closes (the quiet desk, the reader's tools, the owner, 2026-10-30)
  const [listenOne, setListenOne] = useState<string | null>(null);
  // the translation's own credit, as the editions line names it ("Murray, 1924") and the collection it comes from, under the
  // site's licence (Footer.tsx); a private book names only its own description
  const trCredit = trText && work ? `${describe(trText, work.texts)}${trText.urn.startsWith("mine:") ? "" : `, from ${COLLECTION_NAME[trText.col]}. CC BY-SA 4.0.`}` : "";
  const pk = (x: string) => (pane === 1 ? x : `${x}2`);
  const cite = `${author?.name ?? ""}, ${work?.title ?? ""}`;
  const loadKey = grcText && snap?.work === workId ? `${grcText.urn}|${second?.urn ?? ""}|${retry}` : null;

  // ------------------------------------------------------------ load and parse the texts
  useEffect(() => {
    if (!idx || !grcText || !loadKey) return;
    if (isPrivate) return;   // made from the database's document, below
    let stale = false;
    const release = readerBusy();   // a Scroll Case download waits until the text is up
    (async () => {
      try {
        // on a slow connection, show how much of the Greek has arrived (only when the percentage moves)
        let shown = -1;
        const progress = (got: number, total: number) => {
          const pc = Math.min(99, Math.floor((got / total) * 100));
          if (stale || pc === shown) return;
          shown = pc;
          setStep({ key: loadKey, text: `Fetching the Greek text… ${pc}%` });
        };
        const [g, t] = await Promise.all([getXml(idx, grcText, progress), second ? getXml(idx, second).catch(() => null) : null]);
        if (stale) return;
        setStep({ key: loadKey, text: "Preparing the text…" });
        const p = await parseInWorker(g.xml, t?.xml ?? null, cmpText || !work || !second ? undefined : schemeFor(work.id, second), second?.urn);
        if (stale) return;
        setResult({ key: loadKey, parsed: p, from: { grc: g.from, tr: t?.from ?? null } });
        if (second && !t) toast(cmpText ? "The other edition could not be loaded." : "The translation could not be loaded; showing the Greek only.");
      } catch (e) {
        if (!stale) setResult({ key: loadKey, error: (e as Error).message });
      } finally { release(); }
    })();
    return () => { stale = true; release(); };
    // grcText and the second text are identified by loadKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, loadKey, toast, isPrivate]);
  // a book of the private collection is made from its document at once (lib/mine.ts): nothing to fetch or parse
  const secondUrn = second?.urn;
  const minePart = useMemo<Loaded | null>(() => {
    if (!isPrivate || !mineDoc || !loadKey) return null;
    const v = secondUrn ? (versionOf(secondUrn) as MineVersion) : null;
    return { key: loadKey, parsed: mineParsed(mineDoc, v), from: { grc: "private", tr: v ? "private" : null } };
  }, [isPrivate, mineDoc, loadKey, secondUrn]);

  const current = minePart ?? (result && result.key === loadKey ? result : null);
  const load: Load = catalogError ? { state: "error", message: catalogError }
    : !current ? { state: "loading", step: !idx ? "Opening the catalogue…" : step?.key === loadKey ? step.text : "Fetching the Greek text…" }
    : current.error ? { state: "error", message: current.error } : { state: "ready" };
  const parsed = current?.parsed ?? null;
  const from = current?.from ?? null;
  // the book counts as opened once its text is up, and not before: one that did not load has not been read (the page that shows
  // the title page or the one-line title is the one-book reader's)
  useEffect(() => { if (single && load.state === "ready") markOpened(workId); }, [single, load.state, workId]);
  const doc = parsed?.doc;
  // the New Testament and the Septuagint are cited by verse: short units that read best as running text
  const verses = doc?.levels.at(-1) === "verse";

  // ------------------------------------------------------------ which page, and which passage to show
  const target = at ?? remembered?.at ?? null;
  const placed = parsed?.placed ?? null;
  // a search hit in the translation (?tu=its passage number there): open beside the Greek it translates
  const tu = P("tu");
  const tuAt = useMemo(() => {
    if (tu === null || !placed) return undefined;
    let best: number | undefined;
    for (const p of placed) { if (p.src > Number(tu)) break; best = p.at; }
    return best;
  }, [tu, placed]);
  const startUnit = tuAt !== undefined ? tuAt : doc && target ? Math.max(0, findRef(doc, target)) : 0;
  const chunk = doc ? chunkOf(doc, startUnit) : 0;
  // a link to a passage this text does not have opens at the start: say so, rather than silently
  const missingAt = doc && at && tuAt === undefined && findRef(doc, at) < 0 ? at : null;
  useEffect(() => {
    if (missingAt && doc) toast(`No passage "${missingAt}" in this text, so it opens at the start. Try a reference like ${doc.units[Math.min(40, doc.units.length - 1)].ref.join(".")}.`);
  }, [missingAt, doc, toast]);
  const unitKeys = useMemo(() => new Set(doc?.units.map((u) => u.ref.join(".")) ?? []), [doc]);
  const pageKeys = useMemo(() => new Set(doc && doc.chunks[chunk] ? doc.units.slice(doc.chunks[chunk].first, doc.chunks[chunk].last + 1).map((u) => u.ref.join(".")) : []), [doc, chunk]);
  const rows = useMemo(() => (doc && doc.chunks[chunk] ? alignChunk(doc, doc.chunks[chunk], placed) : []), [doc, chunk, placed]);
  // a page of poetry (its Greek set in lines of verse): on a wide screen the Greek takes more of the width, so that a line is
  // not broken (Reader.module.css)
  const poetry = useMemo(() => rows.some((r) => r.greek.some((u) => u.blocks.some((b) => b.t === "l"))), [rows]);
  // a page that is one book of a work cited by book and passage (two or more citation levels, and every passage on the page in the same
  // book): the margin shows each passage's number in its book ("1", "580"), not the whole reference ("1.1", "1.580"); the one-line title and
  // the page's name say which book. The whole reference stays in aria-label, data-row and every jump, find, mark and link (the quiet desk,
  // ticket 08, the owner, 2026-10-30)
  const inBook = useMemo(() => !!doc && doc.levels.length >= 2 && rows.length > 0 && rows.every((r) => r.greek.every((u) => u.ref[0] === rows[0].greek[0].ref[0])), [doc, rows]);
  // how many figures the widest number in the margin has (a full stop counts for less), and never fewer than three: on a phone the number's
  // column is as wide as that needs, so that "92.1" or "1415" does not wrap (Reader.module.css, --num-n)
  const numFigures = useMemo(() => Math.max(3, Math.ceil(Math.max(0, ...rows.filter((r) => !/(^|\.)0$/.test(r.key)).map((r) => {
    const s = marginNo(r, verses, inBook), dots = s.length - s.replace(/[.,]/g, "").length;
    return s.length - dots + 0.45 * dots;
  })))), [rows, verses, inBook]);
  // the first passage is set in lines of verse: the title line above it starts where the words of its lines do (past the line numbers' column)
  const firstInLines = useMemo(() => !!rows[0] && rows[0].greek.some((u) => u.blocks.some((b) => b.t === "l")), [rows]);
  const missing = trText && !cmpText && placed ? untranslated(rows) : [];
  const extraHere = !cmpText && rows.some((r) => r.extra);
  const outOfStep = !cmpText && !!trText && OUT_OF_STEP.has(trText.urn);
  const comparing = !!cmpText && !!placed && !!doc;
  // the second edition lines up word by word only if it numbers its passages as this one does
  const cmpFit = useMemo(() => (comparing ? new Set(placed!.map((p) => p.at)).size / Math.max(1, doc!.units.length) : 0), [comparing, placed, doc]);
  const canDiff = comparing && cmpFit >= 0.5;
  const allDiffs = useMemo<RowDiff[]>(() => (canDiff ? compareAll(doc!, placed!, strict) : []), [canDiff, doc, placed, strict]);
  const [cmpListOpen, setCmpListOpen] = useState(false);
  // a panel open at the side (they all give way to the look-up while a word is open, and come back when it closes)
  const sideOpen = !!(echo || vocabOpen || placesOpen || talkOpen || msOpen || findOpen || (cmpListOpen && canDiff) || sentenceAt);
  // a look-up in a sheet stands in for the panel beside the text, which is put away for the while and comes back with the sheet closed; a note in the margin leaves it open;
  // a note with a panel open takes the panel's box and the panel waits wholly behind it, kept as it is (what it holds stays), and out of the keyboard's reach (Reader.module.css, lookOver)
  const lookSheet = !!word && !(wordAt && "note" in wordAt);
  const lookOver = !!word && !!wordAt && "note" in wordAt && sideOpen;
  // the panels a row of the Study menu opens (the one open now, if it was opened from Study, has "Back to Study"; once it is closed, the way back is forgotten)
  const panelsOpen: Record<StudyPanel, boolean> = { find: findOpen, vocab: vocabOpen, places: placesOpen, ms: msOpen, talk: talkOpen, cmp: cmpListOpen && canDiff };
  if (studyFor && !panelsOpen[studyFor]) setStudyFor(null);
  // a window opened from a row of Study (the list of books for a second one, the private collection) has "Back to Study", and asks for it here (ReaderBooks)
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ pane: number; tool: string }>).detail;
      if (d.pane === pane) { setDrop("study"); setStudyRow(d.tool); }
    };
    addEventListener("mathesis:study", on);
    return () => removeEventListener("mathesis:study", on);
  }, [pane]);
  useEffect(() => {
    if (!studyRow || drop !== "study") return;
    const id = requestAnimationFrame(() => { root().querySelector<HTMLElement>(`[data-tool="${studyRow}"]`)?.focus({ preventScroll: true }); setStudyRow(null); });
    return () => cancelAnimationFrame(id);
  }, [studyRow, drop]);
  const wordAtRef = useRef(wordAt);
  useEffect(() => { wordAtRef.current = wordAt; });

  // ------------------------------------------------------------ metre
  const [mIndex, setMIndex] = useState<MetreIndex | null>(null);
  useEffect(() => { metreIndex().then(setMIndex, () => undefined); }, []);
  const grcUrn = grcText?.urn;
  const mInfo = grcUrn && mIndex ? mIndex.texts[grcUrn] : undefined;
  const [mData, setMData] = useState<{ urn: string; pub: Map<string, string> } | null>(null);
  useEffect(() => {
    if (!metreOn || !mInfo || !grcUrn) return;
    let live = true;
    Promise.all([publishedFor(grcUrn, mInfo.pack), loadLengths()])
      .then(([pub]) => { if (live) setMData({ urn: grcUrn, pub }); })
      .catch(() => { if (live) toast("The metre data could not be loaded."); });
    return () => { live = false; };
  }, [metreOn, mInfo, grcUrn, toast]);
  const metre = useMemo(() => {
    if (!metreOn || !mInfo || !doc || !doc.chunks[chunk] || !grcUrn || mData?.urn !== grcUrn) return null;
    const c = doc.chunks[chunk];
    const pub = mData.pub;
    return renderPassages(doc.units.slice(c.first, c.last + 1), mInfo.kind, (h) => pub.get(h), lineHash);
  }, [metreOn, mInfo, doc, chunk, grcUrn, mData]);
  const stopBeat = useRef<(() => void) | null>(null);
  useEffect(() => () => stopBeat.current?.(), []);
  /** Play a line's rhythm, lighting each syllable as it sounds. */
  const playLine = (line: HTMLElement) => { stopBeat.current = playLineRhythm(line, { playing: styles.playing, now: styles.beatNow }); };
  /** The line under which the text is in view: the bottom of what is stuck to the top (the bar of a book among two, the key to the case colours), else the top
   *  of the window or of the pane. One book has no bar along its top (the quiet desk, ticket 09, the owner, 2026-10-30). */
  const topEdge = () => {
    const stuck = [...root().querySelectorAll<HTMLElement>(`.${styles.bar}, .${styles.caseKey}`)].find((el) => el.offsetHeight && getComputedStyle(el).position === "sticky");
    return stuck ? stuck.getBoundingClientRect().bottom : contained ? rootRef.current!.getBoundingClientRect().top : headerVisible();
  };
  /** Bring a passage to the top, just below what is stuck there (and the site header, if it will be showing). */
  const bringToTop = (el: HTMLElement, smooth = false) => {
    if (contained) {
      // measured, not scroll-margin: the bar's height changes as the window is resized
      rootRef.current!.scrollBy({ top: el.getBoundingClientRect().top - topEdge() - 12, behavior: smooth ? "smooth" : "auto" });
      return;
    }
    scrollBelowHeader(el, topEdge() + 12, smooth);
  };
  /**
   * Passages away from the screen are drawn only when reached (content-visibility in the CSS), with a
   * guessed height until then, so the page settles over its first moments and a passage brought to the
   * top would drift (under the sticky bar, or far away). Keep it in place until the page stops changing
   * size, or the reader scrolls, taps, selects or presses a key. Returns the function that stops it.
   */
  const holdAtTop = (el: HTMLElement) => {
    // the foot bar stays showing through the jump (it would slip away as the page moves; holdFoot in lib/header.ts)
    if (single) holdFoot();
    // anything the reader does, including starting to select words, ends the hold
    const USER = ["wheel", "touchstart", "pointerdown", "keydown", "selectionchange"] as const;
    let done = false, frame = 0;
    const again = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (!done) bringToTop(el); }); };
    const ro = new ResizeObserver(again);
    if (textRef.current) ro.observe(textRef.current);
    const stop = () => {
      if (done) return;
      done = true; ro.disconnect(); cancelAnimationFrame(frame); clearTimeout(timer);
      USER.forEach((ev) => removeEventListener(ev, stop, true));
    };
    USER.forEach((ev) => addEventListener(ev, stop, { capture: true, passive: true }));
    const timer = setTimeout(stop, 2500);
    again();
    return stop;
  };
  const startKey = doc && startUnit > 0 ? doc.units[startUnit].ref.join(".") : null;

  // once the page is drawn, bring the requested passage into view (and briefly mark it if it was asked for)
  useEffect(() => {
    if (!rows.length) return;
    // the book's title page is for a first visit: a reader coming back to the book (a place saved), or sent to a passage,
    // lands on the text itself, the title page above it (review fix list, slice 8)
    const back = single && (!!remembered || !!at);
    if (!startKey && !back) { if (contained) rootRef.current?.scrollTo({ top: 0 }); else window.scrollTo({ top: 0 }); return; }
    const row = startKey ? rows.find((r) => r.greek.some((u) => u.ref.join(".") === startKey)) : rows[0];
    const el = row && root().querySelector<HTMLElement>(`[data-key="${CSS.escape(row.key)}"]`);
    if (!el) return;
    if (at || tu) { el.classList.remove(styles.flash); void el.offsetWidth; el.classList.add(styles.flash); }
    // with the one-line title above the page (no title page), the page's first passage is not scrolled up to the bar: the page stays at its
    // start, the title in sight over it (the quiet desk, ticket 08, the owner, 2026-10-30)
    if (single && !showCover && row === rows[0]) { window.scrollTo({ top: 0 }); return; }
    return holdAtTop(el);
    // holdAtTop only reads `contained` and the page as it is
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, startKey, at, tu, contained, showCover]);

  // words found by a search: ?hl= their positions in the passage (Greek), ?find= the words (translation)
  const hl = P("hl"), find = P("find");
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const name = `search-hit-${pane}`;
    if (!reg || !H || !doc || !rows.length || (!hl && !find)) return;
    const unitKey = doc.units[startUnit]?.ref.join(".");
    const row = rows.find((r) => r.greek.some((u) => u.ref.join(".") === unitKey));
    const ranges: Range[] = [];
    if (hl && unitKey) {
      const spans = root().querySelector(`[data-u="${CSS.escape(unitKey)}"]`)?.querySelectorAll("[data-w]");
      for (const i of hl.split(",").map(Number)) {
        const sp = spans?.[i];
        if (sp) { const r = new Range(); r.selectNodeContents(sp); ranges.push(r); }
      }
    }
    const words = (find ?? "").split(/\s+/).filter((w) => /^[A-Za-z’']+$/.test(w));   // letters only: safe in a pattern
    if (words.length && row) {
      // a translation passage can run over several rows: mark the words in the first row that has them
      const re = new RegExp(`\\b(?:${words.join("|")})\\b`, "gi");
      const first = rows.indexOf(row);
      for (let i = first; i < Math.min(rows.length, first + 60); i++) {
        const el = root().querySelector<HTMLElement>(`[data-key="${CSS.escape(rows[i].key)}"]`);
        const trEl = el?.querySelector(`.${styles.tr}`);
        if (!el || !trEl) continue;
        const walk = document.createTreeWalker(trEl, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          for (const m of n.textContent!.matchAll(re)) {
            const r = new Range(); r.setStart(n, m.index!); r.setEnd(n, m.index! + m[0].length); ranges.push(r);
          }
        }
        if (ranges.length) {
          if (i !== first) requestAnimationFrame(() => requestAnimationFrame(() => el.scrollIntoView({ block: "center" })));
          break;
        }
      }
    }
    reg.set(name, new H(...ranges));
    return () => { reg.delete(name); };
  }, [rows, hl, find, doc, startUnit, pane]);

  // ------------------------------------------------------------ remember where the reader is
  /** The passage at the top of this pane now: the first showing more than a sliver below the sticky bar. */
  const topKey = () => {
    const edge = topEdge();
    // a row's empty padding below its last line does not count as showing
    return [...root().querySelectorAll<HTMLElement>("article [data-key]")]
      .find((r) => r.getBoundingClientRect().bottom - parseFloat(getComputedStyle(r).paddingBottom) > edge + 24)?.dataset.key ?? null;
  };
  const onPosition = useRef(nav.onPosition);
  useEffect(() => { onPosition.current = nav.onPosition; }, [nav.onPosition]);
  const edV = grcText ? versionOf(grcText.urn) : null;
  const trV = trText ? versionOf(trText.urn) : null;
  // the passage being read is the first one showing clearly below the sticky bar
  useEffect(() => {
    if (!rows.length || !edV) return;
    const scroller: HTMLElement | Window = contained ? rootRef.current! : window;
    let frame = 0, last: string | null = null;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const key = topKey();
        const el = key ? root().querySelector<HTMLElement>(`article [data-key="${CSS.escape(key)}"]`) : null;
        topAnchor.current = key && el ? { key, top: el.getBoundingClientRect().top } : null;
        if (!key || key === last) return;
        last = key;
        setTopRow(key);
        savePosition(workId, { ed: edV, tr: trV, at: key });
        if (pane === 1) onPosition.current?.(key);
        if (!floating) paneTops[pane] = key;
      });
    };
    // after the page has been scrolled to the passage asked for
    const t = setTimeout(check, 400);
    scroller.addEventListener("scroll", check, { passive: true });
    return () => { clearTimeout(t); cancelAnimationFrame(frame); scroller.removeEventListener("scroll", check); };
    // topKey reads the page as it is
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, workId, edV, trV, contained, pane, floating]);

  // Opening or closing a side panel narrows or widens the text, and its lines re-flow: keep the passage that
  // was at the top where it was, instead of letting the page slide back or ahead by many lines. (The look-up never changes
  // the text's width: it is written in the margin, rises from the foot of the screen, or takes a side panel's place.)
  const topAnchor = useRef<{ key: string; top: number } | null>(null);
  const panelOpen = sideOpen;
  useLayoutEffect(() => {
    const a = topAnchor.current;
    const el = a ? root().querySelector<HTMLElement>(`article [data-key="${CSS.escape(a.key)}"]`) : null;
    if (!a || !el) return;
    const d = el.getBoundingClientRect().top - a.top;
    if (Math.abs(d) > 1) (contained ? rootRef.current! : window).scrollBy({ top: d, behavior: "instant" });
    // only when a panel opens or closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen]);

  // the sticky bar's height, so a passage brought into view is not hidden under it
  const hasRows = rows.length > 0;
  useEffect(() => {
    const el = rootRef.current, bar = el?.querySelector<HTMLElement>(`.${styles.bar}`);
    if (!el || !bar) return;
    const ro = new ResizeObserver(() => el.style.setProperty("--bar-h", `${bar.offsetHeight}px`));
    ro.observe(bar);
    return () => ro.disconnect();
  }, [hasRows]);

  // Pinch the text with two fingers to change the size of the Greek (remembered in Settings). The passage
  // between the fingers stays where it is while the lines re-flow around it. The fingers start from the Greek as it is on the screen (a page of verse is set
  // a little smaller than the reader's size, and the Greek must not jump under the hand), and take the size in hand: the verse fit is off from the first move
  // and for the size the pinch ends at, which is saved as a number, a size the reader chose (the quiet desk, ticket 10, the owner, 2026-10-30).
  useEffect(() => {
    const el = textRef.current;
    if (!el || contained) return;
    let d0 = 0, size0 = 0, live = 0, moved = false, anchor: HTMLElement | null = null, anchorY = 0, frame = 0;
    const { min, max, step } = LIMITS.greekSize;
    const gap = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const start = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      const shown = el.querySelector<HTMLElement>('[lang="grc"]');
      size0 = live = inRem(shown ? parseFloat(getComputedStyle(shown).fontSize) : shownGreekSize(el).px);
      d0 = gap(e.touches); moved = false;
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2, my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      anchor = document.elementFromPoint(mx, my)?.closest<HTMLElement>("[data-key]") ?? null;
      anchorY = anchor?.getBoundingClientRect().top ?? 0;
    };
    const move = (e: TouchEvent) => {
      if (!d0 || e.touches.length !== 2) return;
      e.preventDefault();   // the page itself must not zoom
      if (!moved) { moved = true; rootRef.current?.style.setProperty("--fit", "1"); }
      live = Math.min(max, Math.max(min, size0 * gap(e.touches) / d0));
      document.documentElement.style.setProperty("--greek-chosen", `${live}rem`);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (anchor) scrollBy(0, anchor.getBoundingClientRect().top - anchorY); });
    };
    const end = (e: TouchEvent) => {
      if (!d0 || e.touches.length >= 2) return;
      d0 = 0;
      // two fingers that did not move leave the size as it was (a size that suits the device stays so)
      if (moved) useSettings.getState().set({ greekSize: Math.round(live / step) * step });
    };
    const noZoom = (e: Event) => e.preventDefault();   // Safari's own pinch gesture
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    el.addEventListener("gesturestart", noZoom);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("touchstart", start); el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end); el.removeEventListener("touchcancel", end); el.removeEventListener("gesturestart", noZoom);
    };
  }, [contained, hasRows]);

  // ------------------------------------------------------------ verse fit
  // A page set in lines of verse is set at the reader's size, made smaller only as far as its widest line needs to stand whole, and never below 16 px: Homer's
  // lines stand whole on a phone (all but the few that cannot at 16 px, which wrap with a hanging indent) and at 1100 px, and keep the full 26 px where they fit
  // (lib/verseFit.ts; the quiet desk, ticket 10, the owner, 2026-10-30). Measured when the page is drawn and again when its width, the columns or the size change,
  // not while it scrolls: the width of the widest line, worked out from the text itself (so that rows drawn only when scrolled to count too, and a window dragged
  // wider does not set every line out again), and the room the words of a line have, read from the page with the reader's own size. The result is --fit on the
  // reader's root (the fitted size ÷ the reader's), which the Greek, the English beside it and the title line's start all read (Reader.module.css): one size for
  // the whole page, never one per passage. A size the reader has chosen is kept exactly as it is, and so is prose.
  const sizeAuto = useSettings((s) => s.greekSize === "auto");
  // The Greek typeface is asked for as the reader opens, while the book is being fetched, and not when the first line is drawn: the verse is then measured in the
  // face it is set in, and the size is settled when the page is first drawn. Measured in the stand-in and again when the face arrives a moment later, the size
  // would change under the page, the passage held at the top would be moved back, and the header, which returns at any movement up, would return with it.
  useEffect(() => {
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden;font-family:var(--f-greek)";
    document.body.append(probe);
    // (read before the probe is taken away; the size asked for is the page's own, which the face does not depend on)
    const { fontFamily, fontSize } = getComputedStyle(probe);
    probe.remove();
    void document.fonts?.load(`400 ${fontSize} ${fontFamily}`, "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος").catch(() => undefined);
  }, []);
  useLayoutEffect(() => {
    const root = rootRef.current, art = textRef.current;
    if (!root || !art) return;
    // the lines of Greek verse, by the column they stand in: the Greek's own and, when two editions are compared, the second Greek one (English lines are not these)
    const verse = [`.${styles.grc} [data-u] .${styles.line} .${styles.lt}`, `.${styles.tr}[data-greek] .${styles.line} .${styles.lt}`]
      .map((q) => [...art.querySelectorAll<HTMLElement>(q)]).filter((lines) => lines.length);
    const canvas = document.createElement("canvas").getContext("2d");
    if (!poetry || !sizeAuto || !verse.length || !canvas) { root.style.removeProperty("--fit"); return; }
    let off = false, face = "", widest: number[] = [];
    const fit = () => {
      if (off || !verse[0][0].isConnected) return;
      // the passage at the top stays where it is while the Greek is set again: a panel opening narrows the text and the size follows it (the passage is kept through the
      // narrowing above; the new size would move it once more), and so does a window dragged narrower, and the page must not slide from under the reader
      const key = topKey(), held = key ? root.querySelector<HTMLElement>(`article [data-key="${CSS.escape(key)}"]`) : null;
      const was = held?.getBoundingClientRect().top ?? 0;
      root.style.setProperty("--fit", "1");   // the reader's own size, which the room is read at (a smaller size only gives the words more)
      const cs = getComputedStyle(verse[0][0]), px = parseFloat(cs.fontSize);
      if (!(px > 0)) return;
      const now = `${cs.fontStyle} ${cs.fontWeight} ${px}px ${cs.fontFamily}`;
      if (now !== face) {   // the widths are taken again only when the typeface or the size has changed, not as a window is resized
        face = canvas.font = now;
        widest = verse.map((lines) => lines.reduce((w, lt) => Math.max(w, canvas.measureText((lt.textContent ?? "").replace(/\s+/g, " ").trim()).width), 0));
      }
      // a page that compares two editions is set in lines in both columns: the one size is the smaller of what each needs. The room is read from the page at each
      // size tried, since a smaller size gives the words more room on a computer (the column of line numbers is 2.4 em wide; lib/verseFit.ts)
      const roomAt = (lines: HTMLElement[]) => (size: number) => { root.style.setProperty("--fit", String(size / px)); return lines[0].getBoundingClientRect().width; };
      const size = verse.reduce((least, lines, i) => Math.min(least, verseSizeWhere(px, widest[i], roomAt(lines))), px);
      root.style.setProperty("--fit", String(size / px));
      const moved = held ? held.getBoundingClientRect().top - was : 0;
      if (Math.abs(moved) > 1) (contained ? root : window).scrollBy({ top: moved, behavior: "instant" });
    };
    // the web face arriving changes every width: start again from the new face
    const arrived = () => { face = ""; fit(); };
    document.fonts?.addEventListener("loadingdone", arrived);
    void document.fonts?.ready.then(arrived);
    // only a change of width matters (the fitting itself changes the height)
    let w = art.clientWidth;
    const ro = new ResizeObserver(() => { if (art.clientWidth !== w) { w = art.clientWidth; fit(); } });
    ro.observe(art);
    fit();
    return () => { off = true; ro.disconnect(); document.fonts?.removeEventListener("loadingdone", arrived); };
    // topKey and contained read the page as it is
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poetry, sizeAuto, rows, columns, cmpText, metre]);

  // ------------------------------------------------------------ navigation
  const query = (o: { ed?: string; tr?: string | null; at?: string }) => {
    const q = new URLSearchParams(params.toString());
    const k = (x: string) => (pane === 1 ? x : `${x}2`);
    q.set(k("w"), workId);
    const ed = o.ed ?? edV;
    if (ed) q.set(k("ed"), ed);
    q.set(k("tr"), o.tr === undefined ? (trV ?? "none") : (o.tr ?? "none"));
    if (o.at) q.set(k("at"), o.at); else q.delete(k("at"));
    for (const x of ["hl", "find", "tu"]) q.delete(k(x));   // a search's marks belong to the passage it found
    return q;
  };
  const href = (o: { ed?: string; tr?: string | null; at?: string }) => `/read?${query(o)}`;
  const goChunk = (i: number) => {
    if (!doc || i < 0 || i >= doc.chunks.length) return;
    // a new page is a step in the browser's history, so Back returns to the page before
    nav.go(query({ at: doc.units[doc.chunks[i].first].ref.join(".") }), "push");
  };
  const goChunkRef = useRef(goChunk);
  useEffect(() => { goChunkRef.current = goChunk; });

  /** Go to the passage a reader typed ("1.33"): whether there was one (if not, a message says what a reference looks like). */
  const goTo = (ref: string) => {
    if (!doc) return false;
    if (findRef(doc, ref) < 0) { toast(`No passage "${ref}" in this text. Try a reference like ${doc.units[Math.min(40, doc.units.length - 1)].ref.join(".")}.`); return false; }
    nav.go(query({ at: ref.trim().replace(/\s+/g, ".") }), "push");
    return true;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (split && useUI.getState().activePane !== pane) return;
      // two readers can be open (the page and the floating window): keys go to the one in use
      const inFloat = !!document.activeElement?.closest("[data-float-window]");
      if (floating !== inFloat && (floating || useFloat.getState().open)) return;
      // Ctrl+F finds in the whole book (the page shows one part at a time); pressed again in the box, the browser's own
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "f" && !t.closest("[aria-label='Find in this text']")) {
        e.preventDefault(); openFindRef.current(); return;
      }
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "/") { e.preventDefault(); openFindRef.current(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); goChunkRef.current(chunk + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goChunkRef.current(chunk - 1); }
      else if (e.key === "g") { e.preventDefault(); if (!contained) setDrop("goto"); setGotoWant((n) => n + 1); }
      else if (e.key === "?") setHelp((h) => !h);
      else if (e.key === "Escape") { setWord(null); setHelp(false); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [chunk, split, pane, floating, contained]);

  // ------------------------------------------------------------ your marks
  const order = useMemo(() => new Map(doc?.units.map((u, i) => [u.ref.join("."), i]) ?? []), [doc]);
  const marks = useMemo(() => allMarks.filter((m) => m.ed === edV), [allMarks, edV]);
  const marksByRow = useMemo(() => {
    const byUnit = new Map<string, string>();
    for (const r of rows) for (const u of r.greek) byUnit.set(u.ref.join("."), r.key);
    const out = new Map<string, Mark[]>();
    for (const m of marks) {
      const rk = byUnit.get(m.start.u);
      if (rk) out.set(rk, [...(out.get(rk) ?? []), m]);
    }
    return out;
  }, [rows, marks]);
  const noMarks = useMemo<Mark[]>(() => [], []);

  // ------------------------------------------------------------ find in this text
  const findHere = () => {
    if (!doc) return 0;
    const k = topKey(), r = rows.find((x) => x.key === k);
    return (r && order.get(r.greek[0]?.ref.join("."))) ?? doc.chunks[chunk]?.first ?? 0;
  };
  /** Go to a match: on another page, open that page at its passage; on this one, the marking below brings it into view. */
  const findJump = (h: FindHit) => {
    if (!doc) return;
    if (chunkOf(doc, h.unit) !== chunk) nav.go(query({ at: doc.units[h.unit].ref.join(".") }));
  };
  /** Go to a passage where the editions differ: on another page, open it there; on this one, glide to it. */
  const goToDiff = (d: RowDiff) => { if (d.chunk !== chunk) nav.go(query({ at: d.key })); else jumpToRow(d.key); };
  /** The next (1) or previous (-1) difference from the passage at the top. */
  const goDiff = (dir: 1 | -1) => {
    if (!allDiffs.length) return;
    const h = findHere();
    goToDiff(dir === 1 ? allDiffs.find((x) => x.first > h) ?? allDiffs[0] : allDiffs.findLast((x) => x.first < h) ?? allDiffs[allDiffs.length - 1]);
  };
  const setParam = (k: string, v: string | null) => { const q = new URLSearchParams(params.toString()); if (v) q.set(pk(k), v); else q.delete(pk(k)); return q; };
  const stopCompare = () => { const q = setParam("cmp", null); q.delete(pk("cmpx")); setCmpListOpen(false); nav.go(q); };
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const names = [`diff-a-${pane}`, `diff-b-${pane}`];
    if (!reg || !H || !canDiff || !rows.length) return;
    const a: Range[] = [], b: Range[] = [];
    root().querySelectorAll<HTMLElement>("article [data-key]").forEach((row) => {
      const as = [...row.querySelectorAll<HTMLElement>("[data-u] [data-w]")], bs = [...row.querySelectorAll<HTMLElement>("[data-tr] [data-w]")];
      if (!bs.length) return;
      for (const h of readingHunks(as.map((x) => wordKey(x.dataset.w!, strict)), bs.map((x) => wordKey(x.dataset.w!, strict)), strict)) {
        for (let i = h.a0; i < h.a1; i++) { const r = new Range(); r.selectNodeContents(as[i]); a.push(r); }
        for (let i = h.b0; i < h.b1; i++) { const r = new Range(); r.selectNodeContents(bs[i]); b.push(r); }
      }
    });
    reg.set(names[0], new H(...a));
    reg.set(names[1], new H(...b));
    return () => { for (const n of names) reg.delete(n); };
    // (the page is read as it is drawn)
  }, [canDiff, rows, strict, pane, translit, metre]);
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const names = [`syn-s-${pane}`, `syn-p-${pane}`, `syn-w-${pane}`];
    if (!reg || !H || !synMarks || !rows.length) return;
    const spans = new Map<string, NodeListOf<Element> | undefined>();
    const range = (w: { u: string; i: number }) => {
      if (!spans.has(w.u)) spans.set(w.u, root().querySelector(`[data-u="${CSS.escape(w.u)}"]`)?.querySelectorAll("[data-w]"));
      const sp = spans.get(w.u)?.[w.i];
      if (!sp) return null;
      const r = new Range(); r.selectNodeContents(sp); return r;
    };
    [synMarks.sentence, synMarks.phrase, synMarks.word].forEach((ws, k) => reg.set(names[k], new H(...(ws.map(range).filter(Boolean) as Range[]))));
    return () => { for (const nm of names) reg.delete(nm); };
    // (the page is read as it is drawn)
  }, [synMarks, rows, pane, translit, metre]);
  const findSeen = useRef(-1);
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const names = [`find-${pane}`, `find-now-${pane}`];
    if (!reg || !H || !findMarks || !rows.length || !doc || !doc.chunks[chunk]) return;
    const { first, last } = doc.chunks[chunk], cur = findMarks.cur;
    const all: Range[] = [], now: Range[] = [];
    const spans = new Map<number, NodeListOf<Element> | undefined>();
    const spansOf = (u: number) => {
      if (!spans.has(u)) spans.set(u, root().querySelector(`[data-u="${CSS.escape(doc.units[u].ref.join("."))}"]`)?.querySelectorAll("[data-w]"));
      return spans.get(u);
    };
    const rowOf = new Map<string, string>();
    for (const r of rows) for (const u of r.greek) rowOf.set(u.ref.join("."), r.key);
    const engByRow = new Map<string, EnglishHit[]>();
    for (const h of findMarks.hits) {
      if (h.unit < first || h.unit > last) continue;
      if (h.lang === "grc") {
        for (const w of h.words) {
          const sp = spansOf(w.unit)?.[w.i];
          if (!sp) continue;
          const r = new Range(); r.selectNodeContents(sp); (h === cur ? now : all).push(r);
        }
      } else {
        const rk = rowOf.get(doc.units[h.unit].ref.join("."));
        if (rk) engByRow.set(rk, [...(engByRow.get(rk) ?? []), h]);
      }
    }
    // the translation: the row's own text, read again (notes, line numbers and speakers' names left out)
    if (findMarks.engSource) for (const [rk, hs] of engByRow) {
      const trEl = root().querySelector(`[data-key="${CSS.escape(rk)}"] [data-tr]`);
      if (!trEl) continue;
      const nodes: Text[] = [], starts: number[] = [];
      let text = "";
      const walk = document.createTreeWalker(trEl, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.parentElement?.closest("[data-silent], [data-speaker], button") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
      });
      // a mark between pieces of text, so words in two paragraphs never run together
      for (let n = walk.nextNode(); n; n = walk.nextNode()) { nodes.push(n as Text); starts.push(text.length); text += n.textContent + "\u0001"; }
      if (!nodes.length) continue;
      const point = (off: number): [Text, number] => { let k = nodes.length - 1; while (k > 0 && starts[k] > off) k--; return [nodes[k], Math.min(off - starts[k], nodes[k].length)]; };
      let n = 0;
      for (const m of text.matchAll(new RegExp(findMarks.engSource, "gi"))) {
        const h = hs[n++];
        const [sn, so] = point(m.index!), [en, eo] = point(m.index! + m[0].length - 1);
        const r = new Range(); r.setStart(sn, so); r.setEnd(en, Math.min(eo + 1, en.length));
        (h && h === cur ? now : all).push(r);
      }
    }
    reg.set(names[0], new H(...all));
    reg.set(names[1], new H(...now));
    // a newly chosen match is brought into view, if it is not in view already
    if (cur && now.length && findMarks.seq !== findSeen.current) {
      findSeen.current = findMarks.seq;
      const rect = now[0].getBoundingClientRect();
      const edge = topEdge();
      // (one book's foot bar stands along the bottom of the window)
      const foot = single ? root().querySelector<HTMLElement>("[data-foot-bar]")?.offsetHeight ?? 0 : 0;
      const bottom = contained ? rootRef.current!.getBoundingClientRect().bottom : (innerHeight - foot) * (matchMedia("(max-width: 900px)").matches ? 0.72 : 1);
      if (rect.top < edge + 8 || rect.bottom > bottom - 8) {
        const to = rect.top - (edge + (bottom - edge) * 0.3);
        if (contained) rootRef.current!.scrollBy({ top: to, behavior: scrollBehavior() }); else scrollBy({ top: to, behavior: scrollBehavior() });
      }
    }
    return () => { for (const nm of names) reg.delete(nm); };
    // root and the edge of the text are read as they are now
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findMarks, rows, chunk, doc, pane, translit, metre, columns, contained, single]);


  // ------------------------------------------------------------ markers beside the scroll bar
  const markerItems = useMemo<MarkerItem[]>(() => {
    const out: MarkerItem[] = [];
    const rowOf = new Map<string, string>();
    for (const r of rows) for (const u of r.greek) rowOf.set(u.ref.join("."), r.key);
    for (const [rk, ms] of marksByRow) for (const m of ms) {
      out.push({ key: rk, kind: m.kind, label: rangeLabel(m.start.u, m.end.u), colour: m.colour,
        preview: m.kind === "note" ? (m.text || "Empty note") : m.kind === "xref" ? `${m.link?.label ?? ""}: ${m.quote}` : m.quote });
    }
    const left = remembered?.at ? rowOf.get(remembered.at) ?? (rows.some((r) => r.key === remembered.at) ? remembered.at : null) : null;
    if (left) out.push({ key: left, kind: "left", label: remembered!.at, preview: "Where you stopped last time" });
    const here = grcText ? echoMarks?.get(grcText.urn) : undefined;
    if (here) {
      const seen = new Set<string>();
      for (const u of here.keys()) { const rk = rowOf.get(u); if (rk && !seen.has(rk)) { seen.add(rk); out.push({ key: rk, kind: "echo", label: u, preview: "An echo of the passage you chose" }); } }
    }
    return out;
    // remembered is read once per work
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, marksByRow, echoMarks, grcText?.urn, snap]);
  const markerCounts = useMemo(() => {
    const c: Partial<Record<MarkerItem["kind"], number>> = {};
    for (const it of markerItems) c[it.kind] = (c[it.kind] ?? 0) + 1;
    return c;
  }, [markerItems]);
  const jumpToRow = (key: string) => {
    const el = root().querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`);
    if (!el) return;
    if (single) holdFoot();
    bringToTop(el, true);
    el.classList.remove(styles.flash); void el.offsetWidth; el.classList.add(styles.flash);
    // passages drawn on the way may change the page's height: once the glide ends, settle it in place
    const scroller: HTMLElement | Window = contained && rootRef.current ? rootRef.current : window;
    let settled = false;
    const settle = () => { if (settled) return; settled = true; clearTimeout(t); scroller.removeEventListener("scrollend", settle); holdAtTop(el); };
    const t = setTimeout(settle, 900);  // browsers without the scrollend event
    scroller.addEventListener("scrollend", settle, { once: true });
  };

  // highlights are drawn onto the word spans after each render of the page
  useEffect(() => {
    root().querySelectorAll("[data-hl]").forEach((el) => el.removeAttribute("data-hl"));
    for (const m of marks) {
      if (m.kind !== "highlight") continue;
      const a = order.get(m.start.u), b = order.get(m.end.u);
      if (a === undefined || b === undefined) continue;
      for (let i = a; i <= b; i++) {
        const key = doc!.units[i].ref.join(".");
        const unit = root().querySelector(`[data-u="${CSS.escape(key)}"]`);
        if (!unit) continue;
        const spans = unit.querySelectorAll<HTMLElement>("[data-w]");
        const from = i === a ? m.start.i : 0, to = i === b ? m.end.i : spans.length - 1;
        for (let j = from; j <= to && j < spans.length; j++) spans[j].dataset.hl = m.colour ?? "ochre";
      }
    }
  }, [marks, rows, order, doc]);

  // colour by case: mark each Greek word with the case GLAUx gives it here
  useEffect(() => {
    const clear = () => root().querySelectorAll("article [data-w][data-case]").forEach((el) => el.removeAttribute("data-case"));
    if (!cases || !rows.length || !doc) { clear(); return; }
    let live = true;
    loadWordPack(lexWork).then((pack) => {
      if (!live) return;
      clear();
      if (!pack) { toast("No word analyses exist for this text yet, so words can't be coloured by case."); return; }
      // GLAUx's words lined up with the words on screen once for the whole book (one pass, whatever
      // citation scheme GLAUx follows), then each word on the page read off that line-up
      const placed = placeAnalyses(pack, doc);
      if (placed.cover < 0.05) { toast("GLAUx's analysis of this text does not line up with this edition, so its words can't be coloured by case."); return; }
      root().querySelectorAll<HTMLElement>("[data-u]").forEach((unit) => {
        const spans = [...unit.querySelectorAll<HTMLElement>("[data-w]")];
        positionsFor(placed, unit.dataset.u!, spans.map((sp) => sp.dataset.w!)).forEach((p, i) => {
          const c = p >= 0 && placed.tag[p] >= 0 ? caseOf(pack.tags[placed.tag[p]]) : null;
          if (c) spans[i].dataset.case = c;
        });
      });
    }).catch(() => undefined);
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cases, rows, doc, lexWork]);

  const pointOf = (span: HTMLElement) => {
    const unit = span.closest<HTMLElement>("[data-u]")!;
    return { u: unit.dataset.u!, i: [...unit.querySelectorAll("[data-w]")].indexOf(span) };
  };
  const selectSpans = (spans: HTMLElement[], rect: DOMRect) => {
    if (!spans.length) return;
    const rowKeys = [...new Set(spans.map((s) => s.closest<HTMLElement>("[data-key]")!.dataset.key!))];
    setSel({ start: pointOf(spans[0]), end: pointOf(spans[spans.length - 1]), quote: spans.map((s) => s.textContent).join(" "), rowKeys,
      rect: { left: rect.left, top: rect.top, bottom: rect.bottom } });
  };
  const onTextMouseUp = () => {
    const s = window.getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) return;
    const range = s.getRangeAt(0);
    const spans = [...root().querySelectorAll<HTMLElement>("article [data-u] [data-w]")].filter((sp) => range.intersectsNode(sp));
    selectSpans(spans, range.getBoundingClientRect());
  };
  // Touch screens send no mouse-up after pressing and holding to select words, so follow the selection
  // itself: once it rests for a moment, the passage toolbar opens for it (and closes when it is cleared).
  const touchSel = useRef(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined, touch = false;
    const onDown = (e: PointerEvent) => { touch = e.pointerType === "touch"; };
    const onChange = () => {
      if (!touch) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const s = getSelection(), a = textRef.current;
        if (s && !s.isCollapsed && s.rangeCount && a?.contains(s.anchorNode)) { touchSel.current = true; onTextMouseUpRef.current(); }
        else if (touchSel.current) { touchSel.current = false; setSel(null); }
      }, 350);
    };
    addEventListener("pointerdown", onDown, true);
    document.addEventListener("selectionchange", onChange);
    return () => { clearTimeout(timer); removeEventListener("pointerdown", onDown, true); document.removeEventListener("selectionchange", onChange); };
  }, []);
  const onTextMouseUpRef = useRef(onTextMouseUp);
  useEffect(() => { onTextMouseUpRef.current = onTextMouseUp; });
  /** The one word selected, if the selection is a single word, with where it is (for its quick meaning). */
  const selWord = useMemo(() => {
    if (!sel || sel.start.u !== sel.end.u || sel.start.i !== sel.end.i || !doc) return null;
    const unit = rootRef.current?.querySelector<HTMLElement>(`[data-u="${CSS.escape(sel.start.u)}"]`);
    const span = unit?.querySelectorAll<HTMLElement>("[data-w]")[sel.start.i];
    if (!unit || !span) return null;
    const same = [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(span.dataset.w!));
    return { w: span.dataset.w!, ctx: { work: lexWork, unitKey: sel.start.u, occurrence: same.indexOf(span), keys: unitKeys, depth: doc.levels.length }, span };
  }, [sel, doc, lexWork, unitKeys]);

  async function act(a: "bookmark" | "favourite" | "note" | "share" | "xref" | "xref-here" | "echoes" | "ask" | "notebook" | { highlight: Colour }) {
    if (!sel || !edV) return;
    if (a === "notebook") {
      if (!grcText) return;
      const tr = cmpText ? "" : rows.filter((r) => sel.rowKeys.includes(r.key)).map((r) => blockText(r.trans)).filter(Boolean).join(" ");
      setNbPick({ what: "this passage", items: [{ kind: "passage", work: workId, urn: grcText.urn, from: sel.start.u, to: sel.end.u, grc: sel.quote, ...(tr ? { tr: tr.slice(0, 2000) } : {}) }] });
      window.getSelection()?.removeAllRanges(); setSel(null); return;
    }
    if (a === "echoes") {
      openEchoes(sel.start, sel.end);
      window.getSelection()?.removeAllRanges(); setSel(null); return;
    }
    if (a === "xref") {
      useUI.getState().setPendingXref({ pane, work: workId, ed: edV, start: sel.start, end: sel.end, quote: sel.quote, label: `${cite} ${rangeLabel(sel.start.u, sel.end.u)}` });
      toast("Now select the passage in the other book and choose \u201cLink here\u201d.");
      window.getSelection()?.removeAllRanges(); setSel(null); return;
    }
    if (a === "xref-here" && pendingXref) {
      const here = { work: workId, ed: edV, start: sel.start, end: sel.end, quote: sel.quote, label: `${cite} ${rangeLabel(sel.start.u, sel.end.u)}` };
      const { add } = useMarks.getState();
      await add({ kind: "xref", work: pendingXref.work, ed: pendingXref.ed, start: pendingXref.start, end: pendingXref.end, quote: pendingXref.quote,
        link: { work: here.work, ed: here.ed, start: here.start, label: here.label } });
      await add({ kind: "xref", ...here, link: { work: pendingXref.work, ed: pendingXref.ed, start: pendingXref.start, label: pendingXref.label } });
      useUI.getState().setPendingXref(null);
      toast(`Linked ${pendingXref.label} with ${here.label}.`);
      window.getSelection()?.removeAllRanges(); setSel(null); return;
    }
    if (a === "xref-here") return;   // no first passage chosen yet
    const base = { work: workId, ed: edV, start: sel.start, end: sel.end, quote: sel.quote };
    const where = rangeLabel(sel.start.u, sel.end.u);
    if (a === "ask" && isPrivate) return;   // a private book's text is never posted to the forum
    if (a === "ask") {
      // the Agora's new-thread page picks this up (components/community/NewThread.tsx)
      const tr = rows.filter((r) => sel.rowKeys.includes(r.key)).map((r) => blockText(r.trans)).filter(Boolean).join(" ");
      const quote = { work: workId, ref: where, grc: sel.quote, eng: tr ? tr.slice(0, 1500) : undefined, cite: `${cite} ${where}`, href: href({ at: sel.start.u }) };
      try { sessionStorage.setItem(ASK_KEY, JSON.stringify(quote)); } catch { /* private mode: the page opens without it */ }
      window.getSelection()?.removeAllRanges(); setSel(null);
      router.push("/town-hall/new?ask=1");
      return;
    }
    if (a === "share") {
      const rowsHit = rows.filter((r) => sel.rowKeys.includes(r.key));
      const tr = rowsHit.map((r) => blockText(r.trans)).filter(Boolean).join(" ");
      setShare({ words: sel.quote.split(" "), greekText: sel.quote, translation: tr || null, cite: `${cite} ${where}`,
        link: `${location.origin}${href({ at: sel.start.u })}` });
    } else if (typeof a === "object") {
      await useMarks.getState().add({ ...base, kind: "highlight", colour: a.highlight });
    } else if (a === "note") {
      const m = await useMarks.getState().add({ ...base, kind: "note", text: "" });
      setOpenNote(m.id);
    } else {
      await useMarks.getState().add({ ...base, kind: a });
      toast(a === "bookmark" ? `Bookmarked ${where}.` : `Added ${where} to your favourite passages.`);
      buzz();
    }
    window.getSelection()?.removeAllRanges();
    setSel(null);
  }

  // dragging a passage number, or selected Greek, carries the words with their citation
  const onDragStart = (e: React.DragEvent) => {
    const el = e.target instanceof HTMLElement ? e.target : (e.target as Node).parentElement;
    const r = el?.closest<HTMLElement>("[data-drag]");
    let text = "", where = "";
    if (r) {
      // the passage's own text, punctuation and all
      text = rows.find((x) => x.key === r.dataset.drag)?.greek.map((u) => blockText(u.blocks)).join(" ") ?? "";
      where = r.dataset.drag!;
    } else {
      const s = window.getSelection();
      if (!s || s.isCollapsed) return;
      const range = s.getRangeAt(0);
      const spans = [...root().querySelectorAll<HTMLElement>("article [data-u] [data-w]")].filter((sp) => range.intersectsNode(sp));
      if (!spans.length) return;
      text = spans.map((w) => w.textContent).join(" ");
      const a = pointOf(spans[0]).u, b = pointOf(spans[spans.length - 1]).u;
      where = rangeLabel(a, b);
    }
    if (!text) return;
    e.dataTransfer.setData("text/plain", `“${text}” (${cite} ${where})`);
    e.dataTransfer.setData("text/uri-list", `${location.origin}${href({ at: where.split("–")[0] })}`);
    e.dataTransfer.effectAllowed = "copy";
  };

  // a word opens the look-up (by a click, or Enter on the focused word)
  // (`back`: the way back from the sentence or Echoes, which reopens the second layer on this word)
  const openWord = (w: HTMLElement, back = false) => {
    // while a sentence's structure is open, a word chosen in the text is shown there, in its own sentence
    const inUnit = w.closest<HTMLElement>("[data-u]");
    if (sentenceAt && inUnit && !back) { setCameFrom(null); setSentenceAt({ u: inUnit.dataset.u!, i: [...inUnit.querySelectorAll("[data-w]")].indexOf(w) }); return; }
    root().querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel));
    w.classList.add(styles.sel);
    rove(w);
    // which passage the word is in, and which occurrence of this form within it
    const unit = w.closest<HTMLElement>("[data-u]");
    let ctx: WordContext | null = null;
    if (unit && doc) {
      const same = [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!));
      ctx = { work: lexWork, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: unitKeys, depth: doc.levels.length };
    }
    setWord({ w: w.dataset.w!, ctx, at: unit ? { u: unit.dataset.u!, i: [...unit.querySelectorAll("[data-w]")].indexOf(w) } : null, more: back });
    placeWord(true);
  };

  /** "‹ Back to μῆνις" in the sentence panel or Echoes: they close, and the look-up opens again on the word it was opened for,
   *  in the second layer, where the reader came from, and placed as usual. */
  const backToWord = () => {
    const from = cameFrom;
    setCameFrom(null); setSentenceAt(null); setEcho(null);
    const unit = from ? [...root().querySelectorAll<HTMLElement>("[data-u]")].find((u) => u.dataset.u === from.at.u) : null;
    const span = unit?.querySelectorAll<HTMLElement>("[data-w]")[from!.at.i];
    if (span) openWord(span, true);
    else root().querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel));
  };

  /** Where the look-up goes (decision 4 and the quiet desk, ticket 04: one place per device, and it never covers the Greek
   *  being read). lookupPlace decides from the room the reader has. A note: a window over the right margin (the last column
   *  of each passage's row), fixed to the screen, so that the text scrolls while it stays (the owner, 2026-10-26: "open from
   *  the right side of the page and hold its place"). While a side panel is open beside the text the margin's room is not
   *  kept (the quiet desk, ticket 10, the owner, 2026-10-30: the Greek would lose a third of its size): the same window takes
   *  the panel's box instead, its left edge and width here and its top and foot in the stylesheet (.withPanel .wordNote), so
   *  that the panel is wholly behind it and nothing of it shows; closing it shows the panel again. A sheet: from the foot of
   *  the screen, or of the floating window, that rises no higher than just below the line; on opening, a line in the lower
   *  part is first brought up under the bar. */
  const placeWord = (opening = false) => {
    const box = rootRef.current, w = box?.querySelector<HTMLElement>(`article .${styles.sel}`);
    if (!box) return;
    if (single && lookupPlace(innerWidth) === "note") {
      // a panel stands beside the text: its width is the text's right margin (the very figure that keeps the text clear of it), so
      // a window of that width from that edge is the panel's own place, and never over the text. Read from the page as it is, since
      // a panel may be opening or closing now.
      const text = box.querySelector<HTMLElement>(`article.${styles.text}`);
      const side = box.classList.contains(styles.withPanel) && text ? parseFloat(getComputedStyle(text).marginRight) : 0;
      if (side > 120) {
        setWordAt({ note: { left: Math.round(document.documentElement.clientWidth - side), width: Math.round(side) } });
        return;
      }
      const top = topEdge();
      const row = w?.closest<HTMLElement>(`.${styles.row}`)
        ?? [...box.querySelectorAll<HTMLElement>(`article .${styles.row}`)].find((r) => r.getBoundingClientRect().bottom > top + 40);
      const tracks = row ? getComputedStyle(row).gridTemplateColumns.split(" ").map(parseFloat) : [];
      const margin = tracks.length >= 3 ? tracks[tracks.length - 1] : 0;
      if (row && margin > 120) {
        setWordAt({ note: { left: Math.round(row.getBoundingClientRect().right - margin), width: Math.round(margin) } });
        return;
      }
    }
    if (!w) { setWordAt({ sheet: null }); return; }
    // a sheet: measured against the screen, or against the floating window it rises in
    const frame = floating ? box.getBoundingClientRect() : { top: 0, bottom: innerHeight };
    const edge = Math.max(frame.top, topEdge());
    const r = w.getBoundingClientRect();
    let bottom = r.bottom;
    if (opening && r.bottom > frame.top + (frame.bottom - frame.top) * 0.45) {
      const own = contained && box.scrollHeight > box.clientHeight;
      // as far as the page can go: near its end the line stays lower, and the sheet is shorter
      const room = own ? box.scrollHeight - box.clientHeight - box.scrollTop : document.documentElement.scrollHeight - innerHeight - scrollY;
      const by = Math.max(0, Math.min(r.top - edge - 16, room));
      (own ? box : window).scrollBy({ top: by, behavior: scrollBehavior() });
      bottom -= by;
    }
    setWordAt({ sheet: Math.max(0, Math.round(frame.bottom - bottom - 12)) });
  };
  const placeWordRef = useRef(placeWord);
  useEffect(() => { placeWordRef.current = placeWord; });
  // a side panel opening or closing while the look-up stands (a panel that gives itself up, say): the window goes between the margin and the
  // panel's box, before the page is drawn, since the room under it has changed (the quiet desk, ticket 10)
  useLayoutEffect(() => {
    if (word && wordAt && "note" in wordAt) placeWord();
    // only when a panel opens or closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideOpen]);

  // The keyboard in the text. Tab reaches it as one stop (the first word, or the word last used);
  // there ← → move word by word, ↑ ↓ line by line, Home / End to the first / last word, Enter or Space looks up.
  const textRef = useRef<HTMLElement>(null);
  // the look-up follows its line when the text reflows: a note in the margin whenever the text changes size (passages above it
  // drawn for the first time, the size of the Greek), a sheet only when the width changes (a turned phone, a resized window)
  useEffect(() => {
    const t = textRef.current;
    if (!word || !t) return;
    let last: { w: number; h: number } | null = null;
    const ro = new ResizeObserver(([e]) => {
      const now = { w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) };
      if (last && (now.w !== last.w || (now.h !== last.h && wordAtRef.current && "note" in wordAtRef.current))) placeWordRef.current();
      last = now;
    });
    ro.observe(t);
    return () => ro.disconnect();
  }, [word]);
  const rove = (w: HTMLElement) => {
    textRef.current?.querySelectorAll<HTMLElement>('[data-w][tabindex="0"]').forEach((x) => { if (x !== w) x.tabIndex = -1; });
    w.tabIndex = 0;
  };
  useEffect(() => {
    const a = textRef.current;
    if (a && !a.querySelector('[data-w][tabindex="0"]')) { const f = a.querySelector<HTMLElement>("[data-w]"); if (f) f.tabIndex = 0; }
  });
  const onTextKey = (e: React.KeyboardEvent<HTMLElement>) => {
    const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    if (!w || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openWord(w); return; }
    const all = [...e.currentTarget.querySelectorAll<HTMLElement>("[data-w]")];
    const i = all.indexOf(w);
    let to: HTMLElement | undefined;
    if (e.key === "ArrowRight") to = all[i + 1];
    else if (e.key === "ArrowLeft") to = all[i - 1];
    else if (e.key === "Home") to = all[0];
    else if (e.key === "End") to = all[all.length - 1];
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const r = w.getBoundingClientRect();
      const next = e.key === "ArrowDown"
        ? all.slice(i + 1).find((x) => x.getBoundingClientRect().top > r.bottom - 2)
        : all.slice(0, i).reverse().find((x) => x.getBoundingClientRect().bottom < r.top + 2);
      if (next) {
        // on that line, the word nearest the same place across
        const top = next.getBoundingClientRect().top;
        const line = all.filter((x) => Math.abs(x.getBoundingClientRect().top - top) < 2);
        const dx = (x: HTMLElement) => Math.abs(x.getBoundingClientRect().left - r.left);
        to = line.reduce((a, b) => (dx(b) < dx(a) ? b : a));
      }
    } else return;
    // these keys stay in the text (← → would otherwise turn the page)
    e.preventDefault(); e.stopPropagation();
    if (to) { rove(to); to.focus(); }
  };

  // clicks inside the text: words open the look-up; margin references and marks act on the passage
  const onTextClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    const beat = el.closest<HTMLElement>("[data-beat]");
    if (beat) { playLine(beat.closest<HTMLElement>(`.${styles.line}`)!); return; }
    const w = el.closest<HTMLElement>("[data-w]");
    if (w) { openWord(w); return; }
    const r = el.closest<HTMLElement>("[data-row]");
    if (r) {
      const row = root().querySelector(`[data-key="${CSS.escape(r.dataset.row!)}"]`);
      const spans = row ? [...row.querySelectorAll<HTMLElement>("[data-u] [data-w]")] : [];
      selectSpans(spans, r.getBoundingClientRect());
      return;
    }
    const mk = el.closest<HTMLElement>("[data-mark]");
    if (mk) {
      const m = marks.find((x) => x.id === mk.dataset.mark);
      if (!m) return;
      if (m.kind === "note") setOpenNote(openNote === m.id ? null : m.id);
      else if (m.kind === "xref" && m.link) openInPane(pane === 1 ? 2 : 1, m.link.work, m.link.ed, m.link.start.u);
      else { useMarks.getState().remove(m.id); toast(m.kind === "bookmark" ? "Bookmark removed." : "Removed from favourites."); }
      return;
    }
    // one book: a click or a tap on the page away from any word or button puts the look-up away, from the margin or its sheet, and brings the foot
    // bar back on a phone (the quiet desk, ticket 09, the owner, 2026-10-30)
    if (!contained && !el.closest("a, button, input, select, textarea, label, summary, [role='button']") && !getSelection()?.toString()) {
      if (word) closeWord();
      showFoot();
    }
  };

  // ------------------------------------------------------------ Echoes
  function openEchoes(start: Point, end: Point, from: { at: Point; label: string } | null = null) {
    if (!doc || !grcText || !work) return;
    setCameFrom(from && { to: "echoes", ...from });
    setEcho({ work: workId, urn: grcText.urn, doc, title: work.title, start, end });
    setWord(null); setVocabOpen(false); setPlacesOpen(false); setTalkOpen(false); setMsOpen(false);
  }
  const echoJump = (t: EchoTarget) => {
    setCameFrom(null);   // it is another passage now: there is no word to go back to
    const q = new URLSearchParams(params.toString());
    const k = (x: string) => (pane === 1 ? x : `${x}2`);
    if (t.work !== workId) q.delete(k("tr"));
    q.set(k("w"), t.work); q.set(k("ed"), t.ed); q.set(k("at"), t.at);
    for (const x of ["hl", "find", "tu"]) q.delete(k(x));
    nav.go(q, "push");
  };
  // the words Echoes found, marked wherever they are on the page
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const names = [`echo-${pane}`, `echo-self-${pane}`];
    const here = grcText ? echoMarks?.get(grcText.urn) : undefined;
    if (!reg || !H || !here || !rows.length) return;
    const ranges: Range[] = [], self: Range[] = [];
    root().querySelectorAll<HTMLElement>("[data-u]").forEach((unit) => {
      const ws = here.get(unit.dataset.u!);
      if (!ws) return;
      const spans = unit.querySelectorAll("[data-w]");
      for (const { i, self: me } of ws) {
        const sp = spans[i];
        if (!sp) continue;
        const r = new Range(); r.selectNodeContents(sp);
        (me ? self : ranges).push(r);
      }
    });
    reg.set(names[0], new H(...ranges));
    reg.set(names[1], new H(...self));
    return () => { for (const n of names) reg.delete(n); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [echoMarks, rows, grcText?.urn, pane]);

  // the words that name places, marked while the Places panel is open
  useEffect(() => {
    const reg = typeof CSS !== "undefined" ? (CSS as unknown as { highlights?: Map<string, unknown> }).highlights : undefined;
    const H = (globalThis as unknown as { Highlight?: new (...r: Range[]) => unknown }).Highlight;
    const name = `place-${pane}`;
    if (!reg || !H || !placeMarks || !placesOpen || !rows.length) return;
    const ranges: Range[] = [];
    root().querySelectorAll<HTMLElement>("[data-u]").forEach((unit) => {
      const ks = placeMarks.get(unit.dataset.u!);
      if (!ks) return;
      unit.querySelectorAll<HTMLElement>("[data-w]").forEach((sp) => {
        if (!ks.has(greekKey(sp.dataset.w!))) return;
        const r = new Range(); r.selectNodeContents(sp); ranges.push(r);
      });
    });
    reg.set(name, new H(...ranges));
    return () => { reg.delete(name); };
  }, [placeMarks, placesOpen, rows, pane]);
  const jumpToRef = useCallback((ref: string) => {
    const row = rows.find((r) => r.greek.some((u) => u.ref.join(".") === ref));
    if (row) jumpToRow(row.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  /** Show a passage in the given pane (opening the second pane if needed). */
  const openInPane = (target: 1 | 2, w: string, ed: string, u: string) => {
    const q = new URLSearchParams(params.toString());
    const k = (x: string) => (target === 1 ? x : `${x}2`);
    q.set(k("w"), w); q.set(k("ed"), ed); q.set(k("at"), u);
    if (!q.get(k("tr"))) q.delete(k("tr"));
    nav.go(q);
  };
  const closePane = () => {
    const q = new URLSearchParams(params.toString());
    for (const k of ["w2", "ed2", "tr2", "at2"]) q.delete(k);
    nav.go(q);
  };
  /** Shrink the reader into the floating window (this book only, or both), and step back to the page before. */
  const floatAway = (which: "this" | "all") => {
    const q = new URLSearchParams();
    if (which === "all") for (const [k, v] of params) q.set(k, v);
    else for (const k of ["w", "ed", "tr", "at"]) { const v = P(k); if (v) q.set(k, v); }
    for (const k of ["hl", "find", "tu", "hl2", "find2", "tu2"]) q.delete(k);
    const here = topKey();
    if (here) q.set("at", here);
    if (which === "all" && split && paneTops[pane === 1 ? 2 : 1]) q.set(pane === 1 ? "at2" : "at", paneTops[pane === 1 ? 2 : 1]!);
    useFloat.getState().float(q.toString());
    if (which === "this" && pane === 2) { closePane(); return; }
    // back to the page you came from (never off the site); the Mouseion if the reader was the first page
    router.push(lastOtherPage() ?? AREAS.library.href);
  };


  // ------------------------------------------------------------ synced scrolling (same work in both panes)
  const sync = useUI((s) => s.syncScroll);
  const otherWork = params.get(pane === 1 ? "w2" : "w");
  const canSync = split && otherWork === workId;
  useEffect(() => {
    const el = rootRef.current;
    if (!canSync || !sync || !el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (useUI.getState().activePane !== pane) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const top = el.getBoundingClientRect().top + 70;
        const row = [...el.querySelectorAll<HTMLElement>("[data-key]")].find((r) => r.getBoundingClientRect().bottom > top);
        if (row) useUI.getState().setScrollAnchor({ pane, key: row.dataset.key! });
      }, 60);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const unsub = useUI.subscribe((s, prev) => {
      const a = s.scrollAnchor;
      if (!a || a === prev.scrollAnchor || a.pane === pane) return;
      // find the row here that contains the other pane's passage, or the nearest before it
      const idxOf = order.get(a.key);
      if (idxOf === undefined) return;
      const target = [...el.querySelectorAll<HTMLElement>("[data-u]")].reverse().find((u) => (order.get(u.dataset.u!) ?? Infinity) <= idxOf);
      target?.closest<HTMLElement>("[data-key]")?.scrollIntoView({ block: "start" });
    });
    return () => { el.removeEventListener("scroll", onScroll); unsub(); clearTimeout(timer); };
  }, [canSync, sync, pane, order]);

  // ------------------------------------------------------------ render
  // (until there is a book to show, the site's header stays on this page, so there is a way on: globals.css, data-nobook)
  if (isPrivate && mine.state !== "ready") return <div data-nobook=""><MineStatus s={mine} work={workId} retry={() => setRetry((r) => r + 1)} onOpenMine={() => onOpenMine()} /></div>;
  if (!workId || (idx && !work)) {
    // the reader with no book: the normal page head, with one clear next step (PAGE-RULES.md, rule 6)
    return (
      <div data-nobook="">
      <PageHead path={trail("reader")} title={workId ? "This work is not in the library" : AREAS.reader.name}
        piece={null}
        purpose={workId
          ? <>There is no work <code>{workId}</code> in the catalogue: the link may be mistyped. Choose something to read in {AREAS.library.name}.</>
          : <>{AREAS.reader.origin} Choose a text in {AREAS.library.name}, and it opens here.</>}
        action={<div className={styles.statusActions}>
          <Link className="btn" href={AREAS.library.href} transitionTypes={["page-turn"]}>Choose a text <span className="arr" aria-hidden="true">→</span></Link>
          {moderator && <button type="button" className="btn ghost" onClick={() => onOpenMine()}>Private collection</button>}
        </div>} />
      </div>
    );
  }

  /** Look up the next (1) or previous (-1) word on the page, from the one being looked up. */
  function stepWord(dir: 1 | -1) {
    const words = [...(textRef.current?.querySelectorAll<HTMLElement>("[data-w]") ?? [])];
    const cur = textRef.current?.querySelector<HTMLElement>(`.${styles.sel}`);
    const next = cur ? words[words.indexOf(cur) + dir] : undefined;
    if (next) openWord(next);
  }

  /** Close the look-up, back to the word that was looked up, so the keyboard carries on from there. */
  function closeWord() {
    const back = root().querySelector<HTMLElement>(`.${styles.sel}`);
    setWord(null); setWordAt(null); root().querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel));
    back?.focus({ preventScroll: true });
  }

  const chunkInfo = doc?.chunks[chunk];
  // how many of the reading modes are on, for the sign on the Study button (review fix list, slice 8; "Fit lines" is no mode any more: the quiet desk, ticket 10)
  const modesOn = [translit, cases, !!mInfo && metreOn, !!trText && !cmpText && columns === "both" && tryFirst].filter(Boolean).length;
  const sortedMarks = [...allMarks].sort((a, b) => cmp(a.start, b.start, order));
  // the panels a row of Study opens: one at a time, and each one shows "Back to Study"; a row again closes it
  const SETTERS: Record<StudyPanel, (open: boolean) => void> = { find: setFindOpen, vocab: setVocabOpen, places: setPlacesOpen, ms: setMsOpen, talk: setTalkOpen, cmp: setCmpListOpen };
  const openPanel = (p: StudyPanel) => {
    const was = panelsOpen[p];
    (Object.keys(SETTERS) as StudyPanel[]).forEach((k) => SETTERS[k](false));
    setWord(null); setEcho(null);
    if (was) { setStudyFor(null); return; }
    if (p === "find") { openFind(true); return; }
    SETTERS[p](true);
    setStudyFor(p);
  };
  /** Back to Study, from a panel it opened: the panel closes, Study opens again, and the keyboard returns to the row that opened the panel. */
  const backToStudy = (p: StudyPanel) => { SETTERS[p](false); setStudyFor(null); setStudyRow(p); setDrop("study"); };
  const studyBack = (p: StudyPanel): Back | undefined => (studyFor === p ? { to: "Study", onBack: () => backToStudy(p) } : undefined);
  const aaMenu = <AaMenu columns={columns} onColumns={(c) => setSettings({ columns: c })} hasTranslation={!!trText} comparing={!!cmpText} />;
  // Study: every other tool, in one place (StudyMenu.tsx). The same menu in the foot bar of one book and in the top bar of each of two books.
  const studyMenu = work && grcText ? (
    <StudyMenu bar={single ? "foot" : "pane"} work={work} grcText={grcText} trText={trText} cmpText={cmpText} editions={editions} columns={columns}
      hasMetre={!!mInfo} open={{ ...panelsOpen, listen: listenOpen, keys: help }}
      onPanel={openPanel} onListen={() => setListenOpen(!listenOpen)} onKeys={() => setHelp((h) => !h)} canDiff={canDiff} onDiff={goDiff}
      onEdition={(v) => nav.go(query({ ed: v, at: topKey() ?? undefined }))} onTranslation={(v) => nav.go(query({ tr: v, at: topKey() ?? undefined }))}
      onCompare={(v) => {
        const q = query({ at: topKey() ?? undefined });
        if (v) q.set(pk("cmp"), v); else { q.delete(pk("cmp")); q.delete(pk("cmpx")); }
        nav.go(q);
      }}
      marks={sortedMarks} onMark={(m) => nav.go(query({ at: m.start.u }))} markerCounts={markerCounts}
      split={split} canFloat={!floating && pane === 1} onFloat={() => floatAway("all")} onSecond={() => onOpenSecond(true)}
      isPrivate={isPrivate} notesHref={isPrivate && mineDoc && mineDoc.status !== "imported" ? `${PRIVATE_TRANSLATIONS}?id=${encodeURIComponent(mineDoc.id)}` : null}
      moderator={moderator && !floating} onMine={() => onOpenMine(true)} />
  ) : null;

  // two books side by side, and the floating window: a bar along the top of each book (the page and Go to, Find, Listen, then Aa and Study); one
  // book has its bar along the foot instead (ReaderBar.tsx)
  const barRow = load.state === "ready" && doc && chunkInfo && !single ? (
    <>
      <Where doc={doc} chunk={chunk} layout="row" onPage={goChunk} onGoto={goTo} inputRef={gotoRef} focusSignal={gotoWant} />
      <button type="button" className={`chip ${styles.findBtn}`} aria-pressed={findOpen} onClick={() => (findOpen ? setFindOpen(false) : openFind())} title="Find a word or phrase anywhere in this text (/ or Ctrl+F)">
        <Icon name="search" /> Find
      </button>
      {canDiff && (
        <span className={styles.diffNav} role="group" aria-label="Differences between the editions">
          <button type="button" className="icon-btn framed" onClick={() => goDiff(-1)} disabled={!allDiffs.length} aria-label="Previous difference" title="Previous difference"><Icon name="back" /></button>
          <span>{allDiffs.length.toLocaleString("en-GB")} {allDiffs.length === 1 ? "difference" : "differences"}</span>
          <button type="button" className="icon-btn framed" onClick={() => goDiff(1)} disabled={!allDiffs.length} aria-label="Next difference" title="Next difference"><Icon name="next" /></button>
        </span>
      )}
      {/* wide screens: Listen sits here (on phones it is a row of Study) */}
      {trText && !cmpText && (
        <button type="button" className={`chip ${styles.listenBtn}`} aria-pressed={listenOpen} onClick={() => setListenOpen(!listenOpen)} title="Hear the English translation read aloud, passage by passage">
          <Icon name="listen" /> Listen
        </button>
      )}
      <div className={styles.barEnd}>
        <AaStudy bar="pane" aa={dropOf("aa")} study={dropOf("study")} aaMenu={aaMenu} studyMenu={studyMenu} modesOn={modesOn} />
      </div>
    </>
  ) : null;

  // the edition and the translation, named once as plain words (the title page, and the head of each of two books); the choices are in Study
  const edLine = work && grcText ? (
    <div className={styles.edLine}>
      <span className={styles.ed}><span className={styles.edKind}>Greek</span> {describe(grcText, work.texts)}</span>
      {second && <>
        <span className={styles.dot} aria-hidden="true">·</span>
        <span className={styles.ed}><span className={styles.edKind}>{cmpText ? "Compared with" : "English"}</span> {describe(second, work.texts)}</span>
      </>}
    </div>
  ) : null;
  // what stands where the foot bar was, for the bar to give way to (ReaderBar.module.css): the look-up's sheet, a panel's sheet, the passage toolbar
  const covers = [lookSheet && "lookup", sideOpen && "panel", sel && "toolbar"].filter(Boolean).join(" ");
  return (
    <div ref={rootRef} data-reader="" className={`${styles.reader} ${single ? styles.single : ""} ${styles["cols-" + (cmpText ? "both" : columns)] ?? ""} ${verses ? styles.verses : ""} ${poetry ? styles.poetry : ""} ${sideOpen ? styles.withPanel : ""} ${lookOver ? styles.lookOver : ""} ${split ? styles.pane : ""} ${split && active ? styles.activePane : ""} ${floating ? styles.floating : ""}`}
      style={{ "--num-n": numFigures } as React.CSSProperties} data-covers={covers || undefined}
      onPointerDown={() => useUI.getState().setActivePane(pane)} onFocusCapture={() => useUI.getState().setActivePane(pane)}>
      {load.state === "ready" && <ScrollMarkers rootRef={rootRef} contained={contained} items={markerItems} onJump={jumpToRow} depKey={`${chunk}|${rows.length}|${columns}|${translit}|${!!metre}|${word ? 1 : 0}`} />}
      {split && (
        <div className={styles.paneBar}>
          <span className="label">{pane === 1 ? "Left book" : "Right book"}</span>
          {canSync && <button type="button" className="chip" aria-pressed={sync} onClick={() => useUI.getState().setSyncScroll(!sync)}>Sync scrolling</button>}
          {!floating && <button type="button" className="chip" onClick={() => floatAway("this")} title="Keep reading this book in a small window while you use the rest of the site">Float this book</button>}
          {pane === 2 && <button type="button" className="chip" onClick={closePane}>Close this book</button>}
        </div>
      )}
      {single ? (showCover ? (
        <ReaderCover workId={work?.id ?? ""} title={work?.title ?? ""} greek={grcText?.label} author={author?.name} authorId={isPrivate ? undefined : author?.id}
          seal={isPrivate ? <span className={styles.privateTag}><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>Only you can see this</span> : null}
          orig={work?.orig && work.orig !== grcText?.label ? <OrigTitle work={work} full /> : null}
          editions={edLine} />
      ) : null) : (
      <header className={`wrap ${styles.top}`}>
        {!floating && (
          <>
            <nav className={styles.crumbs} aria-label="Breadcrumbs">
              <Link href={AREAS.library.href} transitionTypes={["page-turn"]}>{AREAS.library.name}</Link>
              {isPrivate ? (
                <><span aria-hidden="true">›</span><button type="button" className={styles.crumbBtn} onClick={() => onOpenMine()}>Private collection</button>
                  <span className={styles.privateTag}><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>Only you can see this</span></>
              ) : author && <><span aria-hidden="true">›</span><Link href={`${AREAS.library.href}/author?a=${author.id}`} transitionTypes={["page-turn"]}>{author.name}</Link></>}
            </nav>
            <h1 className={styles.title}>{work?.title ?? " "}
              {grcText?.label && grcText.label !== work?.title && <span className={styles.titleGr} lang="grc">{grcText.label}</span>}
            </h1>
            {work?.orig && work.orig !== grcText?.label && <p className={styles.titleOrig}><OrigTitle work={work} full /></p>}
          </>
        )}
        {floating && split && <p className={styles.floatTitle}>{work?.title}</p>}

        {/* the edition named once, quietly, under the title; Study, in the bar below, has the choices (and a second book beside this one) */}
        {edLine && !floating && <div className={styles.editions}>{edLine}</div>}
      </header>
      )}

      {load.state === "loading" && <div className={`wrap ${styles.status}`}><span className={`meander ${styles.loadingBand}`} aria-hidden="true" /><p>{load.step}</p></div>}
      {load.state === "error" && (
        <div className={`wrap ${styles.status}`}>
          <p className={styles.warn}>{load.message}</p>
          <div className={styles.statusActions}>
            <button type="button" className="btn" onClick={() => setRetry((r) => r + 1)}>Try again</button>
            <Link className="btn ghost" href={AREAS.downloads.href} transitionTypes={["page-turn"]}>Offline library</Link>
          </div>
        </div>
      )}

      {load.state === "ready" && doc && chunkInfo && (
        <>
          {/* two books, or the floating window: one slim row that stays at the top while reading (the page and Go to, Find and Listen, then Aa and Study).
              One book alone has its bar along the foot instead (ReaderBar). */}
          {!single && <div className={`wrap ${styles.bar}`}>{barRow}</div>}

          {/* a book opens on its text, under a one-line title, from the second time it is opened on this device; the page's name is the part of
              the work it is ("Book 1") */}
          {single && !showCover && <ReaderTitle title={work?.title ?? ""} greek={grcText?.label} author={author?.name} authorId={isPrivate ? undefined : author?.id} page={chunkInfo.label} lines={firstInLines && (!!cmpText || columns !== "trans")} only={isPrivate} />}

          {cases && (
            <p className={`wrap ${styles.legend} ${styles.caseKey}`} aria-label="Case colours" title="From GLAUx's analyses of this text">
              <span data-case="nominative">nominative</span> <span data-case="genitive">genitive</span> <span data-case="dative">dative</span>
              <span data-case="accusative">accusative</span> <span data-case="vocative">vocative</span>
              <span className={`muted ${styles.legendCredit}`}>From GLAUx&apos;s analyses of this text.</span>
            </p>
          )}
          {metreOn && mInfo && <MetreBar info={mInfo} about={mIndex?.about ?? null} />}
          {translit && <p className={`wrap ${styles.legend}`}><span className="muted">Transliteration uses a simple scheme: η ē, ω ō, rough breathing h, υ y (u in diphthongs), χ ch, φ ph, θ th, iota subscript i; accents are left out.</span></p>}
          {help && (
            <div className={`wrap ${styles.help}`} role="note">
              <p><kbd>←</kbd> <kbd>→</kbd> previous / next page · <kbd>g</kbd> go to a reference · <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>F</kbd> find in this text · click a word to look it up (or <kbd>Tab</kbd> into the text, move with the arrow keys, <kbd>Enter</kbd> to look up) · select words or click a passage number for bookmarks, notes, highlights, sharing and Echoes · <kbd>Esc</kbd> close</p>
            </div>
          )}

          {cmpText && grcText && (
            <section className={`wrap ${styles.compare}`} aria-label="Comparing two editions">
              {canDiff ? (
                <>
                  <p className={styles.compareKey}>
                    Where they differ, the words are marked: <mark className={styles.keyA}>{describe(grcText, work!.texts)}</mark> on the left, <mark className={styles.keyB}>{describe(cmpText, work!.texts)}</mark> on the right.{" "}
                    <span className="muted">{strict === "readings"
                      ? "Differences of reading only: accents, breathings, capitals, punctuation and word division are not counted."
                      : "Spelling too: accents, breathings and elision count as differences."}</span>
                  </p>
                  <div className={styles.compareTools}>
                    <span className={styles.compareCount} aria-live="polite">
                      {(() => { const n = allDiffs.filter((d) => d.chunk === chunk).length; return `${n} ${n === 1 ? "passage differs" : "passages differ"} on this page`; })()} · {allDiffs.length.toLocaleString("en-GB")} in the whole text
                    </span>
                    <button type="button" className="chip" onClick={() => goDiff(-1)} disabled={!allDiffs.length}><Icon name="back" />Previous difference</button>
                    <button type="button" className="chip" onClick={() => goDiff(1)} disabled={!allDiffs.length}>Next difference<Icon name="next" /></button>
                    <button type="button" className="chip" aria-pressed={cmpListOpen} onClick={() => { setCmpListOpen(!cmpListOpen); setWord(null); setEcho(null); setVocabOpen(false); setPlacesOpen(false); setTalkOpen(false); setMsOpen(false); setFindOpen(false); }}><Icon name="variants" />List of differences</button>
                    <label className={styles.compareCheck}>
                      <input type="checkbox" checked={strict === "spelling"} onChange={(e) => nav.go(setParam("cmpx", e.target.checked ? "1" : null))} /> Spelling too
                    </label>
                    <button type="button" className="chip" onClick={stopCompare}><Icon name="close" />Stop comparing</button>
                  </div>
                </>
              ) : comparing ? (
                <p className={styles.compareKey}>
                  These two editions number their passages differently, so they stand side by side here but cannot be compared word by word.{" "}
                  <button type="button" className="chip" onClick={stopCompare}><Icon name="close" />Stop comparing</button>
                </p>
              ) : null}
            </section>
          )}
          {(missing.length > 0 || extraHere || outOfStep) && (
            <div className={`wrap ${styles.cover}`} role="note" aria-label="About the translation on this page">
              {missing.length > 0 && (
                <p>
                  <b>{missing.length === rows.length ? "This page has no English translation." : "Some passages on this page have no English."}</b>{" "}
                  {missing.length === rows.length ? "This part of the work has not been translated" : "They have not been translated (they are marked “Not translated”)"} in
                  this translation, so there is no English to show. It is not a bug: translators sometimes leave passages out, or translate only some books.
                  {translations(work!).length > 1 && " Another translation in the menu above may include them."}
                </p>
              )}
              {outOfStep && (
                <p>
                  <b>This translation is numbered out of step with the Greek in places,</b> so some of its English stands a passage before
                  or after the Greek it translates. The fault is in the translation&apos;s file, not the site.
                  {translations(work!).length > 1 && " Another translation in the menu above lines up with the Greek."}
                </p>
              )}
              {extraHere && (
                <p>
                  Some of the English here has no matching passage in this Greek edition (an appendix, say, or a part the edition does not print),
                  so it stands beside the nearest passage before it.
                </p>
              )}
            </div>
          )}

          {/* the editions are named under the title: above the columns only when two editions, or two books, stand side by side */}
          {(cmpText || split) && (
            <div className={`wrap ${styles.cols}`} aria-hidden="true">
              <span />
              <span className="label">Greek · {describe(grcText!, work!.texts)}</span>
              <span className="label">{cmpText ? `Greek · ${describe(cmpText, work!.texts)}` : trText ? `English · ${describe(trText, work!.texts)}` : ""}</span>
            </div>
          )}

          {/* data-reading: the text being read, sized by the reader's own choices in Settings (scripts/check-design.mjs) */}
          <article ref={textRef} data-reading="" className={`wrap ${styles.text} ${metre ? styles.metreOn : ""}`} onClick={onTextClick} onKeyDown={onTextKey} onMouseUp={onTextMouseUp} onDragStart={onDragStart} aria-label={`${cite}, ${chunkInfo.label}`}>
            {rows.map((r) => <RowView key={r.key} row={r} marks={marksByRow.get(r.key) ?? noMarks} openNote={openNote} onCloseNote={() => setOpenNote(null)} translit={translit} metre={metre} verses={verses} inBook={inBook}
              tryFirst={tryFirst && !!trText && !cmpText && columns === "both"} trGreek={!!cmpText}
              english={trText && !cmpText && columns === "greek" ? { open: openOnes.has(r.key) || listenOne === r.key, credit: trCredit, onToggle: () => (listenOne === r.key && !openOnes.has(r.key) ? setListenOne(null) : toggleOne(r.key)) } : null} />)}
          </article>
          {sel && <PassageToolbar sel={sel} onAction={act} onClose={() => { setSel(null); getSelection()?.removeAllRanges(); }}
            xref={split ? (pendingXref && pendingXref.pane !== pane ? "here" : "start") : null}
            word={selWord} onLookUp={selWord ? () => { const s = selWord.span; setSel(null); getSelection()?.removeAllRanges(); openWord(s); } : undefined} ask={!isPrivate} />}
          {share && <ShareDialog data={share} onClose={() => setShare(null)} />}

          <div className={`wrap ${styles.bottom}`}>
            {single && <span className={styles.hint}>Tap a word to look it up</span>}
            <span className={styles.bottomGo}>
              <button type="button" className="btn ghost" onClick={() => goChunk(chunk - 1)} disabled={chunk === 0} title="The page before (left arrow key)"><Icon name="back" />{chunk > 0 ? doc.chunks[chunk - 1].label : ""}</button>
              <button type="button" className={single ? "btn ghost" : "btn"} onClick={() => goChunk(chunk + 1)} disabled={chunk === doc.chunks.length - 1} title="The page after (right arrow key)">{single ? "Continue to " : ""}{chunk < doc.chunks.length - 1 ? doc.chunks[chunk + 1].label : ""}<Icon name="next" /></button>
            </span>
          </div>

          {from && isPrivate && (
            <p className={`wrap ${styles.source}`}>
              From your private collection: kept only in the site&apos;s database, where nobody but you can open it, and never in the site&apos;s code.
            </p>
          )}
          {from && !isPrivate && (
            <p className={`wrap ${styles.source}`}>
              Greek read from {FROM_TEXT[from.grc]}{from.tr ? `, translation from ${FROM_TEXT[from.tr]}` : ""}. Files from{" "}
              {idx!.catalog.collections[grcText!.col].repo} ({grcText!.urn}), shown exactly as published. CC BY-SA 4.0.
            </p>
          )}
        </>
      )}

      {/* in a pane that scrolls in its own box the button scrolls that pane; otherwise the page (one button, not one per book) */}
      {doc && <BackToTop paneRef={contained ? rootRef : undefined} page={pane === 1} />}

      {/* one book: the foot bar (the way back, where you are, Aa and Study); until the text is up, the way back alone */}
      {single && (
        <ReaderBar rootRef={rootRef} book={load.state === "ready" && doc && chunkInfo ? {
          doc, chunk, topRow, order, modesOn, aa: dropOf("aa"), aaMenu, study: dropOf("study"), studyMenu,
          goto: dropOf("goto"), gotoMenu: <GotoMenu doc={doc} chunk={chunk} onPage={goChunk} onGoto={goTo} onDone={() => setDrop(null)} inputRef={gotoRef} focusSignal={gotoWant} />,
        } : null} />
      )}

      {/* each panel keeps its own failures to itself: the text stays readable */}
      {vocabOpen && doc && !lookSheet && (
        <PanelGuard name="vocabulary list" className={styles.panel} onClose={() => setVocabOpen(false)}>
          <VocabPanel work={lexWork} doc={doc} pageKeys={pageKeys} back={studyBack("vocab")}
            onClose={() => setVocabOpen(false)} onPick={(lemma) => { root().querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel)); setWord({ w: lemma, ctx: null, at: null }); placeWord(); }} />
        </PanelGuard>
      )}
      {findOpen && doc && !lookSheet && !echo && !vocabOpen && !placesOpen && !talkOpen && !msOpen && (
        <PanelGuard name="find panel" className={styles.panel} onClose={() => setFindOpen(false)}>
          <FindPanel doc={doc} placed={cmpText ? null : placed} initial={findQ} here={findHere} onQuery={setFindQ} onJump={findJump} onMarks={setFindMarks} back={studyBack("find")}
            onClose={() => { setFindOpen(false); requestAnimationFrame(() => root().querySelector<HTMLElement>(single ? `[aria-controls="${dropOf("study").id}"]` : `.${styles.findBtn}`)?.focus({ preventScroll: true })); }} />
        </PanelGuard>
      )}
      {cmpListOpen && canDiff && grcText && cmpText && !lookSheet && !echo && !vocabOpen && !placesOpen && !talkOpen && !msOpen && !findOpen && (
        <PanelGuard name="list of differences" className={styles.panel} onClose={() => setCmpListOpen(false)}>
          <ComparePanel diffs={allDiffs} a={describe(grcText, work?.texts)} b={describe(cmpText, work?.texts)} title={work?.title ?? workId} onJump={goToDiff} back={studyBack("cmp")} onClose={() => setCmpListOpen(false)}
            onNotebook={(ds, what) => setNbPick({ what, items: ds.map((x) => ({ kind: "variant" as const, work: workId, urn: grcText.urn, other: cmpText.urn, from: x.key, a: x.a, b: x.b })) })} />
        </PanelGuard>
      )}
      {nbPick && <NotebookPicker items={nbPick.items} what={nbPick.what} onClose={() => setNbPick(null)} />}
      {sentenceAt && doc && !lookSheet && !echo && !vocabOpen && !placesOpen && !talkOpen && !msOpen && !findOpen && !(cmpListOpen && canDiff) && (
        <PanelGuard name="sentence panel" className={styles.panel} onClose={() => { setSentenceAt(null); setCameFrom(null); }}>
          <SentencePanel work={lexWork} doc={doc} at={sentenceAt} onMarks={setSynMarks}
            back={cameFrom?.to === "sentence" ? { to: <span lang="grc">{cameFrom.label}</span>, onBack: backToWord } : undefined}
            onNotebook={grcText ? (from, to, grc) => setNbPick({ what: "this sentence", items: [{ kind: "passage", work: workId, urn: grcText.urn, from, to, grc }] }) : undefined}
            onClose={() => { setSentenceAt(null); setCameFrom(null); root().querySelectorAll(`.${styles.sel}`).forEach((x) => x.classList.remove(styles.sel)); }} />
        </PanelGuard>
      )}
      {listenOpen && trText && !cmpText && work && rows.length > 0 && (
        <Listen rows={rows} root={root} startKey={topRow} title={work.title} alone={columns === "greek"} onShowEnglish={setListenOne}
          onNextPage={doc && chunk < doc.chunks.length - 1 ? () => goChunkRef.current(chunk + 1) : null} onClose={() => setListenOpen(false)} />
      )}
      {talkOpen && !isPrivate && !lookSheet && !echo && (
        <PanelGuard name="talk panel" className={styles.panel} onClose={() => setTalkOpen(false)}>
          <TalkPanel work={workId} pageKeys={pageKeys} onJump={jumpToRef} back={studyBack("talk")} onClose={() => setTalkOpen(false)} />
        </PanelGuard>
      )}
      {placesOpen && doc && !lookSheet && !echo && (
        <PanelGuard name="places panel" className={styles.panel} onClose={() => setPlacesOpen(false)}>
          <PlacesPanel work={lexWork} doc={doc} pageKeys={pageKeys} onJump={jumpToRef} onMarks={setPlaceMarks} back={studyBack("places")} onClose={() => setPlacesOpen(false)} />
        </PanelGuard>
      )}
      {msOpen && !isPrivate && doc && !lookSheet && !echo && (() => {
        const row = rows.find((r) => r.key === topRow) ?? rows[0];
        const units = row?.greek ?? [];
        return (
          <PanelGuard name="manuscript panel" className={styles.panel} onClose={() => setMsOpen(false)}>
            <ManuscriptPanel work={workId} units={units} label={`${work?.title ?? ""} ${row ? rangeLabel(units[0]?.ref.join(".") ?? row.key, units[units.length - 1]?.ref.join(".") ?? row.key) : ""}`}
              book={doc.levels.length > 1 && units[0] ? units[0].ref[0] : null} back={studyBack("ms")} onClose={() => setMsOpen(false)} />
          </PanelGuard>
        );
      })()}
      {echo && !lookSheet && (
        <PanelGuard name="Echoes panel" className={styles.panel} onClose={() => { setEcho(null); setCameFrom(null); }}>
          <EchoesPanel q={echo} onJump={echoJump} onMarks={setEchoMarks} onClose={() => { setEcho(null); setCameFrom(null); }}
            back={cameFrom?.to === "echoes" ? { to: <span lang="grc">{cameFrom.label}</span>, onBack: backToWord } : undefined} />
        </PanelGuard>
      )}
      <PanelGuard name="word look-up" className={word ? styles.panel : undefined} onClose={closeWord}>
        <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} doc={doc} at={word?.at ?? null} workTitle={work?.title ?? null} onEchoes={word?.at ? (label) => openEchoes(word.at!, word.at!, { at: word.at!, label }) : undefined} onClose={closeWord}
          startMore={!!word?.more} backSteps={single && !floating}
          onSentence={word?.at ? (label) => {
            const a = word.at!;
            setWord(null); setEcho(null); setVocabOpen(false); setPlacesOpen(false); setTalkOpen(false); setMsOpen(false); setFindOpen(false); setCmpListOpen(false);
            setCameFrom({ to: "sentence", at: a, label });
            setSentenceAt(a);
          } : undefined}
          onStep={word?.at ? stepWord : undefined}
          sheet={!wordAt || "sheet" in wordAt} note={wordAt && "note" in wordAt ? wordAt.note : null} maxH={wordAt && "sheet" in wordAt ? wordAt.sheet : null} />
      </PanelGuard>
    </div>
  );
}

/** A book of the private collection that is not open yet, or cannot be: why, in a few words, and the way on. */
function MineStatus({ s, work, retry, onOpenMine }: { s: MineState; work: string; retry: () => void; onOpenMine: () => void }) {
  const back = `/read?w=${work}`;
  if (s.state === "waiting" || s.state === "none" || s.state === "ready") {
    return (
      <div className={`wrap ${styles.status}`} aria-busy="true">
        <h1 className="visually-hidden">Private collection</h1>
        <span className={`meander ${styles.loadingBand}`} aria-hidden="true" /><p>Opening your private collection…</p>
      </div>
    );
  }
  const title = { "signed-out": "A private book", private: "This book is private.", missing: "Not in your private collection", broken: "This book cannot be shown", error: "The book could not be opened" }[s.state];
  return (
    <div className={`wrap ${styles.message}`}>
      <h1>{title}</h1>
      {s.state === "signed-out" && <p className="muted"><Link href={`/account?next=${encodeURIComponent(back)}`}>Sign in</Link> to open it.</p>}
      {s.state === "missing" && <p className="muted">Nothing in your private collection has the id “{mineId(work)}”. It may have been removed.</p>}
      {s.state === "broken" && (
        <>
          <p className="muted">It is stored, but no longer passes the check:</p>
          <ul className={styles.mineProblems}>{s.problems.slice(0, 8).map((p, i) => <li key={i}>{p}</li>)}</ul>
          <p className="muted">Download it from the <Link href={PRIVATE_TRANSLATIONS}>shelf in Mine</Link>, mend the file, and add it again.</p>
        </>
      )}
      {s.state === "error" && <p className={styles.warn} role="alert">{s.message}</p>}
      {s.state !== "private" && s.state !== "signed-out" && (
        <div className={styles.statusActions}>
          {s.state === "error" && <button type="button" className="btn" onClick={retry}>Try again</button>}
          <button type="button" className={s.state === "error" ? "btn ghost" : "btn"} onClick={() => onOpenMine()}>Private collection</button>
        </div>
      )}
    </div>
  );
}

/** One book, or two side by side (w2=…), wherever the reader lives (its page, or the floating window). */
export function ReaderBooks() {
  const nav = useNav();
  const split = !!nav.params.get("w2");
  const [picking, setPicking] = useState(false);
  // the private collection's window, opened from either book: a book chosen there opens in that pane
  const [mineFor, setMineFor] = useState<1 | 2 | null>(null);
  // the book whose Study opened the window that is open (the list of books, the private collection), if one did: the window has "Back to Study",
  // which closes it and opens Study there again (the quiet desk, ticket 09, the owner, 2026-10-30)
  const [fromStudy, setFromStudy] = useState<1 | 2 | null>(null);
  const backFor = (tool: string, close: () => void): Back | undefined => (fromStudy
    ? { to: "Study", onBack: () => { close(); setFromStudy(null); dispatchEvent(new CustomEvent("mathesis:study", { detail: { pane: fromStudy, tool } })); } }
    : undefined);
  const openMine = (pane: 1 | 2, id: string) => {
    const q = new URLSearchParams(nav.params.toString());
    const k = (x: string) => (pane === 1 ? x : `${x}2`);
    q.set(k("w"), `mine:${id}`);
    for (const x of ["ed", "tr", "at", "cmp", "cmpx", "hl", "find", "tu"]) q.delete(k(x));
    nav.go(q, "push");
    setMineFor(null);
  };
  const open = (w: string) => {
    const q = new URLSearchParams(nav.params.toString());
    q.set("w2", w);
    for (const k of ["ed2", "tr2", "at2"]) q.delete(k);
    nav.go(q);
    setPicking(false);
  };
  return (
    <div className={`${split ? styles.split : ""} ${nav.floating ? styles.floatBooks : ""} ${styles.page}`} data-split={split ? "" : undefined}>
      <ReaderPane pane={1} split={split} onOpenSecond={(s) => { setPicking(true); setFromStudy(s ? 1 : null); }} onOpenMine={(s) => { setMineFor(1); setFromStudy(s ? 1 : null); }} />
      {split && <ReaderPane pane={2} split onOpenSecond={() => undefined} onOpenMine={(s) => { setMineFor(2); setFromStudy(s ? 2 : null); }} />}
      {picking && <WorkPicker onPick={open} onClose={() => setPicking(false)} back={backFor("second", () => setPicking(false))} />}
      {mineFor && <MineDialog current={nav.params.get(mineFor === 1 ? "w" : "w2")} onOpen={(id) => openMine(mineFor, id)} onClose={() => setMineFor(null)} back={backFor("mine", () => setMineFor(null))} />}
    </div>
  );
}

/** The reader's page: what it shows is in the address (/read?w=…). */
export default function Reader() {
  const params = useSearchParams();
  const router = useRouter();
  const nav = useMemo<ReaderNav>(() => ({
    params: new URLSearchParams(params.toString()),
    go: (q, how = "replace") => router[how](`/read?${q}`, { scroll: false }),
    floating: false,
  }), [params, router]);
  return (
    <ReaderNavContext.Provider value={nav}>
      <ReaderBooks />
    </ReaderNavContext.Provider>
  );
}

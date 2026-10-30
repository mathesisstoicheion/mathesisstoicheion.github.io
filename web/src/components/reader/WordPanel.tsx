"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { decapitalise, isElided, lookupForm } from "@/lib/greek";
import { lookUpWiktionary, type WiktResult, type WiktSense } from "@/lib/lookup/wiktionary";
import { loadWordPack, analyse, type Analysis } from "@/lib/lookup/words";
import { lsjEntries, citationHref, type LsjEntry, type Seg } from "@/lib/lookup/lsj";
import { caseOf } from "@/lib/lookup/postag";
import { lookupCard, treeAt, SOURCE_NAMES, type InSentence } from "@/lib/lookup/card";
import { loadSyntax } from "@/lib/syntax";
import type { TeiDoc } from "@/lib/tei/types";
import { lessonFor } from "@/lib/lookup/lesson-link";
import { coreEntry, type CoreEntry } from "@/lib/lookup/core";
import { countLemma, whereElse } from "@/lib/lookup/occurrences";
import { otherDefinitions, withoutMeaning } from "@/lib/lookup/repeats";
import { certaintyNote } from "@/lib/lookup/certainty";
import { creditsFor } from "@/lib/lookup/credits";
import { placeNamed, shortName, type Place } from "@/lib/map";
import { useSettings } from "@/lib/settings";
import styles from "./Reader.module.css";
import { SidePanel } from "./Panel";
import { useBackSteps } from "./useBackSteps";

export interface WordContext { work: string; unitKey: string; occurrence: number; keys: Set<string>; depth: number }

/** The dictionary forms worth trying for a word as printed. */
export function candidates(word: string): string[] {
  const base = lookupForm(word);
  const out: string[] = [];
  const add = (w: string) => { if (w && !out.includes(w)) out.push(w); };
  if (isElided(word)) {
    for (const v of ["α", "ε", "ο", "ι"]) add(base + v);
    for (const v of ["ά", "έ", "ό", "ί"]) add(base + v);
  } else add(base);
  for (const w of [...out]) if (w !== decapitalise(w)) add(decapitalise(w));
  return out;
}

function Senses({ senses }: { senses: WiktSense[] }) {
  return (
    <ol className={styles.senses}>
      {senses.map((s, i) => (
        <li key={i}><span className="label">{s.pos}</span>{s.lines.map((l, j) => <p key={j}>{l}</p>)}</li>
      ))}
    </ol>
  );
}

/** Shift- or Alt-click a citation to open it beside the current text instead of replacing it. */
function useCiteClick() {
  const router = useRouter();
  return (e: React.MouseEvent, href: string) => {
    if (!(e.shiftKey || e.altKey) || location.pathname !== "/read") return;
    e.preventDefault();
    const target = new URL(href, location.origin).searchParams;
    const q = new URLSearchParams(location.search);
    q.set("w2", target.get("w") ?? "");
    for (const k of ["ed2", "tr2", "at2"]) q.delete(k);
    if (target.get("at")) q.set("at2", target.get("at")!);
    router.replace(`/read?${q}`, { scroll: false });
  };
}

export function Segs({ segs }: { segs: Seg[] }) {
  const onCite = useCiteClick();
  return (
    <>
      {segs.map((s, i) => {
        if (typeof s === "string") return <span key={i}>{s}</span>;
        if ("g" in s) return <span key={i} lang="grc" className={styles.lsjGr}>{s.g}</span>;
        const href = citationHref(s.u);
        // LSJ's text runs a Greek word straight into the citation after it ("μήνιοςPl. R. 390e"): a space between them
        const prev = segs[i - 1];
        const gap = prev && typeof prev !== "string" && "g" in prev ? " " : "";
        return href ? <Fragment key={i}>{gap}<Link href={href} className={styles.cite} onClick={(e) => onCite(e, href)} title="Open this passage in the reader (Shift-click: beside this one)">{s.c}</Link></Fragment> : <span key={i}>{gap}{s.c}</span>;
      })}
    </>
  );
}

export function LsjEntryView({ e, full, tall = false }: { e: LsjEntry; full: boolean; tall?: boolean }) {
  if (!full) return <p className={styles.gloss}>{e.s || "See the full entry."}</p>;
  return (
    <div className={styles.lsj} style={tall ? { maxHeight: "none", overflow: "visible" } : undefined}>
      {e.b.map(([level, label, segs], i) => (
        <p key={i} style={{ paddingLeft: `${Math.max(0, level - 1) * 0.9}em` }}>
          {label && <b className={styles.senseN}>{label}.</b>} <Segs segs={segs} />
        </p>
      ))}
    </div>
  );
}

type Loaded<T> = { key: string; value: T | null; error?: string };

/**
 * Whether a box that clips its contents (the start of LSJ's entry, a few lines tall) has more under the clip. It says so until it has
 * measured, so that "The whole entry" does not come and go as the page settles; it measures again when the box or its contents change
 * size (the width of the window, the Greek face arriving), and only while the clip is on (`on`), so that the answer stands while the
 * clip is lifted. A link under the clip is left out of the keyboard's way (tabindex -1) while it is there, since the keyboard would
 * otherwise stop on something nobody can see; every link comes back when the clip is lifted.
 */
function useClipped(box: HTMLElement | null, on: boolean) {
  const [clipped, setClipped] = useState(true);
  useEffect(() => {
    if (!box) return;
    const measure = () => {
      const links = box.querySelectorAll("a");
      if (!on) { for (const a of links) a.removeAttribute("tabindex"); return; }
      setClipped(box.scrollHeight > box.clientHeight + 1);
      const edge = box.getBoundingClientRect().bottom;
      for (const a of links) { if (a.getBoundingClientRect().top >= edge - 1) a.setAttribute("tabindex", "-1"); else a.removeAttribute("tabindex"); }
    };
    const watch = new ResizeObserver(measure);
    watch.observe(box);
    for (const part of box.children) watch.observe(part);
    return () => watch.disconnect();
  }, [box, on]);
  return clipped;
}

/**
 * A word's dictionary form and one-line meaning, for a quick look without the whole look-up (the
 * passage toolbar on phones): GLAUx's analysis here, then the core vocabulary or LSJ's short definition.
 */
export function useQuickGloss(word: string | null, ctx: WordContext | null) {
  const key = word ? `${ctx?.work}|${ctx?.unitKey}|${ctx?.occurrence}|${word}` : "";
  const [got, setGot] = useState<{ key: string; lemma: string | null; gloss: string }>({ key: "", lemma: null, gloss: "" });
  useEffect(() => {
    if (!word) return;
    let live = true;
    (async () => {
      const pack = ctx ? await loadWordPack(ctx.work).catch(() => null) : null;
      const lemma = pack && ctx ? analyse(pack, word, ctx.unitKey, ctx.occurrence, ctx.keys, ctx.depth)?.lemma ?? null : null;
      const core = await coreEntry(lemma ?? lookupForm(word)).catch(() => null);
      let gloss = core?.def ?? "";
      if (!gloss) {
        for (const h of lemma ? [lemma] : candidates(word)) {
          const r = await lsjEntries(h).catch(() => null);
          if (r?.entries[0]?.s) { gloss = r.entries[0].s; break; }
        }
      }
      if (live) setGot({ key, lemma, gloss });
    })();
    return () => { live = false; };
    // ctx is identified by key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, word]);
  return got.key === key && word ? { lemma: got.lemma, gloss: got.gloss, done: true } : { lemma: null, gloss: "", done: false };
}

type Snap = "peek" | "half" | "full";
/** where the sheet takes a finger: its handle, and a swipe across it (Reader.module.css sets the sheet to the same widths) */
const PHONE = "(max-width: 1099px)";

/**
 * A sheet from the foot of the screen, with a handle and three heights. It opens at "peek" (the word, its
 * grammar and short meaning); drag the handle up for half or all of the room it has (the dictionary),
 * down to close. It never rises over the line being read (maxH, from the reader). Swipe sideways, on the
 * handle or the text, for the next or previous word; the arrow buttons do the same. Returns the handlers
 * for the head and for the body.
 */
function useSheetGestures(ref: React.RefObject<HTMLElement | null>, opts: { on: boolean; snap: Snap; setSnap: (s: Snap) => void; onClose: () => void; onStep?: (dir: 1 | -1) => void; maxH: number | null }) {
  const g = useRef<{ id: number; x: number; y: number; h: number; axis: "" | "x" | "y"; lastY: number; lastT: number; v: number; head: boolean } | null>(null);
  const o = useRef(opts);
  useEffect(() => { o.current = opts; });
  const heights = (el: HTMLElement) => {
    const cap = o.current.maxH ?? Infinity;
    const probe = (s: Snap) => { const was = el.dataset.snap; el.dataset.snap = s; const h = parseFloat(getComputedStyle(el).getPropertyValue("--sheet-h")) || 0; el.dataset.snap = was; return Math.min(h, cap); };
    return { peek: probe("peek"), half: probe("half"), full: probe("full") };
  };
  const down = (head: boolean) => (e: React.PointerEvent) => {
    const el = ref.current;
    if (!o.current.on || e.button !== 0 || !el || !matchMedia(PHONE).matches) return;
    g.current = { id: e.pointerId, x: e.clientX, y: e.clientY, h: el.offsetHeight, axis: "", lastY: e.clientY, lastT: e.timeStamp, v: 0, head };
  };
  const move = (e: React.PointerEvent) => {
    const s = g.current, el = ref.current;
    if (!s || !el || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
      s.axis = Math.abs(dx) > Math.abs(dy) * 1.5 ? "x" : "y";
      if (s.axis === "y" && !s.head) { g.current = null; return; }   // the body scrolls itself
      e.currentTarget.setPointerCapture(e.pointerId);
      if (s.axis === "y") el.classList.add(styles.sheetDragging);
    }
    if (s.axis === "y") {
      s.v = (e.clientY - s.lastY) / Math.max(1, e.timeStamp - s.lastT); s.lastY = e.clientY; s.lastT = e.timeStamp;
      el.style.height = `${Math.max(80, Math.min(o.current.maxH ?? innerHeight, s.h - dy))}px`;
    } else el.style.translate = `${dx * 0.35}px 0`;
  };
  const up = (e: React.PointerEvent, cancelled = false) => {
    const s = g.current, el = ref.current;
    if (!s || !el || s.id !== e.pointerId) return;
    g.current = null;
    const dx = e.clientX - s.x;
    el.style.translate = "";
    if (s.axis === "x") { if (!cancelled && Math.abs(dx) > 56) o.current.onStep?.(dx < 0 ? 1 : -1); return; }
    if (s.axis !== "y") return;
    const h = el.offsetHeight, hs = heights(el);
    el.classList.remove(styles.sheetDragging);
    el.style.height = "";
    if (cancelled) return;
    // a flick carries on in its direction; otherwise the nearest height wins; well below "peek" closes it
    const order: Snap[] = ["peek", "half", "full"];
    let next: Snap | "close" = order.reduce((a, b) => (Math.abs(hs[b] - h) < Math.abs(hs[a] - h) ? b : a), "peek" as Snap);
    if (Math.abs(s.v) > 0.6) {
      const i = order.indexOf(o.current.snap) + (s.v < 0 ? 1 : -1);
      next = i < 0 ? "close" : order[Math.min(order.length - 1, i)];
    }
    if (h < hs.peek * 0.6) next = "close";
    if (next === "close") o.current.onClose(); else o.current.setSnap(next);
  };
  const common = { onPointerMove: move, onPointerUp: (e: React.PointerEvent) => up(e), onPointerCancel: (e: React.PointerEvent) => up(e, true) };
  return { head: { onPointerDown: down(true), ...common }, body: { onPointerDown: down(false), ...common } };
}

export default function WordPanel({ word, ctx, doc = null, at = null, workTitle = null, onClose, onEchoes, onSentence, onStep, sheet = false, note = null, maxH = null, startMore = false, backSteps = false }: {
  word: string | null; ctx: WordContext | null; onClose: () => void;
  /** show every place the word occurs (Echoes); given the word's dictionary form as shown, for the way back to it */
  onEchoes?: (headword: string) => void;
  /** the text on screen and the word's place in it (its passage and its number among the passage's words), to find the word in the treebank */
  doc?: TeiDoc | null; at?: { u: string; i: number } | null;
  /** the work's title in English, for "12 times in the Iliad" */
  workTitle?: string | null;
  /** show how the sentence this word is in is built; given the word's dictionary form as shown, for the way back to it */
  onSentence?: (headword: string) => void;
  /** the next (1) or previous (-1) word of the passage */
  onStep?: (dir: 1 | -1) => void;
  /** a sheet from the foot of the screen (or of the floating window), with heights */
  sheet?: boolean;
  /** one book on a wide screen: written in the margin beside the line, at this place in the reader */
  note?: { left: number; width: number } | null;
  /** how tall the sheet may rise, in pixels, so that it stops below the line being read */
  maxH?: number | null;
  /** a look-up opened afresh starts in the second layer (the way back from the sentence or Echoes, to where the reader came from) */
  startMore?: boolean;
  /** the phone's back gesture steps back through the layers (the reader's own page only; the quiet desk, back routes, 2026-10-29) */
  backSteps?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [snap, setSnap] = useState<Snap>("peek");
  // a look-up opened afresh starts at "peek", with its first layer showing; moving word to word keeps the height chosen
  const [wasOpen, setWasOpen] = useState(false);
  // the word that "More about it" was opened for (the quiet desk, ticket 06): another word, or a look-up opened afresh, shows
  // the first layer again; likewise the whole LSJ entry
  const [moreFor, setMoreFor] = useState("");
  const [fullFor, setFullFor] = useState("");
  const key = word && ctx ? `${ctx.work}|${ctx.unitKey}|${ctx.occurrence}|${word}` : word ?? "";
  if (!!word !== wasOpen) { setWasOpen(!!word); setMoreFor(word && startMore ? key : ""); setFullFor(""); if (word) setSnap("peek"); }
  const more = !!word && moreFor === key;
  const full = !!word && fullFor === key;
  const [dir, setDir] = useState<1 | -1>(1);
  const step = onStep && ((d: 1 | -1) => { setDir(d); onStep(d); });
  // the second layer is the sheet at its full height; a drag of its handle to a lower height goes back to the first layer there
  const snapNow: Snap = more ? "full" : snap;
  const pickSnap = (s: Snap) => { if (more && s !== "full") setMoreFor(""); setSnap(s); };
  const gestures = useSheetGestures(ref, { on: sheet, snap: snapNow, setSnap: pickSnap, onClose, onStep: more ? undefined : step, maxH });
  // Back, or Escape in the second layer: the first layer, at its resting height, with the keyboard on "More about it"
  const cameBack = useRef(false);
  const goBack = () => { cameBack.current = true; setMoreFor(""); setSnap("peek"); };
  // the browser's Back steps from the second layer to the first, then closes (hooks come before the early return below)
  useBackSteps(!word ? 0 : more ? 2 : 1, backSteps, (depth) => { if (depth > 0) goBack(); else onClose(); });
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    if (more) backRef.current?.focus({ preventScroll: true });
    else if (cameBack.current) { cameBack.current = false; moreRef.current?.focus({ preventScroll: true }); }
  }, [more]);
  const [analysis, setAnalysis] = useState<Loaded<Analysis>>({ key: "", value: null });
  // how many times the dictionary form stands in this work, counted in its word pack
  const [occurs, setOccurs] = useState<{ key: string; n: number | null }>({ key: "", n: null });
  const [lsj, setLsj] = useState<Loaded<{ head: string; entries: LsjEntry[] }>>({ key: "", value: null });
  const [wikt, setWikt] = useState<Loaded<WiktResult>>({ key: "", value: null });
  const [core, setCore] = useState<Loaded<CoreEntry>>({ key: "", value: null });
  const [tree, setTree] = useState<Loaded<InSentence>>({ key: "", value: null });
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  // Colour by case: the grammar line draws its case in the text's colour and line only while the text does (the quiet desk, the look-up's
  // fixes, the owner, 2026-10-30)
  const cases = useSettings((s) => s.cases);
  // how many times "Try again" has asked Wiktionary for this word
  const [wiktTry, setWiktTry] = useState(0);
  // the start of LSJ's own entry, clipped to a few lines, and whether there is more of it under the clip
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);
  const clipped = useClipped(preview, !full);

  // 1. this word in this passage (GLAUx)
  useEffect(() => {
    if (!word || !ctx) return;
    let live = true;
    loadWordPack(ctx.work)
      .then((pack) => {
        if (!live) return;
        const value = pack ? analyse(pack, word, ctx.unitKey, ctx.occurrence, ctx.keys, ctx.depth) : null;
        setAnalysis({ key, value });
        setOccurs({ key, n: pack && value ? countLemma(pack, value.lemma) : null });
      })
      .catch((e: Error) => { if (live) setAnalysis({ key, value: null, error: e.message }); });
    return () => { live = false; };
  }, [key, word, ctx]);

  // 1b. where the word stands in the treebank's sentence, for what it does here (the quiet desk, ticket 05): only a text
  // the treebank has gives a place, and a work with no sentence analyses gives none
  useEffect(() => {
    if (!word || !ctx || !doc || !at) return;
    let live = true;
    Promise.all([loadWordPack(ctx.work), loadSyntax(ctx.work)])
      .then(([pack, syn]) => { if (live) setTree({ key, value: pack ? treeAt(pack, syn, doc, at.u, at.i) : null }); })
      .catch((e: Error) => { if (live) setTree({ key, value: null, error: e.message }); });
    return () => { live = false; };
  }, [key, word, ctx, doc, at]);
  const treeDone = !ctx || !doc || !at || tree.key === key;

  const lemma = analysis.key === key ? analysis.value?.lemma ?? null : null;
  const analysisDone = analysis.key === key;

  // a name that is a place on the Periplus map
  const [placeHit, setPlaceHit] = useState<{ lemma: string; value: Place | null }>({ lemma: "", value: null });
  useEffect(() => {
    if (!lemma || lemma === lemma.toLocaleLowerCase("el")) return;
    let live = true;
    placeNamed(lemma).then((value) => { if (live) setPlaceHit({ lemma, value }); });
    return () => { live = false; };
  }, [lemma]);
  const place = lemma && placeHit.lemma === lemma ? placeHit.value : null;

  // 2. LSJ for the dictionary form (or the word itself when there is no analysis)
  const lsjKey = !ctx ? `${key}|` : analysisDone ? `${key}|${lemma ?? ""}` : "";
  useEffect(() => {
    if (!word || !lsjKey) return;
    let live = true;
    (async () => {
      for (const h of lemma ? [lemma] : candidates(word)) {
        const r = await lsjEntries(h);
        if (r) return r;
      }
      return null;
    })()
      .then((value) => { if (live) setLsj({ key: lsjKey, value }); })
      .catch((e: Error) => { if (live) setLsj({ key: lsjKey, value: null, error: e.message }); });
    return () => { live = false; };
  }, [lsjKey, word, lemma]);

  // 2b. the core vocabulary, for the commonest words
  useEffect(() => {
    if (!word || !lsjKey) return;
    let live = true;
    coreEntry(lemma ?? lookupForm(word)).then((value) => { if (live) setCore({ key: lsjKey, value }); });
    return () => { live = false; };
  }, [lsjKey, word, lemma]);

  // 3. Wiktionary, live (wiktTry: "Try again" asks once more)
  useEffect(() => {
    if (!word || offline) return;
    const ctl = new AbortController();
    lookUpWiktionary(candidates(word), ctl.signal)
      .then((value) => setWikt({ key: word, value }))
      .catch((e: Error) => { if (!ctl.signal.aborted) setWikt({ key: word, value: null, error: e.message }); });
    return () => ctl.abort();
  }, [word, offline, wiktTry]);

  if (!word) return null;
  const a = analysisDone ? analysis.value : undefined;
  const l = lsj.key === lsjKey ? lsj : null;
  const w = wikt.key === word ? wikt : null;
  const headword = lemma ?? l?.value?.head ?? w?.value?.title ?? lookupForm(word);
  const enc = encodeURIComponent;
  // the first layer (the quiet desk, ticket 05): shown once everything it is made of has come, so that it does not change under the eye
  const ready = !!l && lsjKey !== "" && core.key === lsjKey && treeDone;
  const card = ready ? lookupCard({ analysis: a ?? null, tree: tree.key === key ? tree.value : null, core: core.value, lsj: l.value }) : null;
  // the lesson that explains this form, only when the analysis is of this very word (Phase 11)
  const lesson = a && a.where === "here" ? lessonFor(a.tag, a.lemma) : null;
  // its case, in the colour and line that Colour by case gives it in the text (review fix list, slice 8)
  const wcase = a ? caseOf(a.tag) : null;
  // the grammar, with its case in the text's colour and line while Colour by case is on, and plain small capitals while it is off
  const inCase = (g: string) => {
    const i = wcase && cases ? g.toLowerCase().indexOf(wcase) : -1;
    return !wcase || i < 0 ? g : <>{g.slice(0, i)}<span data-case={wcase} title="Its colour and line in the text, as Colour by case is on">{g.slice(i, i + wcase.length)}</span>{g.slice(i + wcase.length)}</>;
  };
  // a meaning is given once (slice 8; the quiet desk, ticket 06): neither LSJ's short definition nor Wiktionary says again what the card says
  const shown = card?.meaning.source ? card.meaning.text : null;
  // LSJ's other short definitions, those that are not the meaning the card gives (the quiet desk, the look-up's fixes, the owner,
  // 2026-10-30). With none, "Dictionary · LSJ" shows the start of the entry itself, so that it is never an empty heading; "The whole
  // entry" shows all of it.
  const lsjShort = l?.value ? otherDefinitions(l.value.entries, shown) : [];
  const wSenses = w?.value && card ? withoutMeaning(w.value.senses, shown) : [];
  const wLemmaSenses = w?.value && card && w.value.lemmaSenses && w.value.senses.some((s) => s.lemma) ? withoutMeaning(w.value.lemmaSenses, shown) : [];
  const wikiShown = wSenses.length > 0 || wLemmaSenses.length > 0;
  // Wiktionary has nothing for this form, or only the meaning already given: the section is left out rather than shown empty
  const wiktNone = !!w && !w.error && (!w.value || (!!card && !wikiShown));
  // the credits: only the sources shown for this word, once, at the foot of the second layer
  const credits = creditsFor({ glaux: !!a || !!tree.value, lsj: !!l?.value, core: card?.meaning.source === "core", wiktionary: wikiShown ? w!.value!.url : null });
  // Previous and Next, and More about it, under the card; in the sheet they keep to its foot, whatever the card's height
  const cardRow = (
    <div className={styles.cardRow}>
      {step && <button type="button" className={`text-btn ${styles.cardStep}`} onClick={() => step(-1)} aria-label="Previous word"><span aria-hidden="true">‹</span>{" "}Previous</button>}
      {step && <button type="button" className={`text-btn ${styles.cardStep}`} onClick={() => step(1)} aria-label="Next word">Next{" "}<span aria-hidden="true">›</span></button>}
      <button ref={moreRef} type="button" className={`text-btn ${styles.cardMore}`} onClick={() => setMoreFor(key)}>More about it</button>
    </div>
  );
  // the red › at the right end of each row of "Go further" (a sign, not read out: the row's words say what it does)
  const wayMark = <span className={styles.wayMark} aria-hidden="true">›</span>;
  // the head's word: the dictionary form in the second layer and once the card is ready; until then the word as it was tapped
  const headText = more ? headword : card ? card.lemma ?? lookupForm(word) : word;

  return (
    <SidePanel ref={ref} className={`${styles.panel} ${sheet ? styles.wordSheet : ""} ${note ? styles.wordNote : ""}`} data-snap={snapNow} data-layer={more ? "2" : "1"} data-overlay="" label={`Look-up: ${word}`}
      style={note ? { left: note.left, width: note.width } : sheet && maxH !== null ? ({ "--sheet-max": `${maxH}px` } as React.CSSProperties) : undefined}
      onClose={onClose} onEscape={more ? goBack : undefined} focusKey={word} closeLabel="Close look-up" headProps={sheet ? gestures.head : undefined} head={<>
        {sheet && <span className={styles.grab} aria-hidden="true" />}
        {more && <button ref={backRef} type="button" className={`text-btn ${styles.cardStep} ${styles.cardBack}`} onClick={goBack}><span aria-hidden="true">‹</span>{" "}Back</button>}
        {/* the word tapped, in Greek, until the dictionary form is known (the quiet desk, the look-up's fixes, the owner, 2026-10-30);
            --chars is its length, for the window on a computer to set a long word smaller rather than break it */}
        <div className={styles.pw} lang="grc" style={{ "--chars": headText.normalize("NFC").length } as React.CSSProperties}>{headText}</div>
      </>}>

      {/* ------------------------------------------------ the second layer keeps the word's context under its head: the kind of word and
          the meaning, as the first layer has them, the meaning a size smaller (the quiet desk, the look-up's fixes, the owner, 2026-10-30).
          It stands outside the body, so that on a sheet it stays while the rest scrolls. */}
      {more && <div className={styles.secWord} aria-busy={!card}>
        {!card && <p className="muted">Looking it up…</p>}
        {card?.kind && <p className={styles.secKind}>{card.kind}</p>}
        {card && <p className={styles.secMeaning} title={card.meaning.source ? `From ${SOURCE_NAMES[card.meaning.source]}` : undefined}>
          {card.meaning.text}{card.meaning.source && <span className="visually-hidden"> (from {SOURCE_NAMES[card.meaning.source]})</span>}
        </p>}
      </div>}

      <div ref={bodyRef} key={word} className={styles.panelBody} data-dir={dir} {...(sheet ? gestures.body : {})}>

      {/* ------------------------------------------------ the first layer: the word, one meaning, plain grammar */}
      {!more && <section className={styles.card} aria-busy={!ready}>
        {!card && <p className={`muted ${styles.cardWait}`}>Looking it up…</p>}
        {card && <>
          <p className={styles.cardKind}>{card.kind ? `${card.kind} · you tapped ` : "You tapped "}<span lang="grc">{word}</span></p>
          <p className={styles.cardMeaning} title={card.meaning.source ? `From ${SOURCE_NAMES[card.meaning.source]}` : undefined}>
            {card.meaning.text}{card.meaning.source && <span className="visually-hidden"> (from {SOURCE_NAMES[card.meaning.source]})</span>}
          </p>
          {card.role && <p className={styles.cardRole}>{card.role.lead}{card.role.governor && <> <span lang="grc">{card.role.governor}</span></>}.</p>}
          {card.grammar && <p className={`label ${styles.cardGrammar}`}>{inCase(card.grammar)}</p>}
        </>}
      </section>}
      {!sheet && !more && cardRow}

      {/* ------------------------------------------------ the second layer, behind "More about it" (the quiet desk, ticket 06):
          the dictionary, then where to go from the word, the other dictionaries, how sure the grammar is, and the credits */}
      {more && <div className={styles.second}>

      {/* the LSJ entry: its other short definitions, when it has any besides the meaning the card gives; otherwise the start of the entry
          itself, clipped to a few lines with a soft fade, so that the heading is never empty. "The whole entry" lifts the clip, or shows
          every entry in full. */}
      <section className={styles.sec}>
        <h3 className="label">Dictionary · LSJ</h3>
        {!l && <p className="muted">Opening the dictionary…</p>}
        {l && !l.value && <p className="muted">{l.error ? `The dictionary could not be loaded (${l.error}).` : "No LSJ entry found under this headword."}</p>}
        {l?.value && !full && lsjShort.map((e, i) => <LsjEntryView key={i} e={e} full={false} />)}
        {l?.value && (full || lsjShort.length === 0) && (
          <div ref={setPreview} className={styles.lsjPreview} data-clip={full ? undefined : ""} data-clipped={!full && clipped ? "" : undefined}>
            {l.value.entries.map((e, i) => <LsjEntryView key={i} e={e} full />)}
          </div>
        )}
        {l?.value && (full || lsjShort.length > 0 || clipped) && <button type="button" className="text-btn" aria-expanded={full} onClick={() => setFullFor(full ? "" : key)}>{full ? "The short entry" : "The whole entry"}</button>}
      </section>

      {/* where to go from the word: a row for each, the same on a computer and a phone, its words on the left and a red › at the right
          end (the quiet desk, the look-up's fixes, the owner, 2026-10-30; mockup B) */}
      <section className={styles.sec}>
        <h3 className="label">Go further</h3>
        <ul className={styles.ways} role="list">
          {onEchoes && (
            <li><button type="button" className={`row-btn ${styles.way}`} onClick={() => onEchoes(headword)} title="Every place this word occurs in the book, marked along a strip">
              <span className={styles.wayText}>{whereElse(occurs.key === key ? occurs.n : null, workTitle)}</span>{wayMark}
            </button></li>
          )}
          {onSentence && (
            <li><button type="button" className={`row-btn ${styles.way}`} onClick={() => onSentence(headword)} title="The sentence's structure: the main verb, its subject and object, and what describes what">
              <span className={styles.wayText}>How the sentence is built</span>{wayMark}
            </button></li>
          )}
          {lesson && (
            <li><Link className={`row-btn ${styles.way}`} href={`/academy/lesson/${lesson.id}`} transitionTypes={["page-turn"]}>
              <span className={styles.wayText}>Lesson {lesson.n}: {lesson.title}{" "}<span className={styles.wayWhy}>{lesson.why}</span></span>{wayMark}
            </Link></li>
          )}
          {(lemma || l?.value) && (
            <li><Link className={`row-btn ${styles.way}`} href={`/treasury/word?l=${encodeURIComponent(headword)}`} transitionTypes={["page-turn"]}
              title="Every form of the word, where and when it is used, real examples and its family">
              <span className={styles.wayText}>Word Study: every form of <span lang="grc">{headword}</span></span>{wayMark}
            </Link></li>
          )}
          {place && (
            <li><Link className={`row-btn ${styles.way}`} href={`/stoa/periplus?p=${place.id}`} transitionTypes={["page-turn"]} title={`${shortName(place)}: where it is, and which works name it most`}>
              <span className={styles.wayText}>On the map: <span lang="grc">{place.grc}</span></span>{wayMark}
            </Link></li>
          )}
        </ul>
      </section>

      {/* Wiktionary, live: never the meaning the card already gives */}
      {!wiktNone && <section className={styles.sec}>
        <h3 className="label">Wiktionary · live</h3>
        {offline && <p className="muted">You are offline. Wiktionary needs a connection.</p>}
        {!offline && (!w || (w.value && !card)) && <p className="muted">Looking it up…</p>}
        {w && !w.value && w.error && (
          <p className={`muted ${styles.retry}`}>Wiktionary could not be reached.{" "}
            <button type="button" className="text-btn" onClick={() => { setWikt({ key: "", value: null }); setWiktTry((n) => n + 1); }}>Try again</button>
          </p>
        )}
        {wikiShown && (
          <>
            {wSenses.length > 0 && <Senses senses={wSenses} />}
            {wLemmaSenses.length > 0 && <Senses senses={wLemmaSenses} />}
          </>
        )}
      </section>}

      <section className={styles.sec}>
        <h3 className="label">More dictionaries</h3>
        <ul className={styles.refs}>
          <li><a href={`https://logeion.uchicago.edu/${enc(headword)}`} target="_blank" rel="noopener noreferrer">Logeion</a> <span className="muted">LSJ, Middle Liddell, Autenrieth and more</span></li>
          <li><a href={`https://www.perseus.tufts.edu/hopper/morph?l=${enc(lookupForm(word))}&la=greek`} target="_blank" rel="noopener noreferrer">Perseus</a> <span className="muted">every possible parsing (Morpheus)</span></li>
        </ul>
      </section>

      {/* at the foot: how sure the grammar is, in one quiet sentence, and the credits, in one quiet line */}
      <div className={styles.foot}>
        {ctx && analysisDone && <p className={styles.fine}>{certaintyNote(a ?? null, analysis.error)}</p>}
        {credits.length > 0 && (
          <p className={styles.fine} data-credits="">
            {credits.map((c, i) => <span key={c.text}>{i > 0 && " · "}{c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer">{c.text}</a> : c.text}</span>)}
          </p>
        )}
      </div>

      </div>}

      </div>
      {sheet && !more && cardRow}
    </SidePanel>
  );
}

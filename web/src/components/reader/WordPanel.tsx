"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { decapitalise, isElided, lookupForm } from "@/lib/greek";
import { lookUpWiktionary, type WiktResult, type WiktSense } from "@/lib/lookup/wiktionary";
import { loadWordPack, analyse, type Analysis } from "@/lib/lookup/words";
import { lsjEntries, citationHref, LSJ_CREDIT, type LsjEntry, type Seg } from "@/lib/lookup/lsj";
import { readTag, caseOf } from "@/lib/lookup/postag";
import { lookupCard, treeAt, SOURCE_NAMES, type InSentence } from "@/lib/lookup/card";
import { loadSyntax } from "@/lib/syntax";
import type { TeiDoc } from "@/lib/tei/types";
import { lessonFor } from "@/lib/lookup/lesson-link";
import { coreEntry, CORE_CREDIT, type CoreEntry } from "@/lib/lookup/core";
import { placeNamed, shortName, type Place } from "@/lib/map";
import styles from "./Reader.module.css";
import { SidePanel } from "./Panel";

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
        return href ? <Link key={i} href={href} className={styles.cite} onClick={(e) => onCite(e, href)} title="Open this passage in the reader (Shift-click: beside this one)">{s.c}</Link> : <span key={i}>{s.c}</span>;
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

export default function WordPanel({ word, ctx, doc = null, at = null, onClose, onEchoes, onSentence, onStep, sheet = false, note = null, maxH = null }: {
  word: string | null; ctx: WordContext | null; onClose: () => void; onEchoes?: () => void;
  /** the text on screen and the word's place in it (its passage and its number among the passage's words), to find the word in the treebank */
  doc?: TeiDoc | null; at?: { u: string; i: number } | null;
  /** show how the sentence this word is in is built */
  onSentence?: () => void;
  /** the next (1) or previous (-1) word of the passage */
  onStep?: (dir: 1 | -1) => void;
  /** a sheet from the foot of the screen (or of the floating window), with heights */
  sheet?: boolean;
  /** one book on a wide screen: written in the margin beside the line, at this place in the reader */
  note?: { left: number; width: number } | null;
  /** how tall the sheet may rise, in pixels, so that it stops below the line being read */
  maxH?: number | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const [snap, setSnap] = useState<Snap>("peek");
  // a look-up opened afresh starts at "peek"; moving word to word keeps the height chosen
  // and "More about it" is shut again
  const [wasOpen, setWasOpen] = useState(false);
  const [more, setMore] = useState(false);
  if (!!word !== wasOpen) { setWasOpen(!!word); if (word) { setSnap("peek"); setMore(false); } }
  const [dir, setDir] = useState<1 | -1>(1);
  const step = onStep && ((d: 1 | -1) => { setDir(d); onStep(d); });
  const gestures = useSheetGestures(ref, { on: sheet, snap, setSnap, onClose, onStep: step, maxH });
  const [analysis, setAnalysis] = useState<Loaded<Analysis>>({ key: "", value: null });
  const [lsj, setLsj] = useState<Loaded<{ head: string; entries: LsjEntry[] }>>({ key: "", value: null });
  const [wikt, setWikt] = useState<Loaded<WiktResult>>({ key: "", value: null });
  const [full, setFull] = useState(false);
  const [core, setCore] = useState<Loaded<CoreEntry>>({ key: "", value: null });
  const [tree, setTree] = useState<Loaded<InSentence>>({ key: "", value: null });
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  const key = word && ctx ? `${ctx.work}|${ctx.unitKey}|${ctx.occurrence}|${word}` : word ?? "";

  // 1. this word in this passage (GLAUx)
  useEffect(() => {
    if (!word || !ctx) return;
    let live = true;
    loadWordPack(ctx.work)
      .then((pack) => { if (live) setAnalysis({ key, value: pack ? analyse(pack, word, ctx.unitKey, ctx.occurrence, ctx.keys, ctx.depth) : null }); })
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

  // 3. Wiktionary, live
  useEffect(() => {
    if (!word || offline) return;
    const ctl = new AbortController();
    lookUpWiktionary(candidates(word), ctl.signal)
      .then((value) => setWikt({ key: word, value }))
      .catch((e: Error) => { if (!ctl.signal.aborted) setWikt({ key: word, value: null, error: e.message }); });
    return () => ctl.abort();
  }, [word, offline]);

  if (!word) return null;
  const a = analysisDone ? analysis.value : undefined;
  const l = lsj.key === lsjKey ? lsj : null;
  const w = wikt.key === word ? wikt : null;
  const headword = lemma ?? l?.value?.head ?? w?.value?.title ?? lookupForm(word);
  const enc = encodeURIComponent;
  const parsing = a ? readTag(a.tag) : null;
  // the first layer (the quiet desk, ticket 05): shown once everything it is made of has come, so that it does not change under the eye
  const ready = !!l && lsjKey !== "" && core.key === lsjKey && treeDone;
  const card = ready ? lookupCard({ analysis: a ?? null, tree: tree.key === key ? tree.value : null, core: core.value, lsj: l.value }) : null;
  // the lesson that explains this form, only when the analysis is of this very word (Phase 11)
  const lesson = a && a.where === "here" ? lessonFor(a.tag, a.lemma) : null;
  // its case, in the colour and line that Colour by case gives it in the text (review fix list, slice 8)
  const wcase = a ? caseOf(a.tag) : null;
  // the grammar, with its case in the colour and line that Colour by case gives it in the text
  const inCase = (g: string) => {
    const i = wcase ? g.toLowerCase().indexOf(wcase) : -1;
    return !wcase || i < 0 ? g : <>{g.slice(0, i)}<span data-case={wcase} title="Its colour and line when Colour by case is on">{g.slice(i, i + wcase.length)}</span>{g.slice(i + wcase.length)}</>;
  };
  // a meaning is given once (slice 8): LSJ's short definition is left out when it says what is already shown above it
  const same = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const above = new Set([card?.meaning.source ? card.meaning.text : ""].filter(Boolean).map(same));
  const lsjShort = l?.value ? l.value.entries.filter((e) => full || !above.has(same(e.s || ""))) : [];
  // Wiktionary has nothing for this form: the section is left out rather than shown empty
  const wiktNone = !!w && !w.value && !w.error;
  // Previous and Next, and More about it, under the card; in the sheet they keep to its foot, whatever the card's height
  const cardRow = (
    <div className={styles.cardRow}>
      {step && <button type="button" className={`text-btn ${styles.cardStep}`} onClick={() => step(-1)} aria-label="Previous word"><span aria-hidden="true">‹</span>{"\u00a0"}Previous</button>}
      {step && <button type="button" className={`text-btn ${styles.cardStep}`} onClick={() => step(1)} aria-label="Next word">Next{"\u00a0"}<span aria-hidden="true">›</span></button>}
      <button type="button" className={`text-btn ${styles.cardMore}`} aria-expanded={more} onClick={() => { setMore(!more); if (sheet) setSnap(more ? "peek" : "full"); }}>
        {more ? "Less" : "More about it"}
      </button>
    </div>
  );

  return (
    <SidePanel ref={ref} className={`${styles.panel} ${sheet ? styles.wordSheet : ""} ${note ? styles.wordNote : ""}`} data-snap={snap} data-overlay="" label={`Look-up: ${word}`}
      style={note ? { left: note.left, width: note.width } : sheet && maxH !== null ? ({ "--sheet-max": `${maxH}px` } as React.CSSProperties) : undefined}
      onClose={onClose} focusKey={word} closeLabel="Close look-up" headProps={sheet ? gestures.head : undefined} head={<>
        {sheet && <span className={styles.grab} aria-hidden="true" />}
        <div className={styles.pw} lang="grc">{card ? card.lemma ?? lookupForm(word) : ""}</div>
      </>}>
      <div key={word} className={styles.panelBody} data-dir={dir} {...(sheet ? gestures.body : {})}>

      {/* ------------------------------------------------ the first layer: the word, one meaning, plain grammar */}
      <section className={styles.card} aria-busy={!ready}>
        {!card && <p className={`muted ${styles.cardWait}`}>Looking it up…</p>}
        {card && <>
          <p className={styles.cardKind}>{card.kind ? `${card.kind} · you tapped ` : "You tapped "}<span lang="grc">{word}</span></p>
          <p className={styles.cardMeaning} title={card.meaning.source ? `From ${SOURCE_NAMES[card.meaning.source]}` : undefined}>
            {card.meaning.text}{card.meaning.source && <span className="visually-hidden"> (from {SOURCE_NAMES[card.meaning.source]})</span>}
          </p>
          {card.role && <p className={styles.cardRole}>{card.role.lead}{card.role.governor && <> <span lang="grc">{card.role.governor}</span></>}.</p>}
          {card.grammar && <p className={`label ${styles.cardGrammar}`}>{inCase(card.grammar)}</p>}
        </>}
      </section>
      {!sheet && cardRow}

      {/* everything else the look-up has, behind "More about it" (until ticket 06 gives it its own design) */}
      {more && <div className={styles.moreBody}>

      {/* ------------------------------------------------ here */}
      {ctx && <section className={styles.sec}>
        <h3 className="label">In this passage</h3>
        {!analysisDone && ctx && <p className="muted">Finding this word…</p>}
        {analysisDone && !a && <p className="muted">{analysis.error ? `Word analyses could not be loaded (${analysis.error}).` : "No analysis is available for this text yet."}</p>}
        {a && parsing && (
          <div className={styles.here}>
            <p className={styles.lemmaBig} lang="grc">{a.lemma}</p>
            <p className={styles.parse}><b>{parsing.pos}</b>{parsing.detail ? " · " : ""}{wcase && parsing.detail.includes(wcase)
              ? <>{parsing.detail.slice(0, parsing.detail.indexOf(wcase))}<span data-case={wcase} title="Its colour and line when Colour by case is on">{wcase}</span>{parsing.detail.slice(parsing.detail.indexOf(wcase) + wcase.length)}</>
              : parsing.detail}</p>
            {a.where === "here" && (a.manual
              ? <span className="tag well">Checked by hand · treebank</span>
              : <span className="tag debated">Automatic analysis · about 97% accurate</span>)}
            {a.where === "passage" && <span className="tag debated">Matched to this passage, not to this exact word</span>}
            {lesson && (
              <Link className={styles.lessonLink} href={`/academy/lesson/${lesson.id}`} transitionTypes={["page-turn"]}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8.5 12 4l9 4.5-9 4.5z" /><path d="M7 10.6v4.6c3 2 7 2 10 0v-4.6" /></svg>
                <span><b>{lesson.why}</b> <span>Lesson {lesson.n}: {lesson.title}</span></span>
              </Link>
            )}
            {a.where === "work" && (
              <div className={styles.fine}>
                <p>This exact place could not be matched. Elsewhere in this work the form is analysed as:</p>
                <ul>{a.others.slice(0, 4).map((o, i) => { const p = readTag(o.tag); return <li key={i}><span lang="grc">{o.lemma}</span>, {p.pos}{p.detail ? ` · ${p.detail}` : ""} ({o.n}×)</li>; })}</ul>
              </div>
            )}
            <p className={styles.fine}>Analysis: GLAUx (Keersmaekers 2021), CC BY-SA 4.0.</p>
          </div>
        )}
      </section>}

      {/* the window on a computer has quiet links in words; the sheet keeps finger-sized framed ones */}
      <p className={styles.panelLinks}>
        {onSentence && (
          <button type="button" className={note ? "text-btn" : "chip"} onClick={onSentence} title="The sentence's structure: the main verb, its subject and object, and what describes what">
            How the sentence is built
          </button>
        )}
        {onEchoes && (
          <button type="button" className={note ? "text-btn" : "chip"} onClick={onEchoes} title="Every place this word occurs in the book, marked along a strip">
            Echoes · where else it occurs
          </button>
        )}
        {place && (
          <Link className={note ? "text-btn" : "chip"} href={`/stoa/periplus?p=${place.id}`} transitionTypes={["page-turn"]} title={`${shortName(place)}: where it is, and which works name it most`}>
            On the map · <span lang="grc">{place.grc}</span>
          </Link>
        )}
        {(lemma || l?.value) && (
          <Link className={note ? "text-btn" : "chip"} href={`/treasury/word?l=${encodeURIComponent(headword)}`} transitionTypes={["page-turn"]}
            title="Every form of the word, where and when it is used, real examples and its family">
            Word Study · <span lang="grc">{headword}</span>
          </Link>
        )}
      </p>

      {core.key === lsjKey && core.value && (
        <section className={styles.sec}>
          <h3 className="label">Core vocabulary · one of the commonest words (#{core.value.rank})</h3>
          <p className={styles.fine}><span lang="grc">{core.value.head}</span> · {core.value.pos}. {CORE_CREDIT}.</p>
        </section>
      )}

      {/* ------------------------------------------------ LSJ */}
      <section className={styles.sec}>
        <h3 className="label">Dictionary · LSJ {l?.value && <span lang="grc" className={styles.lemma}>{l.value.head}</span>}</h3>
        {!l && <p className="muted">Opening the dictionary…</p>}
        {l && !l.value && <p className="muted">{l.error ? `The dictionary could not be loaded (${l.error}).` : "No LSJ entry found under this headword."}</p>}
        {lsjShort.map((e, i) => <LsjEntryView key={i} e={e} full={full} />)}
        {l?.value && <button type="button" className={note ? "text-btn" : "chip"} onClick={() => { setFull(!full); if (!full && sheet) setSnap("full"); }}>{full ? "Short definition" : "Full entry"}</button>}
        {l?.value && full && <p className={styles.fine}>{LSJ_CREDIT}</p>}
      </section>

      {/* ------------------------------------------------ Wiktionary */}
      {!wiktNone && <section className={styles.sec}>
        <h3 className="label">Wiktionary · live</h3>
        {offline && <p className="muted">You are offline. Wiktionary needs a connection.</p>}
        {!offline && !w && <p className="muted">Looking it up…</p>}
        {w && !w.value && w.error && <p className="muted">Wiktionary could not be reached ({w.error}).</p>}
        {w?.value && (
          <>
            <Senses senses={w.value.senses} />
            {w.value.lemmaSenses && w.value.senses.some((s) => s.lemma) && <Senses senses={w.value.lemmaSenses} />}
            <p className={styles.fine}>From <a href={w.value.url} target="_blank" rel="noopener noreferrer">Wiktionary</a>, CC BY-SA 4.0.</p>
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

      </div>}

      </div>
      {sheet && cardRow}
    </SidePanel>
  );
}

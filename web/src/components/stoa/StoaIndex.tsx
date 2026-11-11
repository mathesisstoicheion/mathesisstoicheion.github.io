"use client";
/**
 * The Painted Stoa's front, set as one printed index: a card for each subject (and one more, "Reference", for the
 * library's own reference pages) with its count, its line, its first few entries and the rest behind "+N more".
 *
 * Two parts share one small store (a search typed, a subject chosen): `StoaFinder` stands in the page's head under the
 * introduction (the search box and a row of subject chips, which on a phone swipes sideways), and `StoaIndex` is the
 * body (the entry of the day, then the cards, or the search's results in their place while one is typed).
 * The page gets each entry's card from the server (title, hook, picture); the entries' whole texts, which the search
 * also looks through, are fetched only when a search begins, so the page itself stays light.
 */
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { fold } from "@/lib/catalog";
import { inline, plain } from "@/wiki/markup";
import { CATEGORIES, type CategoryId } from "@/wiki/types";
import type { EntryCard } from "@/wiki/cards";
import Plate from "@/components/plate/Plate";
import { photo } from "@/lib/photos";
import SideScroll from "./SideScroll";
import styles from "./Stoa.module.css";

const text = (s: string) => plain(inline(s));
const noSubscribe = () => () => {};
/** What a search looks in, folded once: the title, the hook and the whole text of each entry (not only its opening). */
const hayOf = (e: EntryCard & { body?: string }) => fold(`${e.title} ${e.greek ?? ""} ${e.kicker} ${text(e.hook)} ${e.body ?? ""}`);
/** every entry's whole text, folded for searching: fetched once, when the first search is typed */
let haystack: Promise<Map<string, string>> | null = null;
const loadHaystack = () => (haystack ??= import("@/wiki/index").then(({ ENTRIES }) => new Map(ENTRIES.map((e) => [e.slug, hayOf(e)]))));

/** A reference page the Wiki offers besides its entries (Authors, Eras, Editions). */
export interface RefCard { href: string; title: string; greek: string; blurb: string }
/** A subject in the chip row: a category's id, or "reference". */
export interface Subject { id: string; title: string; count: number }

// ---------------------------------------------------------------- the search and the chosen subject, shared by head and body
interface Front { q: string; subject: string; open: boolean }
const START: Front = { q: "", subject: "all", open: false };
/** whether the entries were left open, remembered on this device only (a convenience; the page works without it) */
const OPEN_KEY = "stoa-entries-open";
const remember = (open: boolean) => { try { localStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch { /* storage blocked */ } };
let front = START;
const listeners = new Set<() => void>();
const setFront = (patch: Partial<Front>) => { front = { ...front, ...patch }; listeners.forEach((l) => l()); };
const watch = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const useFront = () => useSyncExternalStore(watch, () => front, () => START);

/** A search handed over from Quick search (/stoa?q=…), also when this page is already open. */
function QueryFromUrl({ onQuery }: { onQuery: (q: string) => void }) {
  const v = useSearchParams().get("q");
  useEffect(() => { if (v) onQuery(v); }, [v, onQuery]);
  return null;
}

/** The head's own part: the one search box under the introduction, then the subjects as chips (a swipeable row on a phone). */
export function StoaFinder({ total, subjects }: { total: number; subjects: Subject[] }) {
  const { q, subject } = useFront();
  const row = useRef<HTMLDivElement>(null);
  // a search handed over from Quick search: the page opens at the top, so bring the search and its results into view
  const fromUrl = useCallback((v: string) => {
    setFront({ q: v, open: true });
    requestAnimationFrame(() => row.current?.scrollIntoView({ block: "start" }));
  }, []);
  useEffect(() => () => { front = START; }, []);   // leaving the page, the next visit opens fresh
  return (
    <div className={styles.finder}>
      <Suspense fallback={null}><QueryFromUrl onQuery={fromUrl} /></Suspense>
      <div className={styles.searchRow} role="search" ref={row}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input id="stoa-search" enterKeyHint="search" type="search" value={q} onChange={(e) => setFront({ q: e.target.value })} placeholder={`Search all ${total} entries: Melos, plague…`} aria-label="Search the Painted Stoa" />
      </div>
      <SideScroll className={styles.chips}>
        <ul aria-label="Show one subject">
          {[{ id: "all", title: "All", count: 0 }, ...subjects].map((s) => (
            <li key={s.id}>
              <button type="button" className="chip" aria-pressed={subject === s.id} onClick={() => setFront({ subject: s.id })}>
                {s.title}{s.count > 0 && <b>{s.count}</b>}
              </button>
            </li>
          ))}
        </ul>
      </SideScroll>
    </div>
  );
}

/** Entries not shown on a subject's card until it is opened: the first few stay; the rest open in place, under the button. */
const SHOWN = 2;

function Card({ id, title, blurb, items, whole, i }: { id: string; title: string; blurb: string; items: { href: string; label: string; hint?: string }[]; whole: boolean; i: number }) {
  const first = whole ? items : items.slice(0, SHOWN), rest = whole ? [] : items.slice(SHOWN);
  const link = (e: { href: string; label: string; hint?: string }) => <li key={e.href}><Link href={e.href} title={e.hint} transitionTypes={["page-turn"]} className={styles.row}><span>{e.label}</span></Link></li>;
  return (
    <li id={id} className={styles.card} style={{ "--i": i } as React.CSSProperties}>
      <div className={styles.cardHead}><h3>{title}</h3><b aria-label={`${items.length} entries`}>{items.length}</b></div>
      <p className={styles.blurb}>{blurb}</p>
      {items.length > 0 ? <ul>{first.map(link)}</ul> : <p className={styles.soonLine}>Entries in preparation.</p>}
      {rest.length > 0 && (
        // a real disclosure: the button stays where it is and the rest opens beneath it, so closing moves nothing under the finger
        <details className={styles.more}>
          <summary><span className={styles.moreOpen}>+{rest.length} more</span><span className={styles.moreShut}>Show fewer</span></summary>
          <ul>{rest.map(link)}</ul>
        </details>
      )}
    </li>
  );
}

/** Subjects whose entries are never the entry of the day's picture: photographs the page already holds elsewhere (the fresco
 *  at its head, the Kerameikos wall on the Archaeology card), so no photograph stands twice. */
const PICTURE_TAKEN = new Set(["crates-hipparchia", "kerameikos-street"]);

/** In the head, under the introduction: one button that opens the entries and brings them into view. */
export function EntriesJump({ total }: { total: number }) {
  const go = () => {
    setFront({ open: true });
    remember(true);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => document.getElementById("entries-shelf")?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }));
  };
  return (
    <button type="button" className={`btn ${styles.jump}`} onClick={go}>
      <span>Read the {total} entries</span>
    </button>
  );
}

/**
 * The entries, in one part that opens and closes (the owner, 2026-11-11: the things we made first, then an option to open
 * the entries and choose one). A real disclosure under one wide bar; closed when the page opens, unless the reader left it
 * open on this device or a search arrives from Quick search. Inside: the search, the subject chips, the entry of the day and
 * the subject cards.
 */
export default function StoaEntries({ entries, reference = [], subjects }: { entries: EntryCard[]; reference?: RefCard[]; subjects: Subject[] }) {
  const { open, q } = useFront();
  const shown = open || !!q;
  useEffect(() => {
    let was = false;
    try { was = localStorage.getItem(OPEN_KEY) === "1"; } catch { /* storage blocked */ }
    if (was) setFront({ open: true });
  }, []);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();   // the state, not the browser, opens and shuts it, so a search can open it too
    const next = !shown;
    setFront(next ? { open: true } : { open: false, q: "" });
    remember(next);
  };
  return (
    <details id="entries-shelf" className={styles.shelf} open={shown}>
      <summary onClick={toggle}>
        <span className={styles.shelfText}>
          <span id="entries-h" className={styles.shelfTitle}>The entries</span>
          <span className={styles.shelfSub}>{entries.length} articles in {subjects.length} subjects, with a search</span>
        </span>
        <span className={styles.shelfAct} aria-hidden="true">{shown ? "Close" : "Open"}</span>
      </summary>
      <div className={styles.shelfBody}>
        <StoaFinder total={entries.length} subjects={subjects} />
        <StoaIndex entries={entries} reference={reference} />
      </div>
    </details>
  );
}

function StoaIndex({ entries, reference = [] }: { entries: EntryCard[]; reference?: RefCard[] }) {
  const { q, subject } = useFront();
  const n = fold(q).trim();
  // until the whole texts arrive (a moment, on the first search), the cards alone are searched
  const [full, setFull] = useState<Map<string, string> | null>(null);
  useEffect(() => { if (n && !full) loadHaystack().then(setFull, () => undefined); }, [n, full]);
  const cards = useMemo(() => new Map(entries.map((e) => [e.slug, hayOf(e)])), [entries]);
  const found = useMemo(() => (n ? entries.filter((e) => (full?.get(e.slug) ?? cards.get(e.slug)!).includes(n)) : []), [n, entries, full, cards]);
  const entriesIn = (c: CategoryId) => entries.filter((e) => e.category === c).sort((a, b) => a.title.localeCompare(b.title)).map((e) => ({ href: `/stoa/${e.slug}`, label: e.title }));
  // one entry featured each day, the same for everyone (by date, not at random); the built page shows the first
  const day = useSyncExternalStore(noSubscribe, () => Math.floor(Date.now() / 864e5), () => 0);
  const featured = entries.length ? [...entries].sort((a, b) => a.slug.localeCompare(b.slug))[day % entries.length] : null;
  // its picture only if it is a real picture of the subject that the page does not already show; otherwise a typographic card
  const pic = featured?.image && photo(featured.image) && !PICTURE_TAKEN.has(featured.image) ? featured.image : null;
  const shown = [
    ...CATEGORIES.filter((c) => subject === "all" || subject === c.id).map((c) => ({ id: c.id, title: c.title, blurb: c.blurb, items: entriesIn(c.id) })),
    ...(reference.length && (subject === "all" || subject === "reference")
      ? [{ id: "reference", title: "Reference", blurb: "Who wrote the texts, when, and how they reached us.", items: reference.map((r) => ({ href: r.href, label: r.title, hint: r.blurb })) }] : []),
  ];

  return (
    <div className={styles.index}>
      {n && (
        <section className={styles.found} aria-live="polite">
          <p className="label">{found.length} {found.length === 1 ? "entry" : "entries"}</p>
          <ul>{found.map((e) => <li key={e.slug}><Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]} className={styles.row}><span><b>{e.title}</b> <i>{e.kicker}</i></span></Link></li>)}</ul>
        </section>
      )}

      {featured && !n && subject === "all" && (
        // the entry of the day: its title and opening on the left, its photograph as a plate with its credit on the right
        <section className={styles.featured} aria-labelledby="featured-h" data-pic={pic ? "" : undefined}>
          <div className={styles.featuredText}>
            <p className="label">On the wall today · {CATEGORIES.find((c) => c.id === featured.category)!.title}</p>
            <h2 id="featured-h"><Link href={`/stoa/${featured.slug}`} transitionTypes={["page-turn"]}>{featured.title}</Link></h2>
            <p className={styles.featuredHook}>{text(featured.hook)}</p>
          </div>
          {pic && <Plate id={pic} frame={false} className={styles.featuredPic} sizes="(max-width: 760px) 92vw, 420px" />}
        </section>
      )}

      {!n && (
        <section aria-labelledby="entries">
          <h3 id="entries" className={`label ${styles.entriesH}`}>By subject</h3>
          <ol className={styles.colonnade}>
            {shown.map((s, i) => <Card key={s.id} {...s} whole={subject !== "all"} i={i} />)}
          </ol>
        </section>
      )}
    </div>
  );
}

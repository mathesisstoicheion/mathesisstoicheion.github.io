"use client";

import OrigTitle from "./OrigTitle";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useDeferredValue, useEffect, useMemo, useState, type ReactNode } from "react";
import { create } from "zustand";
import { loadCatalog, fold, greekEditions, hasTranslation, type CatalogIndex, type CatAuthor, type CatWork } from "@/lib/catalog";
import { loadWorksMeta, PERIODS, periodOf, centuries, DATE_NOTE, type WorkMeta } from "@/lib/works-meta";
import { commonShare, loadDifficulty, VOCAB_BANDS } from "@/lib/difficulty";
import { loadAuthorsMeta, loadAuthorNames, type AuthorMeta, type AuthorNames } from "@/lib/authors-meta";
import { BEST_KNOWN } from "@/data/best-known";
import { entryLine } from "@/data/author-lines";
import { picByRef, picRef, plateNo, KIND_PLATES } from "@/data/library-plates";
import { photo } from "@/lib/photos";
import { undated } from "@/lib/bc-ad";
import { recentPositions, shownAt } from "@/lib/position";
import { scrollBelowHeader } from "@/lib/header";
import { workPath } from "@/lib/seo";
import MarginPlate from "@/components/plate/MarginPlate";
import { AZRail } from "./AZList";
import { bestMatch, nameMatch } from "./az";
import { authorKind, kindKey, KIND_ORDER, OTHER_KIND, workKinds } from "./kinds";
import { useLibQuery } from "./libQuery";
import styles from "./Library.module.css";
import { prefersReducedMotion, useSettings } from "@/lib/settings";

type Sort = "kind" | "author" | "title" | "period";
/** The catalogue's order (redesign decision 11): by kind of writing, the default; one plain A to Z list of authors; titles
 *  A to Z; or by period. */
const SORTS: [Sort, string][] = [["kind", "By kind"], ["author", "Authors A–Z"], ["title", "Titles A–Z"], ["period", "By period"]];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
/** How many authors (or titles) a list needs before the rail of letters stands beside it. */
const RAIL_FROM = 20;
const UNDATED = "Not dated";
/** The key of the group that leads a search which names one author (a word, so it is never taken for a letter of the A to Z). */
const BEST = "best";

const readHref = (w: CatWork) => `/read?w=${w.id}`;
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
const n = (x: number) => x.toLocaleString("en-GB");
/** The letter a name is filed under: its first Latin letter, accents ignored. */
const initial = (s: string) => fold(s).replace(/^[^a-z]+/, "").charAt(0).toUpperCase() || "#";
const byName = (a: string, b: string) => fold(a).localeCompare(fold(b), "en");

/**
 * What the plate in the margin shows: the row last pointed at (or moved to with the keyboard), or, while the catalogue is
 * read by kind, the kind whose heading has just come up the screen. Kept apart from the list, so that pointing along the
 * rows draws only the plate again, never the whole catalogue.
 */
const usePointed = create<{ ref: string | null; point: (ref: string | null) => void }>((set) => ({ ref: null, point: (ref) => set({ ref }) }));

/** The text with the parts that match a search marked, accents and capitals ignored (as the search itself does). */
export function marked(text: string, query: string): ReactNode {
  const f = fold(query.trim());
  if (!f) return text;
  // fold each character on its own, remembering where in the original each folded character came from
  const chars = [...text];
  let folded = "";
  const from: number[] = [];
  chars.forEach((c, i) => { const x = fold(c); folded += x; for (let k = 0; k < x.length; k++) from.push(i); });
  const out: ReactNode[] = [];
  let last = 0, hit = folded.indexOf(f);
  while (hit >= 0) {
    const a = from[hit], b = from[hit + f.length - 1] + 1;
    if (a > last) out.push(chars.slice(last, a).join(""));
    out.push(<mark>{chars.slice(a, b).join("")}</mark>);
    last = b;
    hit = folded.indexOf(f, hit + f.length);
  }
  if (!out.length) return text;
  if (last < chars.length) out.push(chars.slice(last).join(""));
  return <>{out.map((x, i) => <Fragment key={i}>{x}</Fragment>)}</>;
}

/**
 * One work on an author's page. `usual` is what most of that author's works are (their kind of writing and their date): the row
 * then names a kind or a date only where the work differs from it, and leaves out the file's size, because the same words
 * on every row (37 times, for Plato) hide the few that are different.
 */
export function WorkItem({ w, author, meta, common, about = false, usual, start = false }: {
  w: CatWork; author?: CatAuthor; meta?: WorkMeta; common: number | null; about?: boolean; usual?: { genre: string | null; when: string | null };
  /** one of the few works suggested to begin with (an author's "Where to begin", PAGE-RULES.md rule 5) */
  start?: boolean;
}) {
  const grc = greekEditions(w)[0];
  const tr = hasTranslation(w);
  const when = meta ? centuries(meta.from, meta.to) : null;
  const kind = [meta?.genre && (!usual || meta.genre !== usual.genre) ? meta.genre : null, when && (!usual || when !== usual.when) ? when : null].filter(Boolean).join(" · ");
  return (
    <li className={styles.work}>
      <Link href={readHref(w)} transitionTypes={["page-turn"]} className={styles.workLink}>
        <span className={styles.workTitle}>{author && <span className={styles.byline}>{author.name}, </span>}{w.title}</span>
        {grc?.label && grc.label !== w.title && <span className={styles.workGr} lang="grc">{grc.label}</span>}
        {w.orig && w.orig !== grc?.label && <OrigTitle work={w} className={styles.orig} />}
      </Link>
      <span className={styles.meta}>
        {start && <span className={styles.start}>Start here</span>}
        {kind && <span className={styles.genre}>{kind}</span>}
        {tr ? <span className={styles.badge}>English</span> : <span className={`${styles.badge} ${styles.off}`}>Greek only</span>}
        {common !== null && <span title={`${common}% of this text's running words are among the 516 core words, the commonest in Greek`}>{common}% common words</span>}
        {grc && !usual && <span className={styles.size}>{kb(grc.size)}</span>}
        {about && <Link href={workPath(w.id)} transitionTypes={["page-turn"]} className={styles.aboutLink}>About</Link>}
      </span>
    </li>
  );
}

/**
 * An author and the works of theirs that pass the filters. In the catalogue by kind an author has a row under each kind they
 * wrote in, with the works of that kind (`kind`); `key` tells their rows apart, and only the first carries the author's
 * address on the page (`anchor`: #author-tlg0059), where the reader and the guided tour find them.
 */
interface Row { a: CatAuthor; works: CatWork[]; from: number | null; to: number | null; kind: string; key: string; anchor: boolean }
/** A part of the list: a kind of writing, a letter, or a period. */
interface Group { key: string; label: string; short: string; kind?: string; rows?: Row[]; titles?: { w: CatWork; a: CatAuthor }[] }

/**
 * Every work in the library, set as the catalogue at the back of a printed edition (redesign decision 11): by kind of
 * writing (Epic, Lyric and elegy, Drama…), authors A to Z inside each, or one plain A to Z list, or titles A to Z, or by
 * period. On a computer, the photograph of whatever is pointed at stands as a plate in the margin; on a phone, the kinds and
 * the authors with a portrait carry a small picture instead, credited in the page's list of plates. The search and what to
 * show (All, With English, Greek only) stand at the top of the page, under its title (LibSearch.tsx), and reach this list
 * through useLibQuery; the other filters wait behind one button.
 */
export default function Library() {
  const params = useSearchParams();
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  // the search, the order and the filters start from the address and are written back to it (replacing, not adding,
  // a history entry), so Back returns to the same list and a filtered list can be shared as a link
  const pick = <T extends string>(k: string, ok: readonly T[], d: T): T => { const v = params.get(k) as T | null; return v && ok.includes(v) ? v : d; };
  const { q, tr, setQ, setTr } = useLibQuery();
  // the search and its filter start from the address too (they are kept outside this list, so they are set here once)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setQ(params.get("q") ?? "");
    setTr(pick("tr", ["all", "with", "greek"] as const, "all"));
    // once, after the first render: the list is not written back to the address until its search is restored
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [sort, setSort] = useState<Sort>(pick("sort", ["kind", "author", "title", "period"] as const, "kind"));
  const [family, setFamily] = useState(params.get("genre") ?? "");
  const [period, setPeriod] = useState(params.get("period") ?? "");
  const [dialect, setDialect] = useState(params.get("dialect") ?? "");
  const [vocab, setVocab] = useState(params.get("vocab") ?? "");
  const [diff, setDiff] = useState<Record<string, [number, number]>>({});
  // the works' kinds and dates (GLAUx) and who the authors were (Wikidata): the catalogue by kind waits for both, so that it
  // is never shown filed one way and then another
  const [known, setKnown] = useState<{ meta: Record<string, WorkMeta>; who: Record<string, AuthorMeta> } | null>(null);
  const meta = useMemo(() => known?.meta ?? {}, [known]), who = useMemo(() => known?.who ?? {}, [known]);
  const [names, setNames] = useState<Record<string, AuthorNames>>({});
  const [reading, setReading] = useState<Map<string, string>>(new Map());     // work id → where the reader stopped
  useEffect(() => { const t = setTimeout(() => setReading(new Map(recentPositions(30).map(([w, p]) => [w, p.at]))), 0); return () => clearTimeout(t); }, []);
  // Each author is a row that opens to show their works (Phase 11). Closed at first; open while a search or a filter
  // narrows the list, and for an author arriving by ?a=. `flips` holds the rows the reader has opened or closed
  // against that, for the present search and filters only (`ctx`); "Open every author" turns the starting point round.
  const [allOpen, setAllOpen] = useState(false);
  const [flips, setFlips] = useState<{ ctx: string; ids: Set<string> }>({ ctx: "", ids: new Set() });
  const [more, setMore] = useState(false);                        // the filters shown
  const query = useDeferredValue(q);
  useEffect(() => {
    if (!ready) return;
    const u = new URL(location.href);
    const set = (k: string, v: string, d = "") => { if (v && v !== d) u.searchParams.set(k, v); else u.searchParams.delete(k); };
    set("q", query.trim()); set("sort", sort, "kind"); set("tr", tr, "all"); set("genre", family); set("period", period); set("dialect", dialect); set("vocab", vocab);
    if (u.href !== location.href) history.replaceState(history.state, "", u);
  }, [ready, query, sort, tr, family, period, dialect, vocab]);
  useEffect(() => {
    loadCatalog().then(setIdx, (e: Error) => setError(e.message));
    Promise.all([loadWorksMeta(), loadAuthorsMeta()]).then(([m, w]) => setKnown({ meta: m, who: w }));
    loadDifficulty().then(setDiff); loadAuthorNames().then(setNames);
  }, []);
  const dialects = useMemo(() => [...new Set(Object.values(meta).map((m) => m.dialect).filter((d): d is string => !!d))].sort(), [meta]);
  const authors = useMemo(() => idx?.catalog.authors ?? [], [idx]);
  /** every work's kind of writing (kinds.ts) */
  const kinds = useMemo(() => workKinds(authors, meta, who), [authors, meta, who]);
  const kindOf = (w: CatWork) => kinds.get(w.id) ?? OTHER_KIND;

  /** Does a work pass every filter except the kind? (The kinds' chips count with this.) */
  const keepBut = useMemo(() => (w: CatWork) => {
    if (tr === "with" && !hasTranslation(w)) return false;
    if (tr === "greek" && hasTranslation(w)) return false;
    const m = meta[w.id];
    if (period && periodOf(m?.from ?? null) !== period) return false;
    if (dialect && m?.dialect !== dialect) return false;
    if (vocab) {
      const p = commonShare(diff[w.id]);
      if (p === null || !VOCAB_BANDS.find(([id]) => id === vocab)?.[2](p)) return false;
    }
    return true;
  }, [tr, period, dialect, vocab, meta, diff]);

  /** The other name of an author's that a search matches (Aristoteles, Ἀριστοτέλης), if it matches one. */
  const alias = (id: string, f: string): string | null => {
    const nm = names[id];
    if (!nm || !f) return null;
    return [nm.grc, ...(nm.also ?? [])].find((x): x is string => !!x && fold(x).includes(f)) ?? null;
  };

  /** The works that match the search and the filters (other than the kind), by author. */
  const found = useMemo(() => {
    const f = fold(query.trim());
    const out: { a: CatAuthor; works: CatWork[] }[] = [];
    for (const a of authors) {
      const whole = f.length > 0 && (fold(`${a.name} ${a.orig ?? ""}`).includes(f) || !!alias(a.id, f));
      const works = a.works.filter((w) => keepBut(w) && (!f || whole || fold(`${w.title} ${w.orig ?? ""} ${greekEditions(w)[0]?.label ?? ""} ${w.id}`).includes(f)));
      if (works.length) out.push({ a, works });
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authors, keepBut, query, names]);

  const kindCounts = useMemo(() => {
    const c = new Map<string, number>();
    let all = 0;
    for (const { works } of found) for (const w of works) { all++; const k = kinds.get(w.id) ?? OTHER_KIND; c.set(k, (c.get(k) ?? 0) + 1); }
    return { all, c };
  }, [found, kinds]);

  const span = (ws: CatWork[]) => {
    const froms = ws.map((w) => meta[w.id]?.from).filter((x): x is number => x !== null && x !== undefined);
    const tos = ws.map((w) => meta[w.id]?.to).filter((x): x is number => x !== null && x !== undefined);
    return { from: froms.length ? Math.min(...froms) : null, to: tos.length ? Math.max(...tos) : null };
  };
  const rows: Row[] = useMemo(() => found.map(({ a, works }) => {
    const ws = family ? works.filter((w) => kindOf(w) === family) : works;
    return { a, works: ws, ...span(ws), kind: family || authorKind(a, kinds), key: a.id, anchor: true };
  }).filter((r) => r.works.length),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [found, family, kinds, meta]);

  // a search that plainly names one author (Plato, aristot, Ἀριστοτέλης): that author leads the list, opened, as the "Best match"
  // (az.ts). Two authors equally close (Marcus A…) name no one in particular, so the order stands as it is.
  const bestId = useMemo(() => {
    const f = fold(query.trim());
    if (f.length < 2 || sort === "title") return null;
    return bestMatch(rows, (r) => nameMatch([r.a.name, r.a.orig, names[r.a.id]?.grc, ...(names[r.a.id]?.also ?? [])], f))?.a.id ?? null;
  }, [rows, query, names, sort]);

  const groups: Group[] = useMemo(() => {
    const best = bestId ? rows.find((r) => r.a.id === bestId) : undefined;
    const rest = best ? rows.filter((r) => r !== best) : rows;
    const lead: Group[] = best ? [{ key: BEST, label: "Best match", short: "Best match", rows: [{ ...best, key: `${BEST}:${best.a.id}` }] }] : [];
    if (sort === "title") {
      const all = rows.flatMap(({ a, works }) => works.map((w) => ({ w, a }))).sort((x, y) => byName(x.w.title, y.w.title));
      const by = new Map<string, Group>();
      for (const t of all) { const k = initial(t.w.title); if (!by.has(k)) by.set(k, { key: k, label: k, short: k, titles: [] }); by.get(k)!.titles!.push(t); }
      return [...by.values()];
    }
    if (sort === "period") {
      const by = new Map<string, Group>();
      for (const [p] of PERIODS) by.set(p, { key: p, label: p, short: p.split(" ·")[0], rows: [] });
      by.set(UNDATED, { key: UNDATED, label: "Not dated in GLAUx", short: "Undated", rows: [] });
      for (const r of [...rest].sort((x, y) => (x.from ?? 1e9) - (y.from ?? 1e9) || byName(x.a.name, y.a.name))) by.get(periodOf(r.from) ?? UNDATED)!.rows!.push(r);
      return [...lead, ...[...by.values()].filter((g) => g.rows!.length)];
    }
    if (sort === "kind") {
      // each author under every kind they wrote in, with the works of that kind; authors A to Z inside each
      const by = new Map<string, Group>(KIND_ORDER.map((k) => [k, { key: kindKey(k), label: k, short: k, kind: k, rows: [] }]));
      for (const r of [...rest].sort((x, y) => byName(x.a.name, y.a.name))) {
        const parts = new Map<string, CatWork[]>();
        for (const w of r.works) { const k = kindOf(w); if (!parts.has(k)) parts.set(k, []); parts.get(k)!.push(w); }
        for (const [k, ws] of parts) by.get(k)!.rows!.push({ ...r, works: ws, ...span(ws), kind: k, key: `${kindKey(k)}:${r.a.id}`, anchor: false });
      }
      // the author's address goes on their first row (the best match, if they are it, already carries it)
      const seen = new Set(best ? [best.a.id] : []);
      const out = [...by.values()].filter((g) => g.rows!.length);
      for (const g of out) for (const r of g.rows!) if (!seen.has(r.a.id)) { seen.add(r.a.id); r.anchor = true; }
      return [...lead, ...out];
    }
    const by = new Map<string, Group>();
    for (const r of [...rest].sort((x, y) => byName(x.a.name, y.a.name))) { const k = initial(r.a.name); if (!by.has(k)) by.set(k, { key: k, label: k, short: k, rows: [] }); by.get(k)!.rows!.push(r); }
    return [...lead, ...by.values()];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sort, bestId, kinds, meta]);

  // a search that names an author (by any of their names): those authors are offered first, as links to their place
  const authorHits = useMemo(() => {
    const f = fold(query.trim());
    if (f.length < 2) return [];
    const at = (r: Row) => { const i = fold(r.a.name).indexOf(f); return i >= 0 ? i : alias(r.a.id, f) ? 50 : -1; };
    return rows.filter((r) => at(r) >= 0).sort((x, y) => at(x) - at(y) || byName(x.a.name, y.a.name)).slice(0, 5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, names]);
  const goAuthor = (id: string) => {
    const el = document.getElementById(`author-${id}`);
    if (el) scrollBelowHeader(el, 12, !prefersReducedMotion(useSettings.getState().motion));
    el?.querySelector("button")?.focus({ preventScroll: true });
  };

  const shown = useMemo(() => ({ works: rows.reduce((s, r) => s + r.works.length, 0), authors: rows.length }), [rows]);
  const total = useMemo(() => ({
    authors: authors.length,
    works: authors.reduce((s, a) => s + a.works.length, 0),
    english: authors.reduce((s, a) => s + a.works.filter(hasTranslation).length, 0),
  }), [authors]);
  const narrowed = shown.works !== total.works;

  // The rail of letters down the right of the list (AZList.tsx). The owner asked for it on 2026-10-16: "the A to Z should just be
  // the side scroller", then on 2026-10-17 to "move it to the right side". It has the letters of the order in use (authors, or
  // titles), those with nothing under them dimmed. By kind or by period there are no letters, so there is no rail; nor is there
  // one for a short list (a search that finds only a few authors), which it would leave standing taller than the list itself.
  const present = useMemo(() => new Set(groups.map((g) => g.key)), [groups]);
  const railOn = (sort === "author" || sort === "title") && groups.reduce((n, g) => n + (g.rows?.length ?? g.titles?.length ?? 0), 0) >= RAIL_FROM;
  const railKeys = useMemo(() => (present.has("#") ? [...LETTERS, "#"] : LETTERS), [present]);
  const jump = (key: string, instant: boolean) => {
    const el = document.getElementById(`lib-${key}`);
    if (el) scrollBelowHeader(el, 12, !instant && !prefersReducedMotion(useSettings.getState().motion) ? "glide" : false);
    return el ?? undefined;
  };

  // arriving with a search or a filter in the address (the home page's "See all in the Library", a shared link): the list,
  // with its search, comes into view at once; an author named by ?a= is brought into view below instead
  useEffect(() => {
    if (params.get("a") || ![...params.keys()].some((k) => ["q", "sort", "tr", "genre", "period", "dialect", "vocab"].includes(k))) return;
    const el = document.getElementById("library-list");
    if (el) scrollBelowHeader(el, 12);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // arriving with ?a=tlg0012 (from the reader or an author page): bring that author into view and mark them
  const selected = params.get("a");
  const ctx = `${query}|${tr}|${family}|${period}|${dialect}|${vocab}|${allOpen}|${sort}`;
  const flipped = flips.ctx === ctx ? flips.ids : new Set<string>();
  const isOpen = (r: Row) => flipped.has(r.key) !== (narrowed || allOpen || r.a.id === selected || r.a.id === bestId);
  const toggle = (key: string) => { const t = new Set(flipped); if (t.has(key)) t.delete(key); else t.add(key); setFlips({ ctx, ids: t }); };
  const listed = !!idx && !!known;
  useEffect(() => {
    if (!listed || !selected) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`author-${selected}`);
      if (el) scrollBelowHeader(el, 12);
    });
  }, [listed, selected]);

  // by kind: the plate in the margin follows the kind whose heading comes up past the top third of the screen
  const point = usePointed((s) => s.point);
  useEffect(() => {
    if (sort !== "kind" || !listed || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) point(`k:${(e.target as HTMLElement).dataset.kind}`);
    }, { rootMargin: "-25% 0px -70% 0px" });
    document.querySelectorAll<HTMLElement>("[data-kind-head]").forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [sort, listed, groups, point]);
  // the plate first shown: the first row's
  const firstRow = groups[0]?.rows?.[0], firstTitle = groups[0]?.titles?.[0];
  const firstRef = firstRow ? picRef(null, firstRow.a.id, firstRow.kind) : firstTitle ? picRef(firstTitle.w.id, firstTitle.a.id, kindOf(firstTitle.w)) : `k:${OTHER_KIND}`;

  const filtering = !!query.trim() || tr !== "all" || !!period || !!dialect || !!vocab;
  const active = (family ? 1 : 0) + (period ? 1 : 0) + (dialect ? 1 : 0) + (vocab ? 1 : 0);
  const clearAll = () => { setQ(""); setTr("all"); setFamily(""); setPeriod(""); setDialect(""); setVocab(""); };

  if (error) return <p className={`wrap ${styles.error}`}>{error}</p>;

  return (
    // every work: the order and the filters stand on the list they sort and narrow (the owner, 2026-10-17: the search
    // "separated from the A to Z list ... isn't intuitive"); the search itself is at the top of the page, and while it is
    // used the famous books stand aside, so this list comes up right under it
    <section id="library-list" className={`wrap ${styles.lib}`} aria-labelledby="library-list-h">
      <header className={styles.head}>
        <h2 id="library-list-h" className={styles.title}>Every work in the library</h2>
        <span className={styles.total}>{idx ? (narrowed ? `${n(shown.works)} of ${n(total.works)} works` : `${n(total.works)} works`) : ""}</span>
      </header>
      {/* the order, always in view (decision 11's switch: by kind, or one plain A to Z list), and the other filters behind one button */}
      <div className={styles.bar}>
        <div className={`segmented ${styles.order}`} role="radiogroup" aria-label="Order">
          {SORTS.map(([id, label]) => <button key={id} type="button" role="radio" aria-checked={sort === id} onClick={() => setSort(id)}>{label}</button>)}
        </div>
        <button type="button" className={styles.moreBtn} aria-expanded={more} aria-controls="library-filters" onClick={() => setMore(!more)}>
          Filters{active ? ` (${active} on)` : ""}
        </button>
      </div>
      <div id="library-filters" className={`${styles.filters} enter`} data-open={more ? "" : undefined}>
        <div className={styles.selects} role="group" aria-label="More filters">
          <select id="library-period" aria-label="Period" value={period} onChange={(e) => setPeriod(e.target.value)} data-set={period ? "" : undefined}>
            <option value="">Every period</option>
            {PERIODS.map(([p]) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select id="library-dialect" aria-label="Dialect" value={dialect} onChange={(e) => setDialect(e.target.value)} data-set={dialect ? "" : undefined}>
            <option value="">Every dialect</option>
            {dialects.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select id="library-vocab" aria-label="Vocabulary" value={vocab} onChange={(e) => setVocab(e.target.value)} data-set={vocab ? "" : undefined}>
            <option value="">Any vocabulary</option>
            {VOCAB_BANDS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </div>
        <div className={styles.genres} role="group" aria-label="Kind of writing">
          <span className="label">Kind of writing</span>
          <div className={styles.chipRow}>
            <button type="button" className="chip" aria-pressed={!family} onClick={() => setFamily("")}>All <small>{n(kindCounts.all)}</small></button>
            {KIND_ORDER.map((f) => {
              const c = kindCounts.c.get(f) ?? 0;
              // while a search or a filter is on, a kind of writing with nothing left in it is not offered (the one chosen stays, to be unchosen)
              if (!c && family !== f && filtering) return null;
              return <button key={f} type="button" className="chip" aria-pressed={family === f} disabled={!c && family !== f} onClick={() => setFamily(family === f ? "" : f)}>{f} <small>{n(c)}</small></button>;
            })}
          </div>
          <p className={styles.note}>The kinds follow the GLAUx corpus’s classification of each work. A work it leaves unclassified is filed with its author’s usual kind, or by what Wikidata says its author was.</p>
        </div>
      </div>

      {vocab && <p className={styles.note}>Vocabulary is the share of a text&apos;s running words that are among the 516 core words, the commonest in Greek (the Dickinson College Commentaries core list, counted over the GLAUx analysis; texts under 2,000 words are not rated). It measures words only, not grammar, dialect or how hard the ideas are: Aristotle&apos;s words are common, his arguments are not.</p>}

      {reading.size > 0 && !query.trim() && idx && (
        <p className={styles.reading} role="group" aria-label="Your books in progress">
          <span className="label">Reading now</span>
          {[...reading].slice(0, 4).map(([w, at]) => {
            const wk = idx.work.get(w), a = idx.authorOf.get(w);
            return wk ? <Link key={w} href={`/read?w=${w}&at=${encodeURIComponent(at)}`} transitionTypes={["page-turn"]}>{a ? `${a.name}, ` : ""}<i>{wk.title}</i>{shownAt(at) && <> <small>at {at}</small></>}</Link> : null;
          })}
        </p>
      )}

      <p className={styles.count} aria-live="polite">
        {!listed ? "Opening the catalogue…"
          : narrowed ? <>{n(shown.works)} of {n(total.works)} works, by {n(shown.authors)} author{shown.authors === 1 ? "" : "s"} · <button type="button" onClick={clearAll}>Show everything</button></>
          : `${n(total.works)} works by ${n(total.authors)} authors, ${n(total.english)} with an English translation.`}
        {listed && sort !== "title" && !narrowed && !allOpen && " Choose an author to see their works, then a work to read it."}
        {listed && sort !== "title" && !narrowed && <> <button type="button" onClick={() => setAllOpen(!allOpen)}>{allOpen ? "Close every author" : "Open every author"}</button></>}
      </p>
      {authorHits.length > 0 && sort !== "title" && (
        <p className={styles.authorHits}>
          <span className="label">{authorHits.length === 1 ? "Author" : "Authors"}</span>
          {authorHits.map((r) => (
            <button key={r.a.id} type="button" onClick={() => goAuthor(r.a.id)}>
              <span>{marked(r.a.name, query)}</span>
              {!fold(r.a.name).includes(fold(query.trim())) && alias(r.a.id, fold(query.trim())) && <span className="muted"> ({marked(alias(r.a.id, fold(query.trim()))!, query)})</span>}
              <small> {n(r.works.length)}</small>
            </button>
          ))}
        </p>
      )}

      {/* by kind: the kinds as a book's contents, each a link to its part of the list */}
      {listed && sort === "kind" && groups.length > 1 && (
        <nav className={styles.contents} aria-label="Kinds of writing in the catalogue">
          {groups.filter((g) => g.kind).map((g) => (
            <a key={g.key} href={`#lib-${g.key}`} onClick={(e) => { e.preventDefault(); jump(g.key, false); }}>
              {g.label} <small>{n(g.rows!.reduce((s, r) => s + r.works.length, 0))}</small>
            </a>
          ))}
        </nav>
      )}

      {listed && !groups.length && <p className={styles.nothing}>Nothing matches. Try fewer letters, search in English, or <button type="button" onClick={clearAll}>clear the filters</button>.</p>}

      {/* the catalogue: the plate in the margin at its left (on a computer), the list, and the rail of letters at its right
          (none by kind or by period) */}
      {listed && groups.length > 0 && (
        <div className={styles.cat} data-rail={railOn ? "" : undefined}>
          <aside className={styles.margin} aria-label="The plate of the work pointed at"><CatalogueMargin first={firstRef} /></aside>
          {/* arrow keys move between the authors' rows; Home and End go to the first and the last */}
          <div className={styles.list}
            onPointerOver={(e) => { const r = (e.target as HTMLElement).closest<HTMLElement>("[data-plate]"); if (r) point(r.dataset.plate!); }}
            onFocus={(e) => { const r = (e.target as HTMLElement).closest<HTMLElement>("[data-plate]"); if (r) point(r.dataset.plate!); }}
            onKeyDown={(e) => {
              const t = e.target as HTMLElement;
              if (!t.matches?.("[data-author-row]") || !["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
              const all = [...document.querySelectorAll<HTMLElement>("[data-author-row]")];
              const i = all.indexOf(t);
              const to = e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : i + (e.key === "ArrowDown" ? 1 : -1);
              if (to < 0 || to >= all.length) return;
              e.preventDefault();
              all[to].focus();
              all[to].scrollIntoView({ block: "nearest" });
            }}>
            {groups.map((g) => (
              <section key={`${sort}-${g.key}`} id={`lib-${g.key}`} className={styles.group} aria-labelledby={`lib-h-${g.key}`}>
                <h3 id={`lib-h-${g.key}`} className={styles.groupHead} tabIndex={-1} data-plate={g.kind ? `k:${g.kind}` : undefined}
                  data-kind-head={g.kind ? "" : undefined} data-kind={g.kind} data-letter={!g.kind && sort !== "period" && g.key !== BEST ? "" : undefined} data-best={g.key === BEST ? "" : undefined}>
                  {g.kind && <Mini pic={KIND_PLATES[g.kind]?.pic} className={styles.kindPic} />}
                  <span className={styles.groupName}>{g.label}</span>
                  {g.kind && <span className={styles.groupCount}>{n(g.rows!.reduce((s, r) => s + r.works.length, 0))} works · {n(g.rows!.length)} {g.rows!.length === 1 ? "author" : "authors"}</span>}
                </h3>
                {g.rows?.map((r) => (
                  <AuthorRow key={r.key} r={r} desc={whoLine(r, who[r.a.id]?.desc, meta, kinds)} grc={names[r.a.id]?.grc}
                    aka={query.trim() && !fold(r.a.name).includes(fold(query.trim())) ? alias(r.a.id, fold(query.trim())) : null} open={isOpen(r)} onToggle={() => toggle(r.key)}
                    selected={r.a.id === selected} query={query} meta={meta} diff={diff} reading={reading} kinds={kinds} />
                ))}
                {g.titles && (
                  <ul className={`${styles.rows} ${styles.titleRows}`}>
                    {g.titles.map(({ w, a }) => <Title key={w.id} w={w} by={a} meta={meta[w.id]} d={diff[w.id]} query={query} at={reading.get(w.id)} plate={picRef(w.id, a.id, kindOf(w))} />)}
                  </ul>
                )}
              </section>
            ))}
          </div>
          {railOn && <AZRail variant="side" keys={railKeys} has={(k) => present.has(k)} jump={jump} noun={sort === "title" ? "Titles" : "Authors"}
            part={(k) => document.getElementById(`lib-${k}`)} parts={`${sort}|${groups.length}`} />}
        </div>
      )}
    </section>
  );
}

/** The plate in the catalogue's margin: the picture of the row last pointed at, or of the first row. */
function CatalogueMargin({ first }: { first: string }) {
  const ref = usePointed((s) => s.ref) ?? first;
  const p = picByRef(ref);
  return <MarginPlate id={p.pic} n={plateNo(p.pic)} why={p.why} />;
}

/** A small picture in a row, for phones, where the margin has no room (credited in the page's list of plates). */
function Mini({ pic, className }: { pic?: string; className?: string }) {
  const p = pic ? photo(pic) : undefined;
  if (!p || !pic) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={p.width > 320 ? `/images/w320/${p.file}` : `/images/${p.file}`} alt="" width={64} height={84} loading="lazy" decoding="async" data-photo={pic} />;
}

/**
 * Who an author was, in one line: Wikidata's description, without its dates when the row gives the date beside it
 * (lib/bc-ad.ts); else the kinds of writing of their works; else what the entry is (data/author-lines.ts).
 */
function whoLine(r: Row, desc: string | undefined, meta: Record<string, WorkMeta>, kinds: Map<string, string>): string | undefined {
  return (r.from !== null ? undated(desc) : desc) ?? kindsLine(r.a, meta, kinds) ?? entryLine(r.a.id, r.a.name, r.a.works);
}

/** For an author Wikidata does not describe: the kinds of writing of their works, "Medicine · Letters" (only those GLAUx classifies). */
function kindsLine(a: CatAuthor, meta: Record<string, WorkMeta>, kinds: Map<string, string>): string | undefined {
  const ks = [...new Set(a.works.filter((w) => meta[w.id]?.genre).map((w) => kinds.get(w.id)).filter((f): f is string => !!f && f !== OTHER_KIND))];
  return ks.length ? ks.join(" · ") : undefined;
}

/** How hard a text's words are, from the share of common words: 1 easy, 2 medium, 3 hard (VOCAB_BANDS). */
const LEVELS = [null, ["Easy words", "80% or more of its running words are among the 516 commonest in Greek"], ["Some rarer words", "70–79% of its running words are among the 516 commonest"], ["Many rare words", "under 70% of its running words are among the 516 commonest"]] as const;
const levelOf = (pct: number) => (pct >= 80 ? 1 : pct >= 70 ? 2 : 3);
/** A text's length in words, rounded: "about 16,000 words". */
const length = (words: number) => `about ${n(words < 1000 ? Math.round(words / 100) * 100 || 100 : Math.round(words / 1000) * 1000)} words`;

function VocabMeter({ pct }: { pct: number }) {
  const l = levelOf(pct), [label, why] = LEVELS[l]!;
  return (
    <span className={styles.meter} data-level={l} title={`${pct}% common words: ${why}`}>
      <span className={styles.bars} aria-hidden="true"><i /><i /><i /></span>
      {label}<span className="visually-hidden"> ({pct}% common words)</span>
    </span>
  );
}

/** One work in the list: its title, Greek title, and what it offers, the whole row a link into the reader. */
function Title({ w, by, meta, d, query = "", best = false, at, plate }: { w: CatWork; by?: CatAuthor; meta?: WorkMeta; d?: [number, number]; query?: string; best?: boolean; at?: string; plate: string }) {
  const grc = greekEditions(w)[0];
  const tr = hasTranslation(w);
  const common = commonShare(d);
  return (
    <li>
      <Link href={at ? `/read?w=${w.id}&at=${encodeURIComponent(at)}` : readHref(w)} transitionTypes={["page-turn"]} className={styles.row} data-plate={plate}>
        <span className={styles.rowTitle}>
          <span className={styles.t}>{marked(w.title, query)}</span>
          {grc?.label && grc.label !== w.title && <span className={styles.gr} lang="grc">{marked(grc.label, query)}</span>}
          {w.orig && w.orig !== grc?.label && <OrigTitle work={w} className={styles.orig} />}
          {by && <span className={styles.by}>{marked(by.name, query)}</span>}
          {best && <span className={styles.best}>Best known</span>}
          {at && <span className={styles.best}>Reading · at {at}</span>}
        </span>
        <span className={styles.rowMeta}>
          {meta?.genre && <span className={styles.genre}>{meta.genre}</span>}
          {d && d[0] >= 100 && <span className={styles.len}>{length(d[0])}</span>}
          {common !== null && <VocabMeter pct={common} />}
          {tr ? <span className={styles.badge}>English</span> : <span className={`${styles.badge} ${styles.off}`}>Greek only</span>}
          <span className={styles.go} aria-hidden="true">→</span>
        </span>
      </Link>
    </li>
  );
}

/**
 * One author: a row that opens to show their works (Phase 11; it used to lead straight to the author's page).
 * The row says who they were (Wikidata's one-line description), when, and how many works the library holds;
 * opened, it lists the works, each a link into the reader, and then a link to the author's own page.
 */
function AuthorRow({ r, desc, grc, aka, open, onToggle, selected, query, meta, diff, reading, kinds }: {
  r: Row; desc?: string; grc?: string; aka: string | null; open: boolean; onToggle: () => void; selected: boolean; query: string;
  meta: Record<string, WorkMeta>; diff: Record<string, [number, number]>; reading: Map<string, string>; kinds: Map<string, string>;
}) {
  const all = r.a.works.length, english = r.a.works.filter(hasTranslation).length;
  const panel = `works-${r.key.replace(/[^\w-]/g, "-")}`;
  // the best-known work (data/best-known.ts) and the books being read come first
  const best = BEST_KNOWN[r.a.id];
  const rank = (w: CatWork) => (reading.has(w.id) ? 0 : w.id === best ? 1 : 2);
  const ordered = [...r.works].sort((x, y) => rank(x) - rank(y));
  const withEn = ordered.filter(hasTranslation), greekOnly = ordered.filter((w) => !hasTranslation(w));
  const item = (w: CatWork) => <Title key={w.id} w={w} meta={meta[w.id]} d={diff[w.id]} query={query} best={w.id === best} at={reading.get(w.id)} plate={picRef(w.id, r.a.id, kinds.get(w.id) ?? r.kind)} />;
  const own = picRef(null, r.a.id, r.kind);
  return (
    <div id={r.anchor ? `author-${r.a.id}` : undefined} className={styles.author} data-selected={selected ? "" : undefined} data-open={open ? "" : undefined}>
      <h4 className={styles.authorHead}>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={panel} onClick={onToggle} data-author-row="" data-plate={own}>
          <span className={styles.name}>
            {marked(r.a.name, query)}
            {grc && <span className={styles.nameGr} lang="grc"> {marked(grc, query)}</span>}
            {aka && aka !== grc && <span className={styles.aka}> also called {marked(aka, query)}</span>}
          </span>
          {r.a.orig && <span className={styles.latin} title="The collection's own Latin name; the English is this site's translation">{marked(r.a.orig, query)}</span>}
          {desc && <span className={styles.desc}>{desc}</span>}
          <span className={styles.facts}>
            {r.from !== null && <span title={DATE_NOTE}>{centuries(r.from, r.to)}</span>}
            <span>{r.works.length < all ? `${n(r.works.length)} of ${n(all)} works` : `${n(all)} ${all === 1 ? "work" : "works"}`}</span>
            {english > 0 && <span>{english === all ? (all === 1 ? "with English" : "all with English") : `${n(english)} with English`}</span>}
          </span>
          {own.startsWith("a:") && <Mini pic={picByRef(own).pic} className={styles.authorPic} />}
          <span className={styles.sign} aria-hidden="true" />
        </button>
      </h4>
      <div id={panel} className={`${styles.worksPanel} enter`} hidden={!open}>
        {open && (
          <>
            {/* the works with English beside the Greek come first, under a heading of their own, when an author has both */}
            {withEn.length > 0 && greekOnly.length > 0 ? (
              <>
                <h5 className={styles.sub}>With English beside the Greek <small>{withEn.length}</small></h5>
                <ul className={styles.rows}>{withEn.map(item)}</ul>
                <h5 className={styles.sub}>Greek only <small>{greekOnly.length}</small></h5>
                <ul className={styles.rows}>{greekOnly.map(item)}</ul>
              </>
            ) : <ul className={styles.rows}>{ordered.map(item)}</ul>}
            <Link href={`/library/author?a=${r.a.id}`} transitionTypes={["page-turn"]} className={styles.aboutAuthor}>
              About {r.a.name}: life, works, and how the texts survived <span aria-hidden="true">→</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

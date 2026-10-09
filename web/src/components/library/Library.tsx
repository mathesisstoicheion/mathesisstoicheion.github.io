"use client";

import OrigTitle from "./OrigTitle";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadCatalog, fold, greekEditions, hasTranslation, type CatalogIndex, type CatAuthor, type CatWork } from "@/lib/catalog";
import { loadWorksMeta, FAMILIES, PERIODS, familyOf, periodOf, centuries, DATE_NOTE, type WorkMeta } from "@/lib/works-meta";
import { commonShare, loadDifficulty, VOCAB_BANDS } from "@/lib/difficulty";
import { loadAuthorsMeta, loadAuthorNames, type AuthorMeta, type AuthorNames } from "@/lib/authors-meta";
import { BEST_KNOWN } from "@/data/best-known";
import { STARTS } from "@/data/starts";
import { recentPositions } from "@/lib/position";
import { scrollBelowHeader } from "@/lib/header";
import { workPath } from "@/lib/seo";
import styles from "./Library.module.css";
import { prefersReducedMotion, useSettings } from "@/lib/settings";

/**
 * Where to begin. The site's own guidance, following the brief; the reasons are the ones
 * teachers usually give. Difficulty is about the Greek, not the ideas.
 */
const START = [
  { level: "Gentle", why: "Short sentences and everyday words.", works: [["tlg0031.tlg004", "The Gospel of John"], ["tlg0096.tlg002", "Aesop's fables"]] },
  { level: "Steady", why: "Clear Classical Attic prose, the usual first authors after a textbook.", works: [["tlg0032.tlg006", "Xenophon, Anabasis"], ["tlg0540.tlg001", "Lysias, On the Murder of Eratosthenes"]] },
  { level: "Demanding", why: "Dense, unusual constructions and rare words, hard even for experienced readers.", works: [["tlg0003.tlg001", "Thucydides, History"], ["tlg0033.tlg001", "Pindar, Olympian Odes"]] },
];

type Sort = "author" | "title" | "period";
type Tr = "all" | "with" | "greek";
const SORTS: [Sort, string][] = [["author", "Author A–Z"], ["title", "Title A–Z"], ["period", "By period"]];
const TRS: [Tr, string][] = [["all", "All"], ["with", "With translation"], ["greek", "Greek only"]];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const UNDATED = "Not dated";

const readHref = (w: CatWork) => `/read?w=${w.id}`;
const kb = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
const n = (x: number) => x.toLocaleString("en-GB");
/** The letter a name is filed under: its first Latin letter, accents ignored. */
const initial = (s: string) => fold(s).replace(/^[^a-z]+/, "").charAt(0).toUpperCase() || "#";
const byName = (a: string, b: string) => fold(a).localeCompare(fold(b), "en");

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

export function WorkItem({ w, author, meta, common, about = false }: { w: CatWork; author?: CatAuthor; meta?: WorkMeta; common: number | null; about?: boolean }) {
  const grc = greekEditions(w)[0];
  const tr = hasTranslation(w);
  return (
    <li className={styles.work}>
      <Link href={readHref(w)} transitionTypes={["page-turn"]} className={styles.workLink}>
        <span className={styles.workTitle}>{author && <span className={styles.byline}>{author.name}, </span>}{w.title}</span>
        {grc?.label && grc.label !== w.title && <span className={styles.workGr} lang="grc">{grc.label}</span>}
        {w.orig && w.orig !== grc?.label && <OrigTitle work={w} className={styles.orig} />}
      </Link>
      <span className={styles.meta}>
        {meta?.genre && <span className={styles.genre}>{meta.genre}{meta.from !== null ? ` · ${centuries(meta.from, meta.to)}` : ""}</span>}
        {tr ? <span className={styles.badge}>English</span> : <span className={`${styles.badge} ${styles.off}`}>Greek only</span>}
        {common !== null && <span title={`${common}% of this text's running words are among the 516 core words, the commonest in Greek`}>{common}% common words</span>}
        {grc && <span className={styles.size}>{kb(grc.size)}</span>}
        {about && <Link href={workPath(w.id)} transitionTypes={["page-turn"]} className={styles.aboutLink}>About</Link>}
      </span>
    </li>
  );
}

/** An author and the works of theirs that pass the filters. */
interface Row { a: CatAuthor; works: CatWork[]; from: number | null; to: number | null }
/** A lettered or dated section of the list. */
interface Group { key: string; label: string; short: string; rows?: Row[]; titles?: { w: CatWork; a: CatAuthor }[] }

export default function Library() {
  const params = useSearchParams();
  const [idx, setIdx] = useState<CatalogIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  // the search, the order and the filters start from the address and are written back to it (replacing, not adding,
  // a history entry), so Back returns to the same list and a filtered list can be shared as a link
  const pick = <T extends string>(k: string, ok: readonly T[], d: T): T => { const v = params.get(k) as T | null; return v && ok.includes(v) ? v : d; };
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<Sort>(pick("sort", ["author", "title", "period"] as const, "author"));
  const [tr, setTr] = useState<Tr>(pick("tr", ["all", "with", "greek"] as const, "all"));
  const [family, setFamily] = useState(params.get("genre") ?? "");
  const [period, setPeriod] = useState(params.get("period") ?? "");
  const [dialect, setDialect] = useState(params.get("dialect") ?? "");
  const [vocab, setVocab] = useState(params.get("vocab") ?? "");
  const [diff, setDiff] = useState<Record<string, [number, number]>>({});
  const [meta, setMeta] = useState<Record<string, WorkMeta>>({});
  const [who, setWho] = useState<Record<string, AuthorMeta>>({});
  const [names, setNames] = useState<Record<string, AuthorNames>>({});
  const [reading, setReading] = useState<Map<string, string>>(new Map());     // work id → where the reader stopped
  useEffect(() => { const t = setTimeout(() => setReading(new Map(recentPositions(30).map(([w, p]) => [w, p.at]))), 0); return () => clearTimeout(t); }, []);
  // Each author is a row that opens to show their works (Phase 11). Closed at first; open while a search or a filter
  // narrows the list, and for an author arriving by ?a=. `flips` holds the authors the reader has opened or closed
  // against that, for the present search and filters only (`ctx`); "Open every author" turns the starting point round.
  const [allOpen, setAllOpen] = useState(false);
  const [flips, setFlips] = useState<{ ctx: string; ids: Set<string> }>({ ctx: "", ids: new Set() });
  const [more, setMore] = useState(false);                        // phones: the extra filters shown
  const query = useDeferredValue(q);
  useEffect(() => {
    const u = new URL(location.href);
    const set = (k: string, v: string, d = "") => { if (v && v !== d) u.searchParams.set(k, v); else u.searchParams.delete(k); };
    set("q", query.trim()); set("sort", sort, "author"); set("tr", tr, "all"); set("genre", family); set("period", period); set("dialect", dialect); set("vocab", vocab);
    if (u.href !== location.href) history.replaceState(history.state, "", u);
  }, [query, sort, tr, family, period, dialect, vocab]);
  useEffect(() => { loadCatalog().then(setIdx, (e: Error) => setError(e.message)); loadWorksMeta().then(setMeta); loadDifficulty().then(setDiff); loadAuthorsMeta().then(setWho); loadAuthorNames().then(setNames); }, []);
  // "where to begin" stays as the reader left it (the box itself holds whether it is open)
  const beginRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => { try { if (beginRef.current && localStorage.getItem("mathesis:lib-begin") === "open") beginRef.current.open = true; } catch {} }, []);
  const rememberBegin = (open: boolean) => { try { localStorage.setItem("mathesis:lib-begin", open ? "open" : "shut"); } catch {} };

  const dialects = useMemo(() => [...new Set(Object.values(meta).map((m) => m.dialect).filter((d): d is string => !!d))].sort(), [meta]);
  const authors = useMemo(() => idx?.catalog.authors ?? [], [idx]);

  /** Does a work pass every filter except the genre? (The genre chips count with this.) */
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

  /** The works that match the search and the filters (other than genre), by author. */
  /** The other name of an author's that a search matches (Aristoteles, Ἀριστοτέλης), if it matches one. */
  const alias = (id: string, f: string): string | null => {
    const nm = names[id];
    if (!nm || !f) return null;
    return [nm.grc, ...(nm.also ?? [])].find((x): x is string => !!x && fold(x).includes(f)) ?? null;
  };

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

  const familyCounts = useMemo(() => {
    const c = new Map<string, number>();
    let all = 0;
    for (const { works } of found) for (const w of works) { all++; const fam = familyOf(meta[w.id]?.genre ?? null); if (fam) c.set(fam, (c.get(fam) ?? 0) + 1); }
    return { all, c };
  }, [found, meta]);

  const rows: Row[] = useMemo(() => found.map(({ a, works }) => {
    const ws = family ? works.filter((w) => familyOf(meta[w.id]?.genre ?? null) === family) : works;
    const froms = ws.map((w) => meta[w.id]?.from).filter((x): x is number => x !== null && x !== undefined);
    const tos = ws.map((w) => meta[w.id]?.to).filter((x): x is number => x !== null && x !== undefined);
    return { a, works: ws, from: froms.length ? Math.min(...froms) : null, to: tos.length ? Math.max(...tos) : null };
  }).filter((r) => r.works.length), [found, family, meta]);

  const groups: Group[] = useMemo(() => {
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
      for (const r of [...rows].sort((x, y) => (x.from ?? 1e9) - (y.from ?? 1e9) || byName(x.a.name, y.a.name))) by.get(periodOf(r.from) ?? UNDATED)!.rows!.push(r);
      return [...by.values()].filter((g) => g.rows!.length);
    }
    const by = new Map<string, Group>();
    for (const r of [...rows].sort((x, y) => byName(x.a.name, y.a.name))) { const k = initial(r.a.name); if (!by.has(k)) by.set(k, { key: k, label: k, short: k, rows: [] }); by.get(k)!.rows!.push(r); }
    return [...by.values()];
  }, [rows, sort]);

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
    if (el) scrollBelowHeader(el, (barRef.current?.offsetHeight ?? 0) + 12, !prefersReducedMotion(useSettings.getState().motion));
    el?.querySelector("button")?.focus({ preventScroll: true });
  };

  const shown = useMemo(() => ({ works: rows.reduce((s, r) => s + r.works.length, 0), authors: rows.length }), [rows]);
  const total = useMemo(() => ({
    authors: authors.length,
    works: authors.reduce((s, a) => s + a.works.length, 0),
    english: authors.reduce((s, a) => s + a.works.filter(hasTranslation).length, 0),
  }), [authors]);
  const narrowed = shown.works !== total.works;

  // the jump bar: every letter (or period), those with nothing to show greyed out
  const jumps = sort === "period" ? groups.map((g) => ({ key: g.key, short: g.short, on: true })) : LETTERS.map((l) => ({ key: l, short: l, on: groups.some((g) => g.key === l) }));
  const barRef = useRef<HTMLElement>(null);
  const jump = (key: string) => {
    const el = document.getElementById(`lib-${key}`);
    if (el) scrollBelowHeader(el, (barRef.current?.offsetHeight ?? 0) + 12, !prefersReducedMotion(useSettings.getState().motion));
  };

  // arriving with ?a=tlg0012 (from the reader or an author page): bring that author into view and mark them
  const selected = params.get("a");
  const ctx = `${query}|${tr}|${family}|${period}|${dialect}|${vocab}|${allOpen}`;
  const flipped = flips.ctx === ctx ? flips.ids : new Set<string>();
  const isOpen = (id: string) => flipped.has(id) !== (narrowed || allOpen || id === selected);
  const toggle = (id: string) => { const t = new Set(flipped); if (t.has(id)) t.delete(id); else t.add(id); setFlips({ ctx, ids: t }); };
  useEffect(() => {
    if (!idx || !selected) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`author-${selected}`);
      if (el) scrollBelowHeader(el, (barRef.current?.offsetHeight ?? 0) + 12);
    });
  }, [idx, selected]);

  const active = (tr !== "all" ? 1 : 0) + (family ? 1 : 0) + (period ? 1 : 0) + (dialect ? 1 : 0) + (vocab ? 1 : 0);
  const clearAll = () => { setQ(""); setTr("all"); setFamily(""); setPeriod(""); setDialect(""); setVocab(""); };

  if (error) return <p className={`wrap ${styles.error}`}>{error}</p>;

  return (
    <div className={`wrap ${styles.lib}`}>
      {/* the search comes first: straight to the point */}
      <div className={styles.searchBox}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} id="library-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="An author or a title: Plato, Odyssey, Ἰλιάς…" aria-label="Search the library" />
      </div>

      {/* phones: the order and every filter wait behind one button, so the list starts high on the screen */}
      <button type="button" className={styles.moreBtn} aria-expanded={more} aria-controls="library-filters" onClick={() => setMore(!more)}>
        Order and filters{active ? ` (${active} on)` : ""}
      </button>
      <div id="library-filters" className={styles.filters} data-open={more ? "" : undefined}>
      <div className={styles.controls}>
        <div className="segmented" role="radiogroup" aria-label="Order">
          {SORTS.map(([id, label]) => <button key={id} type="button" role="radio" aria-checked={sort === id} onClick={() => setSort(id)}>{label}</button>)}
        </div>
        <div className="segmented" role="radiogroup" aria-label="Translation">
          {TRS.map(([id, label]) => <button key={id} type="button" role="radio" aria-checked={tr === id} onClick={() => setTr(id)}>{label}</button>)}
        </div>
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
      </div>

      <div className={styles.genres} role="group" aria-label="Kind of writing">
        <span className="label">Genre</span>
        <div className={styles.chipRow}>
          <button type="button" className="chip" aria-pressed={!family} onClick={() => setFamily("")}>All <small>{n(familyCounts.all)}</small></button>
          {FAMILIES.map(([f]) => {
            const c = familyCounts.c.get(f) ?? 0;
            return <button key={f} type="button" className="chip" aria-pressed={family === f} disabled={!c && family !== f} onClick={() => setFamily(family === f ? "" : f)}>{f} <small>{n(c)}</small></button>;
          })}
        </div>
      </div>
      </div>

      {vocab && <p className={styles.note}>Vocabulary is the share of a text&apos;s running words that are among the 516 core words, the commonest in Greek (the Dickinson College Commentaries core list, counted over the GLAUx analysis; texts under 2,000 words are not rated). It measures words only, not grammar, dialect or how hard the ideas are: Aristotle&apos;s words are common, his arguments are not.</p>}

      <details ref={beginRef} className={styles.begin} hidden={!!query.trim()} onToggle={(e) => rememberBegin((e.currentTarget as HTMLDetailsElement).open)}>
        <summary><span className={styles.beginIcon} aria-hidden="true">✦</span> Not sure where to begin? <span className="muted">Our suggestions, by how hard the Greek is</span></summary>
        <div className={styles.levels}>
          {START.map((s) => (
            <div key={s.level} className={styles.level}>
              <h2>{s.level}</h2>
              <p className="muted">{s.why}</p>
              <ul>
                {s.works.map(([id, label]) => (
                  <li key={id}><Link href={`/read?w=${id}`} transitionTypes={["page-turn"]}>{label} <span aria-hidden="true">→</span></Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>

      {/* famous works to begin with (data/starts.ts, the home page's choice): a shelf of their Greek titles */}
      {idx && !narrowed && (
        <section className={styles.shelf} aria-labelledby="shelf-h">
          <h2 id="shelf-h" className="label">Famous works, with English beside the Greek</h2>
          <ul>
            {STARTS.map((id, i) => {
              const w = idx.work.get(id), a = idx.authorOf.get(id);
              if (!w || !a) return null;
              const gr = greekEditions(w)[0]?.label;
              const pct = commonShare(diff[id]);
              return (
                <li key={id} style={{ "--i": i } as React.CSSProperties}>
                  <Link href={`/read?w=${id}`} transitionTypes={["page-turn"]} className={styles.spine}>
                    {gr && <span className={styles.spineGr} lang="grc">{gr}</span>}
                    <b>{w.title}</b>
                    <span className={styles.spineBy}>{a.name}</span>
                    {pct !== null && <VocabMeter pct={pct} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {reading.size > 0 && !query.trim() && idx && (
        <div className={styles.reading} role="group" aria-label="Your books in progress">
          <span className="label">Reading now</span>
          {[...reading].slice(0, 4).map(([w, at]) => {
            const wk = idx.work.get(w), a = idx.authorOf.get(w);
            return wk ? <Link key={w} className="chip" href={`/read?w=${w}&at=${encodeURIComponent(at)}`} transitionTypes={["page-turn"]}>{a ? `${a.name}, ` : ""}<i>{wk.title}</i> <small>at {at}</small></Link> : null;
          })}
        </div>
      )}

      <nav ref={barRef} className={styles.jumpBar} aria-label={sort === "period" ? "Jump to a period" : "Jump to a letter"} data-periods={sort === "period" ? "" : undefined}>
        {jumps.map((j) => <button key={j.key} type="button" disabled={!j.on} onClick={() => jump(j.key)}>{j.short}</button>)}
      </nav>

      <p className={styles.count} aria-live="polite">
        {!idx ? "Opening the catalogue…"
          : narrowed ? <>{n(shown.works)} of {n(total.works)} works, by {n(shown.authors)} author{shown.authors === 1 ? "" : "s"} · <button type="button" onClick={clearAll}>Show everything</button></>
          : `${n(total.works)} works by ${n(total.authors)} authors, ${n(total.english)} with an English translation`}
        {idx && sort !== "title" && !narrowed && <> · <button type="button" onClick={() => setAllOpen(!allOpen)}>{allOpen ? "Close every author" : "Open every author"}</button></>}
      </p>
      {authorHits.length > 0 && sort !== "title" && (
        <p className={styles.authorHits}>
          <span className="label">{authorHits.length === 1 ? "Author" : "Authors"}</span>
          {authorHits.map((r) => (
            <button key={r.a.id} type="button" className="chip" onClick={() => goAuthor(r.a.id)}>
              <span>{marked(r.a.name, query)}</span>
              {!fold(r.a.name).includes(fold(query.trim())) && alias(r.a.id, fold(query.trim())) && <span className="muted"> ({marked(alias(r.a.id, fold(query.trim()))!, query)})</span>}
              <small>{n(r.works.length)}</small>
            </button>
          ))}
        </p>
      )}
      {idx && sort !== "title" && !narrowed && !allOpen && <p className={styles.hint}>Click an author to see their works, then a work to read it.</p>}

      {idx && !groups.length && <p className={styles.nothing}>Nothing matches. Try fewer letters, search in English, or <button type="button" onClick={clearAll}>clear the filters</button>.</p>}

      {/* arrow keys move between the authors' rows; Home and End go to the first and the last */}
      <div className={styles.list} onKeyDown={(e) => {
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
            <h2 id={`lib-h-${g.key}`} className={styles.groupHead} data-period={sort === "period" ? "" : undefined}>{g.label}</h2>
            {g.rows?.map((r) => (
              <AuthorRow key={r.a.id} r={r} desc={who[r.a.id]?.desc ?? kindsLine(r.a, meta)} grc={names[r.a.id]?.grc}
                aka={query.trim() && !fold(r.a.name).includes(fold(query.trim())) ? alias(r.a.id, fold(query.trim())) : null} open={isOpen(r.a.id)} onToggle={() => toggle(r.a.id)}
                selected={r.a.id === selected} query={query} meta={meta} diff={diff} reading={reading} />
            ))}
            {g.titles && (
              <ul className={`${styles.rows} ${styles.titleRows}`}>
                {g.titles.map(({ w, a }) => <Title key={w.id} w={w} by={a} meta={meta[w.id]} d={diff[w.id]} query={query} at={reading.get(w.id)} />)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

/** For an author Wikidata does not describe: the kinds of writing of their works (GLAUx's genres), "Medicine · Letters". */
function kindsLine(a: CatAuthor, meta: Record<string, WorkMeta>): string | undefined {
  const kinds = [...new Set(a.works.map((w) => familyOf(meta[w.id]?.genre ?? null)).filter((f): f is string => !!f))];
  return kinds.length ? kinds.join(" · ") : undefined;
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
function Title({ w, by, meta, d, query = "", best = false, at }: { w: CatWork; by?: CatAuthor; meta?: WorkMeta; d?: [number, number]; query?: string; best?: boolean; at?: string }) {
  const grc = greekEditions(w)[0];
  const tr = hasTranslation(w);
  const common = commonShare(d);
  return (
    <li>
      <Link href={at ? `/read?w=${w.id}&at=${encodeURIComponent(at)}` : readHref(w)} transitionTypes={["page-turn"]} className={styles.row}>
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
function AuthorRow({ r, desc, grc, aka, open, onToggle, selected, query, meta, diff, reading }: {
  r: Row; desc?: string; grc?: string; aka: string | null; open: boolean; onToggle: () => void; selected: boolean; query: string;
  meta: Record<string, WorkMeta>; diff: Record<string, [number, number]>; reading: Map<string, string>;
}) {
  const all = r.a.works.length, english = r.a.works.filter(hasTranslation).length;
  const panel = `works-${r.a.id}`;
  // the best-known work (data/best-known.ts) and the books being read come first
  const best = BEST_KNOWN[r.a.id];
  const rank = (w: CatWork) => (reading.has(w.id) ? 0 : w.id === best ? 1 : 2);
  const ordered = [...r.works].sort((x, y) => rank(x) - rank(y));
  const withEn = ordered.filter(hasTranslation), greekOnly = ordered.filter((w) => !hasTranslation(w));
  const item = (w: CatWork) => <Title key={w.id} w={w} meta={meta[w.id]} d={diff[w.id]} query={query} best={w.id === best} at={reading.get(w.id)} />;
  return (
    <div id={`author-${r.a.id}`} className={styles.author} data-selected={selected ? "" : undefined} data-open={open ? "" : undefined}>
      <h3 className={styles.authorHead}>
        <button type="button" className={styles.toggle} aria-expanded={open} aria-controls={panel} onClick={onToggle} data-author-row="">
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
          <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </h3>
      <div id={panel} className={styles.worksPanel} inert={!open}>
        <div>
          {open && (
            <>
              {/* the works with English beside the Greek come first, under a heading of their own, when an author has both */}
              {withEn.length > 0 && greekOnly.length > 0 ? (
                <>
                  <h4 className={styles.sub}>With English beside the Greek <small>{withEn.length}</small></h4>
                  <ul className={styles.rows}>{withEn.map(item)}</ul>
                  <h4 className={styles.sub}>Greek only <small>{greekOnly.length}</small></h4>
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
    </div>
  );
}

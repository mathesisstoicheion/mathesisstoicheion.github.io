"use client";
/**
 * The Painted Stoa's front: a colonnade of painted panels, one per category, each listing its
 * entries (and one more, "Reference", listing the library's own reference pages), with a search across every entry
 * directly on top of it, whose results stand in the colonnade's place while a search is typed, and a featured entry that
 * changes each day, below it.
 * The page gets each entry's card from the server (title, hook, picture); the entries' whole texts, which the
 * search also looks through, are fetched only when a search begins, so the page itself stays light.
 */
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { fold } from "@/lib/catalog";
import { inline, plain } from "@/wiki/markup";
import { CATEGORIES, type CategoryId } from "@/wiki/types";
import type { EntryCard } from "@/wiki/cards";
import { IMAGES, srcSet } from "@/wiki/images";
import CategoryIcon from "./CategoryIcon";
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

/** A search handed over from Quick search (/stoa?q=…), also when this page is already open. */
function QueryFromUrl({ onQuery }: { onQuery: (q: string) => void }) {
  const v = useSearchParams().get("q");
  useEffect(() => { if (v) onQuery(v); }, [v, onQuery]);
  return null;
}

/**
 * `lead`: what opens the page above the search (the map, the Census and Archaeology); it stays while searching, so the
 * search does not move under the finger. `foot`: the small print that ends the page, above the footer.
 */
export default function StoaIndex({ entries, reference = [], lead, foot }: { entries: EntryCard[]; reference?: RefCard[]; lead?: React.ReactNode; foot?: React.ReactNode }) {
  const [q, setQ] = useState("");
  const searchRow = useRef<HTMLDivElement>(null);
  // a search handed over from Quick search: the page opens at the top, so bring the search and its results into view
  const fromUrl = useCallback((v: string) => { setQ(v); searchRow.current?.scrollIntoView({ block: "start" }); }, []);
  const n = fold(q).trim();
  // until the whole texts arrive (a moment, on the first search), the cards alone are searched
  const [full, setFull] = useState<Map<string, string> | null>(null);
  useEffect(() => { if (n && !full) loadHaystack().then(setFull, () => undefined); }, [n, full]);
  const cards = useMemo(() => new Map(entries.map((e) => [e.slug, hayOf(e)])), [entries]);
  const found = useMemo(() => (n ? entries.filter((e) => (full?.get(e.slug) ?? cards.get(e.slug)!).includes(n)) : []), [n, entries, full, cards]);
  const entriesIn = (c: CategoryId) => entries.filter((e) => e.category === c).sort((a, b) => a.title.localeCompare(b.title));
  // one entry featured each day, the same for everyone (by date, not at random); the built page shows the first
  const day = useSyncExternalStore(noSubscribe, () => Math.floor(Date.now() / 864e5), () => 0);
  const featured = entries.length ? [...entries].sort((a, b) => a.slug.localeCompare(b.slug))[day % entries.length] : null;
  const pic = featured?.image ? IMAGES[featured.image] : undefined;

  return (
    <div className={`wrap ${styles.index}`}>
      <Suspense fallback={null}><QueryFromUrl onQuery={fromUrl} /></Suspense>
      {lead}

      <div className={styles.searchRow} role="search" ref={searchRow}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></svg>
        <input enterKeyHint="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search all ${entries.length} entries: Melos, plague…`} aria-label="Search the Painted Stoa" />
      </div>
      {n && (
        <section className={styles.found} aria-live="polite">
          <p className="label">{found.length} {found.length === 1 ? "entry" : "entries"}</p>
          <ul>{found.map((e) => <li key={e.slug}><Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]}><b>{e.title}</b> <span>{e.kicker}</span></Link></li>)}</ul>
        </section>
      )}

      {!n && (
        <ol className={styles.colonnade}>
          {CATEGORIES.map((c, i) => {
            const es = entriesIn(c.id);
            return (
              <li key={c.id} id={c.id} className={styles.panel} style={{ "--i": i } as React.CSSProperties}>
                <div className={styles.panelIn}>
                  <span className={styles.roundel}><CategoryIcon id={c.id} /></span>
                  <h2>{c.href ? <Link href={c.href} transitionTypes={["page-turn"]}>{c.title}</Link> : c.title}</h2>
                  <p className={styles.blurb}>{c.blurb}</p>
                  {es.length > 0
                    ? <ul>{es.map((e) => <li key={e.slug}><Link href={`/stoa/${e.slug}`} transitionTypes={["page-turn"]}>{e.title}</Link></li>)}</ul>
                    : <p className={styles.soonLine}>Entries in preparation.</p>}
                </div>
              </li>
            );
          })}
          {reference.length > 0 && (
            // the library's own reference pages (Authors, Eras, Editions…) are one more panel of the colonnade
            <li id="reference" className={styles.panel} style={{ "--i": CATEGORIES.length } as React.CSSProperties}>
              <nav className={styles.panelIn} aria-labelledby="ref-h">
                <span className={styles.roundel}><CategoryIcon id="reference" /></span>
                <h2 id="ref-h">Reference</h2>
                <p className={styles.blurb}>Who wrote the texts, when, and how they reached us.</p>
                <ul>{reference.map((r) => <li key={r.href}><Link href={r.href} title={r.blurb} transitionTypes={["page-turn"]}>{r.title}</Link></li>)}</ul>
              </nav>
            </li>
          )}
        </ol>
      )}

      {featured && !n && (
        <Link href={`/stoa/${featured.slug}`} className={styles.featured} transitionTypes={["page-turn"]} data-pic={pic ? "" : undefined}>
          <span className={styles.featuredText}>
            <span className="label">On the wall today · {CATEGORIES.find((c) => c.id === featured.category)!.title}</span>
            <b>{featured.title}</b>
            <span className={styles.featuredHook}>{text(featured.hook)}</span>
            <span className={styles.featuredGo}>Read the entry →</span>
          </span>
          {pic
            // eslint-disable-next-line @next/next/no-img-element -- self-hosted, sized files; no image service
            ? <img className={styles.featuredPic} data-whole={pic.height > pic.width * 0.9 ? "" : undefined} src={`/images/${pic.file}`} srcSet={srcSet(pic)} sizes="(max-width: 760px) 100vw, 420px" alt={pic.alt} title={`${pic.title} · ${pic.sourceName} · ${pic.licence}`} width={pic.width} height={pic.height} loading="lazy" decoding="async" />
            : <span className={styles.featuredIcon}><CategoryIcon id={featured.category} /></span>}
        </Link>
      )}

      {foot}
    </div>
  );
}

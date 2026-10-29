"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PARADIGMS, formsOf, type Paradigm } from "@/data/paradigms";
import ATTESTED from "@/data/paradigms-attested.json";
import { fold } from "@/lib/catalog";
import { scrollBehavior } from "@/lib/settings";
import { useMoreRight } from "@/lib/use-more-right";
import styles from "./Academy.module.css";

const GROUPS: [Paradigm["group"] | "all", string][] = [["all", "All"], ["article", "Article"], ["noun", "Nouns"], ["adjective", "Adjectives"], ["pronoun", "Pronouns"], ["verb", "Verbs"]];
const attested = ATTESTED as Record<string, number[][]>;

/** The part all forms share (ignoring accents), so the endings can be shown apart. */
function stemLength(p: Paradigm): number {
  const forms = p.cells.flat().flatMap(formsOf).map((f) => fold(f));
  if (p.group === "article" || p.group === "pronoun") return 0;
  let n = 0;
  while (forms.every((f) => f[n] && f[n] === forms[0][n])) n++;
  return n;
}

function Cell({ form, stem, hit, count }: { form: string; stem: number; hit: boolean; count: number }) {
  // split each alternative at the shared stem; letters and folded letters line up one to one
  return (
    <td className={hit ? styles.hit : undefined} title={count ? `Found ${count.toLocaleString("en-GB")} times in the analysed texts` : "Rare in the analysed texts"}>
      {form.split(/(,\s*)/).map((part, i) => /^,/.test(part) ? part : (
        <span key={i} lang="grc">
          {[...part.normalize("NFC")].slice(0, stem).join("")}
          <span className={styles.ending}>{[...part.normalize("NFC")].slice(stem).join("")}</span>
        </span>
      ))}
      <span className={styles.count}>{count ? (count >= 1000 ? `${Math.round(count / 1000)}k` : count) : "·"}</span>
    </td>
  );
}

/** One table, as shown on the tables page and inside lessons. `marked`: a search match has just led here. */
export function ParadigmTable({ p, query = "", marked = false }: { p: Paradigm; query?: string; marked?: boolean }) {
  const stem = stemLength(p);
  const counts = attested[p.id];
  // while the table can still be scrolled sideways (a phone), its right edge fades: the stylesheet reads data-more
  const scroller = useRef<HTMLDivElement>(null);
  useMoreRight(scroller);
  return (
    <section className={`${styles.table} ${p.cols.length > 3 ? styles.tableWide : ""} ${marked ? styles.marked : ""}`} aria-labelledby={`t-${p.id}`}>
      <h2 id={`t-${p.id}`} tabIndex={-1}>{p.title}</h2>
      {p.note && <p className="muted">{p.note}</p>}
      <div ref={scroller} className={styles.scrollX} tabIndex={0} role="region" aria-labelledby={`t-${p.id}`}>
        <table>
          <thead><tr><th />{p.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {p.cells.map((row, r) => (
              <tr key={p.rows[r]}>
                <th scope="row">{p.rows[r]}</th>
                {row.map((cell, c) => <Cell key={c} form={cell} stem={stem} count={counts?.[r]?.[c] ?? 0}
                  hit={!!query && formsOf(cell).some((f) => fold(f) === query)} />)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** A form the search found, and the table it is in. */
interface Match { key: string; text: string; id: string; group: Paradigm["group"] }

export default function Tables() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<(typeof GROUPS)[number][0]>("all");
  const [mark, setMark] = useState<string | null>(null);   // the table a match was followed to, marked for a moment
  const query = fold(q.trim());
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const filters = useRef<HTMLDivElement>(null);
  useMoreRight(filters);

  const matches = useMemo(() => {
    if (!query) return [];
    const out: Match[] = [];
    for (const p of PARADIGMS) p.cells.forEach((row, r) => row.forEach((cell, c) => {
      if (formsOf(cell).some((f) => fold(f) === query)) out.push({ key: `${p.id}:${r}:${c}`, text: `${cell} = ${p.rows[r]}, ${p.cols[c]} of ${p.lemma}`, id: p.id, group: p.group });
    }));
    return out;
  }, [query]);

  const shown = PARADIGMS.filter((p) => group === "all" || p.group === group);

  // the search bar's height, so that a table scrolled to comes to rest clear of it (see .table h2 in the stylesheet)
  useEffect(() => {
    const el = bar.current, box = root.current;
    if (!el || !box) return;
    const measure = () => box.style.setProperty("--bar-h", `${el.offsetHeight}px`);
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  useEffect(() => {
    if (!mark) return;
    const t = setTimeout(() => setMark(null), 2600);
    return () => clearTimeout(t);
  }, [mark]);

  // a match leads to its table; if the filter has hidden that table, the filter goes back to All first
  const follow = (e: React.MouseEvent, m: Match) => {
    e.preventDefault();
    if (group !== "all" && group !== m.group) setGroup("all");
    setMark(m.id);
    requestAnimationFrame(() => {
      const h = document.getElementById(`t-${m.id}`);
      h?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      h?.focus({ preventScroll: true });
    });
  };

  return (
    <div ref={root} className={styles.tables}>
      <div ref={bar} className={styles.tablesTools}>
        <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} id="tables-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} className={styles.searchInput}
          placeholder="Find a form, e.g. λογου (accents optional)" aria-label="Find a form" />
        {/* on a phone the filters keep to one line and slide sideways; the right edge fades while there are more */}
        <div ref={filters} className={styles.seg} role="radiogroup" aria-label="Show">
          {GROUPS.map(([g, l]) => <button key={g} type="button" role="radio" aria-checked={group === g} onClick={() => setGroup(g)}>{l}</button>)}
        </div>
      </div>
      {query && (
        <p className={styles.found} aria-live="polite">
          {matches.length ? matches.map((m) => <a key={m.key} href={`#t-${m.id}`} lang="grc" onClick={(e) => follow(e, m)}>{m.text}</a>) : "That form is not in these tables."}
        </p>
      )}
      <p className={styles.small}>Endings are shown in red. The small number after each form is how often it occurs with that analysis in the 16 million analysed words of GLAUx; every form was checked against it.</p>
      <div className={styles.tableGrid}>
        {shown.map((p) => <ParadigmTable key={p.id} p={p} query={query} marked={mark === p.id} />)}
      </div>
    </div>
  );
}

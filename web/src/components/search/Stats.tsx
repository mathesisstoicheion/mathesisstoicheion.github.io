"use client";
/**
 * The Oracle's statistics: where a word is used, and how. Counts by work and by author, and how often it
 * comes per 10,000 words of Greek, so that a short work and a long one can be compared fairly; how that
 * rate moves from century to century; and, for a dictionary word, which grammar its uses have.
 * Word counts and dates are GLAUx's (dates by the author's lifetime: see DATE_NOTE).
 */
import { useEffect, useMemo, useState } from "react";
import type { CatalogIndex } from "@/lib/catalog";
import { DATE_NOTE, century, type WorkMeta } from "@/lib/works-meta";
import { loadTags, TAG_FIELDS } from "@/lib/search/engine";
import { toCsv } from "@/lib/search/kwic";
import type { Outcome } from "@/lib/search/run";
import rs from "./Research.module.css";

const num = (n: number) => n.toLocaleString("en-GB");
const MIN_WORDS = 1000;
const rate = (n: number) => (n >= 10 ? n.toFixed(0) : n >= 1 ? n.toFixed(1) : n.toFixed(2));
/** the first year of the century a year falls in (-450 → -500, 101 → 101), for ordering */
const centuryStart = (y: number) => (y < 0 ? -Math.ceil(-y / 100) * 100 : Math.floor((y - 1) / 100) * 100 + 1);

interface Bar { key: string; label: string; sub?: string; value: number; tip: string }

/** A list of horizontal bars, one hue, longest scaled to the full width, each labelled at its end. */
function Bars({ rows, unit, caption }: { rows: Bar[]; unit: string; caption: string }) {
  const max = Math.max(...rows.map((r) => r.value), 0) || 1;
  return (
    <figure className={rs.chart}>
      <figcaption className="visually-hidden">{caption}</figcaption>
      <ul className={rs.bars}>
        {rows.map((r) => (
          <li key={r.key} tabIndex={0} aria-label={r.tip} data-tip={r.tip}>
            <span className={rs.barLabel}>{r.label}{r.sub && <small> {r.sub}</small>}</span>
            <span className={rs.track}><span className={rs.fill} style={{ width: `${Math.max(0.6, (r.value / max) * 100)}%` }} /></span>
            <span className={rs.barValue}>{unit === "rate" ? rate(r.value) : num(r.value)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export default function Stats({ idx, meta, outcome, works: scope, lang, lemmaMode, title }: {
  idx: CatalogIndex; meta: Record<string, WorkMeta> | null; outcome: Outcome; works: Set<string> | null;
  lang: "grc" | "eng"; lemmaMode: boolean; title: string;
}) {
  const [by, setBy] = useState<"rate" | "count">(lang === "grc" ? "rate" : "count");
  const [tags, setTags] = useState<string[] | null>(null);
  useEffect(() => { if (lemmaMode) loadTags().then(setTags, () => undefined); }, [lemmaMode]);
  const rates = lang === "grc" && !!meta;

  const data = useMemo(() => {
    const words = (w: string) => (rates ? meta![w]?.tokens ?? null : null);
    const workRows = outcome.works.map((g) => {
      const t = words(g.work);
      return { work: g.work, author: idx.authorOf.get(g.work)?.id ?? "", count: g.count, tokens: t, rate: t ? (g.count / t) * 10000 : null };
    });
    // the denominators take in every work searched, those without a single result too
    const searched = scope ? [...scope] : [...idx.work.keys()];
    const authorWords = new Map<string, number>(), centuryWords = new Map<number, number>();
    for (const w of searched) {
      const t = words(w), m = meta?.[w];
      if (!t) continue;
      const a = idx.authorOf.get(w)?.id ?? "";
      authorWords.set(a, (authorWords.get(a) ?? 0) + t);
      if (m?.from != null) { const c = centuryStart(m.from); centuryWords.set(c, (centuryWords.get(c) ?? 0) + t); }
    }
    const authorCount = new Map<string, number>(), centuryCount = new Map<number, number>();
    for (const r of workRows) {
      authorCount.set(r.author, (authorCount.get(r.author) ?? 0) + r.count);
      const m = meta?.[r.work];
      if (m?.from != null && r.tokens) { const c = centuryStart(m.from); centuryCount.set(c, (centuryCount.get(c) ?? 0) + r.count); }
    }
    const authors = [...authorCount].map(([a, count]) => {
      const t = authorWords.get(a) ?? null;
      return { author: a, count, tokens: t, rate: t ? (count / t) * 10000 : null };
    });
    const centuries = [...centuryWords].sort((a, b) => a[0] - b[0])
      .map(([c, t]) => ({ c, label: century(c)!, count: centuryCount.get(c) ?? 0, tokens: t, rate: ((centuryCount.get(c) ?? 0) / t) * 10000 }));
    return { workRows, authors, centuries };
  }, [outcome, idx, meta, scope, rates]);

  // the grammar of the results (a dictionary word's results carry GLAUx's analysis)
  const grammar = useMemo(() => {
    if (!lemmaMode || !tags) return [];
    const counts = TAG_FIELDS.map(() => new Map<string, number>());
    for (const g of outcome.works) for (const hs of g.texts.values()) for (const h of hs) {
      const t = h.tag !== undefined ? tags[h.tag] : undefined;
      if (!t) continue;
      TAG_FIELDS.forEach((_, i) => { const v = t[i]; if (v && v !== "-") counts[i].set(v, (counts[i].get(v) ?? 0) + 1); });
    }
    return TAG_FIELDS.map((f, i) => ({ f, values: [...counts[i]].sort((a, b) => b[1] - a[1]) }))
      .filter((x) => x.values.length > 1 || (x.values.length === 1 && x.f.id !== "pos"));
  }, [lemmaMode, tags, outcome]);

  const key = by === "rate" && rates ? "rate" : "count";
  // a very short work makes a jumpy rate (one use in 200 words is 50 per 10,000): such works are left out of that ranking
  const topWorks = [...data.workRows].filter((r) => key === "count" || (r.rate !== null && (r.tokens ?? 0) >= MIN_WORDS)).sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0)).slice(0, 20);
  const topAuthors = [...data.authors].filter((r) => key === "count" || r.rate !== null).sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0)).slice(0, 15);
  const workBar = (r: (typeof data.workRows)[number]): Bar => {
    const w = idx.work.get(r.work), a = idx.authorOf.get(r.work);
    return {
      key: r.work, label: w?.title ?? r.work, sub: a?.name, value: (key === "rate" ? r.rate : r.count) ?? 0,
      tip: `${w?.title}, ${a?.name}: ${num(r.count)} ${r.count === 1 ? "result" : "results"}${r.tokens ? ` in ${num(r.tokens)} words, ${rate(r.rate!)} per 10,000` : ""}`,
    };
  };
  const download = () => {
    const rows = [["Author", "Work", "Results", "Words in the work (GLAUx)", "Per 10,000 words"],
      ...[...data.workRows].sort((a, b) => b.count - a.count).map((r) => [idx.authorOf.get(r.work)?.name ?? "", idx.work.get(r.work)?.title ?? r.work, r.count, r.tokens ?? "", r.rate !== null ? r.rate.toFixed(3) : ""])];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
    a.download = `statistics-${title.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40) || "search"}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <section className={rs.stats} aria-label="Statistics">
      <div className={rs.bar}>
        {rates && (
          <div className="segmented" role="radiogroup" aria-label="Measure">
            <button type="button" role="radio" aria-checked={key === "rate"} onClick={() => setBy("rate")}>Per 10,000 words</button>
            <button type="button" role="radio" aria-checked={key === "count"} onClick={() => setBy("count")}>Number of results</button>
          </div>
        )}
        <button type="button" className="btn small ghost" onClick={download}>Download the table (spreadsheet)</button>
      </div>
      <p className={rs.small}>
        {rates
          ? "Per 10,000 words: how often it comes, for every 10,000 words of Greek in the work, so that long and short works compare fairly. Word counts are GLAUx's; works GLAUx does not describe are left out of the rates."
          : lang === "eng" ? "The translations have no word counts here, so these are numbers of results." : "Loading the word counts…"}
      </p>

      <div className={rs.statGrid}>
        <div>
          <h3 className={rs.h}>In each work</h3>
          <Bars rows={topWorks.map(workBar)} unit={key} caption={`The works with the ${key === "rate" ? "highest rate" : "most results"}`} />
          {data.workRows.length > topWorks.length && <p className={rs.small}>The first {topWorks.length} of {num(data.workRows.length)} works{key === "rate" ? `, among those of ${num(MIN_WORDS)} words or more` : ""}. The spreadsheet has them all.</p>}
        </div>
        <div>
          <h3 className={rs.h}>In each author</h3>
          <Bars unit={key} caption="By author" rows={topAuthors.map((r) => {
            const a = idx.author.get(r.author);
            return { key: r.author, label: a?.name ?? r.author, value: (key === "rate" ? r.rate : r.count) ?? 0,
              tip: `${a?.name}: ${num(r.count)} ${r.count === 1 ? "result" : "results"}${r.tokens ? ` in ${num(r.tokens)} words searched, ${rate(r.rate!)} per 10,000` : ""}` };
          })} />
        </div>
      </div>

      {rates && data.centuries.length > 1 && (
        <div>
          <h3 className={rs.h}>Century by century</h3>
          <p className={rs.small}>Per 10,000 words of all the Greek searched from each century. {DATE_NOTE}</p>
          <Bars unit="rate" caption="Rate per century" rows={data.centuries.map((c) => ({
            key: String(c.c), label: c.label, value: c.rate,
            tip: `${c.label}: ${num(c.count)} ${c.count === 1 ? "result" : "results"} in ${num(c.tokens)} words, ${rate(c.rate)} per 10,000`,
          }))} />
        </div>
      )}

      {grammar.length > 0 && (
        <div>
          <h3 className={rs.h}>Its grammar</h3>
          <p className={rs.small}>As GLAUx analyses each result: most of it by computer, some checked by hand.</p>
          <div className={rs.gramGrid}>
            {grammar.map(({ f, values }) => {
              const total = values.reduce((n, [, c]) => n + c, 0);
              return (
                <div key={f.id}>
                  <h4 className={rs.h4}>{f.label}</h4>
                  <Bars unit="count" caption={f.label} rows={values.map(([v, c]) => {
                    const name = (f.values as Record<string, string>)[v] ?? v;
                    return { key: v, label: name, value: c, tip: `${name}: ${num(c)} (${Math.round((c / total) * 100)}%)` };
                  })} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

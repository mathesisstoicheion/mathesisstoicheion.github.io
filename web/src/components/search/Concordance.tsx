"use client";
/**
 * The Oracle's concordance: every result on a line of its own, the match in the middle and the words
 * before and after it lined up either side, as printed concordances have long set them out. Sorted by
 * place, by the form matched, or by the word just before or after (which shows a word's habits: what
 * it follows, what follows it). The lines are read from the texts themselves, a few hundred at a time,
 * and can be downloaded as a spreadsheet.
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { versionOf, describe, type CatalogIndex } from "@/lib/catalog";
import { loadDoc } from "@/lib/search/context";
import { kwic, toCsv, type KwicLine } from "@/lib/search/kwic";
import { loadTags, type Hit } from "@/lib/search/engine";
import { englishWords } from "@/lib/search/codec";
import { readTag } from "@/lib/lookup/postag";
import type { Outcome, WorkHits } from "@/lib/search/run";
import type { TeiDoc } from "@/lib/tei/types";
import rs from "./Research.module.css";

type Order = "place" | "form" | "before" | "after";
const ORDERS: { id: Order; label: string }[] = [
  { id: "place", label: "In order" }, { id: "form", label: "By form" }, { id: "before", label: "By the word before" }, { id: "after", label: "By the word after" },
];
interface Row { n: number; work: string; text: number; h: Hit; ref: string; line: KwicLine | null; href: string; error?: string }
const STEP = 300, MAX = 5000;
const num = (n: number) => n.toLocaleString("en-GB");

/** The address of a result in the reader, with its words marked there. */
export function hitHref(work: string, urn: string, lang: "grc" | "eng", h: Hit, doc: TeiDoc) {
  const u = doc.units[h.unit], words = [...h.words, ...(h.near ?? [])].sort((a, b) => a - b);
  return lang === "grc"
    ? `/read?w=${work}&ed=${versionOf(urn)}&at=${encodeURIComponent(u.ref.join("."))}&hl=${words.join(",")}`
    : `/read?w=${work}&tr=${versionOf(urn)}&tu=${h.unit}&find=${encodeURIComponent(words.map((i) => englishWords(u)[i]).filter(Boolean).join(" "))}`;
}

export default function Concordance({ idx, works, texts, lang, lemmaMode, title }: {
  idx: CatalogIndex; works: WorkHits[]; texts: Outcome["texts"]; lang: "grc" | "eng"; lemmaMode: boolean;
  /** what was searched for, for the spreadsheet's name */
  title: string;
}) {
  const all = useMemo(() => works.flatMap((g) => [...g.texts].flatMap(([t, hs]) => hs.map((h) => ({ work: g.work, text: t, h })))), [works]);
  const [want, setWant] = useState(Math.min(STEP, all.length));
  const [rows, setRows] = useState<Row[]>([]);
  const loaded = useRef<Row[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [order, setOrder] = useState<Order>("place");
  const [tags, setTags] = useState<string[] | null>(null);
  useEffect(() => { if (lemmaMode) loadTags().then(setTags, () => undefined); }, [lemmaMode]);

  // the lines, read text by text from the texts themselves
  useEffect(() => {
    let live = true;
    (async () => {
      const out = loaded.current;
      let i = out.length;
      while (i < want && live) {
        const t = all[i].text, info = texts[t];
        setBusy(`Reading ${idx.work.get(all[i].work)?.title ?? "the text"}…`);
        let doc: TeiDoc | null = null, error: string | undefined;
        try { doc = await loadDoc(info.urn); } catch (e) { error = (e as Error).message; }
        if (!live) return;
        for (; i < want && all[i].text === t; i++) {
          const { work, h } = all[i];
          const u = doc?.units[h.unit];
          out.push({
            n: i, work, text: t, h, ref: u?.ref.join(".") ?? "", error,
            line: doc && u ? kwic(doc, h.unit, h.words, lang, 8, h.near ?? []) : null,
            href: doc && u ? hitHref(work, info.urn, lang, h, doc) : `/read?w=${work}`,
          });
        }
        setRows([...out]);
      }
      if (live) setBusy(null);
    })();
    return () => { live = false; };
  }, [want, all, texts, idx, lang]);

  const sorted = useMemo(() => {
    const by = (f: (r: Row) => string) => [...rows].sort((a, b) => f(a).localeCompare(f(b), lang === "grc" ? "el" : "en") || a.n - b.n);
    return order === "form" ? by((r) => r.line?.keySort ?? "") : order === "before" ? by((r) => r.line?.leftSort ?? "") : order === "after" ? by((r) => r.line?.rightSort ?? "") : rows;
  }, [rows, order, lang]);

  const grammar = (h: Hit) => {
    if (h.tag === undefined || !tags?.[h.tag]) return "";
    const t = readTag(tags[h.tag]);
    return `${t.pos}${t.detail ? `, ${t.detail}` : ""}`;
  };
  const download = () => {
    const head = ["Author", "Work", "Passage", "Edition", "Text (CTS URN)", "Before", "Match", "After", ...(lemmaMode ? ["Grammar (GLAUx)"] : []), "Link"];
    const body = sorted.map((r) => {
      const cat = idx.text.get(texts[r.text].urn);
      return [idx.authorOf.get(r.work)?.name ?? "", idx.work.get(r.work)?.title ?? r.work, r.ref, cat ? describe(cat) : "", texts[r.text].urn,
        r.line?.leftText ?? "", r.line?.key ?? "", r.line?.rightText ?? "", ...(lemmaMode ? [grammar(r.h)] : []), `${location.origin}${r.href}`];
    });
    const blob = new Blob([toCsv([head, ...body])], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `concordance-${title.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40) || "search"}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const many = works.length > 1;
  return (
    <section className={rs.conc} aria-label="Concordance">
      <div className={rs.bar}>
        <div className={`segmented ${rs.order}`} role="radiogroup" aria-label="Order of the lines">
          {ORDERS.map((o) => <button key={o.id} type="button" role="radio" aria-checked={order === o.id} onClick={() => setOrder(o.id)}>{o.label}</button>)}
        </div>
        <button type="button" className="btn small ghost" onClick={download} disabled={!rows.length}>
          Download {num(rows.length)} {rows.length === 1 ? "line" : "lines"} (spreadsheet)
        </button>
      </div>
      {order !== "place" && rows.length < all.length && <p className={rs.small}>Sorted among the {num(rows.length)} lines read so far.</p>}

      <ol className={rs.lines} lang={lang === "grc" ? "grc" : undefined} data-lang={lang}>
        {sorted.map((r) => (
          <li key={r.n}>
            <Link className={rs.ref} href={r.href} transitionTypes={["page-turn"]}
              title={`${idx.authorOf.get(r.work)?.name ?? ""}, ${idx.work.get(r.work)?.title ?? ""} ${r.ref}`}>
              {many && <span className={rs.work}>{idx.work.get(r.work)?.title} </span>}{r.ref}
            </Link>
            {r.line ? (
              <>
                <span className={rs.left}><span>{r.line.left.map((b, i) => (b.near ? <mark key={i} className={rs.near}>{b.t}</mark> : b.t))}</span></span>
                <mark className={rs.key}>{r.line.key}</mark>
                <span className={rs.right}>{r.line.right.map((b, i) => (b.near ? <mark key={i} className={rs.near}>{b.t}</mark> : b.t))}</span>
                {lemmaMode && <span className={rs.gram} lang="en">{grammar(r.h)}</span>}
              </>
            ) : <span className={rs.missing} lang="en">{r.error ?? "This passage could not be read."}</span>}
          </li>
        ))}
      </ol>

      <p className={rs.status} aria-live="polite">
        {busy ?? <>Showing {num(rows.length)} of {num(all.length)} {all.length === 1 ? "line" : "lines"}.</>}
      </p>
      {!busy && rows.length < all.length && (
        <div className={rs.more}>
          <button type="button" className="btn small ghost" onClick={() => setWant((n) => Math.min(all.length, n + STEP))}>Show {num(Math.min(STEP, all.length - rows.length))} more</button>
          {all.length <= MAX && all.length - rows.length > STEP && (
            <button type="button" className="btn small ghost" onClick={() => setWant(all.length)}>Show all {num(all.length)}</button>
          )}
          {all.length > MAX && <span className={rs.small}>For more than {num(MAX)} lines, narrow the search (an author, a work, a period).</span>}
        </div>
      )}
    </section>
  );
}

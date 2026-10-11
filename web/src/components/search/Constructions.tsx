"use client";
/**
 * The Oracle's construction finder: sentences found by how they are built (lib/constructions.ts), from
 * GLAUx's sentence analyses. A ready-made construction (the genitive absolute, ἄν with the optative…)
 * or one described by the reader ("anything that is the object of λέγω"), in the works the filters
 * choose. The word packs and sentence packs are read work by work; results show as they come, with,
 * for a search of one's own, which words fill the open slot most often.
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { greekEditions, versionOf, type CatalogIndex, type CatText, type CatWork } from "@/lib/catalog";
import { PACKS } from "@/config/packs";
import { loadWordPack, type WordPack } from "@/lib/lookup/words";
import { loadSyntax } from "@/lib/syntax";
import { placeAnalyses } from "@/lib/lookup/placed";
import { loadDoc } from "@/lib/search/context";
import { toCsv } from "@/lib/search/kwic";
import { TAG_FIELDS } from "@/lib/search/engine";
import type { TeiDoc } from "@/lib/tei/types";
import {
  ASK_ROLES, PRESETS, checkedByHand, corpus, makeQuery, refOf, searchCorpus, sentenceParts, tally,
  type Corpus, type Custom, type Match, type Query,
} from "@/lib/constructions";
import NotebookPicker from "@/components/notebook/NotebookPicker";
import type { NewItem } from "@/lib/notebooks";
import styles from "./Search.module.css";
import rs from "./Research.module.css";
import cs from "./Constructions.module.css";

const MAX = 20000, STEP = 100;
/** More than this many megabytes of analyses is too much to read in one go: the reader narrows the search first. */
const MAX_MB = 150;
const num = (n: number) => n.toLocaleString("en-GB");

/** Good places to start, each one text: a hand-checked treebank where there is one. */
const STARTS: { a: string; w: string; label: string }[] = [
  { a: "tlg0016", w: "tlg0016.tlg001", label: "Herodotus, Histories" },
  { a: "tlg0059", w: "tlg0059.tlg030", label: "Plato, Republic" },
  { a: "tlg0012", w: "tlg0012.tlg001", label: "Homer, Iliad" },
  { a: "tlg0003", w: "tlg0003.tlg001", label: "Thucydides" },
  { a: "tlg0032", w: "tlg0032.tlg006", label: "Xenophon, Anabasis" },
];

/** The grammar a reader can set for word A or B: four of the tag's nine places. */
const GRAMMAR = [0, 7, 4, 3].map((i) => ({ i, f: TAG_FIELDS[i] }));

let sizesP: Promise<Record<string, [number, string]>> | null = null;
const packSizes = () => (sizesP ??= fetch(`${PACKS}/words/_index.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({})) as Promise<Record<string, [number, string]>>);

/** The edition the reader opens first for a work (as Reader.tsx picks it). */
const editionOf = (w: CatWork): CatText | undefined => {
  const eds = greekEditions(w).length ? greekEditions(w) : w.texts.filter((t) => t.kind === "edition");
  return eds.find((t) => t.col === "perseus") ?? eds[0];
};

export function readCustom(params: URLSearchParams): Custom {
  return {
    a: { lemma: params.get("xa") ?? "", tag: params.get("xat") ?? "" },
    role: params.get("xr") ?? "obj",
    b: { lemma: params.get("xb") ?? "", tag: params.get("xbt") ?? "" },
  };
}

export default function Constructions({ idx, works, params, go }: {
  idx: CatalogIndex; works: Set<string> | null | undefined; params: URLSearchParams;
  go: (p: Record<string, string | null>, push?: boolean) => void;
}) {
  const cx = params.get("cx");
  const custom = useMemo(() => readCustom(params), [params]);
  const query = useMemo(() => (cx === "own" ? makeQuery(null, custom) : cx ? makeQuery(cx, null) : null), [cx, custom]);
  const preset = cx && cx !== "own" ? PRESETS.find((p) => p.id === cx) : undefined;
  const [building, setBuilding] = useState(cx === "own");

  return (
    <div className={cs.page}>
      <section aria-label="Choose a construction">
        <h2 className={rs.h}>Find a construction</h2>
        <ul className={cs.presets} data-compact={cx || building || undefined}>
          {PRESETS.map((p) => (
            <li key={p.id}>
              <button type="button" className={cs.preset} aria-pressed={cx === p.id} onClick={() => { setBuilding(false); go({ cx: p.id }, true); }}>
                <b>{p.name}</b>
                <span lang="grc" className={cs.eg}>{p.greek}</span>
                <small>{p.about}</small>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className={`${cs.preset} ${cs.own}`} aria-pressed={building || cx === "own"} onClick={() => setBuilding(true)}>
              <b>Describe your own</b>
              <span className={cs.eg}>word A is the … of word B</span>
              <small>Anything that is the object of <span lang="grc">λέγω</span>; what <span lang="grc">ψυχή</span> is the subject of; genitives describing a noun…</small>
            </button>
          </li>
        </ul>
        {(building || cx === "own") && <Builder key={params.toString()} initial={custom} onSubmit={(c) => go({ cx: "own", xa: c.a.lemma || null, xat: c.a.tag?.replace(/-+$/, "") || null, xr: c.role, xb: c.b.lemma || null, xbt: c.b.tag?.replace(/-+$/, "") || null }, true)} />}
      </section>

      {!cx ? (
        <p className={rs.small}>
          Sentence structures come from GLAUx: some texts were analysed and checked by people (treebanks), the rest by computer, which makes
          mistakes. Each result says which.
        </p>
      ) : query && "error" in query ? (
        <p className={styles.warn} role="alert">{query.error}</p>
      ) : works === undefined ? (
        <p className={styles.status}>Opening the catalogue…</p>
      ) : !works ? (
        <div className={cs.scope}>
          <p>Choose where to look, in <b>Where</b> beside this (an author, a work, a kind of writing), or start with one of these:</p>
          <div className={styles.examples}>
            {STARTS.filter((s) => idx.work.has(s.w)).map((s) => <button key={s.w} type="button" className="chip" onClick={() => go({ a: s.a, w: s.w })}>{s.label}</button>)}
          </div>
        </div>
      ) : query ? (
        <Run key={`${params.toString()}`} idx={idx} works={works} query={query} title={preset?.name ?? describeCustom(custom)} go={go} />
      ) : null}
    </div>
  );
}

const roleLabel = (id: string) => ASK_ROLES.find((r) => r.id === id)?.label.replace(/ \(.*\)$/, "") ?? id;
function describeWord(w: { lemma?: string; tag?: string }, fallback: string) {
  const g = GRAMMAR.map(({ i, f }) => (w.tag?.[i] && w.tag[i] !== "-" ? (f.values as Record<string, string>)[w.tag[i]] : null)).filter(Boolean).join(" ");
  return [w.lemma, g].filter(Boolean).join(", ") || fallback;
}
export const describeCustom = (c: Custom) =>
  `${describeWord(c.a, "anything")} as ${c.role === "any" ? "anything" : `the ${roleLabel(c.role)}`} of ${describeWord(c.b, "anything")}`;

// ------------------------------------------------------------ describing a search of one's own
function Builder({ initial, onSubmit }: { initial: Custom; onSubmit: (c: Custom) => void }) {
  const [c, setC] = useState<Custom>(initial);
  const word = (side: "a" | "b", title: string, eg: string) => {
    const w = c[side];
    const tag = (w.tag ?? "").padEnd(9, "-");
    const setTag = (i: number, v: string) => setC({ ...c, [side]: { ...w, tag: tag.slice(0, i) + (v || "-") + tag.slice(i + 1) } });
    return (
      <fieldset className={cs.word}>
        <legend>{title}</legend>
        <label className={styles.field}>
          <span>Dictionary word</span>
          <input value={w.lemma ?? ""} onChange={(e) => setC({ ...c, [side]: { ...w, lemma: e.target.value } })} lang="grc" placeholder={eg}
            autoComplete="off" autoCapitalize="off" spellCheck={false} />
        </label>
        {GRAMMAR.map(({ i, f }) => (
          <label key={f.id} className={styles.field}>
            <span>{f.label}</span>
            <select value={tag[i] === "-" ? "" : tag[i]} onChange={(e) => setTag(i, e.target.value)}>
              <option value="">any</option>
              {Object.entries(f.values).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        ))}
      </fieldset>
    );
  };
  return (
    <form className={cs.builder} onSubmit={(e) => { e.preventDefault(); onSubmit(c); }} aria-label="Describe a construction">
      {word("a", "Word A", "any word")}
      <label className={`${styles.field} ${cs.role}`}>
        <span>is the</span>
        <select value={c.role} onChange={(e) => setC({ ...c, role: e.target.value })}>
          {ASK_ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <span>of</span>
      </label>
      {word("b", "Word B", "λέγω")}
      <div className={cs.go}>
        <button className="btn" type="submit">Find</button>
        <small className="muted">Leave a word empty for “any word”. Dictionary words can be typed as in the search box: <span lang="grc">λεγω</span>, <i>lego</i>, <span lang="grc">λογ*</span>.</small>
      </div>
    </form>
  );
}

// ------------------------------------------------------------ running a search
interface Found { m: Match; c: Corpus }
/** Where a match is in the reader: its passage in the edition the reader opens, and the words to mark there. */
interface Place { href: string; ref: string; urn: string }

function Run({ idx, works, query, title, go }: {
  idx: CatalogIndex; works: Set<string>; query: Query; title: string; go: (p: Record<string, string | null>, push?: boolean) => void;
}) {
  const [found, setFound] = useState<Found[]>([]);
  const [busy, setBusy] = useState<string | null>("Getting ready…");
  const [stats, setStats] = useState({ works: 0, searched: 0, missing: 0, words: 0 });
  const [tooBig, setTooBig] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shown, setShown] = useState(STEP);
  const [places, setPlaces] = useState<Map<Match, Place | null>>(new Map());
  const [nbPick, setNbPick] = useState<{ items: NewItem[]; what: string } | null>(null);
  const capped = found.length >= MAX;

  useEffect(() => {
    let live = true;
    (async () => {
      const sizes = await packSizes();
      // without the packs' index (an older packs site), every work is tried, and those with no analyses are passed over
      const known = Object.keys(sizes).length > 0;
      const list = [...works].filter((w) => !known || sizes[w]).sort();
      const mb = known ? list.reduce((n, w) => n + sizes[w][0], 0) / 1e6 : 0;
      if (!live) return;
      setStats({ works: list.length, searched: 0, missing: works.size - list.length, words: 0 });
      if (mb > MAX_MB) { setTooBig(Math.round(mb)); setBusy(null); return; }
      const out: Found[] = [];
      let words = 0;
      for (let k = 0; k < list.length && live && out.length < MAX; k++) {
        const w = list[k];
        setBusy(`Reading ${idx.work.get(w)?.title ?? w}${list.length > 1 ? ` (${k + 1} of ${list.length})` : ""}…`);
        try {
          const [pack, syn] = await Promise.all([loadWordPack(w), loadSyntax(w)]);
          if (!live) return;
          if (pack && syn) {
            const c = corpus(w, pack, syn);
            words += c.lemma.length;
            for (const m of searchCorpus(c, query, MAX - out.length)) out.push({ m, c });
          }
        } catch (e) {
          setError((e as Error).message);
        }
        setFound([...out]);
        setStats((s) => ({ ...s, searched: k + 1, words }));
        // let the page breathe between works
        await new Promise((r) => setTimeout(r, 0));
      }
      if (live) setBusy(null);
    })();
    return () => { live = false; };
  }, [idx, works, query]);

  // the reader's addresses, worked out for the results showing, a text at a time
  const visible = found.slice(0, shown);
  const pending = useRef(new Set<Match>());
  useEffect(() => {
    let live = true;
    (async () => {
      const todo = visible.filter((f) => !places.has(f.m) && !pending.current.has(f.m));
      if (!todo.length) return;
      todo.forEach((f) => pending.current.add(f.m));
      const byWork = new Map<string, Found[]>();
      for (const f of todo) byWork.set(f.c.work, [...(byWork.get(f.c.work) ?? []), f]);
      for (const [w, fs] of byWork) {
        const ed = idx.work.get(w) && editionOf(idx.work.get(w)!);
        let doc: TeiDoc | null = null;
        if (ed) { try { doc = await loadDoc(ed.urn); } catch { doc = null; } }
        if (!live) return;
        const next = new Map<Match, Place | null>();
        for (const f of fs) next.set(f.m, doc && ed ? placeOf(f, doc, ed) : null);
        setPlaces((p) => new Map([...p, ...next]));
      }
    })();
    return () => { live = false; };
  }, [visible, places, idx]);

  const custom = "custom" in query;
  const a = useMemo(() => (custom ? tally(found.map((f) => f.m), "a") : []), [found, custom]);
  const b = useMemo(() => (custom ? tally(found.map((f) => f.m), "b") : []), [found, custom]);
  const byHand = found.filter((f) => checkedByHand(f.c, f.m)).length;
  const workCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of found) m.set(f.c.work, (m.get(f.c.work) ?? 0) + 1);
    return [...m.entries()].sort((x, y) => y[1] - x[1]);
  }, [found]);

  const download = () => {
    const head = ["Author", "Work", "Place (GLAUx)", "Sentence", "Words found", ...(custom ? ["Word A", "Word B"] : []), "Checked by hand", "Link"];
    const body = found.map((f) => {
      const parts = sentenceParts(f.c, f.m);
      const pl = places.get(f.m);
      return [idx.authorOf.get(f.c.work)?.name ?? "", idx.work.get(f.c.work)?.title ?? f.c.work, refOf(f.c, f.m.words[0]), parts.map((p) => p.t).join(" "),
        parts.filter((p) => p.hit).map((p) => p.t).join(" "), ...(custom ? [f.m.a ?? "", f.m.b ?? ""] : []), checkedByHand(f.c, f.m) ? "yes" : "no",
        `${location.origin}${pl?.href ?? `/read?w=${f.c.work}`}`];
    });
    const blob = new Blob([toCsv([head, ...body])], { type: "text/csv;charset=utf-8" });
    const el = document.createElement("a");
    el.href = URL.createObjectURL(blob);
    el.download = `constructions-${title.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40) || "search"}.csv`;
    el.click();
    setTimeout(() => URL.revokeObjectURL(el.href), 1000);
  };
  const lineItem = (f: Found, pl: Place): NewItem => {
    const parts = sentenceParts(f.c, f.m);
    const first = parts.findIndex((p) => p.hit), last = parts.length - 1 - [...parts].reverse().findIndex((p) => p.hit);
    return {
      kind: "line", work: f.c.work, urn: pl.urn, from: pl.ref, lang: "grc", query: title,
      left: parts.slice(0, first).map((p) => p.t).join(" "), match: parts.slice(first, last + 1).map((p) => p.t).join(" "), right: parts.slice(last + 1).map((p) => p.t).join(" "),
    };
  };

  if (tooBig !== null) {
    return (
      <p className={styles.warn} role="alert">
        These {num(stats.works)} works hold {num(tooBig)} MB of analyses, too much to read in one go. Choose fewer works in <b>Where</b> (one author, say),
        and search again.
      </p>
    );
  }
  const many = stats.works > 1;
  return (
    <section className={rs.conc} aria-label="Sentences found" aria-busy={!!busy}>
      <div className={rs.bar}>
        <p className={cs.count} role="status">
          <b>{num(found.length)}{capped ? "+" : ""}</b> {found.length === 1 ? "match" : "matches"} for <i>{title}</i>
          {stats.searched > 0 && <> in {num(stats.searched)} {stats.searched === 1 ? "work" : "works"} ({num(stats.words)} words)</>}
          {found.length > 0 && <>; {byHand === found.length ? "all" : byHand ? num(byHand) : "none"} in sentences checked by hand</>}
          {busy && <span className={rs.status}> · {busy}</span>}
        </p>
        <span className={rs.barBtns}>
          <button type="button" className="btn small ghost" onClick={download} disabled={!found.length || !!busy}>
            Download {num(found.length)} (spreadsheet)
          </button>
        </span>
      </div>
      {stats.missing > 0 && <p className={rs.small}>{num(stats.missing)} of the works chosen have no sentence analyses yet and were left out.</p>}
      {capped && <p className={rs.small}>Stopped at {num(MAX)} matches: narrow the search to see them all.</p>}
      {error && <p className={styles.warn}>Some analyses could not be read: {error}</p>}

      {custom && found.length > 0 && (
        <div className={rs.statGrid}>
          <Tally title="Word A, most often" rows={a} total={found.length} pick={(l) => go({ xa: l }, true)} />
          <Tally title="Word B, most often" rows={b} total={found.length} pick={(l) => go({ xb: l }, true)} />
        </div>
      )}
      {many && workCounts.length > 1 && (
        <details className={cs.works}>
          <summary>By work ({num(workCounts.length)})</summary>
          <ul>
            {workCounts.map(([w, n]) => (
              <li key={w}><button type="button" className="chip" onClick={() => go({ w, a: idx.authorOf.get(w)?.id ?? null }, true)}>{idx.work.get(w)?.title ?? w}</button> {num(n)}</li>
            ))}
          </ul>
        </details>
      )}

      <ol className={cs.list} lang="grc">
        {visible.map((f, n) => {
          const pl = places.get(f.m);
          const ref = refOf(f.c, f.m.words[0]);
          return (
            <li key={n}>
              <div className={cs.where}>
                <Link className={rs.ref} href={pl?.href ?? `/read?w=${f.c.work}`} transitionTypes={["page-turn"]} lang="en"
                  title={`${idx.authorOf.get(f.c.work)?.name ?? ""}, ${idx.work.get(f.c.work)?.title ?? ""} ${pl?.ref ?? ref}`}>
                  {many && <span className={rs.work}>{idx.work.get(f.c.work)?.title} </span>}{pl?.ref ?? ref}
                </Link>
                <small className={cs.how} lang="en" data-hand={checkedByHand(f.c, f.m) || undefined}>
                  {checkedByHand(f.c, f.m) ? "checked by hand" : "computer analysis"}
                </small>
                {pl && (
                  <button type="button" className={rs.addLine} aria-label="Add to a notebook" title="Add to a notebook" lang="en"
                    onClick={() => setNbPick({ items: [lineItem(f, pl)], what: "this sentence" })}>+</button>
                )}
              </div>
              <p className={cs.sentence}>
                {sentenceParts(f.c, f.m).map((p, i) => (p.hit ? <mark key={i}>{p.t}</mark> : <span key={i}>{p.t}</span>)).reduce<React.ReactNode[]>((acc, el, i) => (i ? [...acc, " ", el] : [el]), [])}
              </p>
            </li>
          );
        })}
      </ol>
      {found.length > shown && (
        <div className={rs.more}>
          <button type="button" className="btn small ghost" onClick={() => setShown((s) => s + STEP * 2)}>Show {num(Math.min(STEP * 2, found.length - shown))} more</button>
          <span className={rs.small}>{num(shown)} of {num(found.length)} shown</span>
        </div>
      )}
      {!busy && !found.length && <p className={styles.status}>Nothing found. {"custom" in query ? "Try leaving out some of the grammar, or another role." : "Try other works."}</p>}
      <p className={rs.small} lang="en">
        Sentence structures from GLAUx (see <Link href="/credits">Credits</Link>). Hand-checked sentences are reliable; the computer’s analysis
        misreads some sentences, so check a result in the reader before relying on it.
      </p>
      {nbPick && <NotebookPicker items={nbPick.items} what={nbPick.what} onClose={() => setNbPick(null)} />}
    </section>
  );
}

/** Where a match stands in the edition the reader opens: its passage, and the matched words' places in it. */
function placeOf(f: Found, doc: TeiDoc, ed: CatText): Place | null {
  const placed = placeAnalyses(f.c.pack as WordPack, doc);
  const inv = inverse(placed.word, f.c.lemma.length);
  const pos = f.m.words.map((p) => inv[p]).filter((p) => p >= 0);
  if (!pos.length) return null;
  const { unitStart } = placed;
  let lo = 0, hi = doc.units.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (unitStart[mid] <= pos[0]) lo = mid; else hi = mid - 1; }
  const u = doc.units[lo];
  const hl = pos.filter((p) => p >= unitStart[lo] && p < unitStart[lo + 1]).map((p) => p - unitStart[lo]);
  const ref = u.ref.join(".");
  return { ref, urn: ed.urn, href: `/read?w=${f.c.work}&ed=${versionOf(ed.urn)}&at=${encodeURIComponent(ref)}&hl=${hl.join(",")}` };
}
const inverses = new WeakMap<Int32Array, Int32Array>();
function inverse(word: Int32Array, n: number): Int32Array {
  let inv = inverses.get(word);
  if (!inv) {
    inv = new Int32Array(n).fill(-1);
    word.forEach((p, i) => { if (p >= 0 && p < n) inv![p] = i; });
    inverses.set(word, inv);
  }
  return inv;
}

/** The dictionary words that fill one slot, most often first: bars from a common baseline, values at their ends. */
function Tally({ title, rows, total, pick }: { title: string; rows: [string, number][]; total: number; pick: (lemma: string) => void }) {
  const [all, setAll] = useState(false);
  const top = rows[0]?.[1] ?? 1;
  const list = all ? rows.slice(0, 200) : rows.slice(0, 12);
  return (
    <figure className={rs.chart}>
      <figcaption className={rs.h4}>{title} <span className="muted">({num(rows.length)} different)</span></figcaption>
      <ul className={rs.bars}>
        {list.map(([l, n]) => (
          <li key={l} data-tip={`${l}: ${num(n)} of ${num(total)} matches (${Math.round((n / total) * 100)}%). Choose it to narrow the search.`}>
            <button type="button" className={cs.lemma} lang="grc" onClick={() => pick(l)}>{l}</button>
            <span className={rs.track}><span className={rs.fill} style={{ width: `${(n / top) * 100}%` }} /></span>
            <span className={rs.barValue}>{num(n)}</span>
          </li>
        ))}
      </ul>
      {rows.length > 12 && <button type="button" className="chip" onClick={() => setAll((v) => !v)}>{all ? "Fewer" : `All ${rows.length > 200 ? "(first 200)" : ""}`}</button>}
    </figure>
  );
}

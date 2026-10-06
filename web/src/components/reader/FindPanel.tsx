"use client";
/**
 * Find in this text: a word or phrase, through the whole book, in the Greek and in the translation
 * (lib/find.ts does the finding). The matches are listed with the words around them; Enter, or the
 * arrows, step from one to the next, turning the page when they have to. The Reader marks them on the page.
 * On phones the panel shrinks to its search row once a match is chosen, so the text shows above it.
 */
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { TeiDoc } from "@/lib/tei/types";
import type { Placed } from "@/lib/tei/align";
import { englishSnippet, findInText, FIND_MAX, greekIndex, pieceText, type FindHit } from "@/lib/find";
import { snippet } from "@/lib/search/context";
import styles from "./Reader.module.css";
import fs from "./Find.module.css";

export interface FindMarks { hits: FindHit[]; cur: FindHit | null; seq: number; engSource: string | null }

const LIST_MAX = 200;
const num = (n: number) => n.toLocaleString("en-GB");

export default function FindPanel({ doc, placed, initial, here, onQuery, onJump, onMarks, onClose }: {
  doc: TeiDoc; placed: Placed[] | null;
  initial: string;
  /** the passage at the top of the page now (an index into doc.units): stepping starts from there */
  here: () => number;
  onQuery: (q: string) => void;
  onJump: (h: FindHit) => void;
  onMarks: (m: FindMarks | null) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState(initial);
  const dq = useDeferredValue(q);
  const index = useMemo(() => greekIndex(doc), [doc]);
  const res = useMemo(() => findInText(doc, index, placed, dq), [doc, index, placed, dq]);
  const [scope, setScope] = useState<"grc" | "eng" | null>(null);
  const sc = scope === "eng" && res.eng.length ? "eng" : scope === "grc" && res.grc.length ? "grc" : res.grc.length || !res.eng.length ? "grc" : "eng";
  const hits: FindHit[] = sc === "grc" ? res.grc : res.eng;
  // which match is chosen: forgotten when the search or the language changes
  const k = `${dq}|${sc}`;
  const [cur, setCur] = useState({ k: "", i: -1, seq: 0 });
  const i = cur.k === k ? cur.i : -1;
  const [compact, setCompact] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); inputRef.current?.select(); }, []);
  useEffect(() => { onQuery(dq); }, [dq, onQuery]);
  useEffect(() => {
    onMarks(hits.length ? { hits, cur: i >= 0 ? hits[i] : null, seq: cur.seq, engSource: sc === "eng" ? res.engSource : null } : null);
  }, [hits, i, cur.seq, sc, res.engSource, onMarks]);
  useEffect(() => () => onMarks(null), [onMarks]);
  // the chosen match stays in sight in the list
  useEffect(() => { listRef.current?.querySelector("[aria-current]")?.scrollIntoView({ block: "nearest" }); }, [i]);

  const go = (n: number) => {
    if (!hits.length) return;
    setCur({ k, i: n, seq: cur.seq + 1 });
    onJump(hits[n]);
    if (matchMedia("(max-width: 900px)").matches) setCompact(true);
  };
  const step = (dir: 1 | -1) => {
    if (!hits.length) return;
    if (i >= 0) { go((i + dir + hits.length) % hits.length); return; }
    // the first step goes from where the reader is, not from the start of the book
    const h = here();
    const n = dir === 1 ? hits.findIndex((x) => x.unit >= h) : hits.findLastIndex((x) => x.unit < h);
    go(n >= 0 ? n : dir === 1 ? 0 : hits.length - 1);
  };

  const both = res.eng.length > 0 && !res.error;
  const status = !dq.trim() ? null
    : !hits.length ? (res.error && !res.eng.length ? res.error : "Not found in this text.")
    : `${i >= 0 ? `${num(i + 1)} of ` : ""}${num(hits.length)}${res.capped ? "+" : ""} ${sc === "grc" ? "in the Greek" : "in the translation"}`;

  return (
    <aside className={`${styles.panel} ${fs.panel}`} data-compact={compact || undefined} aria-label="Find in this text"
      onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}>
      <div className={styles.panelHead}>
        <h2 className={fs.title}>Find in this text</h2>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close find">×</button>
      </div>

      <form className={fs.row} role="search" onSubmit={(e) => { e.preventDefault(); step(1); }}>
        <svg className={fs.glass} viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
        <input ref={inputRef} type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a word or phrase in this text"
          placeholder="A word or phrase" enterKeyHint="search" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          onKeyDown={(e) => { if (e.key === "Enter" && e.shiftKey) { e.preventDefault(); step(-1); } }} />
        <button type="button" className={fs.step} onClick={() => step(-1)} disabled={!hits.length} aria-label="Previous match" title="Previous match (Shift+Enter)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg>
        </button>
        <button type="submit" className={fs.step} disabled={!hits.length} aria-label="Next match" title="Next match (Enter)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </form>
      <p className={fs.status} role="status" aria-live="polite">
        {status}
        {compact && hits.length > 0 && <> · <button type="button" className={fs.linkBtn} onClick={() => setCompact(false)}>Show the list</button></>}
      </p>

      {both && (
        <div className={`segmented ${fs.scope}`} role="radiogroup" aria-label="Look in">
          <button type="button" role="radio" aria-checked={sc === "grc"} onClick={() => setScope("grc")} disabled={!res.grc.length}>
            Greek <span lang="grc">{res.greek}</span> <span className={fs.n}>{num(res.grc.length)}</span>
          </button>
          <button type="button" role="radio" aria-checked={sc === "eng"} onClick={() => setScope("eng")}>
            Translation <span className={fs.n}>{num(res.eng.length)}{res.capped ? "+" : ""}</span>
          </button>
        </div>
      )}

      {!dq.trim() && (
        <div className={fs.help}>
          <p>Type Greek in Greek letters, in Latin letters (<i>logos</i>, <i>andra</i>) or in Beta Code. Accents and breathings do not matter. Latin letters also search the English translation.</p>
          <p>Several words find them together, in that order. <kbd>*</kbd> stands for any letters and <kbd>?</kbd> for one: <span lang="grc">λογ*</span> finds λόγος, λόγου, λόγων…</p>
          <p><kbd>Enter</kbd> goes to the next match, <kbd>Shift</kbd>+<kbd>Enter</kbd> to the one before.</p>
        </div>
      )}

      {hits.length > 0 && (
        <ol ref={listRef} className={fs.list} data-hide={compact || undefined}>
          {hits.slice(0, LIST_MAX).map((h, n) => {
            const ref = doc.units[h.unit].ref.join(".");
            return (
              <li key={n}>
                <button type="button" onClick={() => go(n)} aria-current={n === i ? "true" : undefined}>
                  <span className={fs.ref}>{ref}</span>
                  {h.lang === "grc"
                    ? <span className={fs.snip} lang="grc">{snippet(doc.units[h.unit], h.words.filter((w) => w.unit === h.unit).map((w) => w.i), "grc", 6).map((p, j) => (p.hit ? <mark key={j}>{p.t}</mark> : p.t))}</span>
                    : (() => { const s = englishSnippet(pieceText(placed![h.piece]), h); return <span className={fs.snip}>{s.before}<mark>{s.hit}</mark>{s.after}</span>; })()}
                </button>
              </li>
            );
          })}
        </ol>
      )}
      {hits.length > LIST_MAX && !compact && <p className={styles.fine}>The first {LIST_MAX} are listed; the arrows go through all {num(Math.min(hits.length, FIND_MAX))}{res.capped ? "+" : ""}.</p>}
      {dq.trim() && !compact && (
        <p className={styles.fine}>
          <Link href={`/search?q=${encodeURIComponent(dq.trim())}`} transitionTypes={["page-turn"]}>Search every text in the library for “{dq.trim()}” →</Link>
        </p>
      )}
    </aside>
  );
}

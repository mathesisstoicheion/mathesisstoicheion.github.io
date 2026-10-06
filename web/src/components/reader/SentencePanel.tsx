"use client";
/**
 * How a sentence is built: the sentence, then its tree, from the main verb down. Each word shows its role in
 * plain words (subject, object, describes…) and its grammar; choosing one lights up the whole phrase it heads,
 * here and in the text. From GLAUx (lib/syntax.ts), which says whether a person checked the sentence.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { loadWordPack, type WordPack } from "@/lib/lookup/words";
import { placeAnalyses, positionsFor, type Placed } from "@/lib/lookup/placed";
import { readTag } from "@/lib/lookup/postag";
import { unitWords } from "@/lib/search/codec";
import { loadSyntax, packForms, phraseOf, readSentence, roleOf, ROLES, sentenceOf, type Sentence, type Syntax } from "@/lib/syntax";
import type { TeiDoc } from "@/lib/tei/types";
import styles from "./Reader.module.css";
import ss from "./Sentence.module.css";

/** Words on screen to mark: by passage reference and place among the passage's words. */
export interface SentenceMarks { sentence: { u: string; i: number }[]; phrase: { u: string; i: number }[]; word: { u: string; i: number }[] }

const GUIDELINES = "https://github.com/PerseusDL/treebank_data/blob/master/AGDT2/guidelines/Greek_guidelines.md";
const tagsCache = new WeakMap<WordPack, number[]>();
const packTags = (pack: WordPack) => {
  let t = tagsCache.get(pack);
  if (!t) { t = pack.units.flatMap((u) => u[4]); tagsCache.set(pack, t); }
  return t;
};
const invCache = new WeakMap<Placed, Int32Array>();
/** From a word's place in the word pack to its place in the text on screen. */
const inverse = (placed: Placed, n: number) => {
  let inv = invCache.get(placed);
  if (!inv) { inv = new Int32Array(n).fill(-1); placed.word.forEach((p, pos) => { if (p >= 0) inv![p] = pos; }); invCache.set(placed, inv); }
  return inv;
};

type Ready = { pack: WordPack; syn: Syntax; placed: Placed; forms: string[]; tags: number[]; doc: TeiDoc };

export default function SentencePanel({ work, doc, at, onMarks, onClose }: {
  work: string; doc: TeiDoc;
  /** the word asked about: its passage and its place among the passage's words */
  at: { u: string; i: number };
  onMarks: (m: SentenceMarks | null) => void;
  onClose: () => void;
}) {
  const [data, setData] = useState<Ready | { error: string } | null>(null);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let live = true;
    Promise.all([loadWordPack(work), loadSyntax(work)]).then(([pack, syn]) => {
      if (!live) return;
      if (!pack || !syn) { setData({ error: "There is no analysis of this text's sentences yet: GLAUx does not include it." }); return; }
      const forms = packForms(pack);
      setData({ pack, syn, placed: placeAnalyses(pack, doc), forms, tags: packTags(pack), doc });
    }, (e: Error) => { if (live) setData({ error: e.message }); });
    return () => { live = false; };
  }, [work, doc]);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);

  // the sentence of the word asked about (or the one stepped to)
  const asked = useMemo(() => {
    if (!data || "error" in data) return null;
    const unit = doc.units.findIndex((u) => u.ref.join(".") === at.u);
    if (unit < 0) return null;
    const pos = positionsFor(data.placed, at.u, unitWords(doc.units[unit]))[at.i] ?? -1;
    const p = pos >= 0 ? data.placed.word[pos] : -1;
    return p >= 0 ? { p, n: sentenceOf(data.syn, p) } : null;
  }, [data, doc, at]);
  const [step, setStep] = useState<{ from: string; n: number } | null>(null);
  const askedKey = `${at.u}:${at.i}`;
  const n = step?.from === askedKey ? step.n : asked?.n ?? -1;
  const s: Sentence | null = useMemo(() => (data && !("error" in data) && n >= 0 ? readSentence(data.syn, n, data.forms) : null), [data, n]);
  const [chosen, setChosen] = useState<{ n: number; i: number } | null>(null);
  const sel = s ? (chosen?.n === s.n ? chosen.i : s.nodes.find((x) => x.p === asked?.p)?.i ?? s.roots[0] ?? 0) : 0;
  const phrase = useMemo(() => (s ? new Set(phraseOf(s, sel)) : new Set<number>()), [s, sel]);

  // where the sentence's words are on screen, for marking them there
  useEffect(() => {
    if (!s || !data || "error" in data) { onMarks(null); return; }
    const inv = inverse(data.placed, data.forms.length), starts = data.placed.unitStart;
    const where = (i: number) => {
      const p = s.nodes[i].p;
      const pos = p === null ? -1 : inv[p];
      if (pos < 0) return null;
      let lo = 0, hi = doc.units.length - 1;
      while (lo < hi) { const m = (lo + hi + 1) >> 1; if (starts[m] <= pos) lo = m; else hi = m - 1; }
      return { u: doc.units[lo].ref.join("."), i: pos - starts[lo] };
    };
    const all = s.nodes.map((x) => where(x.i));
    const pick = (keep: (i: number) => boolean) => all.filter((w, i) => w && keep(i)) as { u: string; i: number }[];
    onMarks({ sentence: pick(() => true), phrase: pick((i) => phrase.has(i)), word: pick((i) => i === sel) });
  }, [s, sel, phrase, data, doc, onMarks]);
  useEffect(() => () => onMarks(null), [onMarks]);

  const grammar = (p: number | null) => {
    if (p === null || !data || "error" in data) return "";
    const tag = data.pack.tags[data.tags[p]];
    if (!tag) return "";
    const r = readTag(tag);
    return r.detail ? `${r.pos}, ${r.detail}` : r.pos;
  };
  const label = (i: number) => {
    const x = s!.nodes[i], r = roleOf(x.rel);
    const joiner = r.joined && x.head >= 0 ? s!.nodes[x.head] : null;
    return `${r.name}${joiner ? ` · joined by ${joiner.form || "an understood word"}` : r.joined ? " · one of several joined" : ""}${r.apposed ? " · in apposition" : ""}`;
  };

  // (a function that draws a branch, not a component: drawn afresh with the panel)
  const branch = (i: number): React.ReactNode => {
    const x = s!.nodes[i], r = roleOf(x.rel);
    const kids = [...x.kids].sort((a, b) => a - b);
    return (
      <li key={i}>
        <button type="button" className={ss.node} data-kind={r.kind} data-in={phrase.has(i) || undefined} aria-current={sel === i || undefined}
          onClick={() => setChosen({ n: s!.n, i })}>
          <span className={ss.form} lang="grc">{x.form || <i lang="en">an understood {x.rel.startsWith("PRED") ? "verb" : "word"}</i>}</span>
          <span className={ss.role}>{label(i)}</span>
          {x.p !== null && <span className={ss.gram}>{grammar(x.p)}</span>}
        </button>
        {kids.length > 0 && <ul>{kids.map(branch)}</ul>}
      </li>
    );
  };

  const total = data && !("error" in data) ? data.syn.raw.s.length : 0;
  return (
    <aside ref={ref} className={`${styles.panel} ${ss.panel}`} aria-label="How the sentence is built" tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}>
      <div className={styles.panelHead}>
        <h2 className={ss.title}>How the sentence is built</h2>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close the sentence">×</button>
      </div>
      {!data && <p className="muted">Reading the sentence…</p>}
      {data && "error" in data && <p className="muted">{data.error}</p>}
      {data && !("error" in data) && !s && <p className="muted">This word could not be matched with GLAUx&apos;s analysis here (its edition may differ from the one on screen).</p>}
      {s && (
        <>
          <p className={ss.sentence} lang="grc">
            {s.nodes.filter((x) => x.p !== null || x.form).map((x) => (
              <button key={x.i} type="button" className={ss.word} data-kind={roleOf(x.rel).kind} data-in={phrase.has(x.i) || undefined}
                aria-current={sel === x.i || undefined} onClick={() => setChosen({ n: s.n, i: x.i })}>{x.form}</button>
            ))}
          </p>
          <p className={ss.checked} data-manual={s.manual || undefined}>
            {s.manual
              ? "Checked by hand: this sentence's analysis was made or corrected by a person, in a treebank project."
              : "Analysed by computer (GLAUx): good on the whole, but it may be wrong in places."}
          </p>
          <ul className={ss.tree} aria-label="The sentence's structure: each word, then the words that hang on it">
            {s.roots.map(branch)}
          </ul>
          <div className={ss.steps}>
            <button type="button" className="chip" disabled={s.n <= 0} onClick={() => setStep({ from: askedKey, n: s.n - 1 })}>← Previous sentence</button>
            <button type="button" className="chip" disabled={s.n >= total - 1} onClick={() => setStep({ from: askedKey, n: s.n + 1 })}>Next sentence →</button>
          </div>
          <details className={ss.key}>
            <summary>What the roles mean</summary>
            <dl>
              {Object.entries(ROLES).filter(([k]) => !["AtvV", "MWE2", "AuxV", "AuxR", "AuxG"].includes(k)).map(([k, r]) => (
                <div key={k} data-kind={r.kind}><dt>{r.name}</dt><dd>{r.about}</dd></div>
              ))}
              <div data-kind="link"><dt>· joined by</dt><dd>One of several words or clauses of the same kind, joined by the word shown; they hang on it.</dd></div>
            </dl>
            <p className={styles.fine}>After the <a href={GUIDELINES} target="_blank" rel="noopener noreferrer">guidelines of the Ancient Greek Dependency Treebank</a> (G. Celano).</p>
          </details>
          <p className={styles.fine}>Sentence analysis: GLAUx (Keersmaekers 2021), CC BY-SA 4.0, in the scheme of the Ancient Greek Dependency Treebank.</p>
        </>
      )}
    </aside>
  );
}

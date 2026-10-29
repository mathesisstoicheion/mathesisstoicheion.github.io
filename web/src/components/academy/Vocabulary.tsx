"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { coreWords, type CoreEntry } from "@/lib/lookup/core";
import { loadWordPack } from "@/lib/lookup/words";
import { fold } from "@/lib/catalog";
import { useAcademy } from "@/lib/academy";
import { LESSON_INFO } from "@/data/lesson-index";
import { TRACKS, begun } from "@/data/tracks";
import styles from "./Academy.module.css";

const TEXTS: [string, string][] = [
  ["tlg0031.tlg004", "Gospel of John"],
  ["tlg0096.tlg002", "Aesop's fables"],
  ["tlg0032.tlg006", "Xenophon, Anabasis"],
  ["tlg0540.tlg001", "Lysias 1, On the Murder of Eratosthenes"],
  ["tlg0059.tlg002", "Plato, Apology"],
  ["tlg0012.tlg001", "Homer, Iliad"],
  ["tlg0003.tlg001", "Thucydides, History"],
];

/** How many words are listed before "Show the next 100" (searching, or choosing a group, lists every match). */
const PAGE = 100;

/** How much of a text's running words a set of dictionary words covers. `failed`: this text's word data would not load. */
function useCoverage(work: string) {
  const [freq, setFreq] = useState<{ work: string; counts: Map<string, number> | null; total: number } | null>(null);
  useEffect(() => {
    let live = true;
    const fail = () => { if (live) setFreq({ work, counts: null, total: 0 }); };
    loadWordPack(work).then((pack) => {
      if (!live) return;
      if (!pack) return fail();
      const counts = new Map<string, number>();
      let total = 0;
      for (const [, , , lem, tags] of pack.units) lem.forEach((l, j) => {
        if (pack.tags[tags[j]].startsWith("u")) return;
        const k = fold(pack.lemmas[l]);
        counts.set(k, (counts.get(k) ?? 0) + 1);
        total++;
      });
      setFreq({ work, counts, total });
    }).catch(fail);
    return () => { live = false; };
  }, [work]);
  const f = freq?.work === work ? freq : null;
  const share = (lemmas: Iterable<string>) => {
    if (!f?.counts) return null;
    let n = 0;
    for (const l of new Set([...lemmas].map(fold))) n += f.counts.get(l) ?? 0;
    return n / f.total;
  };
  return { share, total: f?.total ?? null, failed: f !== null && f.counts === null };
}

/**
 * The dictionary forms met in the lessons finished on either track: the grammar course's own word lists, and every
 * word read on the reading path (data/reading-path.ts wordsRead, as its "Lessons completed" counts them). The path's
 * lessons are a large file, so they load only for a learner who has read some.
 */
function useLessonWords() {
  const completed = useAcademy((s) => s.completed);
  const started = begun(completed);
  const course = useMemo(() => LESSON_INFO.filter((l) => completed[l.id]).flatMap((l) => l.words), [completed]);
  const [path, setPath] = useState<string[]>([]);
  useEffect(() => {
    if (!started.reading) return;
    let live = true;
    import("@/data/reading-path").then((m) => { if (live) setPath(m.wordsRead(completed).map((w) => w.lemma)); });
    return () => { live = false; };
  }, [completed, started.reading]);
  const words = useMemo(() => [...new Set([...course, ...(started.reading ? path : [])])], [course, path, started.reading]);
  const from = started.reading && started.grammar ? "both tracks" : started.reading ? TRACKS.reading.name : TRACKS.grammar.name;
  return { words, folded: useMemo(() => new Set(words.map(fold)), [words]), from };
}

export default function Vocabulary() {
  const [words, setWords] = useState<{ lemma: string; entry: CoreEntry }[]>([]);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const [work, setWork] = useState(TEXTS[0][0]);
  const query = useDeferredValue(fold(q.trim()));
  useEffect(() => { coreWords().then(setWords); }, []);

  const { share, total, failed } = useCoverage(work);
  // the learner's own words first: how much of the text the lessons have already given them
  const mine = useLessonWords();
  const [limit, setLimit] = useState(PAGE);
  const groups = useMemo(() => [...new Set(words.map((w) => w.entry.group))].sort(), [words]);
  const shown = words.filter((w) => (!group || w.entry.group === group) && (!query || fold(w.lemma).includes(query) || w.entry.def.toLowerCase().includes(q.trim().toLowerCase())));
  const pct = (x: number | null) => (x === null ? "…" : `${Math.round(x * 100)}%`);
  const filtering = !!(q.trim() || group);
  const listed = filtering ? shown : shown.slice(0, limit);

  return (
    <div className={styles.vocabPage}>
      <section className={styles.coverage} aria-labelledby="cov-title">
        <h2 id="cov-title">How much can you read?</h2>
        <label className={styles.covPick}><span className="label">Text</span>
          <select id="coverage-text" value={work} onChange={(e) => setWork(e.target.value)}>
            {TEXTS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        {failed ? <p className="muted">Not available for this text right now</p> : <div className={styles.covBars}>
          {[
            ...(mine.words.length ? [[`The ${mine.words.length} word${mine.words.length === 1 ? "" : "s"} from your lessons`, share(mine.words), mine.from]] : []),
            ["The 100 commonest words", share(words.slice(0, 100).map((w) => w.lemma)), "DCC core #1–100"],
            ["The 250 commonest words", share(words.slice(0, 250).map((w) => w.lemma)), "DCC core #1–250"],
            [`All ${words.length} core words`, share(words.map((w) => w.lemma)), "the whole DCC core list"],
          ].map(([label, v, sub]) => (
            <div key={label as string} className={styles.covRow}>
              <span>{label as string} <small className="muted">{sub as string}</small></span>
              <span className={styles.covBar}><i style={{ width: typeof v === "number" ? `${v * 100}%` : 0 }} /></span>
              <b>{pct(v as number | null)}</b>
            </div>
          ))}
        </div>}
        {!failed && <p className={styles.small}>Share of the running words of this text ({total ? total.toLocaleString("en-GB") : "…"} words) whose dictionary form is in each set, counted from GLAUx&apos;s analyses. Knowing a word&apos;s dictionary form is only the first step: its forms still have to be recognised.</p>}
      </section>

      <section className={styles.coreList} aria-labelledby="core-title">
        <h2 id="core-title">{filtering ? `${shown.length} of the commonest words` : "The commonest words"}</h2>
        {/* the search sits in the list it filters */}
        <div className={`${styles.tablesTools} ${styles.vocabSearch}`} role="search">
          <input enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false} id="vocab-search" type="search" className={styles.searchInput} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a word, in Greek or English" aria-label="Find a word" />
          <select id="vocab-group" value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Group">
            <option value="">All groups</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className={styles.scrollX} tabIndex={0} role="region" aria-label="The commonest words">
          <table className={styles.coreTable}>
            <thead><tr><th>#</th><th>Word</th><th>Meaning</th><th>Kind</th></tr></thead>
            <tbody>
              {listed.map((w) => {
                return (
                  <tr key={w.lemma}>
                    <td className={styles.rank}>{w.entry.rank}</td>
                    <td lang="grc" className={styles.inlineGr}>{w.entry.head}{mine.folded.has(fold(w.lemma)) && (
                      <span className={styles.met} lang="en" title="In your lessons">✓<span className="visually-hidden">, in your lessons</span></span>)}</td>
                    <td>{w.entry.def}</td>
                    <td className={styles.small}>{w.entry.pos}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {listed.length < shown.length && <button type="button" className="btn ghost" onClick={() => setLimit(limit + PAGE)}>Show the next {Math.min(PAGE, shown.length - listed.length)}</button>}
        <p className={styles.small}>Dickinson College Commentaries Greek Core Vocabulary (Christopher Francese et al.), CC BY-SA 3.0.</p>
      </section>
    </div>
  );
}

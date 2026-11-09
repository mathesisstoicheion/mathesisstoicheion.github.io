"use client";
/**
 * Word duels: any two dictionary words side by side, across the five periods and the twelve kinds of writing, each as
 * uses per 10,000 words so that ages and kinds of different sizes compare fairly. A few duels stand ready; either word
 * can be changed by typing (Greek, Latin letters or an English meaning).
 */
import { useMemo, useState } from "react";
import type { CensusMeta } from "@/lib/census";
import { familyWords, loadFamilyCounts, loadMeanings, loadPeriodCounts, matcher, periodWords, type Register } from "@/lib/census-register";
import { transliterate } from "@/lib/translit";
import { useLoad } from "@/lib/use-load";
import { fmtRate } from "@/lib/census";
import { fmt } from "./shared";
import styles from "./Census.module.css";

const READY: [string, string, string][] = [
  ["μοῖρα", "τύχη", "Fate or fortune"],
  ["Ζεύς", "θεός", "Zeus or God"],
  ["ψυχή", "σῶμα", "Soul or body"],
  ["πόλεμος", "εἰρήνη", "War or peace"],
  ["φίλος", "ἐχθρός", "Friend or enemy"],
  ["οἶνος", "ὕδωρ", "Wine or water"],
  ["αὐλός", "λύρα", "Pipe or lyre"],
];

export default function Duels({ meta, reg }: { meta: CensusMeta; reg: Register }) {
  const idx = useMemo(() => new Map(reg.w.map((w, i) => [w, i])), [reg]);
  const [pair, setPair] = useState<[number, number]>(() => [idx.get(READY[0][0]) ?? 0, idx.get(READY[0][1]) ?? 1]);
  const pe = useLoad("reg-pe", loadPeriodCounts);
  const fa = useLoad("reg-fa", loadFamilyCounts);
  const gl = useLoad("gl", loadMeanings);
  const pw = periodWords(meta, reg), fw = familyWords(meta, reg);
  const ready = pe.state === "done" && fa.state === "done" && pe.value && fa.value;
  const rates = (spread: (number[] | 0)[], i: number, words: number[]) => words.map((w, k) => (spread[i] ? ((spread[i] as number[])[k] * 10000) / w : 0));
  const pr = ready ? pair.map((i) => rates(pe.value!, i, pw)) : null;
  const fr = ready ? pair.map((i) => rates(fa.value!, i, fw)) : null;
  const meaning = (i: number) => (gl.state === "done" ? gl.value?.[i] : undefined);
  const [hover, setHover] = useState<number | null>(null);

  const max = pr ? Math.max(0.01, ...pr.flat()) : 1;
  const X = (k: number) => 4 + (k * 92) / (reg.periods.length - 1), Y = (v: number) => 92 - (v / max) * 84;
  const fmax = fr ? Math.max(0.01, ...fr.flat()) : 1;
  const famOrder = fr ? reg.families.map((_, k) => k).filter((k) => fr[0][k] + fr[1][k] > 0).sort((a, b) => (fr[0][b] + fr[1][b]) - (fr[0][a] + fr[1][a])) : [];

  return (
    <section className={styles.duels} aria-labelledby="duel-h">
      <h2 id="duel-h">Word duels</h2>
      <p className={styles.blurb}>Two words, side by side through the ages and the kinds of writing. Uses per 10,000 words, so a small age counts as much as a large one.</p>
      <div className={styles.readyDuels} role="group" aria-label="Ready duels">
        {READY.map(([a, b, label]) => {
          const ia = idx.get(a), ib = idx.get(b);
          if (ia === undefined || ib === undefined) return null;
          return <button key={label} type="button" className="chip" aria-pressed={pair[0] === ia && pair[1] === ib} onClick={() => setPair([ia, ib])}>{label}</button>;
        })}
      </div>
      <div className={styles.duelers}>
        {pair.map((i, side) => (
          <Picker key={side} side={side} reg={reg} id={i} meaning={meaning(i)} meanings={gl.state === "done" ? gl.value : null}
            onPick={(j) => setPair(side === 0 ? [j, pair[1]] : [pair[0], j])} />
        ))}
      </div>
      {!pr || !fr ? <p className="muted"><span className={styles.spinner} aria-hidden="true" /> Counting…</p> : (
        <div className={styles.duelCharts}>
          <figure className={styles.duelTime}>
            <figcaption className="label">Through the ages</figcaption>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" onMouseLeave={() => setHover(null)}>
              {[0.25, 0.5, 0.75].map((f) => <line key={f} className={styles.grid} x1="0" x2="100" y1={92 - f * 84} y2={92 - f * 84} />)}
              {pr.map((line, s) => <polyline key={s} className={s ? styles.duelB : styles.duelA} points={line.map((v, k) => `${X(k)},${Y(v)}`).join(" ")} />)}
              {reg.periods.map((_, k) => <rect key={k} x={X(k) - 9} y="0" width="18" height="100" fill="transparent" onMouseEnter={() => setHover(k)} />)}
              {hover !== null && <line className={styles.cursor} x1={X(hover)} x2={X(hover)} y1="4" y2="92" />}
            </svg>
            <div className={styles.duelAges} aria-hidden="true">{reg.periods.map((p, k) => <span key={p} style={{ left: `${X(k)}%` }} data-on={hover === k ? "" : undefined}>{p.split(" · ")[0]}</span>)}</div>
            <table className={styles.duelTable}>
              <thead><tr><th scope="col">Age</th><th scope="col" lang="grc">{reg.w[pair[0]]}</th><th scope="col" lang="grc">{reg.w[pair[1]]}</th></tr></thead>
              <tbody>{reg.periods.map((p, k) => (
                <tr key={p} tabIndex={0} data-on={hover === k ? "" : undefined} onMouseEnter={() => setHover(k)} onFocus={() => setHover(k)} onBlur={() => setHover(null)} onMouseLeave={() => setHover(null)}>
                  <th scope="row">{p.split(" · ")[0]}</th><td>{fmtRate(pr[0][k])}</td><td>{fmtRate(pr[1][k])}</td>
                </tr>
              ))}</tbody>
            </table>
          </figure>
          <figure className={styles.duelKinds}>
            <figcaption className="label">In each kind of writing</figcaption>
            <ol>
              {famOrder.map((k) => (
                <li key={k}>
                  <span className={styles.dkLabel}>{reg.families[k]}</span>
                  <span className={styles.dkBars} aria-hidden="true">
                    <i className={styles.duelBarA} style={{ "--w": `${(fr[0][k] / fmax) * 100}%` } as React.CSSProperties} title={`${reg.w[pair[0]]}: ${fmtRate(fr[0][k])} per 10,000 words`} />
                    <i className={styles.duelBarB} style={{ "--w": `${(fr[1][k] / fmax) * 100}%` } as React.CSSProperties} title={`${reg.w[pair[1]]}: ${fmtRate(fr[1][k])} per 10,000 words`} />
                  </span>
                  <span className={styles.dkN}>{fmtRate(fr[0][k])} · {fmtRate(fr[1][k])}</span>
                </li>
              ))}
            </ol>
          </figure>
        </div>
      )}
      <p className={styles.fine}>{fmt(reg.n[pair[0]])} uses of {reg.w[pair[0]]} and {fmt(reg.n[pair[1]])} of {reg.w[pair[1]]} in the whole library. An age or a kind of writing reflects the works the library has from it.</p>
    </section>
  );
}

function Picker({ side, reg, id, meaning, meanings, onPick }: {
  side: number; reg: Register; id: number; meaning?: string; meanings: Record<string, string> | null; onPick: (i: number) => void;
}) {
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const m = matcher(q);
    if (!m) return [];
    const out: number[] = [];
    for (let i = 0; i < reg.w.length && out.length < 6; i++) if (m(reg.w[i], meanings?.[i])) out.push(i);
    return out;
  }, [q, reg, meanings]);
  return (
    <div className={`${styles.dueler} ${side ? styles.duelerB : styles.duelerA}`}>
      <p className={styles.duelWord}><b lang="grc">{reg.w[id]}</b> <i>{transliterate(reg.w[id])}</i>{meaning && <small>{meaning}</small>}</p>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Change the ${side ? "second" : "first"} word`}
        placeholder="Change: type a word or a meaning" autoComplete="off" spellCheck={false} />
      {hits.length > 0 && (
        <ul className={styles.duelHits}>
          {hits.map((i) => <li key={i}><button type="button" onClick={() => { onPick(i); setQ(""); }}><b lang="grc">{reg.w[i]}</b> <small>{meanings?.[i] ?? transliterate(reg.w[i])} · {fmt(reg.n[i])}</small></button></li>)}
        </ul>
      )}
    </div>
  );
}

"use client";
/**
 * Every difference between the two editions being compared, listed the way a critical apparatus lists
 * readings: the passage, the first edition's words, a bracket, the second's (— where one prints nothing).
 * A click goes to the passage; the list can be downloaded as a spreadsheet.
 */
import { useMemo, useState } from "react";
import { lemmaOf, type RowDiff } from "@/lib/tei/compare";
import { toCsv } from "@/lib/search/kwic";
import styles from "./Reader.module.css";
import fs from "./Find.module.css";

const SHOW = 300;
const num = (n: number) => n.toLocaleString("en-GB");
/** a long stretch (a whole added introduction, say) is shortened in the list, never in the spreadsheet */
const short = (s: string, n = 9) => { const w = s.split(" "); return w.length > n ? `${w.slice(0, n).join(" ")} … (${num(w.length)} words)` : s; };

export default function ComparePanel({ diffs, a, b, title, onJump, onClose }: {
  diffs: RowDiff[]; a: string; b: string; title: string; onJump: (d: RowDiff) => void; onClose: () => void;
}) {
  const entries = useMemo(() => diffs.flatMap((d) => d.hunks.map((h, j) => ({ d, j, ...lemmaOf(d, h) }))), [diffs]);
  const [shown, setShown] = useState(SHOW);
  const download = () => {
    const rows = [["Passage", a, b], ...entries.map((e) => [e.d.key, e.a, e.b])];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
    link.download = `differences-${title.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  return (
    <aside className={`${styles.panel} ${fs.panel}`} aria-label="Differences between the editions" tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}>
      <div className={styles.panelHead}>
        <h2 className={fs.title}>Differences</h2>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close the differences">×</button>
      </div>
      <p className={styles.fine}>
        Each line gives the passage, then the words of <b>{a}</b>, a bracket ], and the words of <b>{b}</b>. A dash means one edition has no word there.
      </p>
      <p className={fs.status}>{num(entries.length)} {entries.length === 1 ? "difference" : "differences"} in {num(diffs.length)} {diffs.length === 1 ? "passage" : "passages"}</p>
      {entries.length > 0 && <button type="button" className="btn small ghost" onClick={download}>Download the list (spreadsheet)</button>}
      <ol className={fs.list}>
        {entries.slice(0, shown).map((e) => (
          <li key={`${e.d.key}-${e.j}`}>
            <button type="button" onClick={() => onJump(e.d)}>
              <span className={fs.ref}>{e.d.key}</span>
              <span className={fs.snip} lang="grc">{short(e.a)} ] {short(e.b)}</span>
            </button>
          </li>
        ))}
      </ol>
      {entries.length > shown && <button type="button" className="chip" onClick={() => setShown((n) => n + SHOW)}>Show {num(Math.min(SHOW, entries.length - shown))} more</button>}
    </aside>
  );
}

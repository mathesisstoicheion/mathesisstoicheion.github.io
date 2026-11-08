"use client";
/**
 * A tune on the board, drawn as it was played: the lyre's strings as fine lines, one for each note the tune uses, low at
 * the foot and high at the top, and each pluck a dot on its string, along the time it was played, larger the harder it
 * was struck (lib/lyre/tune-link.ts). Read from the tune's own link, so nothing but the link is stored.
 */
import { useEffect, useState } from "react";
import { decodeTune, type Tune } from "@/lib/lyre/tune-link";
import styles from "./Board.module.css";

const W = 320, H = 150, PAD = 14;

export function tuneLength(t: Tune): string {
  const s = Math.max(1, Math.round((t.plucks.at(-1)?.t ?? 0) / 1000));
  return `${t.plucks.length} ${t.plucks.length === 1 ? "note" : "notes"}, ${s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${s % 60} s`}`;
}

export function useTune(link: string | null): Tune | null | undefined {
  const code = link?.split("#tune=")[1] ?? null;
  const [read, setRead] = useState<{ code: string; tune: Tune | null } | null>(null);
  useEffect(() => {
    if (!code) return;
    let live = true;
    void decodeTune(code).then((tune) => { if (live) setRead({ code, tune }); });
    return () => { live = false; };
  }, [code]);
  if (!code) return null;
  return read?.code === code ? read.tune : undefined;
}

export default function TuneRoll({ tune, label }: { tune: Tune | null | undefined; label: string }) {
  if (tune === undefined) return <div className={styles.roll} aria-hidden="true" />;
  if (!tune || !tune.plucks.length) return <div className={styles.roll}><p className="faint">This tune could not be read.</p></div>;
  const notes = [...new Set(tune.plucks.map((p) => p.m))].sort((a, b) => a - b);
  const end = Math.max(1, tune.plucks.at(-1)!.t);
  const y = (m: number) => notes.length === 1 ? H / 2 : H - PAD - (notes.indexOf(m) / (notes.length - 1)) * (H - 2 * PAD);
  const x = (t: number) => PAD + (t / end) * (W - 2 * PAD);
  return (
    <div className={styles.roll}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}: ${tuneLength(tune)}`}>
        <g className={styles.rollStrings}>{notes.map((m) => <line key={m} x1={PAD / 2} x2={W - PAD / 2} y1={y(m)} y2={y(m)} />)}</g>
        <g className={styles.rollNotes}>
          {tune.plucks.map((p, i) => <circle key={i} cx={x(p.t)} cy={y(p.m)} r={1.6 + 2.6 * p.s} />)}
        </g>
      </svg>
    </div>
  );
}

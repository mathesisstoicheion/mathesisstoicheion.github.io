"use client";
/**
 * The nine Muses, as Hesiod names them (Theogony 76–79), each in a niche cut into the wall (lib/art/niche.ts). Pass a
 * torch over a niche (on a phone, scroll her to the middle of the screen) and her name catches the light for a moment.
 * Each niche holds her emblem, cut into its back wall (the owner, 2026-10-18: the empty niches "make no sense"): the
 * attributes later Roman art gave them, small drawings in the page, so they cost nothing to draw.
 */
import { useEffect, useRef } from "react";
import { Niche } from "@/lib/art/niche";
import { useTorchlit } from "@/lib/art/part";
import { onFrame, torchStill } from "@/lib/torch";
import styles from "@/app/home.module.css";

/** Hesiod's order. Which art belongs to which Muse was settled later, and ancient writers do not always agree. */
const MUSES: [greek: string, name: string, art: string][] = [
  ["Κλειώ", "Clio", "history"], ["Εὐτέρπη", "Euterpe", "music of the pipes"], ["Θάλεια", "Thalia", "comedy"],
  ["Μελπομένη", "Melpomene", "tragedy"], ["Τερψιχόρη", "Terpsichore", "dance"], ["Ἐρατώ", "Erato", "love poetry"],
  ["Πολύμνια", "Polyhymnia", "sacred song"], ["Οὐρανίη", "Urania", "the stars"], ["Καλλιόπη", "Calliope", "epic poetry"],
];

/** Each Muse's emblem, in a 48 by 48 box: Clio's scroll, Euterpe's double pipes, Thalia's comic mask, Melpomene's tragic
 *  mask, Terpsichore's lyre, Erato's kithara, Polyhymnia's veil, Urania's globe, Calliope's writing tablet and stylus. */
const EMBLEMS: Record<string, string> = {
  Clio: "M14 11v26M34 11v26M14 14h20M14 34h20M18 20h12M18 24h12M18 28h8",
  Euterpe: "M21 9h6M22 10l-8 29M26 10l8 29M19 24l1 0.3M17.4 30l1 0.3M28 24l-1 0.3M29.6 30l-1 0.3",
  Thalia: "M13 13q11-6 22 0q2 15-11 24q-13-9-11-24zM17 21q2.5-3 5 0M26 21q2.5-3 5 0M17 27q7 8 14 0",
  Melpomene: "M13 13q11-6 22 0q2 15-11 24q-13-9-11-24zM17 19q2.5 3 5 1M26 20q2.5 2 5-1M18 33q6-7 12 0",
  Terpsichore: "M15 31q9 11 18 0zM17 32q-5-11-2-21M31 32q5-11 2-21M14 13h20M21 13v20M24 13v21M27 13v20",
  Erato: "M13 31h22v7H13zM14 31l-2-20h7l2 20M34 31l2-20h-7l-2 20M11 11h26M22 12v19M24 12v19M26 12v19",
  Polyhymnia: "M24 9q-10 0-11 14q-1 10-4 16h30q-3-6-4-16q-1-14-11-14zM19 21q5 5 10 0M18 29l-3 10M24 29v10M30 29l3 10",
  Urania: "M24 10a11 11 0 1 0 0.01 0zM13 21h22M24 10q-6 11 0 22M24 10q6 11 0 22M24 32v5M18 38h12",
  Calliope: "M11 15h19v22H11zM15 20h11M15 25h11M15 30h7M32 12l4 4-9 14-4 1 1-4z",
};

function MuseNiche({ g, e, art, i }: { g: string; e: string; art: string; i: number }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const li = useRef<HTMLLIElement>(null);
  useTorchlit(cv, (c) => new Niche(c));
  useEffect(() => {
    const c = cv.current, el = li.current;
    if (!c || !el) return;
    let until = -1, lit = false;
    return onFrame((now, _dt, ls) => {
      if (torchStill()) return;
      const r = c.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50 || !r.width) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2, reach = Math.max(95, r.width * 1.3);
      if (ls.some((l) => l.I >= 0.25 && Math.hypot(l.x - cx, l.y - cy) < reach)) until = now + 2.4;
      const on = now < until;
      if (on !== lit) { lit = on; return () => el.classList.toggle(styles.lit, on); }
    });
  }, []);
  return (
    <li ref={li} className={`${styles.niche} rv`} style={{ animationDelay: `${i * 0.07}s` }}>
      <div className={styles.nicheBox}>
        <canvas ref={cv} aria-hidden="true" />
        {/* cut into the stone: a dark groove with its lit edge just above it */}
        <svg className={styles.emblem} viewBox="0 0 48 48" aria-hidden="true">
          <path className={styles.cut} d={EMBLEMS[e]} transform="translate(0.7 0.8)" />
          <path className={styles.edge} d={EMBLEMS[e]} />
        </svg>
      </div>
      <span className={styles.mg} lang="grc">{g}</span>
      <span className={styles.me}>{e}</span>
      <span className={`${styles.ma} label`}>{art}</span>
    </li>
  );
}

export default function Muses() {
  return (
    <ol className={styles.niches} aria-label="The nine Muses, as Hesiod names them">
      {MUSES.map(([g, e, art], i) => <MuseNiche key={e} g={g} e={e} art={art} i={i} />)}
    </ol>
  );
}

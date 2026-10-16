"use client";
/**
 * The nine Muses, as Hesiod names them (Theogony 76–79), each in a niche cut into the wall (lib/art/niche.ts). Pass a
 * torch, or a finger, over a niche and her name catches the light for a moment.
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
      if (on !== lit) { lit = on; el.classList.toggle(styles.lit, on); }
    });
  }, []);
  return (
    <li ref={li} className={`${styles.niche} rv`} style={{ animationDelay: `${i * 0.07}s` }}>
      <canvas ref={cv} aria-hidden="true" />
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

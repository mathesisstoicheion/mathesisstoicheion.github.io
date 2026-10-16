"use client";
/**
 * The library's wall of stelai (design B, Stone and torch; DESIGN.md, Screens: Library): a few famous books, each
 * standing as a carved gravestone (a stele) with a pediment, its picture set in a round medallion re-lit by the torch
 * (pipeline/relit_images.py; the credits are those of data/images.json). As the torch passes over a stele (on a phone, as it scrolls through the middle of the screen)
 * its title catches the light for a moment. Each stele opens its book in the reader. On a phone each group is one row
 * to swipe through sideways, so the wall costs a screen or two of scrolling, not six.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import ReliefWindow from "@/components/art/ReliefWindow";
import Settle from "@/components/art/Settle";
import { onFrame, torchRadius, torchStill } from "@/lib/torch";
import styles from "./Stelai.module.css";

export interface Stele {
  id: string; author: string; title: string; greek: string;
  /** the medallion's picture (web/public/images/relit/) and what it shows */
  pic: string; alt: string;
  /** why this picture, and its credit */
  why: string;
  english: boolean;
}

/** The pediment and mouldings at the top of a stele. */
const PED = (
  <svg className={styles.ped} viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
    <path className={styles.face} d="M150 4q-9 0-10 13l-1 4L14 48V36q-4-6-10-4v38h292V32q-6-2-10 4v12L161 21l-1-4q-1-13-10-13z" />
    <path className={styles.ln1} d="M26 47.5 150 22.5 274 47.5z" /><path className={styles.ln2} d="M27 48.5h246" />
    <path className={styles.ln1} d="M0 56.5h300" /><path className={styles.ln2} d="M0 57.5h300" /><path className={styles.ln1} d="M0 69.5h300" />
  </svg>
);

function StoneOf({ b, i }: { b: Stele; i: number }) {
  const el = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const a = el.current;
    if (!a) return;
    let until = -1, lit = false;
    return onFrame((now, _dt, ls) => {
      if (torchStill()) return;
      const r = a.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50 || !r.width) return;
      const reach = torchRadius() * 0.35;
      if (ls.some((l) => l.I >= 0.25 && Math.hypot(Math.max(r.left - l.x, 0, l.x - r.right), Math.max(r.top + 60 - l.y, 0, l.y - r.bottom + 80)) < reach)) until = now + 1.6;
      const on = now < until;
      if (on !== lit) { lit = on; return () => a.classList.toggle(styles.lit, on); }
    });
  }, []);
  return (
    <Link ref={el} href={`/read?w=${b.id}`} transitionTypes={["page-turn"]} className={`${styles.stele} rv`} style={{ animationDelay: `${i * 0.1}s` }}>
      {PED}
      <div className={styles.slab}>
        <ReliefWindow pic={b.pic} kind="medallion" alt={b.alt} frameClassName={styles.medal} delay={0.2 + i * 0.1} />
        <span className={`${styles.who} label`}>{b.author}</span>
        <Settle as="h3" className={styles.tt} text={b.title} />
        {b.greek && <span className={styles.gt} lang="grc">{b.greek}</span>}
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.why}>{b.why}</p>
        <span className={`${styles.tag} label`}>{b.english ? "Greek + English · open in the reader →" : "Greek · open in the reader →"}</span>
      </div>
      <span className={styles.foot} aria-hidden="true" />
    </Link>
  );
}

export default function Stelai({ groups }: { groups: { name: string; books: Stele[] }[] }) {
  return (
    <div className={styles.wall}>
      {groups.map((g) => (
        <section key={g.name} className={styles.grp} aria-label={g.name}>
          <div className={styles.grpH}><Settle className="label" text={g.name} /><span className="label faint">{g.books.length} books</span></div>
          <div className={`${styles.stelai} snap-row`}>{g.books.map((b, i) => <StoneOf key={b.id} b={b} i={i} />)}</div>
        </section>
      ))}
    </div>
  );
}

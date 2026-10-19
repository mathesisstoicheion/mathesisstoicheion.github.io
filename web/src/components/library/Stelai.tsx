"use client";
/**
 * The library's famous books to begin with, each standing as a stele (a Greek gravestone) drawn in gold lines (Gold and
 * lamplight; the plan's "gold-line versions of the stelai"): a pediment and mouldings in gold hairlines, and the book's
 * picture engraved in gold on Pompeian red in a round medallion (pipeline/engrave_medallions.py; the credits are those of
 * data/images.json). Each stele opens its book in the reader. They stand in one row (the owner, 2026-10-17: "less clutter
 * ... more concise"), to swipe through sideways on a phone; why each picture was chosen, and its credit, wait under the
 * row until asked for.
 */
import Link from "next/link";
import styles from "./Stelai.module.css";

export interface Stele {
  id: string; author: string; title: string; greek: string;
  /** the medallion's picture (web/public/images/medallions/engraved/) and what it shows */
  pic: string; alt: string;
  /** why this picture, and its credit */
  why: string;
  english: boolean;
}

/** The pediment and mouldings at the top of a stele, in gold lines. */
const PED = (
  <svg className={styles.ped} viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
    <path className={styles.ln1} d="M150 4q-9 0-10 13l-1 4L14 48V36q-4-6-10-4v38h292V32q-6-2-10 4v12L161 21l-1-4q-1-13-10-13z" />
    <path className={styles.ln2} d="M26 47.5 150 22.5 274 47.5z" />
    <path className={styles.ln2} d="M0 57.5h300" />
  </svg>
);

function StoneOf({ b, i }: { b: Stele; i: number }) {
  const src = `url(/images/medallions/engraved/${b.pic}.webp)`;
  return (
    <Link href={`/read?w=${b.id}`} transitionTypes={["page-turn"]} className={`${styles.stele} rv`} style={{ animationDelay: `${i * 0.1}s` }}>
      {PED}
      <div className={styles.slab}>
        <span className={styles.medal} role="img" aria-label={b.alt}><span className={styles.lines} style={{ maskImage: src, WebkitMaskImage: src }} /></span>
        <span className={`${styles.who} label`}>{b.author}</span>
        <h3 className={styles.tt}>{b.title}</h3>
        {b.greek && <span className={styles.gt} lang="grc">{b.greek}</span>}
        <span className={styles.rule} aria-hidden="true" />
        <span className={`${styles.tag} label`}>{b.english ? "Greek + English →" : "Greek →"}</span>
      </div>
      <span className={styles.foot} aria-hidden="true" />
    </Link>
  );
}

export default function Stelai({ groups }: { groups: { name: string; books: Stele[] }[] }) {
  const books = groups.flatMap((g) => g.books);
  return (
    <section className={styles.wall} aria-labelledby="stelai-h">
      <div className={styles.grpH}><h2 id="stelai-h" className="label">Famous books to begin with</h2></div>
      <div className={styles.stelai}>{books.map((b, i) => <StoneOf key={b.id} b={b} i={i} />)}</div>
      <details className={styles.whys}>
        <summary>About the pictures</summary>
        <ul>{books.map((b) => <li key={b.id}><b>{b.title}.</b> {b.why}</li>)}</ul>
      </details>
    </section>
  );
}

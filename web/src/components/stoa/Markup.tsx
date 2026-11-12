/**
 * Draws the Painted Stoa's markup (src/wiki/markup.ts) as React elements. Greek words in running
 * English are set in the Greek typeface; citations open the passage in the reader.
 */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Blk, Inl } from "@/wiki/markup";
import { CERTAINTY, type Certainty, type Entry } from "@/wiki/types";
import Plate from "@/components/plate/Plate";
import { photo } from "@/lib/photos";
// only the kickers, for the links' tooltips: importing the entries themselves would put every entry's whole text
// into each page that shows an author article
import HINTS from "@/wiki/entry-hints.json";
import { SectionNote } from "./EntryNotes";
import CertCard from "./CertCard";
import { tapWords } from "@/components/lookup/tapWords";
import styles from "./Stoa.module.css";

const GREEK_RUN = /((?:[Ͱ-Ͽἀ-῿][̀-ͯͰ-Ͽἀ-῿’ʼ]*[\s,·;.]*)+)/u;

/** Set runs of Greek in the Greek face (and mark them lang="grc" for screen readers and hyphenation). */
export function greekAware(s: string, key: string | number, tap = false): ReactNode {
  const parts = s.split(GREEK_RUN);
  if (parts.length === 1) return s;
  // tap: running prose, where each Greek word can be touched for the look-up (never inside a link or a heading)
  return <Fragment key={key}>{parts.map((p, i) => (i % 2 ? <span key={i} lang="grc" className={styles.inGr}>{tap ? tapWords(p) : p}</span> : p))}</Fragment>;
}

/** A short text that may hold *italics* (a link's words, a heading), with Greek marked as Greek. */
export function emphAware(s: string, key: string | number): ReactNode {
  const parts = s.split(/\*([^*]+)\*/);
  if (parts.length === 1) return greekAware(s, key);
  return <Fragment key={key}>{parts.map((p, i) => (i % 2 ? <i key={i}>{greekAware(p, i)}</i> : greekAware(p, i)))}</Fragment>;
}

export const readHref = (c: { work: string; ref: string }) => `/read?w=${c.work}&at=${encodeURIComponent(c.ref)}`;

/** A certainty label. With `card` (inside an entry) it is a button that opens the label's meaning under it (CertCard.tsx). */
export function CertTag({ c, card = false }: { c: Certainty; card?: boolean }) {
  if (card) return <CertCard c={c} />;
  return <span className={`tag ${CERTAINTY[c].cls}`} title={CERTAINTY[c].about}>{CERTAINTY[c].label}</span>;
}

/** A superscript pointer to the numbered source list under an author's article. */
export function SourceMark({ n }: { n: number[] }) {
  return (
    <sup className={styles.srcMark}>
      {[...n].sort((a, b) => a - b).map((k, j) => <Fragment key={k}>{j ? <span className={styles.srcSep}>,</span> : null}<a href={`#src-${k}`} aria-label={`Source ${k}`}>{k}</a></Fragment>)}
    </sup>
  );
}

export function Inline({ xs, card = false }: { xs: Inl[]; card?: boolean }) {
  return (
    <>
      {xs.map((x, i) => {
        if (typeof x === "string") return greekAware(x, i, true);
        if ("b" in x) return <b key={i}><Inline xs={x.b} card={card} /></b>;
        if ("i" in x) return <i key={i}><Inline xs={x.i} card={card} /></i>;
        if ("cert" in x) return <CertTag key={i} c={x.cert} card={card} />;
        if ("src" in x) return <SourceMark key={i} n={x.src} />;
        if ("cite" in x) return <Link key={i} className={styles.cite} href={readHref(x.cite)} transitionTypes={["page-turn"]} title="Read this passage in the reader">{emphAware(x.text, "t")}</Link>;
        if ("wiki" in x) {
          return <Link key={i} className={styles.wikiLink} href={`/stoa/${x.wiki}`} transitionTypes={["page-turn"]} title={(HINTS as Record<string, string>)[x.wiki]}>{emphAware(x.text, "t")}</Link>;
        }
        return <a key={i} href={x.ext} target="_blank" rel="noopener noreferrer">{emphAware(x.text, "t")}</a>;
      })}
    </>
  );
}

export function Quote({ q }: { q: NonNullable<Entry["quotes"]>[string] }) {
  return (
    <figure className={`${styles.quote} rv`}>
      <blockquote lang="grc" className={styles.quoteGr}>{tapWords(q.grc)}</blockquote>
      <p className={styles.quoteTr}>“{q.tr}”</p>
      <figcaption>
        <Link href={readHref(q)} transitionTypes={["page-turn"]}>{q.label}</Link>
        <span> · translated by {q.trBy}</span>
      </figcaption>
    </figure>
  );
}

/** A photograph in an entry's text: set as a plate, with its credit printed beneath it (components/plate/Plate.tsx). */
export function Figure({ id }: { id: string }) {
  return photo(id) ? <Plate id={id} className={`${styles.figure} rv`} sizes="(max-width: 980px) 92vw, 736px" /> : null;
}

/** The entry's dates, under a heading of their own ("Dates", with an anchor the contents link to), placed after Share. */
export function Timeline({ items }: { items: NonNullable<Entry["timeline"]> }) {
  return (
    <section className={`${styles.dates} rv`} aria-labelledby="dates">
      <h2 id="dates" className={styles.h2}>Dates</h2>
      <ol className={styles.timeline}>
        {items.map((t, i) => (
          <li key={i}>
            <span className={styles.when}>{t.when}</span>
            <span className={styles.what}>{greekAware(t.what, i, true)} {t.certainty && t.certainty !== "well" && <CertTag c={t.certainty} card />}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Blocks({ bs, entry }: { bs: Blk[]; entry: Entry }) {
  return (
    <>
      {bs.map((b, i) => {
        if ("h2" in b) return (
          // the note button stands at the right end of the heading's own line; a written note opens beneath it
          <div key={i} className={styles.sectionHead}>
            <h2 id={b.id} data-key={b.id} className={`${styles.h2} rv`}>{emphAware(b.h2, "h")}</h2>
            <SectionNote slug={entry.slug} section={b.id} title={b.h2} />
          </div>
        );
        if ("h3" in b) return <h3 key={i} className={styles.h3}>{emphAware(b.h3, "h")}</h3>;
        if ("quote" in b) return <Quote key={i} q={entry.quotes![b.quote]} />;
        if ("figure" in b) return <Figure key={i} id={b.figure} />;
        if ("timeline" in b) return null;   // the dates stand after Share (EntryView)
        if ("dyk" in b) return (
          <aside key={i} className={`${styles.dyk} rv`}>
            <span className="label">Did you know?</span>
            {b.dyk.map((p, j) => <p key={j}><Inline xs={p} card /></p>)}
          </aside>
        );
        if ("list" in b) return <ul key={i} className={styles.list}>{b.list.map((it, j) => <li key={j}><Inline xs={it} card /></li>)}</ul>;
        return (
          <p key={i} className={b.cert ? styles.claim : undefined} data-cert={b.cert}>
            {b.cert && <CertTag c={b.cert} card />} <Inline xs={b.p} card />
          </p>
        );
      })}
    </>
  );
}

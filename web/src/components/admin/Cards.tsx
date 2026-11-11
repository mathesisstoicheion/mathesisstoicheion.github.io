"use client";
/**
 * What the two private pages share (Private translations, /treasury/translations; Private collection, /library/private):
 * the head (path, title, the lock seal), the line that holds the shelf's place while the account is read, and the shelf
 * itself, a row of cards in the Painted Stoa's card style. A card is one link, so the whole of it opens the reader; the
 * buttons for a translation (Remove and the rest) stand at its foot.
 */
import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import PageHead from "@/components/PageHead";
import type { Step } from "@/config/areas";
import type { StoredSummary } from "@/lib/private-translations-db";
import { Seal, StatusTag, savedDate } from "./parts";
import Rich from "./Rich";
import styles from "./Cards.module.css";

/** The page's head: drawn at once, before the account is known, so nothing moves when the shelf arrives. */
export function PrivateHead({ path, title, purpose, sealed = true }: { path: Step[]; title: string; purpose: ReactNode; sealed?: boolean }) {
  return (
    <PageHead bare path={path} title={title} purpose={purpose}>
      {/* signed out, the seal's room is kept (unseen), so the head is the same height before and after the account is known */}
      <div className={`${styles.kicker}${sealed ? "" : ` ${styles.unseen}`}`} aria-hidden={sealed ? undefined : true}><Seal /></div>
    </PageHead>
  );
}

/** Holds the shelf's place while the account is read; after a while, a word on why it may be taking long. */
export function ShelfWait({ children }: { children?: ReactNode }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSlow(true), 8000); return () => clearTimeout(t); }, []);
  return (
    <section className={styles.shelfSec} aria-busy="true">
      {children}
      <p className={styles.wait}><span className={styles.spinner} aria-hidden="true" /> One moment…</p>
      {slow && <p className={styles.small}>Still waiting for the site&apos;s database. Check the connection light at the top of the page.</p>}
    </section>
  );
}

/** The shelf: three cards across on a wide screen, two on a computer, one on a phone. */
export function BookCards({ rows, href, foot }: { rows: StoredSummary[]; href: (id: string) => string; foot?: (r: StoredSummary) => ReactNode }) {
  return (
    <ul className={styles.shelf}>
      {rows.map((r, i) => (
        <li key={r.id} className={styles.card} style={{ "--i": i } as CSSProperties}>
          <Link className={styles.cardLink} href={href(r.id)} title="Open it in the reader, with all the reading aids">
            {r.greekTitle && <span className={styles.gr} lang="grc"><Rich text={r.greekTitle} inline /></span>}
            <b className={styles.name}><Rich text={r.title ?? r.id} inline /></b>
            <span className={styles.by}>{r.author ? <Rich text={r.author} inline /> : "No author given"}</span>
            <span className={styles.meta}>
              <StatusTag status={r.status} />
              <span aria-hidden="true">·</span>
              <span>Saved <time dateTime={r.updated_at}>{savedDate(r.updated_at)}</time></span>
            </span>
          </Link>
          {foot && <div className={styles.foot}>{foot(r)}</div>}
        </li>
      ))}
    </ul>
  );
}

"use client";
/**
 * The pieces of the board (/stoa/board): one item as a card on the wall, who put it up and when, the moderator's
 * Approve and Decline, and the plate at the top of a card (a pot's picture, a tune's roll).
 */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import Icon from "@/components/Icon";
import { ago } from "@/lib/community/ago";
import { problem } from "@/lib/community/account";
import type { BoardItem } from "@/lib/community/board-data";
import { itemHref, KINDS, safePicture } from "@/lib/board";
import TuneRoll, { useTune } from "./TuneRoll";
import styles from "./Board.module.css";

/** Who put it up, and when; the moderator's own items say so. */
export function Byline({ item }: { item: BoardItem }) {
  return (
    <p className={styles.byline}>
      <span className={styles.who}>{item.author?.display_name ?? "a former member"}</span>
      {item.author?.role === "moderator" && <span className={styles.keeper}>the site&apos;s keeper</span>}
      <time dateTime={item.created_at} title={new Date(item.created_at).toLocaleString("en-GB")}>{ago(item.created_at)}</time>
    </p>
  );
}

/** What kind of thing it is, as a small label with its sign. */
export function KindLabel({ item }: { item: Pick<BoardItem, "kind"> }) {
  const k = KINDS[item.kind];
  return <p className={`label ${styles.kind}`}><Icon name={k.icon} />{k.one}</p>;
}

/** Where an item stands, for its author and the moderator, before it is on the board. */
export function StatusLine({ item }: { item: BoardItem }) {
  if (item.status === "shown") return null;
  return item.status === "waiting"
    ? <p className={styles.waiting}><Icon name="history" />Waiting to be approved</p>
    : <p className={styles.declined}><Icon name="close" />Not approved</p>;
}

/** The plate at the top of a card or an item's page: a pot's picture, or a tune's roll. Thoughts have none. */
export function Plate({ item, large = false }: { item: BoardItem; large?: boolean }) {
  const tune = useTune(item.kind === "tune" ? item.link : null);
  if (item.kind === "pot") {
    const src = safePicture(item.picture);
    return (
      <div className={`${styles.potPlate}${large ? ` ${styles.large}` : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a picture held in the item itself (a data address), not a file */}
        {src ? <img src={src} alt={`A painted pot: ${item.title}`} loading="lazy" decoding="async" /> : <p className="faint">No picture.</p>}
      </div>
    );
  }
  if (item.kind === "tune") return <TuneRoll tune={tune} label={`A tune: ${item.title}`} />;
  return null;
}

/** One item as a card on the board: its plate, its title (the way to its own page), its first words, who and when. */
export function Card({ item, children }: { item: BoardItem; children?: ReactNode }) {
  return (
    <article className={`${styles.card} ${styles[item.kind]}`} aria-labelledby={`item-${item.id}`}>
      <Plate item={item} />
      <div className={styles.cardText}>
        <KindLabel item={item} />
        <h3 id={`item-${item.id}`} className={styles.cardTitle}>
          <Link href={itemHref(item.id)} className={styles.stretch}>{item.title}</Link>
        </h3>
        {item.body && <p className={styles.excerpt}>{item.body.replace(/[*_]/g, "")}</p>}
        <Byline item={item} />
        <StatusLine item={item} />
      </div>
      {children && <div className={styles.cardTools}>{children}</div>}
    </article>
  );
}

/** The moderator's two buttons on an item that waits: put it on the board, or decline it. */
export function Decide({ onDecide, shown = false }: { onDecide: (show: boolean) => Promise<void>; shown?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (show: boolean) => {
    setBusy(true); setError(null);
    try { await onDecide(show); } catch (e) { setError(problem(e)); }
    setBusy(false);
  };
  return (
    <>
      <div className="btn-row">
        {!shown && <button type="button" className="btn small" disabled={busy} onClick={() => run(true)}><Icon name="check" />Approve</button>}
        <button type="button" className="btn small ghost" disabled={busy} onClick={() => run(false)}><Icon name="close" />{shown ? "Take it off the board" : "Decline"}</button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </>
  );
}

/** Take down one's own item (or, for the moderator, any), asked once inline. */
export function TakeDown({ onDelete, label = "Delete" }: { onDelete: () => Promise<void>; label?: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!open) return <button type="button" className="btn small quiet" onClick={() => setOpen(true)}><Icon name="delete" />{label}</button>;
  return (
    <div className={styles.ask} role="group" aria-label="Delete it?">
      <span>Delete it for good?</span>
      <button type="button" className="btn small" disabled={busy} autoFocus onClick={async () => {
        setBusy(true); setError(null);
        try { await onDelete(); } catch (e) { setError(problem(e)); setBusy(false); }
      }}><Icon name="delete" />Yes, delete it</button>
      <button type="button" className="btn small quiet" onClick={() => setOpen(false)}>Keep it</button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}

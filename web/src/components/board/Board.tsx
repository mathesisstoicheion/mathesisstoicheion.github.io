"use client";
/**
 * The board (/stoa/board): what readers have thought and made, put up for everyone once the site's keeper (the moderator)
 * has looked at it (the owner, 2026-10-30: "community driven, with every thought and creation: Shareable, including making
 * a pot"; each item approved first). Newest first, as cards on a wall, narrowed to thoughts, pots or tunes (?k=).
 * Above it, for the moderator, what waits for her; for a member, their own items not yet on the board.
 * Anyone may look; putting something up needs an account (components/board/NewItem.tsx).
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { AREAS } from "@/config/areas";
import { ACCOUNTS_ON } from "@/config/supabase";
import { isModerator, problem, useAccount } from "@/lib/community/account";
import { decide, notYetShown, shownItems, takeDown, type BoardItem } from "@/lib/community/board-data";
import { KINDS, NEW_ITEM, type BoardKind } from "@/lib/board";
import { Card, Decide, TakeDown } from "./parts";
import styles from "./Board.module.css";

const FILTERS: [BoardKind | null, string][] = [[null, "Everything"], ["thought", KINDS.thought.many], ["pot", KINDS.pot.many], ["tune", KINDS.tune.many]];
const asKind = (k: string | null): BoardKind | null => (k === "thought" || k === "pot" || k === "tune" ? k : null);

/** The board's body, under its head (app/stoa/board/page.tsx): what waits, then what is up. */
export default function Board() {
  return ACCOUNTS_ON ? <Wall /> : <p className={styles.note}>The board needs the site&apos;s accounts, which this copy of the site was built without.</p>;
}

function Wall() {
  const { start, ready, session, profile } = useAccount();
  useEffect(() => { start(); }, [start]);
  const params = useSearchParams();
  const router = useRouter();
  const kind = asKind(params.get("k"));

  // what is on the board, a page at a time
  const [items, setItems] = useState<BoardItem[] | null>(null);
  const [more, setMore] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async (k: BoardKind | null, p: number) => {
    setBusy(true); setError(null);
    try {
      const r = await shownItems({ kind: k, page: p });
      setItems((was) => (p === 0 ? r.rows : [...(was ?? []), ...r.rows]));
      setMore(r.more); setPage(p);
    } catch (e) { setError(problem(e)); }
    setBusy(false);
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the database is asked again when the filter changes
  useEffect(() => { setItems(null); void load(kind, 0); }, [kind, load]);

  // what is not on the board yet: everything waiting, for the moderator; one's own, for a member
  const mod = isModerator(profile);
  const uid = session?.user.id;
  const [pending, setPending] = useState<BoardItem[]>([]);
  const loadPending = useCallback(async () => {
    if (!uid || !profile) { setPending([]); return; }
    try { setPending(await notYetShown(mod ? {} : { mine: uid })); } catch { setPending([]); }
  }, [uid, profile, mod]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- asked once who is signed in is known
  useEffect(() => { void loadPending(); }, [loadPending]);

  const choose = (k: BoardKind | null) => router.replace(k ? `?k=${k}` : "?", { scroll: false });

  return (
    <>
      {ready && pending.length > 0 && (
        <section className={styles.pending} aria-labelledby="pending-h">
          <h2 id="pending-h" className={styles.sectionHead}>
            {mod ? <>Waiting for you <span className={styles.count}>{pending.length}</span></> : "Yours, not on the board yet"}
          </h2>
          {mod && <p className="muted">Nothing here is seen by anyone else until you approve it.</p>}
          <ul className={styles.grid}>
            {pending.map((it) => (
              <li key={it.id}>
                <Card item={it}>
                  {mod
                    ? <Decide onDecide={async (show) => { await decide(it.id, show); await loadPending(); if (show) void load(kind, 0); }} />
                    : <TakeDown onDelete={async () => { await takeDown(it.id); await loadPending(); }} />}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="wall-h" className={styles.wallSection}>
        <div className={styles.wallHead}>
          <h2 id="wall-h" className={styles.sectionHead}>On the board</h2>
          <div className={styles.filters} role="group" aria-label="Show">
            {FILTERS.map(([k, word]) => (
              <button key={word} type="button" className="chip" aria-pressed={kind === k} onClick={() => choose(k)}>
                {k && <Icon name={KINDS[k].icon} />}{word}
              </button>
            ))}
          </div>
        </div>
        {error && <p className={styles.note} role="alert">The board could not be reached: {error} <button type="button" className={styles.linkBtn} onClick={() => load(kind, page)}>Try again</button></p>}
        {items === null && !error && <p className={styles.status} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Opening the board…</p>}
        {items && items.length === 0 && <Empty kind={kind} />}
        {items && items.length > 0 && (
          <ul className={styles.grid}>
            {items.map((it) => (
              <li key={it.id}>
                <Card item={it}>
                  {mod && <Decide shown onDecide={async () => { await decide(it.id, false); await load(kind, 0); await loadPending(); }} />}
                </Card>
              </li>
            ))}
          </ul>
        )}
        {more && <p className={styles.moreRow}><button type="button" className="btn ghost" disabled={busy} onClick={() => load(kind, page + 1)}><Icon name="chevron-down" />Show more</button></p>}
      </section>
    </>
  );
}

/** Nothing up yet (or nothing of this kind): the three ways to make something to put up. */
function Empty({ kind }: { kind: BoardKind | null }) {
  return (
    <div className={styles.empty}>
      <p>{kind ? `No ${KINDS[kind].many.toLowerCase()} on the board yet.` : "Nothing is on the board yet."} Be the first:</p>
      <ul className={styles.makeList}>
        {(!kind || kind === "pot") && <li><Link className="btn ghost" href={AREAS.pot.href}><Icon name="pots" />Paint a pot</Link></li>}
        {(!kind || kind === "tune") && <li><Link className="btn ghost" href={AREAS.lyre.href}><Icon name="lyre" />Play the lyre</Link></li>}
        {(!kind || kind === "thought") && <li><Link className="btn ghost" href={`${NEW_ITEM}?k=thought`}><Icon name="note" />Write a thought</Link></li>}
      </ul>
    </div>
  );
}

/** The board's few rules, short, at its foot. */
export function HowItWorks() {
  return (
    <aside className={styles.how} aria-labelledby="how-h">
      <h2 id="how-h" className="label">How the board works</h2>
      <ul>
        <li>Paint a pot in the potter or record a tune on the lyre, then press <b>Put it on the board</b> under it. A thought can be written here, or from any entry of the Painted Stoa.</li>
        <li>The site&apos;s keeper looks at everything before it goes up, so it can take a little while to appear. Until then only you can see it.</li>
        <li>Put up your own work and your own words, and be kind. Your display name is shown beside what you put up; your email address never is.</li>
        <li>You can delete what you put up at any time.</li>
      </ul>
    </aside>
  );
}

"use client";
/**
 * One item of the board, on a page of its own (/stoa/board/item?id=…), to look at closely and to share: a pot's picture
 * large, with the way to turn it in 3D and paint one like it; a tune's roll, with the way to play it on the lyre; a thought
 * in full, with the entry or passage it is about. Its author may delete it; the moderator approves, declines or takes it down.
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/Icon";
import ShareButton from "@/components/ShareButton";
import { AREAS, trail } from "@/config/areas";
import { ACCOUNTS_ON } from "@/config/supabase";
import { isModerator, problem, useAccount } from "@/lib/community/account";
import { boardItem, decide, takeDown, type BoardItem } from "@/lib/community/board-data";
import { aboutWords, itemHref, safeLink } from "@/lib/board";
import { PostText } from "@/components/community/parts";
import PageHead from "@/components/PageHead";
import { Byline, Decide, KindLabel, Plate, StatusLine, TakeDown } from "./parts";
import { tuneLength, useTune } from "./TuneRoll";
import styles from "./Board.module.css";

export default function ItemView() {
  const { start, session, profile } = useAccount();
  useEffect(() => { start(); }, [start]);
  const id = Number(useSearchParams().get("id"));
  const router = useRouter();
  const [item, setItem] = useState<BoardItem | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!Number.isInteger(id) || id <= 0) { setItem(null); return; }
    try { setItem(await boardItem(id)); setError(null); } catch (e) { setError(problem(e)); }
  }, [id]);
  // asked again once the session is known, so an author or the moderator also finds what is not on the board yet
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the item is asked of the database once the page is open
  useEffect(() => { if (ACCOUNTS_ON) void load(); }, [load, session?.user.id]);

  const head = (title: string) => <PageHead path={trail("board", title)} title={title} piece={null} />;
  if (!ACCOUNTS_ON) return <>{head("Not here")}<div className="wrap"><p className={styles.note}>The board needs the site&apos;s accounts, which this copy of the site was built without.</p></div></>;
  if (error) return <>{head("The board")}<div className="wrap"><p className={styles.note} role="alert">The board could not be reached: {error}</p></div></>;
  if (item === undefined) return <div className="wrap"><p className={styles.status} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> Opening…</p></div>;
  if (item === null) return (
    <>
      {head("Not on the board")}
      <div className={`wrap ${styles.page}`}>
        <p>This is not on the board: it may have been taken down, or it is still waiting to be approved.</p>
        <p className="btn-row"><Link className="btn" href={AREAS.board.href}><Icon name="board" />The board</Link></p>
      </div>
    </>
  );

  const mine = session?.user.id === item.author_id;
  const mod = isModerator(profile);
  return (
    <>
      <PageHead path={trail("board", item.title)} title={item.title} piece={null}><KindLabel item={item} /><Byline item={item} /></PageHead>
      <div className={`wrap ${styles.page} ${styles.itemPage}`}>
        <StatusLine item={item} />
        <div className={styles.itemBody}>
          {item.kind !== "thought" && <Plate item={item} large />}
          <div className={styles.itemText}>
            {item.body && <PostText text={item.body} />}
            <Ways item={item} />
          </div>
        </div>
        <div className="btn-row">
          {item.status === "shown" && <ShareButton what={() => ({ title: item.title, url: `${location.origin}${itemHref(item.id)}` })} />}
          <Link className="btn ghost small" href={AREAS.board.href}><Icon name="back" />Back to the board</Link>
          {mine && <TakeDown onDelete={async () => { await takeDown(item.id); router.push(AREAS.board.href); }} />}
        </div>
        {mod && (
          <div className={styles.modBox}>
            <p className="label">For the site&apos;s keeper</p>
            <Decide shown={item.status === "shown"} onDecide={async (show) => { await decide(item.id, show); await load(); }} />
            {!mine && <TakeDown label="Delete it" onDelete={async () => { await takeDown(item.id); router.push(AREAS.board.href); }} />}
          </div>
        )}
      </div>
    </>
  );
}

/** Where the item opens on the site: the pot in 3D, the tune on the lyre, the entry or passage a thought is about. */
function Ways({ item }: { item: BoardItem }) {
  const link = safeLink(item.link);
  const tune = useTune(item.kind === "tune" ? item.link : null);
  if (item.kind === "pot") return link
    ? <p className="btn-row"><Link className="btn" href={link}><Icon name="turn" />Turn it in 3D, or paint one like it</Link></p>
    : <p className="faint">This pot had too much brushwork to fit in a link, so only its picture was put up.</p>;
  if (item.kind === "tune") return (
    <>
      {tune && <p className="muted">{tuneLength(tune)}.</p>}
      {link && <p className="btn-row"><Link className="btn" href={link}><Icon name="play" />Play it on the lyre</Link></p>}
    </>
  );
  return link ? <p className="btn-row"><Link className="btn ghost" href={link}><Icon name="read" />{aboutWords(link)}</Link></p> : null;
}

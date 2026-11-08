"use client";
/**
 * Putting something on the board (/stoa/board/new): a thought written here, or a pot or a tune handed over from where it was
 * made (the potter's and the lyre's "Put it on the board", lib/board.ts), with a title and a few words. It waits for the
 * site's keeper (the moderator) before anyone else sees it; hers go up at once. A visitor who is not signed in is asked to
 * sign in first, and what was handed over waits in this tab meanwhile.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { AREAS } from "@/config/areas";
import { ACCOUNTS_ON } from "@/config/supabase";
import { isBanned, isModerator, problem, useAccount } from "@/lib/community/account";
import { putUp, type BoardItem } from "@/lib/community/board-data";
import { aboutWords, BODY_MAX, draftProblem, dropHandOver, itemHref, KINDS, takeOver, TITLE_MAX, type BoardDraft, type BoardKind } from "@/lib/board";
import { SignInPrompt } from "@/components/community/parts";
import { Plate } from "./parts";
import { HowItWorks } from "./Board";
import styles from "./Board.module.css";

const ORDER: BoardKind[] = ["thought", "pot", "tune"];

export default function NewItem() {
  const { start, ready, session, profile } = useAccount();
  useEffect(() => { start(); }, [start]);
  const params = useSearchParams();
  const asked = params.get("k");

  // what was handed over (a pot, a tune, a thought about an entry), read once the page is in the browser
  const [draft, setDraft] = useState<BoardDraft | null>(null);
  // (kept while the reader switches between kinds, so a pot or a tune is not lost by looking at another kind)
  const [handed, setHanded] = useState<ReturnType<typeof takeOver>>(null);
  useEffect(() => {
    const d = takeOver();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from this tab after the first paint
    setHanded(d);
    const kind: BoardKind = d?.kind ?? (asked === "pot" || asked === "tune" ? asked : "thought");
    setDraft({ kind, title: d?.title ?? "", body: d?.body ?? "", link: d?.link ?? null, picture: d?.picture ?? null, aboutTitle: d?.aboutTitle });
  }, [asked]);

  const [done, setDone] = useState<BoardItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!ACCOUNTS_ON) return <p className={styles.note}>The board needs the site&apos;s accounts, which this copy of the site was built without.</p>;
  if (!ready || !draft) return <p className={styles.status} aria-busy="true"><span className={styles.spinner} aria-hidden="true" /> One moment…</p>;
  if (!session) return <div className={styles.form}><SignInPrompt what="put something on the board" button /><HowItWorks /></div>;
  if (isBanned(profile)) return <SignInPrompt what="put something on the board" />;
  if (done) return <Done item={done} />;

  const set = (p: Partial<BoardDraft>) => { setDraft({ ...draft, ...p }); setError(null); };
  const switchTo = (kind: BoardKind) => {
    // a pot or a tune comes only from where it was made; a thought keeps only what it is about
    const from = handed?.kind === kind ? handed : null;
    set({ kind, link: from?.link ?? (kind === "thought" && draft.kind === "thought" ? draft.link : null), picture: from?.picture ?? null, aboutTitle: from?.aboutTitle });
  };
  const missing = (draft.kind === "pot" && !draft.picture) || (draft.kind === "tune" && !draft.link);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const why = draftProblem(draft);
    if (why) { setError(why); return; }
    setBusy(true); setError(null);
    try { const it = await putUp(draft); dropHandOver(); setDone(it); }
    catch (err) { setError(problem(err)); }
    setBusy(false);
  };

  return (
    <form className={styles.form} onSubmit={submit} aria-label="Put something on the board">
      <div className={styles.kinds} role="radiogroup" aria-label="What are you putting up?">
        {ORDER.map((k) => (
          <button key={k} type="button" role="radio" aria-checked={draft.kind === k} className={styles.kindBtn} onClick={() => switchTo(k)}>
            <Icon name={KINDS[k].icon} />{KINDS[k].one}
          </button>
        ))}
      </div>

      {missing ? <MakeFirst kind={draft.kind} /> : (
        <>
          {draft.kind !== "thought" && (
            <div className={styles.preview}>
              <Plate item={{ ...preview(draft), id: 0 }} large={draft.kind === "pot"} />
            </div>
          )}
          {draft.kind === "thought" && draft.link && (
            <p className={styles.about}>
              <Icon name="link" />About <Link href={draft.link}>{draft.aboutTitle ?? aboutWords(draft.link)}</Link>
              <button type="button" className="btn small quiet" onClick={() => set({ link: null, aboutTitle: undefined })}><Icon name="close" />Not about it</button>
            </p>
          )}
          <label className={styles.field}>
            <span>Title <small>{draft.kind === "pot" ? "what is on your pot, or what you call it" : draft.kind === "tune" ? "what you played" : "what it is about, in a few words"}</small></span>
            <input value={draft.title} onChange={(e) => set({ title: e.target.value })} maxLength={TITLE_MAX} required minLength={3} aria-label="Title" />
          </label>
          <label className={styles.field}>
            <span>{draft.kind === "thought" ? "Your thought" : "A few words about it"} <small>{draft.kind === "thought" ? "" : "optional; "}*italic*, **bold**, blank lines between paragraphs</small></span>
            <textarea value={draft.body} onChange={(e) => set({ body: e.target.value })} maxLength={BODY_MAX} rows={draft.kind === "thought" ? 8 : 4}
              required={draft.kind === "thought"} aria-label={draft.kind === "thought" ? "Your thought" : "A few words about it"} />
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <p className="btn-row">
            <button type="submit" className="btn" disabled={busy}><Icon name="send" />{busy ? "Putting it up…" : "Put it up"}</button>
            <Link className="btn ghost" href={AREAS.board.href}><Icon name="back" />Back to the board</Link>
          </p>
          <p className={styles.fine}>
            {isModerator(profile) ? "As the site's keeper, what you put up goes on the board at once." : "The site's keeper looks at it before it goes up. Until then only you can see it."}
            {" "}It is shown under your display name, {profile?.display_name ?? "your name"}.
          </p>
        </>
      )}
    </form>
  );
}

/** A draft as an item, for its plate. */
function preview(d: BoardDraft): Omit<BoardItem, "id"> {
  return { author_id: "", kind: d.kind, title: d.title, body: d.body, link: d.link, picture: d.picture, status: "waiting", decided_at: null, created_at: new Date().toISOString(), author: null };
}

/** A pot or a tune is made first, where it is made, and handed over from there. */
function MakeFirst({ kind }: { kind: BoardKind }) {
  const pot = kind === "pot";
  return (
    <div className={styles.makeFirst}>
      <p>{pot
        ? "Paint your pot in the potter first. Then press Put it on the board under it, and it comes here with its picture."
        : "Record a tune on the lyre first. Then press Put it on the board beside it, and it comes here."}</p>
      <p className="btn-row"><Link className="btn" href={pot ? AREAS.pot.href : AREAS.lyre.href}><Icon name={pot ? "paint" : "lyre"} />{pot ? "Paint a pot" : "Play the lyre"}</Link></p>
    </div>
  );
}

/** Put up: where it stands now, and the ways on. */
function Done({ item }: { item: BoardItem }) {
  const up = item.status === "shown";
  const words = useMemo(() => (up ? "It is on the board." : "Thank you. It will be on the board once the site's keeper has looked at it. Until then only you can see it."), [up]);
  return (
    <div className={styles.done} role="status">
      <p className={styles.doneHead}><Icon name="check" />{up ? "Put up" : "Sent"}</p>
      <p>{words}</p>
      <p className="btn-row">
        <Link className="btn" href={itemHref(item.id)}><Icon name="eye" />See it</Link>
        <Link className="btn ghost" href={AREAS.board.href}><Icon name="board" />Back to the board</Link>
      </p>
    </div>
  );
}

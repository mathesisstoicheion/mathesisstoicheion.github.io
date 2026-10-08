"use client";
/**
 * "Talk about this passage" (Phase 11): the Town Hall threads that quote a passage on this page, without leaving the
 * reader. A thread quotes a passage when it is started with "Ask in the forum" (the passage actions); its quote records
 * the work and the reference (lib/community/data.ts), so no list is kept apart from the forum itself.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { threadsAbout, quoteStart, type PassageThread } from "@/lib/community/data";
import styles from "./Reader.module.css";

export default function TalkPanel({ work, pageKeys, onJump, onClose }: {
  work: string; pageKeys: Set<string>; onJump: (ref: string) => void; onClose: () => void;
}) {
  const [all, setAll] = useState<PassageThread[] | null>(null);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let live = true;
    threadsAbout(work).then((t) => { if (live) setAll(t); }, () => { if (live) setError(true); });
    return () => { live = false; };
  }, [work]);
  useEffect(() => { ref.current?.focus({ preventScroll: true }); }, []);

  const here = (all ?? []).filter((t) => t.quote && pageKeys.has(quoteStart(t.quote)));
  const elsewhere = (all?.length ?? 0) - here.length;

  return (
    <aside ref={ref} className={styles.panel} aria-label="Talk about this passage" tabIndex={-1} onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}>
      <div className={styles.panelHead}>
        <h2 className={styles.vocabTitle}>Talk about this passage</h2>
        <button type="button" className={styles.x} onClick={onClose} aria-label="Close talk about this passage">×</button>
      </div>
      <p className={styles.fine}>Questions asked in the Town Hall about the passages on this page.</p>
      {error && <p className="muted">The Town Hall could not be reached just now. Try again in a moment.</p>}
      {!all && !error && <p className="muted">Looking in the Town Hall…</p>}
      {all && (here.length ? (
        <ul className={styles.talk}>
          {here.map((t) => (
            <li key={t.id}>
              <Link href={`/town-hall/thread?id=${t.id}`} transitionTypes={["page-turn"]}><b>{t.title}</b></Link>
              <span className="muted">
                {t.reply_count} {t.reply_count === 1 ? "reply" : "replies"}{t.answered_post_id ? " · answered" : ""} ·{" "}
                <button type="button" className={styles.talkRef} onClick={() => onJump(quoteStart(t.quote!))}>{t.quote!.ref}</button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No one has asked about this page yet.{elsewhere > 0 ? ` There ${elsewhere === 1 ? "is a question" : `are ${elsewhere} questions`} about other parts of this work.` : ""}</p>
      ))}
      <div className={styles.talkAsk}>
        <b>Ask about a passage</b>
        <p>Click a passage number in the margin, or select some Greek words, then choose <i>Ask in the forum</i>. The passage goes with your question, and the question shows up here.</p>
        <Link className="chip" href="/town-hall" transitionTypes={["page-turn"]}>The Town Hall →</Link>
      </div>
    </aside>
  );
}

"use client";
/**
 * The Guide's chapters: for each part of the site a figure (a still drawing of its controls), a few plain sentences, and "Show me",
 * which opens the real page and points at its controls one by one (lib/tours.ts, components/tour/Tour.tsx).
 * A chapter whose tour has been watched in this browser is ticked.
 */
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import { TOURS } from "@/lib/tours";
import { useToursDone } from "@/lib/tour-progress";
import { useEffect, useId, useState } from "react";
import { inviteSeen } from "./GuideInvite";
import { Picture, WordDemo } from "./Pictures";
import styles from "./Guide.module.css";

export interface Chapter {
  id: keyof typeof TOURS;
  title: string;
  /** the area's own name, where the chapter is about one area of the site */
  place?: { name: string; greek?: string };
  text: string[];
  /** a second place to go, besides the tour's own page */
  /** one more place the chapter is about, to open without the tour */
  also?: { label: string; href: string; icon: IconName };
}

/** how many steps the tour has on a wide screen (a phone may have one more or less) */
const stepsOf = (id: string) => TOURS[id].steps.filter((s) => s.only !== "phone").length;

const showHref = (id: string) => {
  const t = TOURS[id];
  return `${t.start}${t.start.includes("?") ? "&" : "?"}tour=${id}`;
};

/** visiting the Guide answers the first-visit invitation */
export function GuideSeen() {
  useEffect(() => { inviteSeen(); }, []);
  return null;
}

/** a chapter's one-line hint: its first clause, cut at the first colon or full stop */
export const hintOf = (c: Chapter) => c.text[0].split(/[:.](?:\s|$)/)[0];
const firstSentence = (c: Chapter) => c.text[0].split(/\.(?:\s|$)/)[0] + ".";

/** the number is hidden from a screen reader (the list is numbered already); a chapter shown is ticked */
export function GuideContents({ chapters }: { chapters: Chapter[] }) {
  const done = useToursDone();
  return (
    <nav className={styles.contents} aria-label="Chapters">
      <ol>
        {chapters.map((c, i) => {
          const seen = done.includes(c.id);
          return (
            <li key={c.id} className={styles.row} data-done={seen || undefined}>
              <span className={styles.no} aria-hidden="true">{i + 1}</span>
              <a className={styles.rowTitle} href={`#${c.id}`}>{c.title}{seen && <span className="visually-hidden"> (shown)</span>}</a>
              <span className={styles.hint}>{hintOf(c)}</span>
              <span className={styles.rowGo}>
                <Link href={showHref(c.id)} transitionTypes={["page-turn"]} aria-label={`Show me: ${c.title}`}>
                  {seen ? "✓ Shown" : <>Show me · {stepsOf(c.id)} steps</>} <span className="arr" aria-hidden="true">→</span>
                </Link>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** The head's card: "First: look up a word", with the drawing of the look-up whose word is a real button; pressing it fades in the look-up card. */
export function GuideFirst({ chapter }: { chapter: Chapter }) {
  const done = useToursDone();
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <section className={styles.first} aria-labelledby={`${id}-h`}>
      <p className={styles.firstKicker}>Chapter 1 · the reader&apos;s first tool</p>
      <h2 id={`${id}-h`} className="visually-hidden">First: look up a word</h2>
      <WordDemo open={open} onToggle={() => setOpen((o) => !o)} id={`${id}-card`} />
      <p className={styles.firstSay}>{firstSentence(chapter)}</p>
      <div className={styles.go}>
        <Link className="btn" href={showHref(chapter.id)} transitionTypes={["page-turn"]}>
          <Icon name="tour" />{done.includes(chapter.id) ? "Show me again" : <>Show me · {stepsOf(chapter.id)} steps</>} <span className="arr" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

export function GuideChapters({ chapters }: { chapters: Chapter[] }) {
  const done = useToursDone();
  return (
    <ol className={styles.chapters}>
      {chapters.map((c, i) => (
        <li key={c.id} id={c.id} className={`${styles.chapter} rv`} aria-labelledby={`${c.id}-h`} data-first={c.id === "word" || undefined}>
          {/* Look up a word has its drawing in the head, so the card above is its figure */}
          {c.id === "word" ? <p className={styles.tryIt}>Tap any word in the card above to try it</p> : <Picture id={c.id} n={i + 1} />}
          <div className={styles.say}>
            <p className={styles.kicker}>
              <span className={styles.big} aria-hidden="true">{i + 1}</span>
              {c.place && <span className="label">{c.place.name}{c.place.greek && <> · <span lang="grc">{c.place.greek}</span></>}</span>}
            </p>
            <h2 id={`${c.id}-h`}>{c.title}</h2>
            {c.text.map((p, k) => <p key={k}>{p}</p>)}
            <div className={styles.go}>
              <Link className="btn small" href={showHref(c.id)} transitionTypes={["page-turn"]}>
                <Icon name="tour" />{done.includes(c.id) ? "Show me again" : <>Show me · {stepsOf(c.id)} steps</>} <span className="arr" aria-hidden="true">→</span>
              </Link>
              {c.also && <Link className="btn small ghost" href={c.also.href} transitionTypes={["page-turn"]}><Icon name={c.also.icon} />{c.also.label}</Link>}
              {done.includes(c.id) && <span className={styles.steps}>✓ Shown</span>}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

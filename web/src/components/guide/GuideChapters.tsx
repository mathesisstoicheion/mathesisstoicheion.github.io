"use client";
/**
 * The Guide's chapters: for each part of the site a moving picture, a few plain sentences, and "Show me",
 * which opens the real page and points at its controls one by one (lib/tours.ts, components/tour/Tour.tsx).
 * A chapter whose tour has been watched in this browser is ticked.
 */
import Link from "next/link";
import { TOURS } from "@/lib/tours";
import { useToursDone } from "@/lib/tour-progress";
import { useEffect } from "react";
import { inviteSeen } from "./GuideInvite";
import { Picture } from "./Pictures";
import styles from "./Guide.module.css";

export interface Chapter {
  id: keyof typeof TOURS;
  title: string;
  /** the area's own name, where the chapter is about one area of the site */
  place?: { name: string; greek?: string; english: string };
  text: string[];
  /** a second place to go, besides the tour's own page */
  also?: { label: string; href: string };
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

export function GuideContents({ chapters }: { chapters: Chapter[] }) {
  const done = useToursDone();
  return (
    <nav className={styles.contents} aria-label="Chapters">
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} data-done={done.includes(c.id) || undefined}>
              <span className={styles.no}>{done.includes(c.id) ? "✓" : i + 1}</span>{c.title}
              {done.includes(c.id) && <span className="visually-hidden"> (shown)</span>}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function GuideChapters({ chapters }: { chapters: Chapter[] }) {
  const done = useToursDone();
  return (
    <ol className={styles.chapters}>
      {chapters.map((c, i) => (
        <li key={c.id} id={c.id} className={`${styles.chapter} rv`} aria-labelledby={`${c.id}-h`}>
          <Picture id={c.id} />
          <div className={styles.say}>
            <p className={styles.kicker}>
              <span className={styles.big} aria-hidden="true">{i + 1}</span>
              {c.place && <span className="label">{c.place.name}{c.place.greek && <span lang="grc"> {c.place.greek}</span>} · {c.place.english}</span>}
            </p>
            <h2 id={`${c.id}-h`}>{c.title}</h2>
            {c.text.map((p, k) => <p key={k}>{p}</p>)}
            <div className={styles.go}>
              <Link className="btn small" href={showHref(c.id)} transitionTypes={["page-turn"]}>
                {done.includes(c.id) ? "Show me again" : "Show me"} <span className="arr" aria-hidden="true">→</span>
              </Link>
              {c.also && <Link className="btn small ghost" href={c.also.href} transitionTypes={["page-turn"]}>{c.also.label}</Link>}
              <span className={styles.steps}>{done.includes(c.id) ? "✓ Shown" : `${stepsOf(c.id)} steps`}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

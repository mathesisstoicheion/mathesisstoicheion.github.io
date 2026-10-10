"use client";
/**
 * A first visit's home page asks one question, "Where are you starting?" (Phase 11). Picking an answer opens a panel
 * saying what will be set up; "Begin" sets the reading aids to suit, remembers the answer (lib/visitor.ts) and opens
 * the right place. Nothing changes until Begin is pressed, and all of it can be changed later in Settings.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { useSettings, scrollBehavior, type Settings } from "@/lib/settings";
import { saveStart, type StartChoice as Choice } from "@/lib/visitor";
import styles from "./Start.module.css";

interface Option { id: Choice; glyph: string; title: string; text: string; sets: string[]; go: string; cta: string; settings: Partial<Settings> }

export const OPTIONS: Option[] = [
  { id: "none", glyph: "Αα", title: "I know no Greek", go: "/academy/alphabet", cta: "Meet the alphabet",
    text: "Begin with the letters and their sounds. A real line of Homer by the end of the first lesson.",
    sets: ["Start at the alphabet: shapes, names and sounds", "Latin letters shown under the Greek in the reader", "Tap or click any Greek word to see what it means"],
    settings: { translit: true } },
  { id: "some", glyph: "λόγος", title: "I know a little", go: "/academy", cta: "Choose a lesson",
    text: "Pick up the lessons where you are, and read real texts with help one tap away.",
    sets: [`The ${LESSONS.length} lessons, to start wherever suits you`, "Look up any word: its dictionary form, its grammar here and its meaning", "Save the words you meet for a few minutes' practice a day"],
    settings: { translit: false } },
  { id: "read", glyph: "Α | A", title: "I just want to read", go: "/library", cta: "Open the library",
    text: "Greek and English side by side. Read the English, glance at the Greek, dig in when you like.",
    sets: ["The library, with the English beside the Greek", "Reading aids off: switch any on from the reader", "Suggestions for where to begin"],
    settings: { translit: false, columns: "both" } },
];

export default function StartChoice() {
  const [picked, setPicked] = useState<Choice | null>(null);
  const setSettings = useSettings((s) => s.set);
  const panel = useRef<HTMLDivElement>(null);
  const opt = OPTIONS.find((o) => o.id === picked);

  // on a narrow screen the panel opens below all three cards: bring it into view
  useEffect(() => {
    if (!picked || !panel.current || innerWidth > 760) return;
    const t = setTimeout(() => panel.current?.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" }), 250);
    return () => clearTimeout(t);
  }, [picked]);

  const begin = (o: Option) => { useSettings.persist.rehydrate(); setSettings(o.settings); saveStart(o.id); };

  return (
    <section className={styles.ask} aria-labelledby="ask-title">
      <h2 id="ask-title" className={styles.askTitle}>Where are you starting?</h2>
      <div className={styles.choices} data-picked={picked ?? undefined} role="group" aria-labelledby="ask-title">
        {OPTIONS.map((o, i) => (
          <button key={o.id} type="button" className={styles.choice} style={{ "--i": i } as React.CSSProperties}
            aria-pressed={picked === o.id} aria-controls="start-setup" onClick={() => setPicked(picked === o.id ? null : o.id)}>
            <span className={styles.glyph} lang="grc" aria-hidden="true">{o.glyph}</span>
            <b>{o.title}</b>
            <span className={styles.choiceText}>{o.text}</span>
          </button>
        ))}
      </div>
      <div id="start-setup" ref={panel} className={styles.setup} data-open={opt ? "" : undefined} aria-live="polite">
        {opt && (
          <div className={styles.setupIn} key={opt.id}>
            <div>
              <span className="label">We&apos;ll set things up for you</span>
              <ul>
                {opt.sets.map((s, i) => (
                  <li key={s} style={{ "--i": i } as React.CSSProperties}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 9.5 18 20 6" /></svg>{s}
                  </li>
                ))}
              </ul>
              <small>You can change any of this later in Settings.</small>
            </div>
            <Link className="btn" href={opt.go} transitionTypes={["page-turn"]} onClick={() => begin(opt)}>
              {opt.cta} <span className="arr" aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
      <p className={styles.guide}>Not sure? <Link href="/guide" transitionTypes={["page-turn"]}>See how the site works</Link>, ten short chapters.</p>
    </section>
  );
}

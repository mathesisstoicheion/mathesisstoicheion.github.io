"use client";
/**
 * A first visit's home page asks one question, "Where are you starting?" (Phase 11), over the wall at the top of the
 * page (design B, Stone and torch). Three tabs (No Greek, A little, Just reading) each say what will be set up;
 * "Begin" sets the reading aids to suit, remembers the answer (lib/visitor.ts) and opens the right place. Nothing
 * changes until that button is pressed, and all of it can be changed later in Settings.
 */
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { LESSON_INFO as LESSONS } from "@/data/lesson-index";
import { useSettings, type Settings } from "@/lib/settings";
import { saveStart, type StartChoice as Choice } from "@/lib/visitor";
import styles from "./Start.module.css";

interface Option { id: Choice; tab: string; title: string; text: string; sets: string[]; go: string; cta: string; settings: Partial<Settings> }

export const OPTIONS: Option[] = [
  { id: "none", tab: "No Greek", title: "I know no Greek", go: "/academy/alphabet", cta: "Meet the alphabet",
    text: "Begin with the letters and their sounds. A real line of Homer by the end of the first lesson.",
    sets: ["Start at the alphabet: shapes, names and sounds", "Latin letters shown under the Greek in the reader", "Tap or click any Greek word to see what it means"],
    settings: { translit: true } },
  { id: "some", tab: "A little", title: "I know a little", go: "/academy", cta: "Choose a lesson",
    text: "Pick up the lessons where you are, and read real texts with help one tap away.",
    sets: [`The ${LESSONS.length} lessons, to start wherever suits you`, "Look up any word: its dictionary form, its grammar here and its meaning", "Save the words you meet for a few minutes' practice a day"],
    settings: { translit: false } },
  { id: "read", tab: "Just reading", title: "I just want to read", go: "/library", cta: "Open the library",
    text: "Greek and English side by side. Read the English, glance at the Greek, dig in when you like.",
    sets: ["The library, with the English beside the Greek", "Reading aids off: switch any on from the reader", "Suggestions for where to begin"],
    settings: { translit: false, columns: "both" } },
];

export default function StartChoice() {
  const [picked, setPicked] = useState<Choice>("none");
  const setSettings = useSettings((s) => s.set);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const opt = OPTIONS.find((o) => o.id === picked)!;

  const begin = (o: Option) => { useSettings.persist.rehydrate(); setSettings(o.settings); saveStart(o.id); };
  // the arrow keys move between the tabs, as in any set of tabs
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + OPTIONS.length) % OPTIONS.length;
    setPicked(OPTIONS[j].id); tabs.current[j]?.focus();
  };

  return (
    <section className={styles.ask} aria-labelledby="ask-title">
      <h2 id="ask-title" className={`${styles.askTitle} label`}>Where are you starting?</h2>
      <div className={styles.tabs} role="tablist" aria-labelledby="ask-title">
        {OPTIONS.map((o, i) => (
          <button key={o.id} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`start-tab-${o.id}`} className={styles.tab}
            aria-label={o.title} aria-selected={picked === o.id} aria-controls="start-setup" tabIndex={picked === o.id ? 0 : -1}
            onClick={() => setPicked(o.id)} onKeyDown={(e) => onKey(e, i)}>
            {o.tab}
          </button>
        ))}
      </div>
      <div id="start-setup" className={styles.setup} role="tabpanel" aria-labelledby={`start-tab-${opt.id}`}>
        <div className={styles.setupIn} key={opt.id}>
          <p className={styles.setupText}><b>{opt.title}.</b> {opt.text}</p>
          <ul>
            {opt.sets.map((s, i) => (
              <li key={s} style={{ "--i": i } as React.CSSProperties}>{s}</li>
            ))}
          </ul>
          <div className={styles.setupGo}>
            <Link className="btn" href={opt.go} transitionTypes={["page-turn"]} onClick={() => begin(opt)}>
              {opt.cta} <span className="arr" aria-hidden="true">→</span>
            </Link>
            <small>We&apos;ll set the reading aids to suit. You can change any of this later in Settings.</small>
          </div>
        </div>
      </div>
      <p className={styles.guide}>Not sure? <Link href="/guide" transitionTypes={["page-turn"]}>See how the site works</Link>, ten short chapters.</p>
    </section>
  );
}

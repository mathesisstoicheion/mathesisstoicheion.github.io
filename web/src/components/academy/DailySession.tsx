"use client";
/**
 * Today's session: a few minutes of study as the pages of a small book, turned forward with Next or
 * a swipe to the left (Phase 10). A few flashcards, a lesson's refresh when one is due, one question on the
 * forms, and one real sentence;
 * then a last page with what was done and the days in a row. Full screen on phones.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { dueRefreshes, type Due } from "@/lib/refreshes";
import { useAcademy, streak } from "@/lib/academy";
import { AREAS } from "@/config/areas";
import Review from "./Review";
import { Endings, Parsing } from "./Practice";
import styles from "./Academy.module.css";

// the refresh carries the lessons with it, so it loads only when one is due
const SessionRefresh = dynamic(() => import("./SessionRefresh"), { loading: () => <p className="muted">Setting out the questions…</p> });

type StepId = "cards" | "refresh" | "ending" | "sentence" | "done";
const STEP: Record<StepId, { title: string; gr: string; note: string }> = {
  cards: { title: "Your cards", gr: "ἀνάμνησις", note: "Up to ten words from your review deck, due today." },
  refresh: { title: "A refresh", gr: "ἀνανέωσις", note: "" },
  ending: { title: "One ending", gr: "ἄσκησις", note: "One question on the forms, from the tables." },
  sentence: { title: "One real sentence", gr: "λόγος", note: "A word in a verse of the Gospel of John, its analysis checked by hand." },
  done: { title: "Done for today", gr: "τέλος", note: "" },
};
const CARDS = 10;

export default function DailySession() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [cards, setCards] = useState<number | null>(null);
  const [ending, setEnding] = useState<boolean | null>(null);
  const [sentence, setSentence] = useState<boolean[]>([]);
  const days = useAcademy((s) => s.days);
  const mastery = useAcademy((s) => s.mastery);
  // the refresh due when the session began (the store fills in after the first paint; once under way, the pages stay put)
  const [kept, setKept] = useState<Due | null | undefined>(undefined);
  const dueNow = dueRefreshes(mastery)[0] ?? null;
  const refresh = kept !== undefined ? kept : dueNow;
  const [refreshed, setRefreshed] = useState(false);
  const ids: StepId[] = refresh ? ["cards", "refresh", "ending", "sentence", "done"] : ["cards", "ending", "sentence", "done"];
  const STEPS = ids.map((id) => (id === "refresh" && refresh ? { ...STEP.refresh, note: `${refresh.name}, ${refresh.title}, has come round again: a short test to keep it fresh.` } : STEP[id]));
  const markActive = useAcademy((s) => s.markActive);
  const box = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLElement>(null);
  // the footer's Next or Skip steps back to a ghost button while the page itself shows a gold one (Show the meaning, Add the next 10…)
  const [gold, setGold] = useState(false);
  useEffect(() => {
    const el = page.current;
    if (!el) return;
    const look = () => setGold(!!el.querySelector(".btn:not(.ghost)"));
    const first = requestAnimationFrame(look);
    const watch = new MutationObserver(look);
    watch.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    return () => { cancelAnimationFrame(first); watch.disconnect(); };
  }, [step]);
  const doneBy: Record<StepId, boolean> = { cards: cards !== null, refresh: refreshed, ending: ending !== null, sentence: sentence.length >= 2, done: true };
  const done = ids.map((id) => doneBy[id]);
  const last = STEPS.length - 1;

  const go = (n: number) => {
    if (n < 0 || n > last) return;
    if (kept === undefined) setKept(refresh);
    setDir(n > step ? 1 : -1);
    setStep(n);
    if (n === last) markActive();
    box.current?.scrollTo({ top: 0 });
  };

  // a swipe to the left turns forward, to the right back (not on the flashcard, which has swipes of its own)
  const g = useRef<{ id: number; x: number; y: number } | null>(null);
  const swipe = {
    onPointerDown: (e: React.PointerEvent) => {
      const t = e.target as Element;
      g.current = t.closest("[data-noswipe], button, a, input, select, textarea") ? null : { id: e.pointerId, x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = g.current;
      g.current = null;
      if (!s || s.id !== e.pointerId) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(step + (dx < 0 ? 1 : -1));
    },
    onPointerCancel: () => { g.current = null; },
  };

  const s = STEPS[step];
  const at = ids[step];
  return (
    <div ref={box} className={styles.session}>
      <div className={styles.sessionTop}>
        <Link className={styles.sessionX} href={AREAS.study.href} transitionTypes={["page-turn"]} aria-label={`Leave today's session, back to ${AREAS.study.name}`}>×</Link>
        <ol className={styles.dots} aria-label="Pages of today's session">
          {STEPS.map((x, i) => (
            <li key={x.title} aria-current={i === step ? "step" : undefined} data-done={i < step || undefined}>
              <span className="visually-hidden">{x.title}{i === step ? " (this page)" : ""}</span>
            </li>
          ))}
        </ol>
        <span className="label">{step + 1} of {STEPS.length}</span>
      </div>

      <section key={step} ref={page} className={styles.sessionPage} data-dir={dir} aria-labelledby="session-title" {...swipe}>
        <header className={styles.sessionHead}>
          <h1 id="session-title">{s.title} <span lang="grc">{s.gr}</span></h1>
          {s.note && <p className="muted">{s.note}</p>}
        </header>
        {at === "cards" && <div data-noswipe=""><Review limit={CARDS} onDone={(n) => setCards(n)} /></div>}
        {at === "refresh" && refresh && <div data-noswipe=""><SessionRefresh due={refresh} onFinish={() => setRefreshed(true)} /></div>}
        {at === "ending" && <Endings once onScore={(ok) => setEnding(ok)} />}
        {at === "sentence" && <Parsing once onScore={(ok) => setSentence((a) => [...a, ok])} />}
        {at === "done" && (
          <div className={styles.sessionDone}>
            <ul>
              <li>{cards ? `${cards} card${cards === 1 ? "" : "s"} reviewed` : "No cards were due"}</li>
              {refresh && <li>{refreshed ? `${refresh.name}: refresh taken` : `${refresh.name}: refresh skipped, still due`}</li>}
              <li>{ending === null ? "The ending was skipped" : ending ? "The ending: right" : "The ending: one to look at again in the tables"}</li>
              <li>{sentence.length < 2 ? "The sentence was skipped" : `The sentence: ${sentence.filter(Boolean).length} of 2 right`}</li>
            </ul>
            <p className={styles.sessionDays}>
              <b>{streak(days)}</b> day{streak(days) === 1 ? "" : "s"} in a row. A few minutes each day is the surest way to learn a language.
            </p>
            <div className={styles.row}>
              <Link className="btn ghost" href="/academy/practice" transitionTypes={["page-turn"]}>More practice</Link>
              <Link className="btn ghost" href={AREAS.library.href} transitionTypes={["page-turn"]}>Read something</Link>
            </div>
          </div>
        )}
      </section>

      <div className={styles.sessionFoot}>
        {step > 0 && <button type="button" className="btn ghost" onClick={() => go(step - 1)}>Back</button>}
        {step < last
          ? <button type="button" className={gold ? "btn ghost" : "btn"} onClick={() => go(step + 1)}>{done[step] ? "Next" : "Skip"} <span className="arr" aria-hidden="true">→</span></button>
          : <Link className="btn" href={AREAS.study.href} transitionTypes={["page-turn"]}>Back to {AREAS.study.name}</Link>}
      </div>
    </div>
  );
}

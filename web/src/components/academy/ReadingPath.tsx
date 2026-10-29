"use client";
/**
 * The learn-by-reading path (data/reading-path.ts) in two tabs: the path itself, its lessons and practice lessons
 * in order with the next one lit, and "Lessons completed" (Noa, 2026-10-18): what each finished lesson taught,
 * real counts of what the learner has read, and the help they have outgrown, kept there to look back at.
 */
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { LETTERS_STEP, PATH, PRACTICE, partText, stepWords, pathKey, passageKey, readingNo, lineWords, wordsRead, READING_TOTAL, type PathWord } from "@/data/reading-path";
import { READING_ITEMS, lessonsRead } from "@/data/reading-index";
import { nextReading, wordsLabel } from "@/data/tracks";
import { useAcademy } from "@/lib/academy";
import Rich from "./Rich";
import { AlphabetFold } from "./PathStepView";
import styles from "./Academy.module.css";
import w from "./Workout.module.css";

export { pathKey, passageKey };

/** The path in order: the letters, then each lesson, with a practice lesson after every third (data/reading-index.ts). */
const ITEMS = READING_ITEMS;

const done = (mark: string) => <span className={`${w.mark} ${w.markPassed}`} title={mark}>✓<span className="visually-hidden">{mark}</span></span>;

function PathList({ completed }: { completed: Record<string, number> }) {
  // the one next step, the same as the Academy's button and Your desk (data/tracks.ts)
  const next = nextReading(completed)?.href;
  return (
    <ol className={styles.path}>
      {ITEMS.map((it) => {
        const lit = `/academy/reading/${it.id}` === next;
        const style = lit ? { backgroundColor: "var(--slab-lit)" } : undefined;
        const nextMark = <span className="label" style={{ color: "var(--accent)" }}>Next</span>;
        if (it.kind === "letters") return (
          <li key={it.id}>
            <Link href={`/academy/reading/${it.id}`} transitionTypes={["page-turn"]} className={styles.pathItem} style={style} aria-current={lit ? "step" : undefined}>
              <span className={styles.pathNo}>{readingNo(it.id)}</span>
              <span>
                <b>{LETTERS_STEP.title}</b> <span lang="grc" className={styles.pathGr}>{LETTERS_STEP.names.slice(0, 3).map((n) => n.gr).join(" ")}</span>
                <span className={styles.pathAbout}>{LETTERS_STEP.who}</span>
              </span>
              <span className={styles.pathMin}>{completed[pathKey(it.id)] ? done("Read") : lit ? nextMark : wordsLabel(LETTERS_STEP.names.length)}</span>
            </Link>
          </li>
        );
        if (it.kind === "practice") {
          const p = PRACTICE.find((x) => x.id === it.id)!;
          return (
            <li key={it.id}>
              <Link href={`/academy/reading/${it.id}`} transitionTypes={["page-turn"]} className={styles.pathItem} style={style} aria-current={lit ? "step" : undefined}>
                <span className={styles.pathNo} aria-hidden="true">◆</span>
                <span><b>{p.title}</b><span className={styles.pathAbout}><Rich text={p.intro} /></span></span>
                <span className={styles.pathMin}>{completed[pathKey(it.id)] ? done("Done") : lit ? nextMark : "Practice"}</span>
              </Link>
            </li>
          );
        }
        const i = PATH.findIndex((s) => s.id === it.id), s = PATH[i];
        return (
          <li key={it.id}>
            <Link href={`/academy/reading/${s.id}`} transitionTypes={["page-turn"]} className={styles.pathItem} style={style} aria-current={lit ? "step" : undefined}>
              <span className={styles.pathNo}>{readingNo(s.id)}</span>
              <span>
                <b>{s.title}</b> <span lang="grc" className={styles.pathGr}>{s.parts.map(partText).join(" ")}</span>
                <span className={styles.pathAbout}>{s.who}</span>
              </span>
              <span className={styles.pathMin}>{completed[pathKey(s.id)] ? done("Read") : lit ? nextMark : wordsLabel(lineWords(s))}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** The help each level leaves behind, and after which lesson it goes. */
const OUTGROWN = [
  { after: 3, title: "The letters stage", text: "From lesson 5 you sound each word out yourself. The whole alphabet, with every letter's sound, is here." },
  { after: 6, title: "Meanings before guessing", text: "From lesson 8 you pick each new word's meaning before it opens, and build each sentence yourself. Every word you have met, with its meaning, is below." },
  { after: 9, title: "New-word marks for words you know", text: "From lesson 11 words you have met are no longer marked as new, and you put the English in order yourself. Every piece of grammar you have met is below." },
];

function Completed({ completed }: { completed: Record<string, number> }) {
  const lessons = PATH.map((s, i) => ({ s, i })).filter(({ s }) => completed[pathKey(s.id)]);
  const practices = PRACTICE.filter((p) => completed[pathKey(p.id)]);
  // everything read: each finished lesson's line, its passage if finished, and finished practice lines
  const { words, read, grammar } = useMemo(() => {
    const ws = wordsRead(completed);
    const g: { title: string; text: string[] }[] = [];
    for (const { s } of lessons) {
      const withPassage = !!completed[passageKey(s.id)];
      g.push(s.learn, ...(withPassage ? (s.passage?.sentences ?? []).flatMap((st) => st.pieces.map((p) => p.learn)) : []));
    }
    for (const p of practices) for (const l of p.lines) g.push(...l.pieces.map((q) => q.learn));
    const byLemma = new Map<string, PathWord>();
    for (const x of ws) if (!byLemma.has(x.lemma)) byLemma.set(x.lemma, x);
    const byTitle = new Map<string, { title: string; text: string[] }>();
    for (const x of g) if (!byTitle.has(x.title)) byTitle.set(x.title, x);
    return { words: [...byLemma.values()], read: ws.length, grammar: [...byTitle.values()] };
  }, [lessons, practices, completed]);

  // nothing read yet but (perhaps) the letters: the way on is the one next step every page offers (data/tracks.ts)
  const next = nextReading(completed);
  if (lessons.length === 0) return (
    <p className={styles.lp}>
      {completed[pathKey(LETTERS_STEP.id)] ? "You have read the letters. " : "Nothing here yet. "}When you finish a lesson with a real
      line it appears here, with the words and grammar it taught you, and a count of everything you have read.{" "}
      {next && <Link href={next.href} transitionTypes={["page-turn"]}>Your next lesson: {next.title} →</Link>}
    </p>
  );
  const outgrown = OUTGROWN.filter((o) => lessons.length >= o.after);
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section aria-label="How far you have come" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 100px), 1fr))" }}>
        {[
          { n: words.length, what: "words you know", note: "each dictionary form you have learned" },
          { n: grammar.length, what: "endings and grammar", note: "each piece of grammar you have met" },
          { n: read, what: "Greek words read", note: "every word of every line and passage you finished" },
        ].map((c) => (
          <div key={c.what} className={w.card} style={{ display: "grid", gap: 4 }}>
            <span className={styles.pathNo} style={{ textAlign: "start" }}>{c.n}</span>
            <b>{c.what}</b>
            <span className={styles.small}>{c.note}</span>
          </div>
        ))}
      </section>

      <p className={styles.lp}>
        You have finished {lessonsRead(completed)} of {READING_TOTAL} lessons{practices.length > 0 ? ` and ${practices.length} of ${PRACTICE.length} practice lessons` : ""}.
        {lessons.length >= 3 ? " Each three lessons, one kind of help has gone, because you no longer need it." : " After lesson 4 the first kind of help goes: you will be ready for it."}
      </p>

      {outgrown.length > 0 && (
        <section style={{ display: "grid", gap: 12 }}>
          <span className="label">Help you have outgrown</span>
          {outgrown.map((o) => <p key={o.title} className={styles.small}><b>{o.title}.</b> {o.text}</p>)}
          <AlphabetFold label="The whole alphabet" />
          {lessons.length >= 6 && (
            <details>
              <summary className="label" style={{ cursor: "pointer" }}>Every word you know ({words.length})</summary>
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 6, gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))" }}>
                {words.map((x) => <li key={x.lemma}><span lang="grc" className={styles.inlineGr}>{x.lemma}</span> <span className="muted">{x.dict}</span></li>)}
              </ul>
            </details>
          )}
          {lessons.length >= 9 && (
            <details>
              <summary className="label" style={{ cursor: "pointer" }}>Every piece of grammar you have met ({grammar.length})</summary>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {grammar.map((g) => (
                  <aside key={g.title} className={styles.tipBox}><span className="label">{g.title}</span>{g.text.map((t, i) => <p key={i}><Rich text={t} /></p>)}</aside>
                ))}
              </div>
            </details>
          )}
        </section>
      )}

      <section style={{ display: "grid", gap: 4 }}>
        <span className="label">The lessons you have finished</span>
        <ol className={styles.path}>
          {/* the letters too, lesson 1, so that the list counts what the tab and the Learn page count */}
          {completed[pathKey(LETTERS_STEP.id)] && (
            <li>
              <Link href={`/academy/reading/${LETTERS_STEP.id}`} transitionTypes={["page-turn"]} className={styles.pathItem}>
                <span className={styles.pathNo}>{readingNo(LETTERS_STEP.id)}</span>
                <span>
                  <b>{LETTERS_STEP.title}</b> <span lang="grc" className={styles.pathGr}>{LETTERS_STEP.names.slice(0, 3).map((n) => n.gr).join(" ")}</span>
                  <span className={styles.pathAbout}>Taught you the 24 letters, sounding out {LETTERS_STEP.names.length} names you already know.</span>
                </span>
                <span className={styles.pathMin}>{done("Read")}</span>
              </Link>
            </li>
          )}
          {lessons.map(({ s }) => {
            const taught = [...new Set(stepWords(s, !!completed[passageKey(s.id)]).map((x) => x.lemma))];
            return (
              <li key={s.id}>
                <Link href={`/academy/reading/${s.id}`} transitionTypes={["page-turn"]} className={styles.pathItem}>
                  {/* the number it has on the path, the letters being lesson 1 */}
                  <span className={styles.pathNo}>{readingNo(s.id)}</span>
                  <span>
                    <b>{s.title}</b> <span lang="grc" className={styles.pathGr}>{s.parts.map(partText).join(" ")}</span>
                    <span className={styles.pathAbout}>
                      Taught you {taught.length} words and <i>{s.learn.title}</i>{completed[passageKey(s.id)] ? ", and you read its passage" : ""}.
                    </span>
                  </span>
                  <span className={styles.pathMin}>{done("Read")}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

const onHash = (f: () => void) => { window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); };

export default function ReadingPath() {
  const completed = useAcademy((s) => s.completed);
  // the tab is the page's #completed hash, so "Lessons completed" can be linked to
  const hash = useSyncExternalStore(onHash, () => window.location.hash, () => "");
  const tab = hash === "#completed" ? "completed" : "path";
  const pick = (t: "path" | "completed") => {
    window.history.replaceState(null, "", t === "completed" ? "#completed" : window.location.pathname);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  const n = lessonsRead(completed);
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className={styles.seg} role="radiogroup" aria-label="Show" style={{ justifySelf: "start" }}>
        <button type="button" role="radio" aria-checked={tab === "path"} onClick={() => pick("path")}>The path</button>
        <button type="button" role="radio" aria-checked={tab === "completed"} onClick={() => pick("completed")}>Lessons completed{n > 0 ? ` (${n})` : ""}</button>
      </div>
      {tab === "path" ? <PathList completed={completed} /> : <Completed completed={completed} />}
    </div>
  );
}

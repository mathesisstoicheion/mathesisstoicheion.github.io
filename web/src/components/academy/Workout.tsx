"use client";
/**
 * A lesson's workout: the practice (anything missed comes back at the end of the round, and a third of the
 * questions are from earlier lessons), the test (ten questions on this lesson, 8 right to pass) and the
 * warm-up (three quick questions from earlier lessons, at the top of a lesson); and a checkpoint, fifteen
 * questions over a stretch of lessons (data/checkpoints.ts). The questions are made in
 * lib/workout.ts from material checked elsewhere on the site.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Lesson } from "@/data/lessons";
import { LESSONS } from "@/data/lessons";
import { practiceRound, testRound, warmUp, checkpointRound, wordsFor, isRightWritten, type Question } from "@/lib/workout";
import { checkpointKey, CHECKPOINT_GREEK, type Checkpoint } from "@/data/checkpoints";
import { passMark, refreshDue, REFRESH_DAYS, type Mastery } from "@/lib/mastery";
import { glossesFor } from "@/lib/glosses";
import { useAcademy } from "@/lib/academy";
import { buzz } from "@/lib/haptics";
import GreekKeyboard from "@/components/search/GreekKeyboard";
import Rich from "./Rich";
import styles from "./Workout.module.css";

export type Mode = "practice" | "test" | "warmup";
interface Answer { right: boolean; picked?: number; typed?: string }
/** How many times a missed practice question comes back. */
const RETRIES = 2;

function useGlosses(lesson: Lesson) {
  const [g, setG] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    let live = true;
    glossesFor(wordsFor(lesson)).then((x) => { if (live) setG(x); }, () => { if (live) setG({}); });
    return () => { live = false; };
  }, [lesson]);
  return g;
}

function ChoiceQ({ q, answer, onAnswer }: { q: Extract<Question, { kind: "choice" }>; answer: Answer | null; onAnswer: (a: Answer) => void }) {
  return (
    <div className={styles.options} role="group" aria-label="Answers">
      {q.options.map((o, j) => (
        <button key={j} type="button" disabled={!!answer} lang={q.greek ? "grc" : undefined}
          className={`${q.greek ? styles.optGr : ""} ${answer ? (j === q.answer ? styles.right : j === answer.picked ? styles.wrong : styles.faded) : ""}`}
          onClick={() => onAnswer({ right: j === q.answer, picked: j })}>
          <Rich text={o} />
        </button>
      ))}
    </div>
  );
}

function WriteQ({ q, answer, onAnswer }: { q: Extract<Question, { kind: "write" }>; answer: Answer | null; onAnswer: (a: Answer) => void }) {
  const [text, setText] = useState("");
  const [kbd, setKbd] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus({ preventScroll: true }); }, []);
  const submit = () => { if (text.trim()) onAnswer({ right: isRightWritten(text, q.answers), typed: text }); };
  return (
    <form className={styles.write} onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <div className={styles.writeRow}>
        <input ref={input} lang="grc" value={text} onChange={(e) => setText(e.target.value)} disabled={!!answer}
          className={`${styles.writeInput} ${answer ? (answer.right ? styles.right : styles.wrong) : ""}`}
          autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="Your answer" placeholder="Greek or Latin letters" />
        {!answer && <button type="submit" className="btn" disabled={!text.trim()}>Check</button>}
      </div>
      {!answer && (
        <div className={styles.writeTools}>
          <button type="button" className="chip" aria-pressed={kbd} onClick={() => setKbd((k) => !k)}>Greek letters</button>
          <button type="button" className={styles.dunno} onClick={() => onAnswer({ right: false, typed: "" })}>I don&apos;t know yet</button>
          <span className={styles.hint}>No need for accents: «logōn» or «λογων» both count.</span>
        </div>
      )}
      {kbd && !answer && (
        <GreekKeyboard wildcards={false} onKey={(k) => setText((t) => (k === "Backspace" ? t.slice(0, -1) : t + k))} />
      )}
    </form>
  );
}

/** The right answer and why, after answering. */
function Feedback({ q, answer }: { q: Question; answer: Answer }) {
  const shown = q.kind === "choice" ? q.options[q.answer] : q.answers.join(" or ");
  return (
    <div className={`${styles.feedback} ${answer.right ? styles.fbGood : styles.fbBad}`} role="status">
      <b>{answer.right ? pickPraise(q.key) : "Not quite."}</b>{" "}
      {(!answer.right || q.kind === "write") && <>The answer is <span lang={q.kind === "write" || (q.kind === "choice" && q.greek) ? "grc" : undefined} className={q.kind === "write" || q.greek ? styles.gr : undefined}><Rich text={shown} /></span>. </>}
      {q.kind === "choice" && q.why && <Rich text={q.why} />}
    </div>
  );
}
const PRAISE = ["Right.", "Yes.", "Well done.", "Exactly.", "Correct."];
const pickPraise = (key: string) => PRAISE[[...key].reduce((a, c) => a + c.charCodeAt(0), 0) % PRAISE.length];

/** The seal a passed lesson earns: stamped when the test is passed. */
function Seal({ label, greek, right, total }: { label: string; greek: string; right: number; total: number }) {
  return (
    <svg className={styles.seal} viewBox="0 0 200 200" role="img" aria-label={`${label} passed, ${right} of ${total}`}>
      <circle cx="100" cy="100" r="92" className={styles.sealRim} />
      <circle cx="100" cy="100" r="80" className={styles.sealRing} pathLength={1} />
      <circle cx="100" cy="100" r="74" className={styles.sealIn} />
      <text x="100" y="72" textAnchor="middle" className={styles.sealLabel}>{label.toUpperCase()}</text>
      <text x="100" y="112" textAnchor="middle" className={styles.sealScore}>{right}/{total}</text>
      <text x="100" y="140" textAnchor="middle" className={styles.sealGr} lang="grc">{greek.length > 16 ? "" : greek}</text>
    </svg>
  );
}

const fmtDate = (t: number) => new Date(t).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

interface Props {
  lesson: Lesson;              // the lesson; for a checkpoint, the last lesson of its stretch
  mode: Mode;
  checkpoint?: Checkpoint;     // a checkpoint test (mode "test") over the checkpoint's lessons
  embedded?: boolean;          // inside Today's session: no links away at the end
  onExit?: () => void;
  onFinish?: (passed: boolean) => void;   // a test or checkpoint has been marked
}

export default function Workout(props: Props) {
  const glosses = useGlosses(props.lesson);
  const [round, setRound] = useState(0);
  if (!glosses) return <p className="muted">Setting out the questions…</p>;
  return <Round key={round} {...props} glosses={glosses} again={() => setRound((r) => r + 1)} />;
}

function Round({ lesson, mode, checkpoint, embedded, glosses, onExit, onFinish, again }: Props & { glosses: Record<string, string>; again: () => void }) {
  const cpLessons = checkpoint ? LESSONS.filter((l) => checkpoint.lessons.includes(l.id)) : [];
  const recordId = checkpoint ? checkpointKey(checkpoint.id) : lesson.id;
  const [queue, setQueue] = useState<Question[]>(() => checkpoint ? checkpointRound(cpLessons, glosses)
    : mode === "practice" ? practiceRound(lesson, glosses) : mode === "test" ? testRound(lesson, glosses)
    : warmUp(lesson, glosses, Math.random, new Set(Object.keys(useAcademy.getState().completed))));
  const [at, setAt] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [first, setFirst] = useState<Record<string, boolean>>({});   // first try at each question
  const [log, setLog] = useState<boolean[]>([]);                     // each answer in turn, for the track
  const [tries, setTries] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Mastery | null>(null);
  const [added, setAdded] = useState(0);
  const record = useAcademy((s) => s.recordTest);
  const addCard = useAcademy((s) => s.addCard);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const n = LESSONS.findIndex((l) => l.id === lesson.id) + 1;
  // a refresh is the test taken when it is due (decided at the start, before the result moves the date)
  const [refresh] = useState(() => mode === "test" && refreshDue(useAcademy.getState().mastery[recordId]));

  useEffect(() => { if (answer) nextBtn.current?.focus({ preventScroll: true }); }, [answer]);

  if (!queue.length) return null;

  const q = queue[at];
  const finished = at >= queue.length;
  const total = Object.keys(first).length;
  const right = Object.values(first).filter(Boolean).length;

  const onAnswer = (a: Answer) => {
    setAnswer(a);
    setLog((l) => [...l, a.right]);
    buzz(a.right ? "right" : "wrong");
    if (!(q.key in first)) setFirst((f) => ({ ...f, [q.key]: a.right }));
    // practice: a missed question comes back at the end of the round
    if (mode === "practice" && !a.right && (tries[q.key] ?? 0) < RETRIES) {
      setTries((t) => ({ ...t, [q.key]: (t[q.key] ?? 0) + 1 }));
      setQueue((qs) => [...qs, q]);
    }
  };

  const next = () => {
    const done = at + 1 >= queue.length;
    if (done && mode === "test") {
      const m = record(recordId, right, total);
      setResult(m);
      onFinish?.(right >= passMark(total));
      if (m.passed) {
        // passing puts the lesson's words (a checkpoint's: all its lessons') in the daily review
        let k = 0;
        for (const w of checkpoint ? cpLessons.flatMap((l) => l.words) : lesson.words) if (glosses[w] && addCard(w, glosses[w], "lesson")) k++;
        setAdded(k);
        buzz("done");
      }
    }
    setAnswer(null);
    setAt(at + 1);
  };

  // ---------------------------------------------------------- the end of a round
  if (finished) {
    if (mode === "warmup") return (
      <div className={styles.warmEnd}>
        <p><b>{right} of {total}</b> from earlier lessons. {right === total ? "Your memory is in good shape." : "Worth a look back at what you missed before you go on."}</p>
        {onExit && <button type="button" className="btn ghost" onClick={onExit}>On to the lesson</button>}
      </div>
    );
    const missed = [...new Set(queue.filter((x) => first[x.key] === false).map((x) => x.topic))];
    if (mode === "practice") return (
      <div className={styles.end}>
        <p className={styles.endBig}>{right} of {total} right first time</p>
        <p className="muted">{right === total ? "Everything, first time. You are ready for the test." : "Everything you missed came back until you had it."}</p>
        {missed.length > 0 && <p>Worth another look: {missed.map((t, i) => <span key={t}>{i ? ", " : ""}<Rich text={t} /></span>)}.</p>}
        <div className={styles.endRow}>
          <Link className="btn" href={`/academy/lesson/${lesson.id}/test`} transitionTypes={["page-turn"]}>Take the test</Link>
          <button type="button" className="btn ghost" onClick={again}>Practise again</button>
          <Link className="btn ghost" href={`/academy/lesson/${lesson.id}`} transitionTypes={["page-turn"]}>Back to the lesson</Link>
        </div>
      </div>
    );
    const passed = right >= passMark(total);
    const nextLesson = LESSONS[n];
    // a checkpoint's misses are named by lesson, so the learner knows which to go back to
    const missedLessons = [...new Set(queue.filter((x) => first[x.key] === false).map((x) => x.lesson))]
      .map((id) => ({ id, n: LESSONS.findIndex((l) => l.id === id) + 1 })).sort((a, b) => a.n - b.n);
    return (
      <div className={styles.end}>
        {passed
          ? <Seal label={checkpoint ? `Checkpoint ${checkpoint.numeral}` : `Lesson ${n}`} greek={checkpoint ? CHECKPOINT_GREEK : lesson.greek} right={right} total={total} />
          : <p className={styles.endBig}>{right} of {total}</p>}
        {passed ? (
          <>
            <p className={styles.endBig}>{refresh ? "Refreshed." : checkpoint ? "Checkpoint passed." : "Lesson passed."}</p>
            <p>
              {added > 0 && <>{added} word{added === 1 ? "" : "s"} from {checkpoint ? "these lessons" : "this lesson"} joined your daily review. </>}
              {result && <>It will come back for a short refresh on <b>{fmtDate(result.due)}</b>, so it stays with you.</>}
            </p>
          </>
        ) : (
          <>
            <p>You need {passMark(total)} to pass{!checkpoint && total < 10 ? ` this lesson's ${total} questions` : ""}. Nothing is lost: {checkpoint ? "go back to the lessons you missed and try again" : "practise the parts you missed and try again"}.</p>
            {checkpoint
              ? missedLessons.length > 0 && <p>Go back to: {missedLessons.map((x, i) => <span key={x.id}>{i ? ", " : ""}<Link href={`/academy/lesson/${x.id}/practice`} transitionTypes={["page-turn"]}>lesson {x.n}</Link></span>)}.</p>
              : missed.length > 0 && <p>Go over: {missed.map((t, i) => <span key={t}>{i ? ", " : ""}<Rich text={t} /></span>)}.</p>}
          </>
        )}
        {embedded ? null : checkpoint ? (
          <div className={styles.endRow}>
            {nextLesson && <Link className="btn" href={`/academy/lesson/${nextLesson.id}`} transitionTypes={["page-turn"]}>{passed ? "On to" : "Or carry on with"} lesson {n + 1} →</Link>}
            <button type="button" className={nextLesson ? "btn ghost" : "btn"} onClick={again}>{passed ? "Take it again" : "Try again"}</button>
            <Link className="btn ghost" href="/academy" transitionTypes={["page-turn"]}>Back to the Academy</Link>
          </div>
        ) : (
        <div className={styles.endRow}>
          {passed
            ? nextLesson && <Link className="btn" href={`/academy/lesson/${nextLesson.id}`} transitionTypes={["page-turn"]}>Next: {nextLesson.title} →</Link>
            : <Link className="btn" href={`/academy/lesson/${lesson.id}/practice`} transitionTypes={["page-turn"]}>Practise</Link>}
          <button type="button" className="btn ghost" onClick={again}>{passed ? "Take it again" : "Try again"}</button>
          <Link className="btn ghost" href={`/academy/lesson/${lesson.id}`} transitionTypes={["page-turn"]}>Back to the lesson</Link>
        </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------- one question
  const from = q.lesson !== lesson.id ? LESSONS.findIndex((l) => l.id === q.lesson) + 1 : 0;
  // the card is labelled only when that says something new: where the question comes from, a refresh, a question come back;
  // a plain "Practice" or "Test" is the page's own title
  const where = checkpoint ? <>{refresh ? "Refresh" : `Checkpoint ${checkpoint.numeral}`} · lesson {from || n}</> : from ? <>From lesson {from}</> : refresh ? "Refresh" : null;
  const retry = queue.indexOf(q) < at;
  return (
    <div className={mode === "warmup" ? styles.warm : styles.workout}>
      <div className={styles.trackRow}>
        <ol className={styles.track} aria-label={`Question ${at + 1} of ${queue.length}`}>
          {queue.map((_, i) => <li key={i} data-state={i < at ? (log[i] ? "right" : "wrong") : i === at ? "now" : undefined} />)}
        </ol>
        <span className={styles.count}>{at + 1} of {queue.length}</span>
      </div>
      <section key={`${at}:${q.key}`} className={styles.card} aria-live="polite">
        {(where || retry) && <span className="label">{where}{retry ? (where ? " · again" : "Again") : ""}</span>}
        <p className={styles.prompt}><Rich text={q.prompt} /></p>
        {q.kind === "choice"
          ? <ChoiceQ q={q} answer={answer} onAnswer={onAnswer} />
          : <WriteQ key={`${at}`} q={q} answer={answer} onAnswer={onAnswer} />}
        {answer && <Feedback q={q} answer={answer} />}
      </section>
      <div className={styles.foot}>
        {answer && <button ref={nextBtn} type="button" className="btn" onClick={next}>{at + 1 >= queue.length ? "See how you did" : "Next"} <span className="arr" aria-hidden="true">→</span></button>}
        {!answer && mode === "warmup" && onExit && <button type="button" className={styles.dunno} onClick={onExit}>Skip the warm-up</button>}
      </div>
      {mode === "test" && at === 0 && !answer && !embedded && (
        <p className={styles.hint}>{queue.length} questions on {checkpoint ? `lessons ${LESSONS.findIndex((l) => l.id === checkpoint.lessons[0]) + 1} to ${n}` : "this lesson"}, {passMark(queue.length)} right to pass. Once passed, it comes back for short refreshes, after {REFRESH_DAYS[0]} days, then {REFRESH_DAYS[1]}, then a month, so that it sticks.</p>
      )}
    </div>
  );
}

"use client";
/**
 * One step of the learn-by-reading path: where you are, the line with every word explained on a tap, the one new piece of
 * grammar, then the English, hidden until asked for, one part at a time. Everything shown is in data/reading-path.ts, so
 * nothing is fetched until the learner opens the full dictionary entry for a word.
 */
import Link from "next/link";
import { useState } from "react";
import { PATH, firstMet, partText, type PathStep, type PathWord } from "@/data/reading-path";
import { useAcademy } from "@/lib/academy";
import WordPanel from "@/components/reader/WordPanel";
import Rich from "./Rich";
import { pathKey } from "./ReadingPath";
import styles from "./Academy.module.css";
import readerStyles from "@/components/reader/Reader.module.css";

function WordCard({ w, n, onEntry }: { w: PathWord; n: number; onEntry: () => void }) {
  const met = firstMet(w.lemma, n - 1);
  return (
    <aside className={styles.tipBox} aria-live="polite">
      <span className="label">This word</span>
      <p style={{ fontSize: "1.12rem" }}>
        <span lang="grc" className={styles.inlineGr}>{w.form}</span> means <b>{w.here}</b>. <span className="muted">{w.form_note}.</span>
      </p>
      <p className="muted">
        In the dictionary: <span lang="grc" className={styles.inlineGr}>{w.lemma}</span>, “{w.dict}” ({w.src === "DCC" ? "DCC core list" : "LSJ"}).
        {met ? ` You met it on step ${met}.` : ""}
      </p>
      <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onEntry}>The full dictionary entry</button>
    </aside>
  );
}

function Reveal({ step }: { step: PathStep }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const all = open.size === step.parts.length;
  return (
    <div className={styles.reveal}>
      <span className="label">Now try it</span>
      <p className={styles.lp}>
        Say to yourself what you think {step.parts.length > 1 ? "each part" : "it"} means. Then tap to see a published translation{step.parts.length > 1 ? ", one part at a time" : ""}.
      </p>
      <div className={styles.revealGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}>
        {step.parts.map((p, i) => (
          <button key={i} type="button" className={`${styles.revealCard} ${open.has(i) ? styles.revealed : ""}`}
            onClick={() => setOpen((s) => new Set(s).add(i))} aria-expanded={open.has(i)}>
            <span lang="grc" className={styles.revealGr}>{partText(p)}</span>
            <span className={styles.revealAns}>
              <span className={styles.revealText} aria-hidden={!open.has(i)}>{p.en}</span>
              {!open.has(i) && <span className={styles.revealMark} aria-hidden="true">?</span>}
            </span>
          </button>
        ))}
      </div>
      {all && <p className={styles.small}>Translation by {step.translator}, as the library gives it.</p>}
    </div>
  );
}

export default function PathStepView({ step }: { step: PathStep }) {
  const n = PATH.findIndex((s) => s.id === step.id) + 1;
  const next = PATH[n];
  const words = step.parts.flatMap((p) => p.words);
  const [picked, setPicked] = useState<number | null>(null);
  const [entry, setEntry] = useState<string | null>(null);
  const done = useAcademy((s) => !!s.completed[pathKey(step.id)]);
  const complete = useAcademy((s) => s.completeLesson);
  const known = words.filter((w) => firstMet(w.lemma, n - 1)).length;

  let k = 0;
  return (
    <article className={styles.lesson}>
      <section style={{ display: "grid", gap: 12 }}>
        <span className="label">Where you are</span>
        {step.where.map((t, i) => <p key={i} className={styles.lp}><Rich text={t} /></p>)}
      </section>

      <figure className={styles.real}>
        <figcaption className={styles.realHead}>
          <b>{step.label}</b>
          <Link className="chip" href={`/read?w=${step.work}&at=${step.ref}`} transitionTypes={["page-turn"]}>Open in the reader →</Link>
        </figcaption>
        <p lang="grc" className={`${styles.realGr} ${styles.revealGr}`} style={{ lineHeight: 1.6 }}>
          {step.parts.map((p, pi) => (
            <span key={pi}>
              {pi > 0 && " "}
              {p.words.map((w, wi) => {
                const i = k++;
                return (
                  <span key={wi}>
                    {wi > 0 && " "}
                    <span role="button" tabIndex={0} className={readerStyles.w} data-quote={picked === i ? "1" : undefined}
                      aria-pressed={picked === i} onClick={() => setPicked(picked === i ? null : i)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(picked === i ? null : i); } }}>{w.form}</span>
                    {w.after}
                  </span>
                );
              })}
            </span>
          ))}
        </p>
        <p className={styles.small}>
          <span className={styles.hoverOnly}>Click</span><span className={styles.touchOnly}>Tap</span> each word to see what it means.
          {known > 0 ? ` You have met ${known} of these ${words.length} words already.` : ""}
        </p>
        {picked !== null && <WordCard w={words[picked]} n={n} onEntry={() => setEntry(words[picked].form)} />}
      </figure>

      <aside className={styles.tipBox}>
        <span className="label">New here: {step.learn.title}</span>
        {step.learn.text.map((t, i) => <p key={i}><Rich text={t} /></p>)}
      </aside>

      <Reveal step={step} />

      <nav className={styles.guideLinks} aria-label="Go further">
        <span className="label">Go further</span>
        {step.links.map((l) => (
          <Link key={l.href} href={l.href} transitionTypes={["page-turn"]} className={styles.guideLink}>
            <b>{l.label}</b>{l.note && <span className="muted">{l.note}</span>}<span aria-hidden="true" className={styles.guideArrow}>→</span>
          </Link>
        ))}
      </nav>

      <footer className={styles.lessonEnd}>
        {done
          ? <p className={styles.good}>You have read this step.</p>
          : <button type="button" className="btn ghost" onClick={() => complete(pathKey(step.id))}>I have read it</button>}
        {next
          ? <Link className="btn ghost" href={`/academy/reading/${next.id}`} transitionTypes={["page-turn"]} onClick={() => complete(pathKey(step.id))}>Next: {next.title} →</Link>
          : <Link className="btn ghost" href={`/read?w=${step.work}&at=${step.ref}`} transitionTypes={["page-turn"]} onClick={() => complete(pathKey(step.id))}>Read on in the Metaphysics →</Link>}
      </footer>

      <WordPanel word={entry} ctx={null} onClose={() => setEntry(null)} />
    </article>
  );
}

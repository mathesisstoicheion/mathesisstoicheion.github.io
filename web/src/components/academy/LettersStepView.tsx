"use client";
/**
 * Step 0 of the learn-by-reading path: the letters, then six names the learner already knows to sound out,
 * each name's English hidden until tapped, as on the reading steps.
 */
import Link from "next/link";
import { useState } from "react";
import { LETTERS_STEP, PATH } from "@/data/reading-path";
import { useAcademy } from "@/lib/academy";
import AlphabetGlance from "./AlphabetGlance";
import Rich from "./Rich";
import { pathKey } from "./ReadingPath";
import styles from "./Academy.module.css";

export default function LettersStepView() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const done = useAcademy((s) => !!s.completed[pathKey(LETTERS_STEP.id)]);
  const complete = useAcademy((s) => s.completeLesson);
  const next = PATH[0];
  return (
    <article className={styles.lesson}>
      <section style={{ display: "grid", gap: 12 }}>
        <span className="label">Where you are</span>
        <p className={styles.lp}>At the start. Before the first line, the letters: Greek has 24, and many of them look like ours.</p>
        <p className={styles.lp}>You do not need to learn them all by heart now. Every step has the alphabet folded at the top, for when you forget one.</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <span className="label">1 · The letters</span>
        <AlphabetGlance />
      </section>

      <aside className={styles.tipBox}>
        <span className="label">2 · Three things to know</span>
        <p><Rich text="A vowel that starts a word carries a small mark, a breathing. The rough breathing, as in «ὁ», is an *h*: «ὁ» is *ho*. The smooth breathing, as in «Ἀθῆναι», is no sound at all. (Modern Greek drops the *h*.)" /></p>
        <p><Rich text="The marks «ά», «ὰ» and «ᾶ» are accents. For now, read past them." /></p>
        <p><Rich text="«ου» together sounds like the *oo* of *food*, and «σ» is written «ς» at the end of a word." /></p>
      </aside>

      <figure className={styles.real}>
        <figcaption className={styles.realHead}><span className="label">3 · Now read them</span></figcaption>
        <p className={styles.small}>Six names you already know. Sound each one out, then <span className={styles.hoverOnly}>click</span><span className={styles.touchOnly}>tap</span> it to check.</p>
        <div className={styles.revealGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))" }}>
          {LETTERS_STEP.names.map((n, i) => (
            <button key={n.gr} type="button" className={`${styles.revealCard} ${open.has(i) ? styles.revealed : ""}`}
              onClick={() => setOpen((s) => new Set(s).add(i))} aria-expanded={open.has(i)}>
              <span lang="grc" className={styles.revealGr}>{n.gr}</span>
              <span className={styles.revealAns}>
                <span className={styles.revealText} aria-hidden={!open.has(i)}>{n.en}</span>
                {!open.has(i) && <span className={styles.revealMark} aria-hidden="true">?</span>}
              </span>
            </button>
          ))}
        </div>
      </figure>

      <footer className={styles.lessonEnd}>
        {done
          ? <p className={styles.good}>You have read the letters.</p>
          : <button type="button" className="btn ghost" onClick={() => complete(pathKey(LETTERS_STEP.id))}>I have read them</button>}
        <Link className="btn ghost" href={`/academy/reading/${next.id}`} transitionTypes={["page-turn"]} onClick={() => complete(pathKey(LETTERS_STEP.id))}>Next: {next.title} →</Link>
      </footer>
    </article>
  );
}

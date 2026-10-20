"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS, type Lesson, type Section } from "@/data/lessons";
import { PARADIGMS } from "@/data/paradigms";
import { loadPassage, type LoadedPassage } from "@/lib/passage";
import { fold, describe } from "@/lib/catalog";
import { norm } from "@/lib/lookup/words";
import { coreEntry } from "@/lib/lookup/core";
import { lsjEntries } from "@/lib/lookup/lsj";
import { useAcademy } from "@/lib/academy";
import { useUI } from "@/lib/ui";
import { Blocks } from "@/components/reader/Blocks";
import { metreIndex, publishedFor, loadLengths } from "@/lib/metre/load";
import { renderPassages, type LineRender } from "@/lib/metre/render";
import { lineHash } from "@/lib/metre/text";
import { playLine } from "@/lib/metre/beat";
import WordPanel, { type WordContext } from "@/components/reader/WordPanel";
import { ParadigmTable } from "./Tables";
import AlphabetGlance from "./AlphabetGlance";
import Motion from "./Motion";
import Shift from "./Shift";
import Voice from "./Voice";
import Timeline from "./Timeline";
import Report from "./Report";
import Sigma from "./Sigma";
import Refer from "./Refer";
import Rich from "./Rich";
import { WarmUp, LessonSteps } from "./LessonSteps";
import styles from "./Academy.module.css";
import readerStyles from "@/components/reader/Reader.module.css";
import { FORUM_OPEN } from "@/config/areas";

/** An answer that is Greek and nothing else (a single letter, a word): set in the Greek face, larger. */
const isGreek = (t: string) => /\p{Script=Greek}/u.test(t) && !/\p{Script=Latin}/u.test(t);

function Check({ items }: { items: Extract<Section, { kind: "check" }>["items"] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div className={styles.check}>
      <span className="label">Check yourself</span>
      {items.map((q, i) => {
        const p = picked[i];
        return (
          <fieldset key={i} className={styles.q}>
            <legend><Rich text={q.q} /></legend>
            <div className={styles.options}>
              {q.options.map((o, j) => {
                const gr = isGreek(o);
                return (
                  <button key={j} type="button" disabled={p !== undefined} lang={gr ? "grc" : undefined}
                    className={`${gr ? styles.optGr : ""} ${p === undefined ? "" : j === q.answer ? styles.right : j === p ? styles.wrong : ""}`}
                    onClick={() => setPicked((s) => ({ ...s, [i]: j }))}>{gr ? o.replace(/[«»]/g, "") : <Rich text={o} />}</button>
                );
              })}
            </div>
            {p !== undefined && <p className={p === q.answer ? styles.good : styles.bad} role="status">{p === q.answer ? "Right. " : "Not quite. "}<Rich text={q.why} /></p>}
          </fieldset>
        );
      })}
    </div>
  );
}

function Reveal({ title, items }: Extract<Section, { kind: "reveal" }>) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  return (
    <div className={styles.reveal}>
      <span className="label">{title}</span>
      <div className={styles.revealGrid}>
        {items.map((it, i) => (
          <button key={i} type="button" className={`${styles.revealCard} ${open.has(i) ? styles.revealed : ""}`}
            onClick={() => setOpen((s) => new Set(s).add(i))} aria-expanded={open.has(i)}>
            <span lang="grc" className={styles.revealGr}>{it.grc}</span>
            <span className={styles.revealAns}>
              <span className={styles.revealText} aria-hidden={!open.has(i)}>{it.answer}</span>
              {!open.has(i) && <span className={styles.revealMark} aria-hidden="true">?</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RealPassage({ item, onWord }: { item: Extract<Section, { kind: "real" }>["items"][number]; onWord: (w: string, ctx: WordContext | null) => void }) {
  const [data, setData] = useState<LoadedPassage | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadPassage(item.work, item.ref).then(setData, (e: Error) => setError(e.message)); }, [item.work, item.ref]);

  // the metre, marked over the lines (published scansion where it exists, else the site's scanner)
  const [metre, setMetre] = useState<Map<string, (LineRender | null)[]> | null>(null);
  useEffect(() => {
    if (!data || !item.metre) return;
    let live = true;
    const kind = item.metre;
    (async () => {
      const idx = await metreIndex();
      const info = idx.texts[data.grc.urn];
      const [pub] = await Promise.all([publishedFor(data.grc.urn, !!info?.pack), loadLengths()]);
      if (live) setMetre(renderPassages(data.rows.flatMap((r) => r.greek), kind, (h) => pub.get(h), lineHash));
    })().catch(() => undefined);
    return () => { live = false; };
  }, [data, item.metre]);

  // highlight the first run of words that matches the quote
  useEffect(() => {
    if (!data) return;
    const clean = (w: string) => fold(w).replace(/[^\p{L}]/gu, "");
    const want = item.quote.split(/\s+/).map(clean).filter(Boolean);
    const spans = [...document.querySelectorAll<HTMLElement>(`[data-real="${item.work}:${item.ref}"] [data-w]`)];
    const words = spans.map((sp) => clean(sp.dataset.w!));
    for (let i = 0; i + want.length <= words.length; i++) {
      if (want.every((w, j) => words[i + j] === w)) { for (let j = 0; j < want.length; j++) spans[i + j].dataset.quote = "1"; break; }
    }
  }, [data, item.work, item.ref, item.quote]);

  const click = (e: React.MouseEvent) => {
    const beat = (e.target as HTMLElement).closest<HTMLElement>("[data-beat]");
    if (beat) { playLine(beat.closest<HTMLElement>(`.${readerStyles.line}`)!, { playing: readerStyles.playing, now: readerStyles.beatNow }); return; }
    const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    if (!w || !data) return;
    const unit = w.closest<HTMLElement>("[data-u]");
    const same = unit ? [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!)) : [];
    onWord(w.dataset.w!, unit ? { work: item.work, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: data.keys, depth: data.depth } : null);
  };

  return (
    <figure className={styles.real} data-real={`${item.work}:${item.ref}`}>
      <figcaption className={styles.realHead}>
        <b>{item.label}</b>
        <Link className="chip" href={`/read?w=${item.work}&at=${item.ref}`} transitionTypes={["page-turn"]}>Open in the reader →</Link>
      </figcaption>
      {error && <p className="muted">This passage could not be loaded ({error}).</p>}
      {!data && !error && <p className="muted">Unrolling the passage…</p>}
      {data && (
        <div className={styles.realBody}>
          <div className={`${readerStyles.grc} ${styles.realGr} ${metre ? `${readerStyles.metreOn} ${readerStyles.metreInset}` : ""}`} lang="grc" onClick={click}>
            {data.rows.flatMap((r) => r.greek).map((u) => (
              <div key={u.ref.join(".")} data-u={u.ref.join(".")}>
                <Blocks blocks={u.blocks.filter((b) => b.t !== "head")} greek keyPrefix={`lesson-${u.ref.join(".")}`}
                  metre={metre?.get(u.ref.join("."))?.filter((_, i) => u.blocks[i].t !== "head")} />
              </div>
            ))}
          </div>
          {data.tr && <div className={styles.realTr}><span className="label">{describe(data.tr)}</span><Blocks blocks={data.rows.flatMap((r) => r.trans).filter((b) => b.t !== "head")} greek={false} keyPrefix="lesson-tr" /></div>}
        </div>
      )}
      <p className={styles.realNote}><Rich text={item.note} /></p>
      <p className={styles.small}>Greek {data ? `from ${describe(data.grc)}, ` : ""}shown exactly as the source file gives it. <span className={styles.hoverOnly}>Click</span><span className={styles.touchOnly}>Tap</span> any word to look it up.</p>
    </figure>
  );
}

export function SectionView({ s, onWord }: { s: Section; onWord: (w: string, ctx: WordContext | null) => void }) {
  switch (s.kind) {
    case "p": return <p className={styles.lp}><Rich text={s.text} /></p>;
    case "alphabet": return <AlphabetGlance />;
    case "motion": return <Motion {...s} />;
    case "shift": return <Shift {...s} />;
    case "voice": return <Voice {...s} />;
    case "timeline": return <Timeline {...s} />;
    case "report": return <Report {...s} />;
    case "sigma": return <Sigma {...s} />;
    case "refer": return <Refer {...s} />;
    case "grid": return (
      <div className={styles.gridBox}>
        <span className="label">{s.title}</span>
        <div className={styles.gridScroll} tabIndex={0} role="region" aria-label={s.title}>
          <table className={styles.gridTable}>
            <thead><tr>{s.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => j === 0
                    ? <th key={j} scope="row"><Rich text={c} /></th>
                    : <td key={j} data-label={s.head[j]} className={c ? undefined : styles.gridNone}>{c ? <Rich text={c} /> : <span className={styles.gridEmpty} aria-label="not used">·</span>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {s.note && <p className={styles.small}><Rich text={s.note} /></p>}
      </div>
    );
    case "tip": return <aside className={styles.tipBox}><span className="label">Tip</span><p><Rich text={s.text} /></p></aside>;
    case "table": { const p = PARADIGMS.find((x) => x.id === s.paradigm); return p ? <ParadigmTable p={p} /> : null; }
    case "made": return (
      <div className={styles.made}>
        <span className="label">{s.title ?? "Practice sentences (made up for this lesson)"}</span>
        {s.items.map((it, i) => (
          <p key={i}><span lang="grc" className={styles.inlineGr}>{it.grc}</span> <span className="muted">{it.en}</span>{it.note && <span className={styles.small}> {it.note}</span>}</p>
        ))}
      </div>
    );
    case "reveal": return <Reveal {...s} />;
    case "links": return (
      <nav className={styles.guideLinks} aria-label="Go further">
        {s.items.map((l) => (
          <Link key={l.href} href={l.href} transitionTypes={["page-turn"]} className={styles.guideLink}>
            <b><Rich text={l.label} /></b>{l.note && <span className="muted"><Rich text={l.note} /></span>}<span aria-hidden="true" className={styles.guideArrow}>→</span>
          </Link>
        ))}
      </nav>
    );
    case "check": return <Check items={s.items} />;
    case "real": return (
      <div className={styles.realList}>
        <span className="label">{s.title ?? "From the texts"}</span>
        {s.items.map((it) => <RealPassage key={`${it.work}:${it.ref}`} item={it} onWord={onWord} />)}
      </div>
    );
  }
}

function LessonWords({ lesson }: { lesson: Lesson }) {
  const [glosses, setGlosses] = useState<Record<string, string>>({});
  const deck = useAcademy((s) => s.deck);
  const add = useAcademy((s) => s.addCard);
  const toast = useUI((s) => s.showToast);
  useEffect(() => {
    let live = true;
    Promise.all(lesson.words.map(async (w) => [w, (await coreEntry(w))?.def ?? (await lsjEntries(w).catch(() => null))?.entries[0]?.s ?? ""] as const))
      .then((r) => { if (live) setGlosses(Object.fromEntries(r)); });
    return () => { live = false; };
  }, [lesson]);
  const missing = lesson.words.filter((w) => !deck[w.normalize("NFC")]);
  return (
    <section className={styles.words}>
      <span className="label">Words from this lesson</span>
      <ul>
        {lesson.words.map((w) => (
          <li key={w}><span lang="grc" className={styles.inlineGr}>{w}</span> <span className="muted">{glosses[w] ?? "…"}</span>{deck[w.normalize("NFC")] && <span className={styles.inDeck}>in your deck</span>}</li>
        ))}
      </ul>
      {missing.length > 0 && (
        <button type="button" className="btn ghost" onClick={() => {
          for (const w of missing) add(w, glosses[w] ?? "", "lesson");
          toast(`Added ${missing.length} word${missing.length === 1 ? "" : "s"} to your daily review.`);
        }}>Add {missing.length === lesson.words.length ? "them" : `the other ${missing.length}`} to my daily review</button>
      )}
    </section>
  );
}

export default function LessonView({ lesson }: { lesson: Lesson }) {
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null } | null>(null);
  const done = useAcademy((s) => !!s.completed[lesson.id]);
  const complete = useAcademy((s) => s.completeLesson);
  const i = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[i + 1];

  return (
    <article className={styles.lesson}>
      <WarmUp lesson={lesson} />
      {lesson.sections.map((s, k) => <SectionView key={k} s={s} onWord={(w, ctx) => setWord({ w, ctx })} />)}
      <LessonWords lesson={lesson} />
      <LessonSteps lesson={lesson} />
      {!done && <button type="button" className={styles.markRead} onClick={() => complete(lesson.id)}>Mark as read, without the test</button>}
      {(done || next) && (
        <footer className={styles.lessonEnd}>
          {done && <p className={styles.good}>You have completed this lesson.</p>}
          {next && <Link className="btn ghost" href={`/academy/lesson/${next.id}`} transitionTypes={["page-turn"]}>Next: {next.title} →</Link>}
        </footer>
      )}
      {/* talk where you learn (Phase 11): a question about the lesson goes to the Agora's board for it */}
      {FORUM_OPEN && (
        <p className={styles.askLesson}>
          Stuck on something here? <Link href={`/town-hall/new?c=${i < 2 ? "beginners" : "grammar"}`} transitionTypes={["page-turn"]}>Ask in the Agora</Link>,
          in {i < 2 ? "Beginners' questions" : "Grammar help"}: no question is too small.
        </p>
      )}
      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onClose={() => setWord(null)} />
    </article>
  );
}

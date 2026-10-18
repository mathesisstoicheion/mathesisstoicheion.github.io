"use client";
/**
 * One lesson of the learn-by-reading path, in the form Noa agreed (2026-10-18). Every lesson stands on its own:
 *   1 the letters its line uses, then sounding out each word;
 *   2 the words, one card at a time (Greek first), then a matching check;
 *   3 building the sentence word by word, with its one piece of grammar where it comes up;
 *   4 reading it alone, then the English and what it means.
 * "Continue" then teaches the rest of the passage the same way, a piece of at most eight words at a time,
 * each sentence ending with the whole of it read together. Everything shown is in data/reading-path.ts.
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PATH, partText, type PathStep, type PathWord } from "@/data/reading-path";
import { LETTERS, DIPHTHONGS } from "@/data/alphabet";
import { transliterate } from "@/lib/translit";
import { useAcademy } from "@/lib/academy";
import { useSettings, prefersReducedMotion } from "@/lib/settings";
import Rich from "./Rich";
import { pathKey } from "./ReadingPath";
import styles from "./Academy.module.css";
import w from "./Workout.module.css";
import readerStyles from "@/components/reader/Reader.module.css";

// the full alphabet, for when one is forgotten: loaded only when the learner opens it
const AlphabetGlance = dynamic(() => import("./AlphabetGlance"));

/** One thing taught in the five stages: the line itself, or one piece of a passage sentence. */
interface Unit {
  key: string;
  label: string;
  words: PathWord[];
  learn: { title: string; text: string[]; at?: number };
  /** what ends it: the whole line or sentence, its English and its meaning (none for a piece mid-sentence) */
  end?: { whole?: string; parts: { gr: string; en: string }[]; translator: string; meaning: string[] };
}

function units(step: PathStep): Unit[] {
  const out: Unit[] = [{
    key: "line", label: step.label, words: step.parts.flatMap((p) => p.words), learn: step.learn,
    end: { parts: step.parts.map((p) => ({ gr: partText(p), en: p.en })), translator: step.translator, meaning: step.meaning },
  }];
  step.passage?.sentences.forEach((s, si) => s.pieces.forEach((p, pi) => {
    const last = pi === s.pieces.length - 1;
    out.push({
      key: `s${si}p${pi}`,
      label: `The passage: sentence ${si + 1} of ${step.passage!.sentences.length}${s.pieces.length > 1 ? `, piece ${pi + 1} of ${s.pieces.length}` : ""}`,
      words: p.words, learn: p.learn,
      end: last ? {
        whole: s.pieces.length > 1 ? s.pieces.map((q) => partText({ words: q.words, en: "" })).join(" ") : undefined,
        parts: [{ gr: s.pieces.map((q) => partText({ words: q.words, en: "" })).join(" "), en: s.en }], translator: step.translator, meaning: s.meaning,
      } : undefined,
    });
  }));
  return out;
}

const STAGES = ["The letters", "The words", "Build the sentence", "Read it yourself"];
const tap = <><span className={styles.hoverOnly}>Click</span><span className={styles.touchOnly}>Tap</span></>;
const tapLc = <><span className={styles.hoverOnly}>click</span><span className={styles.touchOnly}>tap</span></>;
/** letters a beginner reading English is likely to misread, and why */
const TRICKY: Record<string, string> = {
  η: "it looks like an English n, but it is a vowel, a long e.",
  ν: "it looks like an English v, but it is an n.",
  ρ: "it looks like an English p, but it is an r.",
  χ: "it looks like an English x, but it is a different sound.",
  ω: "it looks like an English w, but it is a vowel, a long o.",
  υ: "it looks like an English u or v, but it is a vowel.",
  γ: "it looks a little like an English y, but it is a g.",
  θ: "one letter, though our letters spell it th.",
  φ: "one letter, though our letters spell it ph.",
  ψ: "one letter for two sounds, ps.",
  ξ: "one letter for two sounds, ks.",
  ζ: "one letter for two sounds.",
};
const bare = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/ς/g, "σ");

/* 1 · the letters this line uses, and sounding out each word */
function LettersStage({ words, onNext }: { words: PathWord[]; onNext: () => void }) {
  const pron = useSettings((s) => s.pron);
  const [sel, setSel] = useState<number | null>(null);
  const [said, setSaid] = useState<Set<number>>(new Set());
  const forms = words.map((x) => x.form);
  const text = forms.join(" ");
  const notes = useMemo(() => {
    const nfd = text.normalize("NFD"), b = bare(text), n: string[] = [];
    // the letters of this line a beginner could misread, each with a word of the line it is in
    for (const L of LETTERS) {
      const why = TRICKY[L.lower];
      const inWord = forms.find((f) => bare(f).includes(L.lower));
      if (why && inWord) n.push(`«${L.lower}», ${L.name}, as in «${inWord}»: ${why} Its sound: ${L.sounds[pron].say}.`);
    }
    if (nfd.includes("̔")) n.push("A word that starts with a vowel carries a breathing mark on it. The rough breathing, «ʽ», is an *h*: " + forms.filter((f) => f.normalize("NFD").includes("̔")).map((f) => `«${f}» is *${transliterate(f)}*`).join(", ") + ".");
    if (nfd.includes("̓")) n.push("The smooth breathing, «ʼ», on a first vowel is no sound at all.");
    if (/[́̀͂]/.test(nfd)) n.push("The marks «ά», «ὰ» and «ᾶ» are accents. For now, read past them.");
    for (const d of DIPHTHONGS) if (!d.spelling.includes(" ") && b.includes(d.spelling)) n.push(`«${d.spelling}» is one sound: ${d.sounds[pron].say}.`);
    if (nfd.includes("\u0345")) { const d = DIPHTHONGS.find((x) => x.spelling.includes("ῳ"))!; n.push(`The little «ι» written under a vowel, as in «ῳ», is part of the sound: ${d.sounds[pron].say}.`); }
    if (text.includes("ς")) n.push("«σ» is written «ς» at the end of a word.");
    return n;
  }, [text, forms, pron]);
  const L = sel === null ? null : LETTERS[sel];
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={styles.small}>The 24 letters. {tap} one to see how it sounds. Below, the letters of this line to watch out for.</p>
      <div className={styles.alphaGrid} role="listbox" aria-label="The 24 letters">
        {LETTERS.map((L, i) => (
          <button key={L.name} type="button" role="option" aria-selected={i === sel} onClick={() => setSel(i === sel ? null : i)}
            className={`${styles.tile} ${L.vowel ? styles.vowelTile : ""}`}>
            <span className={styles.tileGlyph} lang="grc">{L.upper}{L.lower}{L.final ?? ""}</span>
            <span className={styles.tileName}>{L.name}</span>
          </button>
        ))}
      </div>
      {L && <p className={styles.tipBox} aria-live="polite"><span><b>{L.name}</b> <span lang="grc" className={styles.inlineGr}>{L.lower}</span>: {L.sounds[pron].say}</span></p>}
      {notes.length > 0 && <aside className={styles.tipBox}><span className="label">Good to know</span>{notes.map((t, i) => <p key={i}><Rich text={t} /></p>)}</aside>}
      <span className="label">Sound out each word</span>
      <p className={styles.small}>Say each word aloud, letter by letter, then {tapLc} it to check yourself.</p>
      <div className={styles.revealGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 160px), 1fr))" }}>
        {forms.map((f, i) => (
          <button key={i} type="button" className={`${styles.revealCard} ${said.has(i) ? styles.revealed : ""}`}
            onClick={() => setSaid((s) => new Set(s).add(i))} aria-expanded={said.has(i)}>
            <span lang="grc" className={styles.revealGr}>{f}</span>
            <span className={styles.revealAns}>
              <span className={styles.revealText} aria-hidden={!said.has(i)}>{transliterate(f)}</span>
              {!said.has(i) && <span className={styles.revealMark} aria-hidden="true">?</span>}
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>On to the words →</button>
    </section>
  );
}

/* 2 · word cards, Greek first, then a check: which meaning goes with each word */
function WordsStage({ words, onNext }: { words: PathWord[]; onNext: () => void }) {
  const cards = useMemo(() => words.filter((x, i) => words.findIndex((y) => y.form === x.form && y.here === x.here) === i), [words]);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [checking, setChecking] = useState(false);
  if (checking) return <MatchCheck cards={cards} onNext={onNext} />;
  const c = cards[i];
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={styles.small}>Word {i + 1} of {cards.length}. Look at the Greek, say it, and try to guess what it means before you look.</p>
      <div className={w.card}>
        <p lang="grc" className={styles.revealGr} style={{ fontSize: "clamp(2.2rem, 7vw, 3.2rem)" }}>{c.form}</p>
        {shown ? (
          <div aria-live="polite" style={{ display: "grid", gap: 8 }}>
            <p style={{ fontSize: "1.2rem" }}><b>{c.here}</b></p>
            <p className="muted">{c.form_note}.</p>
            <p className={styles.small}>In the dictionary: <span lang="grc" className={styles.inlineGr}>{c.lemma}</span>, “{c.dict}” ({c.src === "DCC" ? "DCC core list" : "LSJ"}).</p>
          </div>
        ) : <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setShown(true)}>Show the meaning</button>}
      </div>
      {shown && (i < cards.length - 1
        ? <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => { setI(i + 1); setShown(false); }}>Next word →</button>
        : <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setChecking(true)}>Check yourself →</button>)}
    </section>
  );
}

function MatchCheck({ cards, onNext }: { cards: PathWord[]; onNext: () => void }) {
  // the words in a fixed shuffled order (the same each visit), and for each up to four meanings to choose from
  const order = useMemo(() => cards.map((_, i) => i).sort((a, b) => ((a * 7 + 3) % 11) - ((b * 7 + 3) % 11)), [cards]);
  const [k, setK] = useState(0);
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [right, setRight] = useState(false);
  const done = k >= order.length;
  const c = done ? null : cards[order[k]];
  const options = useMemo(() => {
    if (!c) return [];
    const others = [...new Set(cards.map((x) => x.here).filter((h) => h !== c.here))];
    const pick = others.sort((a, b) => (a.length * 3 + k) % 5 - (b.length * 3 + k) % 5).slice(0, 3);
    return [...pick, c.here].sort((a, b) => (a.charCodeAt(0) + k) % 7 - (b.charCodeAt(0) + k) % 7);
  }, [c, cards, k]);
  if (done) return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={`${w.feedback} ${w.fbGood}`}><b>All {cards.length} words matched.</b> Now put them together.</p>
      <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>On to the sentence →</button>
    </section>
  );
  const choose = (o: string) => {
    if (right) return;
    if (o !== c!.here) { setWrong((s) => new Set(s).add(o)); return; }
    setRight(true);
    setTimeout(() => { setK((n) => n + 1); setRight(false); setWrong(new Set()); }, 650);
  };
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={styles.small}>Check yourself: {k + 1} of {order.length}.</p>
      <div className={w.card}>
        <p className={w.prompt}><span lang="grc">{c!.form}</span> means…</p>
        <div className={w.options} role="group" aria-label="Meanings">
          {options.map((o) => (
            <button key={o} type="button" onClick={() => choose(o)} disabled={wrong.has(o)}
              className={right && o === c!.here ? w.right : wrong.has(o) ? w.wrong : ""}>{o}</button>
          ))}
        </div>
        {wrong.size > 0 && !right && <p className={styles.small}>Not that one. Try again.</p>}
      </div>
    </section>
  );
}

/* 3 · building the sentence, word by word */
function BuildStage({ unit, onNext }: { unit: Unit; onNext: () => void }) {
  const ws = unit.words;
  const [n, setN] = useState(0); // words shown so far
  const at = unit.learn.at ?? ws.length - 1;
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={styles.small}>One word at a time: say what the lit word means, then {tapLc} <i>Show</i> to check.</p>
      <p lang="grc" className={styles.realGr} style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", lineHeight: 1.3 }}>
        {ws.map((x, i) => (
          <span key={i} style={{ display: "inline-grid", justifyItems: "center", gap: 2, opacity: i > n ? 0.45 : 1 }}>
            <span className={readerStyles.w} data-quote={i === n ? "1" : undefined}>{x.form}{x.after}</span>
            <span lang="en" className={styles.small} style={{ visibility: i < n ? "visible" : "hidden", fontFamily: "var(--f-body)" }}>{x.here}</span>
          </span>
        ))}
      </p>
      {n < ws.length
        ? <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setN(n + 1)}>Show: <span lang="grc">{ws[n].form}</span></button>
        : null}
      {n > at && (
        <aside className={styles.tipBox} aria-live="polite">
          <span className="label">The grammar: {unit.learn.title}</span>
          {unit.learn.text.map((t, i) => <p key={i}><Rich text={t} /></p>)}
        </aside>
      )}
      {n >= ws.length && <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>Now read it yourself →</button>}
    </section>
  );
}

/* 4 · reading it alone; then the English and what it means */
function ReadStage({ unit, onDone, doneLabel }: { unit: Unit; onDone: () => void; doneLabel: string }) {
  const [whole, setWhole] = useState(false);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const end = unit.end;
  const all = !!end && open.size === end.parts.length;
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <p lang="grc" className={`${styles.realGr} ${styles.revealGr}`} style={{ lineHeight: 1.6 }}>{partText({ words: unit.words, en: "" })}</p>
      <p className={styles.small}>Read it in your head from start to end, without help. If you get stuck, go back a stage with the buttons above.</p>
      {end?.whole && !whole && <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setWhole(true)}>That was the last piece: now the whole sentence →</button>}
      {end?.whole && whole && (
        <>
          <span className="label">The whole sentence</span>
          <p lang="grc" className={`${styles.realGr} ${styles.revealGr}`} style={{ lineHeight: 1.6 }}>{end.whole}</p>
          <p className={styles.small}>Every piece of it is one you have just read. Read it through.</p>
        </>
      )}
      {end && (!end.whole || whole) && (
        <>
          <p className={styles.small}>When you have tried, check yourself against a published translation{end.parts.length > 1 ? ", one part at a time" : ""}.</p>
          <div className={styles.revealGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}>
            {end.parts.map((p, i) => (
              <button key={i} type="button" className={`${styles.revealCard} ${open.has(i) ? styles.revealed : ""}`}
                onClick={() => setOpen((s) => new Set(s).add(i))} aria-expanded={open.has(i)}>
                <span className="label">{end.parts.length > 1 ? <>Part {i + 1}: <span lang="grc" style={{ textTransform: "none", letterSpacing: 0 }}>{p.gr}</span></> : "The English"}</span>
                <span className={styles.revealAns}>
                  <span className={styles.revealText} aria-hidden={!open.has(i)}>{p.en}</span>
                  {!open.has(i) && <span className={styles.revealMark} aria-hidden="true">?</span>}
                </span>
              </button>
            ))}
          </div>
          {all && <p className={styles.small}>Translation by {end.translator}, as the library gives it.</p>}
          {all && (
            <aside className={styles.tipBox} aria-live="polite">
              <span className="label">What it means</span>
              {end.meaning.map((t, i) => <p key={i}><Rich text={t} /></p>)}
            </aside>
          )}
        </>
      )}
      {(!end || all) && <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onDone}>{doneLabel}</button>}
    </section>
  );
}

function UnitView({ unit, onDone, doneLabel }: { unit: Unit; onDone: () => void; doneLabel: string }) {
  const [stage, setStage] = useState(0);
  const [reached, setReached] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const go = (s: number) => {
    setStage(s); setReached((r) => Math.max(r, s));
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: prefersReducedMotion(useSettings.getState().motion) ? "auto" : "smooth" });
  };
  return (
    <div ref={top} style={{ display: "grid", gap: 16, scrollMarginTop: 90 }}>
      <div className={styles.seg} role="radiogroup" aria-label="Stages of this lesson" style={{ justifySelf: "start" }}>
        {STAGES.map((t, i) => (
          <button key={t} type="button" role="radio" aria-checked={stage === i} disabled={i > reached} onClick={() => go(i)}
            style={i > reached ? { opacity: 0.45 } : undefined}>{i + 1} · {t}</button>
        ))}
      </div>
      {stage === 0 && <LettersStage words={unit.words} onNext={() => go(1)} />}
      {stage === 1 && <WordsStage words={unit.words} onNext={() => go(2)} />}
      {stage === 2 && <BuildStage unit={unit} onNext={() => go(3)} />}
      {stage === 3 && <ReadStage unit={unit} onDone={onDone} doneLabel={doneLabel} />}
    </div>
  );
}

export default function PathStepView({ step }: { step: PathStep }) {
  const n = PATH.findIndex((s) => s.id === step.id) + 1;
  const next = PATH[n];
  const all = useMemo(() => units(step), [step]);
  const [u, setU] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const done = useAcademy((s) => !!s.completed[pathKey(step.id)]);
  const complete = useAcademy((s) => s.completeLesson);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { if (u > 0) box.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion(useSettings.getState().motion) ? "auto" : "smooth" }); }, [u]);

  const unit = all[u];
  const finishLine = () => { complete(pathKey(step.id)); setAtEnd(true); };
  const nextLabel = u === 0 ? "Done with the line →" : u === all.length - 1 ? "Finish the passage →" : unit.end ? "Next sentence →" : "Next piece →";

  return (
    <article className={styles.lesson}>
      <section style={{ display: "grid", gap: 12 }}>
        <span className="label">Where you are</span>
        {step.where.map((t, i) => <p key={i} className={styles.lp}><Rich text={t} /></p>)}
      </section>

      <AlphabetFold />

      <figure ref={box} className={styles.real} style={{ scrollMarginTop: 90 }}>
        <figcaption className={styles.realHead}>
          <span className="label">{unit.label}</span>
          <Link className="chip" href={`/read?w=${step.work}&at=${step.ref}`} transitionTypes={["page-turn"]}>In the reader →</Link>
        </figcaption>
        {atEnd ? (
          <div style={{ display: "grid", gap: 14 }}>
            {u === 0 && step.passage ? (
              <>
                <p className={styles.lp}><Rich text={step.passage.intro} /></p>
                <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => { setAtEnd(false); setU(1); }}>Continue: read the passage →</button>
              </>
            ) : <p className={styles.good}>{u === 0 ? "You have read the line." : "You have read the passage."}</p>}
          </div>
        ) : (
          <UnitView key={unit.key} unit={unit} doneLabel={nextLabel}
            onDone={() => { if (u === 0) finishLine(); else if (u === all.length - 1) setAtEnd(true); else setU(u + 1); }} />
        )}
      </figure>

      <footer className={styles.lessonEnd}>
        {done ? <p className={styles.good}>You have read this lesson.</p> : <span />}
        {next
          ? <Link className="btn ghost" href={`/academy/reading/${next.id}`} transitionTypes={["page-turn"]}>Next lesson: {next.title} →</Link>
          : <Link className="btn ghost" href={`/read?w=${step.work}&at=${step.ref}`} transitionTypes={["page-turn"]}>Read on in the Metaphysics →</Link>}
      </footer>

      <details>
        <summary className="label" style={{ cursor: "pointer" }}>Extras, if you are curious: the places and people of this lesson</summary>
        <nav className={styles.guideLinks} aria-label="Extras" style={{ marginTop: 12 }}>
          {step.links.map((l) => (
            <Link key={l.href} href={l.href} transitionTypes={["page-turn"]} className={styles.guideLink}>
              <b>{l.label}</b>{l.note && <span className="muted">{l.note}</span>}<span aria-hidden="true" className={styles.guideArrow}>→</span>
            </Link>
          ))}
        </nav>
      </details>
    </article>
  );
}

function AlphabetFold() {
  const [open, setOpen] = useState(false);
  return (
    <details onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="label" style={{ cursor: "pointer" }}>Forgot how a letter is read? The whole alphabet</summary>
      {open && <div style={{ marginTop: 12 }}><AlphabetGlance /></div>}
    </details>
  );
}

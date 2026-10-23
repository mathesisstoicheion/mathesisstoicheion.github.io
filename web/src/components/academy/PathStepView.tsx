"use client";
/**
 * One lesson of the learn-by-reading path, in the form Noa agreed (2026-10-18):
 *   1 the letters its line uses, then sounding out each word;
 *   2 the words, one card at a time (Greek first), then a matching check;
 *   3 building the sentence word by word, with its one piece of grammar where it comes up;
 *   4 reading it alone, then the English and what it means.
 * "Continue" then teaches the rest of the passage the same way, a piece of at most eight words at a time,
 * each sentence ending with the whole of it read together. Everything shown is in data/reading-path.ts.
 * The help fades every three lessons (pathLevel): the letters stage goes, then you guess each meaning and build
 * the sentence yourself, then words you have met get no card and you put the English in order before it shows.
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PATH, PRACTICE, pathKey, passageKey, partText, pathLevel, knownBefore, type PathStep, type PathWord, type PathSentence } from "@/data/reading-path";
import { LETTERS, DIPHTHONGS } from "@/data/alphabet";
import { transliterate } from "@/lib/translit";
import { useAcademy } from "@/lib/academy";
import { useSettings, prefersReducedMotion } from "@/lib/settings";
import Rich from "./Rich";
import styles from "./Academy.module.css";
import w from "./Workout.module.css";
import readerStyles from "@/components/reader/Reader.module.css";

// the full alphabet, for when one is forgotten: loaded only when the learner opens it
const AlphabetGlance = dynamic(() => import("./AlphabetGlance"));

/** One thing taught in the five stages: the line itself, or one piece of a passage sentence. */
export interface Unit {
  key: string;
  label: string;
  words: PathWord[];
  learn: { title: string; text: string[]; at?: number };
  /** what ends it: the whole line or sentence, its English and its meaning (none for a piece mid-sentence) */
  end?: { whole?: string; parts: { gr: string; en: string }[]; translator: string; meaning: string[] };
}

/** The units of a run of sentences, each piece one unit, the last piece of each ending with the whole sentence. */
export function sentenceUnits(ss: PathSentence[], label: (si: number, pi: number) => string, translator: (si: number) => string, prefix = "s"): Unit[] {
  const out: Unit[] = [];
  ss.forEach((s, si) => s.pieces.forEach((p, pi) => {
    const last = pi === s.pieces.length - 1;
    const whole = s.pieces.map((q) => partText({ words: q.words, en: "" })).join(" ");
    out.push({
      key: `${prefix}${si}p${pi}`, label: label(si, pi), words: p.words, learn: p.learn,
      end: last ? { whole: s.pieces.length > 1 ? whole : undefined, parts: [{ gr: whole, en: s.en }], translator: translator(si), meaning: s.meaning } : undefined,
    });
  }));
  return out;
}

function units(step: PathStep): Unit[] {
  const ss = step.passage?.sentences ?? [];
  return [
    {
      key: "line", label: step.label, words: step.parts.flatMap((p) => p.words), learn: step.learn,
      end: { parts: step.parts.map((p) => ({ gr: partText(p), en: p.en })), translator: step.translator, meaning: step.meaning },
    },
    ...sentenceUnits(ss, (si, pi) => `The passage: sentence ${si + 1} of ${ss.length}${ss[si].pieces.length > 1 ? `, piece ${pi + 1} of ${ss[si].pieces.length}` : ""}`,
      () => step.passage!.translator ?? step.translator),
  ];
}

const STAGES = ["The letters", "The words", "Build the sentence", "Read it yourself"];
/** what each level of help asks of the learner, said once at the top of the lesson */
export const LEVEL_NOTE = [
  "",
  "From this lesson on there is no letters stage: sound each word out yourself. The alphabet is still in the fold above.",
  "From this lesson on you guess each word's meaning before its card shows it, and you build the sentence yourself.",
  "From this lesson on, words you have already met get no card, and you put the English in order before the translation shows.",
];
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

/** Up to four meanings to choose from for one word: its own and three others from `pool`, in an order fixed for each `k`. */
function choicesFor(c: PathWord, pool: string[], k: number) {
  const others = [...new Set(pool.filter((h) => h !== c.here))];
  const pick = others.sort((a, b) => (a.length * 3 + k) % 5 - (b.length * 3 + k) % 5).slice(0, 3);
  return [...pick, c.here].sort((a, b) => (a.charCodeAt(0) + k) % 7 - (b.charCodeAt(0) + k) % 7);
}

/** Pick the right meaning of one word; wrong picks are greyed out until the right one is found. */
function Choices({ c, pool, k, onRight }: { c: PathWord; pool: string[]; k: number; onRight: () => void }) {
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [right, setRight] = useState(false);
  const options = useMemo(() => choicesFor(c, pool, k), [c, pool, k]);
  const choose = (o: string) => {
    if (right) return;
    if (o !== c.here) { setWrong((s) => new Set(s).add(o)); return; }
    setRight(true);
    onRight();
  };
  return (
    <>
      <div className={w.options} role="group" aria-label="Meanings">
        {options.map((o) => (
          <button key={o} type="button" onClick={() => choose(o)} disabled={wrong.has(o)}
            className={right && o === c.here ? w.right : wrong.has(o) ? w.wrong : ""}>{o}</button>
        ))}
      </div>
      {wrong.size > 0 && !right && <p className={styles.small}>Not that one. Try again.</p>}
    </>
  );
}

const dedupe = (ws: PathWord[]) => ws.filter((x, i) => ws.findIndex((y) => y.form === x.form && y.here === x.here) === i);

/* 2 · word cards, Greek first, then a check: which meaning goes with each word.
   From level 2 you guess each meaning before its card shows; from level 3 words already met get no card. */
function WordsStage({ words, level, known, pool, onNext }: { words: PathWord[]; level: number; known: Set<string>; pool: string[]; onNext: () => void }) {
  const unique = useMemo(() => dedupe(words), [words]);
  const cards = useMemo(() => (level >= 3 ? unique.filter((x) => !known.has(x.lemma)) : unique), [unique, level, known]);
  const met = level >= 3 ? unique.filter((x) => known.has(x.lemma)) : [];
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [checking, setChecking] = useState(false);
  const metNote = met.length > 0 && (
    <p className={styles.small}>
      You have met {met.length === 1 ? "this word" : "these words"} before, so {met.length === 1 ? "it gets" : "they get"} no card:{" "}
      {met.map((x, j) => <span key={j}>{j > 0 && ", "}<span lang="grc" className={styles.inlineGr}>{x.form}</span></span>)}.
      If you forget one, {tapLc} it in the next stage.
    </p>
  );
  if (cards.length === 0) return (
    <section style={{ display: "grid", gap: 14 }}>
      {metNote}
      <p className={styles.good}>You know every word of this piece already.</p>
      <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>On to the sentence →</button>
    </section>
  );
  if (checking) return <MatchCheck cards={cards} pool={pool} onNext={onNext} />;
  const c = cards[i];
  const guess = level >= 2;
  const last = i === cards.length - 1;
  return (
    <section style={{ display: "grid", gap: 14 }}>
      {i === 0 && metNote}
      <p className={styles.small}>
        Word {i + 1} of {cards.length}.{" "}
        {guess ? "Sound it out, then pick what you think it means: the card opens when you find it."
          : level >= 1 ? "Sound it out yourself, then try to guess what it means before you look."
          : "Look at the Greek, say it, and try to guess what it means before you look."}
      </p>
      <div className={w.card}>
        <p lang="grc" className={styles.revealGr} style={{ fontSize: "clamp(2.2rem, 7vw, 3.2rem)" }}>{c.form}</p>
        {guess && !shown && <Choices key={i} c={c} pool={pool} k={i} onRight={() => setTimeout(() => setShown(true), 500)} />}
        {shown ? (
          <div aria-live="polite" style={{ display: "grid", gap: 8 }}>
            <p style={{ fontSize: "var(--step-1)" }}><b>{c.here}</b></p>
            <p className="muted">{c.form_note}.</p>
            <p className={styles.small}>In the dictionary: <span lang="grc" className={styles.inlineGr}>{c.lemma}</span>, “{c.dict}” ({c.src === "DCC" ? "DCC core list" : "LSJ"}).</p>
          </div>
        ) : !guess && <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setShown(true)}>Show the meaning</button>}
      </div>
      {shown && (!last
        ? <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => { setI(i + 1); setShown(false); }}>Next word →</button>
        : guess
          ? <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>On to the sentence →</button>
          : <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setChecking(true)}>Check yourself →</button>)}
    </section>
  );
}

/** Match each word to its meaning, in a fixed shuffled order (the same each visit); distractors come from `pool`. */
export function MatchCheck({ cards, pool, onNext, nextLabel = "On to the sentence →", doneText = "Now put them together." }:
  { cards: PathWord[]; pool: string[]; onNext: () => void; nextLabel?: string; doneText?: string }) {
  const order = useMemo(() => cards.map((_, i) => i).sort((a, b) => ((a * 7 + 3) % 11) - ((b * 7 + 3) % 11)), [cards]);
  const [k, setK] = useState(0);
  if (k >= order.length) return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={`${w.feedback} ${w.fbGood}`}><b>All {cards.length} words matched.</b> {doneText}</p>
      <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>{nextLabel}</button>
    </section>
  );
  const c = cards[order[k]];
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={styles.small}>Check yourself: {k + 1} of {order.length}.</p>
      <div className={w.card}>
        <p className={w.prompt}><span lang="grc">{c.form}</span> means…</p>
        <Choices key={k} c={c} pool={pool} k={k} onRight={() => setTimeout(() => setK((n) => n + 1), 650)} />
      </div>
    </section>
  );
}

/* 3 · building the sentence: guided word by word, or from level 2 on your own, tapping a word for its meaning */
function BuildStage({ unit, level, onNext }: { unit: Unit; level: number; onNext: () => void }) {
  const ws = unit.words;
  const [n, setN] = useState(0); // words shown so far (guided)
  const [peek, setPeek] = useState<Set<number>>(new Set()); // words looked up (on your own)
  const [gram, setGram] = useState(false);
  const at = unit.learn.at ?? ws.length - 1;
  const grammar = (
    <aside className={styles.tipBox} aria-live="polite">
      <span className="label">The grammar: {unit.learn.title}</span>
      {unit.learn.text.map((t, i) => <p key={i}><Rich text={t} /></p>)}
    </aside>
  );
  if (level >= 2) return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={styles.small}>Work out what it says yourself, word by word. If you forget a word, {tapLc} it for its meaning.</p>
      <p lang="grc" className={styles.realGr} style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", lineHeight: 1.3 }}>
        {ws.map((x, i) => (
          <span key={i} style={{ display: "inline-grid", justifyItems: "center", gap: 2 }}>
            <button type="button" className={readerStyles.w} aria-expanded={peek.has(i)}
              onClick={() => setPeek((s) => { const t = new Set(s); if (t.has(i)) t.delete(i); else t.add(i); return t; })}
              style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "inherit" }}>{x.form}{x.after}</button>
            <span lang="en" className={styles.small} style={{ visibility: peek.has(i) ? "visible" : "hidden", fontFamily: "var(--f-body)" }}>{x.here}</span>
          </span>
        ))}
      </p>
      {gram ? grammar : <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={() => setGram(true)}>Stuck? The grammar here: {unit.learn.title}</button>}
      <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>Now read it yourself →</button>
    </section>
  );
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
      {n > at && grammar}
      {n >= ws.length && <button type="button" className="btn ghost" style={{ justifySelf: "start" }} onClick={onNext}>Now read it yourself →</button>}
    </section>
  );
}

/** The published English cut into a few pieces: at its commas and semicolons, the longest halved until there are three. */
export function englishPieces(en: string): string[] {
  const c = en.split(/(?<=[,;:])\s+/).filter(Boolean);
  while (c.length < 3) {
    const i = c.reduce((b, x, j) => (x.split(" ").length > c[b].split(" ").length ? j : b), 0);
    const ws = c[i].split(" ");
    if (ws.length < 4) break;
    const h = Math.ceil(ws.length / 2);
    c.splice(i, 1, ws.slice(0, h).join(" "), ws.slice(h).join(" "));
  }
  return c;
}

/* level 3: put the pieces of the English in order; then the translation shows */
function OrderEnglish({ en, onDone }: { en: string; onDone: () => void }) {
  const pieces = useMemo(() => englishPieces(en), [en]);
  const shuffled = useMemo(() => {
    const o = pieces.map((_, i) => i).sort((a, b) => ((a * 5 + 2) % 7) - ((b * 5 + 2) % 7));
    return o.every((x, i) => x === i) ? o.reverse() : o;
  }, [pieces]);
  const [placed, setPlaced] = useState(0);
  const [miss, setMiss] = useState<number | null>(null);
  const tapPiece = (i: number) => {
    if (i !== placed) { setMiss(i); setTimeout(() => setMiss(null), 400); return; }
    setPlaced(placed + 1);
    if (placed + 1 === pieces.length) setTimeout(onDone, 500);
  };
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <p className={styles.small}>Here is the published English, in pieces. {tap} them in the order that matches the Greek.</p>
      <p className={styles.lp} style={{ minHeight: "1.6em" }} aria-live="polite">{pieces.slice(0, placed).join(" ")}{placed < pieces.length && <span className="muted"> …</span>}</p>
      <div className={w.options} role="group" aria-label="Pieces of the English">
        {shuffled.filter((i) => i >= placed).map((i) => (
          <button key={i} type="button" onClick={() => tapPiece(i)} className={miss === i ? w.wrong : ""}>{pieces[i]}</button>
        ))}
      </div>
    </section>
  );
}

/* 4 · reading it alone; then the English and what it means */
function ReadStage({ unit, level, onDone, doneLabel }: { unit: Unit; level: number; onDone: () => void; doneLabel: string }) {
  const [whole, setWhole] = useState(false);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const end = unit.end;
  const toOrder = level >= 3 && !!end && englishPieces(end.parts.map((p) => p.en).join(" ")).length > 1;
  const [ordered, setOrdered] = useState(false);
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
      {end && (!end.whole || whole) && toOrder && !ordered && (
        <OrderEnglish en={end.parts.map((p) => p.en).join(" ")} onDone={() => { setOrdered(true); setOpen(new Set(end.parts.map((_, i) => i))); }} />
      )}
      {end && (!end.whole || whole) && (!toOrder || ordered) && (
        <>
          <p className={styles.small}>{toOrder ? "That is the order. Here is the translation as published." : <>When you have tried, check yourself against a published translation{end.parts.length > 1 ? ", one part at a time" : ""}.</>}</p>
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

/** One unit through its stages, with as much help as its `level` gives (no letters stage from level 1). */
export function UnitView({ unit, level, known, pool, onDone, doneLabel }:
  { unit: Unit; level: number; known: Set<string>; pool: string[]; onDone: () => void; doneLabel: string }) {
  const stages = level >= 1 ? [1, 2, 3] : [0, 1, 2, 3];
  const [stage, setStage] = useState(stages[0]);
  const [reached, setReached] = useState(stages[0]);
  const top = useRef<HTMLDivElement>(null);
  const go = (s: number) => {
    setStage(s); setReached((r) => Math.max(r, s));
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: prefersReducedMotion(useSettings.getState().motion) ? "auto" : "smooth" });
  };
  return (
    <div ref={top} style={{ display: "grid", gap: 16, scrollMarginTop: 90 }}>
      <div className={styles.seg} role="radiogroup" aria-label="Stages of this lesson" style={{ justifySelf: "start" }}>
        {stages.map((i, j) => (
          <button key={i} type="button" role="radio" aria-checked={stage === i} disabled={i > reached} onClick={() => go(i)}
            style={i > reached ? { opacity: 0.45 } : undefined}>{j + 1} · {STAGES[i]}</button>
        ))}
      </div>
      {stage === 0 && <LettersStage words={unit.words} onNext={() => go(1)} />}
      {stage === 1 && <WordsStage words={unit.words} level={level} known={known} pool={pool} onNext={() => go(2)} />}
      {stage === 2 && <BuildStage unit={unit} level={level} onNext={() => go(3)} />}
      {stage === 3 && <ReadStage unit={unit} level={level} onDone={onDone} doneLabel={doneLabel} />}
    </div>
  );
}

/** For each unit, the dictionary forms met before it: in earlier lessons (`base`), then in this lesson's earlier units. */
export function knownByUnit(all: Unit[], base: Set<string>): Set<string>[] {
  const out: Set<string>[] = [];
  let k = new Set(base);
  for (const u of all) { out.push(k); k = new Set(k); for (const x of u.words) k.add(x.lemma); }
  return out;
}

export default function PathStepView({ step }: { step: PathStep }) {
  const idx = PATH.findIndex((s) => s.id === step.id);
  const n = idx + 1;
  const level = pathLevel(idx);
  const practiceNext = PRACTICE.find((p) => p.after === step.id);
  const next = PATH[n];
  const all = useMemo(() => units(step), [step]);
  const known = useMemo(() => knownByUnit(all, knownBefore(idx)), [all, idx]);
  const pool = useMemo(() => all.flatMap((x) => x.words.map((y) => y.here)), [all]);
  const [u, setU] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const completed = useAcademy((s) => s.completed);
  const done = !!completed[pathKey(step.id)];
  const missing = PATH.slice(0, idx).map((s, i) => ({ s, i })).filter(({ s }) => !completed[pathKey(s.id)]);
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
        {level > 0 && idx % 3 === 0 && <p className={styles.small}>{LEVEL_NOTE[level]} The help you have outgrown is kept under <Link href="/academy/reading#completed" transitionTypes={["page-turn"]}>Lessons completed</Link>.</p>}
        {missing.length > 0 && (
          <p className={styles.small}>
            This lesson takes for granted the lessons before it. Not done yet:{" "}
            {missing.map(({ s, i }, j) => <span key={s.id}>{j > 0 && ", "}<Link href={`/academy/reading/${s.id}`} transitionTypes={["page-turn"]}>{i + 1} {s.title}</Link></span>)}.
          </p>
        )}
      </section>

      <AlphabetFold />

      <figure ref={box} className={styles.real} style={{ scrollMarginTop: 90 }}>
        <figcaption className={styles.realHead}>
          <span className="label">{unit.label}</span>
          <Link className="chip" href={u > 0 && step.passage?.work ? `/read?w=${step.passage.work}&at=${step.passage.ref}` : `/read?w=${step.work}&at=${step.ref}`} transitionTypes={["page-turn"]}>In the reader →</Link>
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
          <UnitView key={unit.key} unit={unit} level={level} known={known[u]} pool={pool} doneLabel={nextLabel}
            onDone={() => { if (u === 0) finishLine(); else if (u === all.length - 1) { complete(passageKey(step.id)); setAtEnd(true); } else setU(u + 1); }} />
        )}
      </figure>

      <footer className={styles.lessonEnd}>
        {done ? <p className={styles.good}>You have read this lesson.</p> : <span />}
        {practiceNext
          ? <Link className="btn ghost" href={`/academy/reading/${practiceNext.id}`} transitionTypes={["page-turn"]}>Next: {practiceNext.title} →</Link>
          : next
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

export function AlphabetFold({ label = "Forgot how a letter is read? The whole alphabet" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="label" style={{ cursor: "pointer" }}>{label}</summary>
      {open && <div style={{ marginTop: 12 }}><AlphabetGlance /></div>}
    </details>
  );
}

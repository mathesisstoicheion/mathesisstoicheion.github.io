"use client";
/**
 * Study: every tool the reader has besides the page and the type, in one place and in a set order (the quiet desk, ticket 09, the owner,
 * 2026-10-30). It rises from the foot bar (Aa's neighbour) as a leaf on a computer and a sheet on a phone, scrolls when it is long, and in a book's
 * own top bar (two books side by side, the floating window) it is the same menu. Each tool is one full-width row (the site's row-btn): its sign,
 * its name and, where it helps, one quiet line at the left; its state at the right: a switch for a mode, a count for your marks, › for what opens
 * a panel or a window. What unfolds in place (your marks, Compare, the signs beside the scroll bar) opens under its own row, the › turning down.
 * A panel opened from a row has "Back to Study" in its head (Panel.tsx, Reader.tsx), and its × closes to the text.
 * 2026-11-09 (the owner): Study holds only the helps for studying (Reading help, Go deeper), each group folding away; Find and Listen are buttons
 * of the bar, Float stands by Library, the edition and translation are in Text, your notes are a round button at the top right, and the rest is
 * More (MoreMenu below). The home page is not here: Library is the way out.
 * Nothing is here twice: Go to is the bar's centre; the author's page is the title line's link; Echoes are in the look-up and the passage bar.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import Icon, { type IconName } from "@/components/Icon";
import { FORUM_OPEN } from "@/config/areas";
import { describe, translations, versionOf, type CatText, type CatWork } from "@/lib/catalog";
import type { Mark } from "@/lib/annotations";
import { useSettings, type Columns, type MarkerKind } from "@/lib/settings";
import { MarkersLegend } from "./ScrollMarkers";
import { MenuHead } from "./ReaderBar";
import { rangeLabel } from "./refs";
import { leaveBy } from "./useBackSteps";
import styles from "./ReaderBar.module.css";

/** The panels a row opens at the side (each with "Back to Study" in its head). */
export type StudyPanel = "find" | "vocab" | "places" | "ms" | "talk" | "cmp";

export interface StudyProps {
  /** where it stands: the foot bar of one book, or the top bar of a book among two (which has Find and Listen buttons of its own on a wide screen) */
  bar: "foot" | "pane";
  work: CatWork; grcText: CatText; trText: CatText | null; cmpText: CatText | null; editions: CatText[];
  columns: Columns;
  /** the text has metre to show */
  hasMetre: boolean;
  /** which panels are open now, and the Listen player and the key list */
  open: Record<StudyPanel | "listen" | "keys", boolean>;
  onPanel: (panel: StudyPanel) => void;
  onListen: () => void; onKeys: () => void;
  /** two Greek editions are compared and line up word by word: the differences, and the way to the next and the one before */
  canDiff: boolean; onDiff: (dir: 1 | -1) => void;
  onEdition: (version: string) => void; onTranslation: (version: string) => void; onCompare: (version: string) => void;
  /** your marks in this book, in the order of the text; choosing one goes to its passage */
  marks: Mark[]; onMark: (m: Mark) => void;
  markerCounts: Partial<Record<MarkerKind, number>>;
  split: boolean;
  /** the Float row: not in the floating window itself, and for the first of two books it takes both */
  canFloat: boolean; onFloat: () => void;
  onSecond: () => void;
  isPrivate: boolean;
  /** a private book that is a translation: the page that holds its introduction, notes and comparison */
  notesHref: string | null;
  moderator: boolean; onMine: () => void;
}

interface RowProps {
  icon: IconName; name: string; note?: string; title?: string;
  /** the tool's name for scripts and the way back from a panel (data-tool) */
  tool: string;
  /** a mode, on or off: shown as a switch */
  mode?: boolean;
  /** it opens a panel at the side: whether that is open now (›) */
  panel?: boolean;
  /** it unfolds in place, under the row: whether it is open now (› turning to a chevron down) */
  fold?: boolean;
  /** it is a toggle of another kind (Keys): whether it is on */
  toggled?: boolean;
  /** how many (your marks) */
  count?: number;
  /** what stands at the right instead of ›: the key for Keys */
  state?: ReactNode;
  /** the menu closes when the row is chosen (a panel, a window, a page): not for a mode or a fold */
  closes?: boolean;
  className?: string;
  onClick: () => void;
}

/** One tool: its sign, name and quiet line at the left, its state at the right (a switch, a count and ›, or ›). */
function Row({ icon, name, note, title, tool, mode, panel, fold, toggled, count, state, closes = false, className, onClick }: RowProps) {
  const id = useId();
  return (
    <button type="button" className={`row-btn ${styles.row}${className ? ` ${className}` : ""}`} data-tool={tool} title={title}
      aria-pressed={mode} aria-expanded={panel ?? fold ?? toggled} data-closes-sheet={closes ? "" : undefined}
      aria-labelledby={count !== undefined ? `${id}-n ${id}-c` : `${id}-n`} aria-describedby={note ? `${id}-q` : undefined} onClick={onClick}>
      <span className={styles.rowSign}><Icon name={icon} /></span>
      <span className={styles.rowText}>
        <span id={`${id}-n`}>{name}</span>
        {note && <span id={`${id}-q`} className={styles.rowNote}>{note}</span>}
      </span>
      <span className={styles.rowState}>
        {mode !== undefined ? <span className={styles.switch} data-switch="" aria-hidden="true" /> : (
          <>
            {count !== undefined && <span className={styles.count} id={`${id}-c`}>{count}</span>}
            {state ?? <Icon name={fold ? "chevron-down" : "chevron-right"} />}
          </>
        )}
      </span>
    </button>
  );
}

/** A row that leaves for a page of the site (the home page, a private book's notes). */
function LinkRow({ icon, name, note, title, href, tool }: { icon: IconName; name: string; note?: string; title?: string; href: string; tool: string }) {
  const router = useRouter();
  return (
    <Link className={`row-btn ${styles.row}`} href={href} transitionTypes={["page-turn"]} data-tool={tool} title={title} data-closes-sheet=""
      onClick={(e) => leaveBy(e, () => router.push(href, { transitionTypes: ["page-turn"] }))}>
      <span className={styles.rowSign}><Icon name={icon} /></span>
      <span className={styles.rowText}><span>{name}</span>{note && <span className={styles.rowNote}>{note}</span>}</span>
      <span className={styles.rowState}><Icon name="chevron-right" /></span>
    </Link>
  );
}

/** A choice of edition or translation: its name, and its menu. */
function Pick({ icon, name, value, options, onChange, disabled, title }: {
  icon: IconName; name: string; value: string; options: [string, string][]; onChange: (v: string) => void; disabled?: boolean; title?: string;
}) {
  return (
    <label className={styles.pick}>
      <span className="label"><Icon name={icon} />{name}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} title={title}>
        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
    </label>
  );
}

/** The kinds of group, each with its own sign and colour (ReaderBar.module.css, [data-kind]), so that one is told from another at a glance. */
type GroupKind = "help" | "deeper" | "book" | "page" | "texts";
const GROUP_SIGN: Record<GroupKind, IconName> = { help: "eye", deeper: "manuscript", book: "read", page: "signs", texts: "translation" };
const FOLDS_KEY = "mathesis:menu-groups";
function foldedNow(): Record<string, boolean> { try { return JSON.parse(localStorage.getItem(FOLDS_KEY) ?? "{}") ?? {}; } catch { return {}; } }

/**
 * A group of rows with its own head: a band in the group's colour, its sign and name, and a button that folds the group away and opens it again
 * (the owner, 2026-11-09: "make those visually distinguishable and then give them a collapse button"). What is folded is remembered on this device.
 */
export function Group({ name, kind, children }: { name: string; kind: GroupKind; children: ReactNode }) {
  const id = useId();
  const [shut, setShut] = useState(() => (typeof window === "undefined" ? false : !!foldedNow()[kind]));
  const flip = () => {
    const next = !shut;
    setShut(next);
    try { localStorage.setItem(FOLDS_KEY, JSON.stringify({ ...foldedNow(), [kind]: next })); } catch { /* not kept: it opens next time */ }
  };
  return (
    <section className={styles.group} data-kind={kind} aria-labelledby={`${id}-h`}>
      <h3 className={styles.groupHead} id={`${id}-h`}>
        <button type="button" className={`row-btn ${styles.groupBtn}`} aria-expanded={!shut} aria-controls={`${id}-b`} onClick={flip}>
          <span className={styles.groupSign}><Icon name={GROUP_SIGN[kind]} /></span>
          <span className={styles.groupName}>{name}</span>
          <span className={styles.groupFold}><Icon name="chevron-down" /></span>
        </button>
      </h3>
      <div id={`${id}-b`} className={styles.groupBody} hidden={shut}>{children}</div>
    </section>
  );
}

/** The Greek edition and the translation, side by side in the Text menu (the owner, 2026-11-09: the language picker goes with the edition picker). */
export function EditionPicks({ work, grcText, trText, cmpText, editions, onEdition, onTranslation }: Pick<StudyProps, "work" | "grcText" | "trText" | "cmpText" | "editions" | "onEdition" | "onTranslation">) {
  const text = (t: CatText): [string, string] => [versionOf(t.urn), describe(t, work.texts)];
  return (
    <div className={styles.picks}>
      <Pick icon="read" name="Greek text" value={versionOf(grcText.urn)} onChange={onEdition} options={editions.map(text)} />
      <Pick icon="translation" name="Translation" value={trText ? versionOf(trText.urn) : "none"} onChange={onTranslation} disabled={!!cmpText}
        title={cmpText ? "The translation comes back when you stop comparing editions" : undefined}
        options={[["none", "None"], ...translations(work).map(text)]} />
    </div>
  );
}

/** Your notes and marks in this book, in the order of the text: choosing one goes to its passage. */
export function MarksList({ marks, onMark }: { marks: Mark[]; onMark: (m: Mark) => void }) {
  return (
    <>
      {!marks.length && <p className={styles.marksEmpty}>Select words in the Greek, or click a passage number, to bookmark, highlight or write a note.</p>}
      <ul className={styles.marksList}>
        {marks.map((m) => (
          <li key={m.id}>
            <button type="button" className="row-btn" data-closes-sheet="" onClick={() => onMark(m)}>
              <span className="label">{m.kind} · {rangeLabel(m.start.u, m.end.u)}</span>
              <span>{m.kind === "note" && m.text ? m.text.slice(0, 80) : <span lang="grc">{m.quote.slice(0, 60)}</span>}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Study: the helps for reading and studying the Greek, and nothing else (the owner, 2026-11-09: Study was cluttered with everything in one place).
 * Two groups, each folding away: Reading help (what marks the Greek itself, and its words) and Go deeper (other editions, places, the manuscript).
 * Find and Listen are buttons of the bar; the edition and translation are in Text; the rest is in More.
 */
export default function StudyMenu(p: StudyProps) {
  const s = useSettings();
  const pane = p.bar === "pane";
  const [fold, setFold] = useState({ compare: p.cmpText !== null });
  const flip = (k: "translit" | "cases" | "metre" | "tryFirst") => s.set({ [k]: !s[k] });
  const others = p.editions.filter((t) => t.urn !== p.grcText.urn);
  const text = (t: CatText): [string, string] => [versionOf(t.urn), describe(t, p.work.texts)];

  return (
    <>
      <MenuHead title="Study" />
      <div className={`${styles.body} ${styles.study}`}>
        <Group name="Reading help" kind="help">
          {pane && <Row icon="search" name="Find in this text" note="A word or phrase, anywhere in the book" tool="find" title="Find a word or phrase anywhere in this text (Ctrl+F)"
            panel={p.open.find} closes className={styles.inBar} onClick={() => p.onPanel("find")} />}
          <Row icon="palette" name="Colour by case" note="Underline each word in the colour of its case" tool="cases" title="Underline nouns, adjectives and participles in the colour of their case"
            mode={s.cases} onClick={() => flip("cases")} />
          {p.hasMetre && <Row icon="metre" name="Metre" note="Long and short syllables, feet and caesura" tool="metre" title="Mark long and short syllables, feet and caesura"
            mode={s.metre} onClick={() => flip("metre")} />}
          <Row icon="latin" name="Transliteration" note="Each line in Latin letters" tool="translit" title="Show each line in Latin letters"
            mode={s.translit} onClick={() => flip("translit")} />
          {p.trText && !p.cmpText && p.columns === "both" && <Row icon="eye" name="Try it first" note="Hide the translation until you tap it" tool="tryFirst"
            title="Hide each translation until you tap it, so you read the Greek first" mode={s.tryFirst} onClick={() => flip("tryFirst")} />}
          <Row icon="vocabulary" name="Vocabulary for this page" note="The words on it, the most used first" tool="vocab" panel={p.open.vocab} closes onClick={() => p.onPanel("vocab")} />
          {pane && p.trText && !p.cmpText && <Row icon="listen" name="Listen to the English" note="Read aloud, passage by passage" tool="listen" title="Hear the English translation read aloud, passage by passage"
            toggled={p.open.listen} closes className={styles.inBar} onClick={p.onListen} />}
        </Group>

        <Group name="Go deeper" kind="deeper">
          {p.editions.length > 1 && (
            <>
              <Row icon="compare" name="Compare with another edition" note="Set a second Greek text beside this one" tool="compare" fold={fold.compare} onClick={() => setFold((f) => ({ ...f, compare: !f.compare }))} />
              {fold.compare && (
                <div className={styles.fold}>
                  <Pick icon="compare" name="Compare with" value={p.cmpText ? versionOf(p.cmpText.urn) : ""} onChange={p.onCompare}
                    options={[["", "No other edition"], ...others.map(text)]} />
                  {p.canDiff && (
                    <>
                      <Row icon="back" name="Previous difference" tool="diff-back" closes onClick={() => p.onDiff(-1)} />
                      <Row icon="next" name="Next difference" tool="diff-next" closes onClick={() => p.onDiff(1)} />
                      <Row icon="variants" name="List of differences" tool="cmp" panel={p.open.cmp} closes onClick={() => p.onPanel("cmp")} />
                    </>
                  )}
                </div>
              )}
            </>
          )}
          <Row icon="places" name="Places on this page" note="Shown on a map" tool="places" title="The places this page names, on a map" panel={p.open.places} closes onClick={() => p.onPanel("places")} />
          {!p.isPrivate && <Row icon="manuscript" name="How it was written" note="The passage as a scribe wrote it, and a real manuscript page" tool="ms"
            title="The passage as a scribe wrote it, and the page of a real manuscript" panel={p.open.ms} closes onClick={() => p.onPanel("ms")} />}
          {!p.isPrivate && FORUM_OPEN && <Row icon="talk" name="Talk about it" note="Questions asked in the Agora about this page" tool="talk"
            title="Questions asked in the Agora about the passages on this page" panel={p.open.talk} closes onClick={() => p.onPanel("talk")} />}
        </Group>
      </div>
    </>
  );
}

/**
 * More: what is not reading or studying (the owner, 2026-11-09: "everything else can just go in a button"). The book: a second book beside it,
 * the floating window (a phone's; a computer has its button by Library), your notes in two books (one book has the round Notes button), a private
 * book's notes, your private collection. The page: the signs beside the scroll bar, and Keys. There is no Home: Library is the way out.
 */
export function MoreMenu(p: StudyProps) {
  const pane = p.bar === "pane";
  const [fold, setFold] = useState({ marks: false, signs: false });
  const toggle = (k: keyof typeof fold) => setFold((f) => ({ ...f, [k]: !f[k] }));
  return (
    <>
      <MenuHead title="More" />
      <div className={`${styles.body} ${styles.study}`}>
        <Group name="This book" kind="book">
          {!p.split && <Row icon="book-plus" name="Open a second book beside this one" note="Two books side by side" tool="second" closes onClick={p.onSecond} />}
          {p.canFloat && <Row icon="float" name={p.split ? "Float both books" : "Float the reader"} note="A small window that follows you around the site" tool="float"
            title="Shrink the reader into a small window that follows you around the site, at the passage you are reading" closes
            className={pane ? undefined : styles.phoneOnly} onClick={p.onFloat} />}
          {pane && <Row icon="bookmark" name="Your notes and marks" note="What you have marked in this book" tool="marks" count={p.marks.length} fold={fold.marks} onClick={() => toggle("marks")} />}
          {pane && fold.marks && <div className={styles.fold}><MarksList marks={p.marks} onMark={p.onMark} /></div>}
          {p.notesHref && <LinkRow icon="note" name="Notes and comparison" tool="notes" href={p.notesHref}
            title="The introduction, the translator's notes, and where our English parts from the published one" />}
          {p.moderator && <Row icon="lock" name="Private collection" note="Your own translations and texts, which only you can see" tool="mine"
            title="Your own translations and imported texts, which only you can see" closes onClick={p.onMine} />}
        </Group>
        <Group name="The page" kind="page">
          <Row icon="signs" name="Signs beside the scroll bar" note="Choose which to show" tool="signs" fold={fold.signs} onClick={() => toggle("signs")} />
          {fold.signs && <div className={styles.fold}><MarkersLegend inline counts={p.markerCounts} /></div>}
          <Row icon="key" name="Keys" note="Shortcuts for the keyboard" tool="keys" toggled={p.open.keys} closes state={<kbd>?</kbd>} className={styles.keys} onClick={p.onKeys} />
        </Group>
      </div>
    </>
  );
}

"use client";
/**
 * Study: every tool the reader has besides the page and the type, in one place and in a set order (the quiet desk, ticket 09, the owner,
 * 2026-10-30). It rises from the foot bar (Aa's neighbour) as a leaf on a computer and a sheet on a phone, scrolls when it is long, and in a book's
 * own top bar (two books side by side, the floating window) it is the same menu. Each tool is one full-width row (the site's row-btn): its sign,
 * its name and, where it helps, one quiet line at the left; its state at the right: a switch for a mode, a count for your marks, › for what opens
 * a panel or a window. What unfolds in place (your marks, Compare, the signs beside the scroll bar) opens under its own row, the › turning down.
 * A panel opened from a row has "Back to Study" in its head (Panel.tsx, Reader.tsx), and its × closes to the text.
 * The groups, in order: Reading help; Go deeper; Edition and translation; and at the foot the signs beside the scroll bar, Keys and the home page.
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

function Group({ name, children }: { name: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className={styles.group} aria-labelledby={id}>
      <h3 id={id} className={`label ${styles.groupLabel}`}>{name}</h3>
      {children}
    </section>
  );
}

export default function StudyMenu(p: StudyProps) {
  const s = useSettings();
  const pane = p.bar === "pane";
  const [fold, setFold] = useState({ compare: p.cmpText !== null, marks: false, signs: false });
  const toggle = (k: keyof typeof fold) => setFold((f) => ({ ...f, [k]: !f[k] }));
  const flip = (k: "translit" | "cases" | "metre" | "tryFirst") => s.set({ [k]: !s[k] });
  const others = p.editions.filter((t) => t.urn !== p.grcText.urn);
  const text = (t: CatText): [string, string] => [versionOf(t.urn), describe(t, p.work.texts)];

  return (
    <>
      <MenuHead title="Study" />
      <div className={`${styles.body} ${styles.study}`}>
        <Group name="Reading help">
          <Row icon="search" name="Find in this text" note="A word or phrase, anywhere in the book" tool="find" title="Find a word or phrase anywhere in this text (/ or Ctrl+F)"
            panel={p.open.find} closes className={pane ? styles.inBar : undefined} onClick={() => p.onPanel("find")} />
          <Row icon="palette" name="Colour by case" note="Underline each word in the colour of its case" tool="cases" title="Underline nouns, adjectives and participles in the colour of their case"
            mode={s.cases} onClick={() => flip("cases")} />
          {p.hasMetre && <Row icon="metre" name="Metre" note="Long and short syllables, feet and caesura" tool="metre" title="Mark long and short syllables, feet and caesura"
            mode={s.metre} onClick={() => flip("metre")} />}
          <Row icon="latin" name="Transliteration" note="Each line in Latin letters" tool="translit" title="Show each line in Latin letters"
            mode={s.translit} onClick={() => flip("translit")} />
          {p.trText && !p.cmpText && p.columns === "both" && <Row icon="eye" name="Try it first" note="Hide the translation until you tap it" tool="tryFirst"
            title="Hide each translation until you tap it, so you read the Greek first" mode={s.tryFirst} onClick={() => flip("tryFirst")} />}
          <Row icon="vocabulary" name="Vocabulary for this page" note="The words on it, the most used first" tool="vocab" panel={p.open.vocab} closes onClick={() => p.onPanel("vocab")} />
          <Row icon="bookmark" name="Your notes and marks" note="What you have marked in this book" tool="marks" count={p.marks.length} fold={fold.marks} onClick={() => toggle("marks")} />
          {fold.marks && (
            <div className={styles.fold}>
              {!p.marks.length && <p className={styles.marksEmpty}>Select words in the Greek, or click a passage number, to bookmark, highlight or write a note.</p>}
              <ul className={styles.marksList}>
                {p.marks.map((m) => (
                  <li key={m.id}>
                    <button type="button" className="row-btn" data-closes-sheet="" onClick={() => p.onMark(m)}>
                      <span className="label">{m.kind} · {rangeLabel(m.start.u, m.end.u)}</span>
                      <span>{m.kind === "note" && m.text ? m.text.slice(0, 80) : <span lang="grc">{m.quote.slice(0, 60)}</span>}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Group>

        <Group name="Go deeper">
          {p.editions.length > 1 && (
            <>
              <Row icon="compare" name="Compare with another edition" note="Set a second Greek text beside this one" tool="compare" fold={fold.compare} onClick={() => toggle("compare")} />
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
          {!p.split && <Row icon="book-plus" name="Open a second book beside this one" note="Two books side by side" tool="second" closes onClick={p.onSecond} />}
          {p.canFloat && <Row icon="float" name={p.split ? "Float both books" : "Float the reader"} note="A small window that follows you around the site" tool="float"
            title="Shrink the reader into a small window that follows you around the site, at the passage you are reading" closes onClick={p.onFloat} />}
          <Row icon="places" name="Places on this page" note="Shown on a map" tool="places" title="The places this page names, on a map" panel={p.open.places} closes onClick={() => p.onPanel("places")} />
          {!p.isPrivate && <Row icon="manuscript" name="How it was written" note="The passage as a scribe wrote it, and a real manuscript page" tool="ms"
            title="The passage as a scribe wrote it, and the page of a real manuscript" panel={p.open.ms} closes onClick={() => p.onPanel("ms")} />}
          {p.trText && !p.cmpText && <Row icon="listen" name="Listen to the English" note="Read aloud, passage by passage" tool="listen" title="Hear the English translation read aloud, passage by passage"
            toggled={p.open.listen} closes className={pane ? styles.inBar : undefined} onClick={p.onListen} />}
          {!p.isPrivate && FORUM_OPEN && <Row icon="talk" name="Talk about it" note="Questions asked in the Agora about this page" tool="talk"
            title="Questions asked in the Agora about the passages on this page" panel={p.open.talk} closes onClick={() => p.onPanel("talk")} />}
          {p.notesHref && <LinkRow icon="note" name="Notes and comparison" tool="notes" href={p.notesHref}
            title="The introduction, the translator's notes, and where our English parts from the published one" />}
        </Group>

        <Group name="Edition and translation">
          <Pick icon="read" name="Greek text" value={versionOf(p.grcText.urn)} onChange={p.onEdition} options={p.editions.map(text)} />
          <Pick icon="translation" name="Translation" value={p.trText ? versionOf(p.trText.urn) : "none"} onChange={p.onTranslation} disabled={!!p.cmpText}
            title={p.cmpText ? "The translation comes back when you stop comparing editions" : undefined}
            options={[["none", "None"], ...translations(p.work).map(text)]} />
          {p.moderator && <Row icon="lock" name="Private collection" note="Your own translations and texts, which only you can see" tool="mine"
            title="Your own translations and imported texts, which only you can see" closes onClick={p.onMine} />}
        </Group>

        <Group name="More">
          <Row icon="signs" name="Signs beside the scroll bar" note="Choose which to show" tool="signs" fold={fold.signs} onClick={() => toggle("signs")} />
          {fold.signs && <div className={styles.fold}><MarkersLegend inline counts={p.markerCounts} /></div>}
          <Row icon="key" name="Keys" note="Shortcuts for the keyboard" tool="keys" toggled={p.open.keys} closes state={<kbd>?</kbd>} className={styles.keys} onClick={p.onKeys} />
          <LinkRow icon="home" name="Home" note="The front page of the site" tool="home" href="/" />
        </Group>
      </div>
    </>
  );
}

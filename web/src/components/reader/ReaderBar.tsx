"use client";
/**
 * The reader's foot bar (the quiet desk, ticket 09, the owner, 2026-10-30; mockup B). One book has nothing along its top: the page starts with
 * the book's one-line title (or its title page), and the bar stands along the foot, the same on a computer and a phone. Left, "Library", the
 * way back; in the middle where you are, "Book 1", a thin rule with a short red mark at the place, "line 25 of 611", which is the button for
 * Go to (the page, and a reference to type); right, Text (the Aa sign and the word: the page and the type) and Study (every other tool). Each menu rises from the bar:
 * a leaf on a computer, a sheet on a phone (ReaderBar.module.css), and shows its own close.
 *
 * On a phone the bar slips away as the text is read on and comes back when the reader scrolls up or taps the paper (a tap on a word looks it
 * up instead); Reader.tsx marks what covers it (data-covers on the reader: the look-up's sheet, a panel's sheet, the passage toolbar). It tells
 * the reader when it is away (data-foot on the reader's root), so that Back to top, Listen's player and the signs beside the scroll bar
 * stand clear of it (--foot-now, --foot-h in Reader.module.css).
 *
 * Two books side by side and the floating window keep a bar along their top, with the same Text and Study in it (AaStudy below, bar="pane"; the
 * page and Go to are Where, in a row).
 */
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode, type RefObject } from "react";
import Icon from "@/components/Icon";
import { AREAS } from "@/config/areas";
import { barsHeld, footHeld } from "@/lib/header";
import type { TeiDoc } from "@/lib/tei/types";
import Drop from "./Drop";
import { placeOf } from "./place";
import styles from "./ReaderBar.module.css";

/** One of the bar's small panels: its id (for aria-controls), whether it is open now, and the way to open or close it (Reader.tsx keeps one open at a time). */
export interface DropState { id: string; open: boolean; onOpen: (open: boolean) => void }

/** A phone, or a narrow screen under a finger: where the bar comes and goes and every control is a finger's height (the same query is in ReaderBar.module.css). */
const PHONE = "(max-width: 760px), (pointer: coarse) and (max-width: 900px)";
const usePhone = () => useSyncExternalStore(
  (on) => { const m = matchMedia(PHONE); m.addEventListener("change", on); return () => m.removeEventListener("change", on); },
  () => matchMedia(PHONE).matches,
  () => false,
);

/** The head of every menu: its name and its close (the owner's rule, 2026-10-30: each menu shows its own close, besides Escape and a tap outside). */
export function MenuHead({ title }: { title: string }) {
  return (
    <div className={styles.head}>
      <span className={styles.grab} aria-hidden="true" />
      <h2 className={styles.title}>{title}</h2>
      <button type="button" className={`icon-btn ${styles.close}`} data-drop-close=""><Icon name="close" label="Close" /></button>
    </div>
  );
}

/**
 * The page (a select of the parts of the book) and Go to (a reference to type, "1.33"): in a book's own top bar as one row, with arrows to the
 * page before and after; in the Go to menu one under the other, without the arrows (the foot of each page has the way on and back).
 */
export function Where({ doc, chunk, layout, onPage, onGoto, inputRef, focusSignal = 0 }: {
  doc: TeiDoc; chunk: number; layout: "row" | "menu";
  onPage: (i: number) => void;
  /** go to the reference typed; whether there was such a passage (the reader says so when there was not) */
  onGoto: (ref: string) => boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  /** changes whenever the keyboard shortcut (g) asks for the reference field: it takes the keyboard when it appears, and again when this changes */
  focusSignal?: number;
}) {
  const [text, setText] = useState("");
  useEffect(() => { if (focusSignal) inputRef.current?.focus({ preventScroll: true }); }, [focusSignal, inputRef]);
  const menu = layout === "menu";
  const page = (
    <div className={styles.pager}>
      {!menu && <button type="button" className="icon-btn framed" onClick={() => onPage(chunk - 1)} disabled={chunk === 0} aria-label="Previous page"><Icon name="back" /></button>}
      <select aria-label="Page" value={chunk} onChange={(e) => onPage(+e.target.value)}>
        {doc.chunks.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
      </select>
      {!menu && <button type="button" className="icon-btn framed" onClick={() => onPage(chunk + 1)} disabled={chunk === doc.chunks.length - 1} aria-label="Next page"><Icon name="next" /></button>}
    </div>
  );
  const form = (
    <form className={menu ? styles.gotoRow : styles.goto} role="search" onSubmit={(e) => { e.preventDefault(); if (onGoto(text)) setText(""); }}>
      <input ref={inputRef} id="reader-goto" value={text} onChange={(e) => setText(e.target.value)} placeholder={`Go to ${doc.levels.join(".")}`} aria-label="Go to reference"
        enterKeyHint="go" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
      <button type="submit" className="chip">Go<Icon name="next" /></button>
    </form>
  );
  if (!menu) return <div className={styles.whereRow}>{page}{form}</div>;
  return (
    <>
      <div className={styles.field}><span className="label"><Icon name="read" />Page</span>{page}</div>
      <div className={styles.field}><span className="label"><Icon name="goto" />Reference</span>{form}</div>
    </>
  );
}

/** Go to, the menu under the bar's middle: the page and a reference to type. It closes once the reader has gone somewhere. */
export function GotoMenu({ doc, chunk, onPage, onGoto, onDone, inputRef, focusSignal }: {
  doc: TeiDoc; chunk: number; onPage: (i: number) => void; onGoto: (ref: string) => boolean; onDone: () => void;
  inputRef: RefObject<HTMLInputElement | null>; focusSignal: number;
}) {
  return (
    <>
      <MenuHead title="Go to" />
      <div className={styles.body}>
        <Where doc={doc} chunk={chunk} layout="menu" inputRef={inputRef} focusSignal={focusSignal}
          onPage={(i) => { onPage(i); onDone(); }} onGoto={(ref) => { const ok = onGoto(ref); if (ok) onDone(); return ok; }} />
      </div>
    </>
  );
}

/** Text (the Aa sign and the word) and Study, with the menus that open under (above) them. `bar` says where they stand: the foot bar of one book, or the top bar of a book among two. */
export function AaStudy({ bar, aa, study, aaMenu, studyMenu, modesOn }: {
  bar: "foot" | "pane"; aa: DropState; study: DropState; aaMenu: ReactNode; studyMenu: ReactNode;
  /** how many of the reading modes (Transliteration, Colour by case…) are on, for the sign on Study */
  modesOn: number;
}) {
  const foot = bar === "foot";
  const button = foot ? `icon-btn ${styles.quiet}` : `chip ${styles.paneBtn}`;
  const menu = (own?: string) => `${styles.menu} ${foot ? styles.footMenu : styles.paneMenu} ${own ?? ""}`;
  return (
    <>
      {/* its sign and its word, as Library and Study have theirs (the quiet desk, the reader's tools, the owner, 2026-10-30: the sign alone was smaller and
          fainter than the buttons beside it, and the owner might not know what it opens); its name starts with the word it shows, and its menu is still "Page and text" */}
      <Drop {...aa} chevron={false} className={button} panelClass={menu(styles.aaMenu)} panelLabel="Page and text"
        label={<><Icon name="text-size" />Text</>} ariaLabel="Text: page and size"
        title="The page (Paper or Night), the size of the Greek, the line spacing and the columns">
        {aa.open && aaMenu}
      </Drop>
      <Drop {...study} chevron={false} className={button} panelClass={menu()} panelLabel="Study"
        label={<><Icon name="study" />Study{modesOn > 0 && <span className={styles.onCount} data-on="" aria-hidden="true">{modesOn}</span>}</>}
        ariaLabel={modesOn > 0 ? `Study, ${modesOn} on` : undefined}
        title="Reading help, ways to go deeper, and the edition and translation">
        {study.open && studyMenu}
      </Drop>
    </>
  );
}

/** What the bar needs once the book's text is up. */
export interface BarBook {
  doc: TeiDoc; chunk: number;
  /** the passage at the top of the screen (its row's key), once known */
  topRow: string | null;
  order: ReadonlyMap<string, number>;
  goto: DropState; gotoMenu: ReactNode;
  aa: DropState; aaMenu: ReactNode;
  study: DropState; studyMenu: ReactNode;
  /** how many of the reading modes are on, for the sign on Study */
  modesOn: number;
}

export default function ReaderBar({ rootRef, book }: {
  /** the reader's root: the bar says on it when it stands away (data-foot), which what clears the bar reads */
  rootRef: RefObject<HTMLElement | null>;
  /** null until the text is up: the bar is then the way back alone (the site's header stands aside on this page) */
  book: BarBook | null;
}) {
  const id = useId();
  const phone = usePhone();
  const menuOpen = !!book && (book.aa.open || book.study.open || book.goto.open);
  const [away, setAway] = useState(false);
  // what the scroll listener below reads: whether the bar is away now, and whether a menu is open
  const awayRef = useRef(false), menuRef = useRef(menuOpen);
  useEffect(() => { awayRef.current = away; menuRef.current = menuOpen; });
  // a menu opening shows the bar (a key can open one while the bar is away)
  const [menuSeen, setMenuSeen] = useState(menuOpen);
  if (menuOpen !== menuSeen) { setMenuSeen(menuOpen); if (menuOpen) setAway(false); }

  // On a phone the bar slips away as the text is read on (any scroll down) and comes back with any scroll up, at the top and at the very end
  // of the page, when the reader taps the paper (lib/header.ts showFoot), when a menu opens and when Tab is pressed. A jump the reader asked
  // for (Go to, Find, a mark) holds it for a moment (holdFoot), so that it does not go as the page moves.
  useEffect(() => {
    if (!phone) return;
    let last = scrollY, frame = 0;
    const set = (hide: boolean) => { if (hide !== awayRef.current) { awayRef.current = hide; setAway(hide); } };
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = scrollY, dy = y - last;
        if (y <= 4) set(false);
        else if (y + innerHeight >= document.documentElement.scrollHeight - 2) set(false);
        else if (dy > 6 && !menuRef.current && !footHeld() && !barsHeld()) set(true);
        else if (dy < -6) set(false);
        else return;
        last = y;
      });
    };
    const show = () => { set(false); last = scrollY; };
    const onBars = (e: Event) => { if ((e as CustomEvent<boolean | undefined>).detail === false) show(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Tab") show(); };
    addEventListener("scroll", check, { passive: true });
    addEventListener("mathesis:bars", onBars);
    addEventListener("mathesis:foot", onBars);
    addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", check); removeEventListener("mathesis:bars", onBars); removeEventListener("mathesis:foot", onBars); removeEventListener("keydown", onKey); set(false); };
  }, [phone]);
  // the reader's root carries the bar's state, for what stands clear of the bar (Back to top, Listen, the signs beside the scroll bar)
  const gone = phone && away;
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (gone) root.setAttribute("data-foot", "away"); else root.removeAttribute("data-foot");
    return () => root.removeAttribute("data-foot");
  }, [gone, rootRef]);

  const place = book && placeOf(book.doc, book.chunk, book.topRow, book.order);
  return (
    <nav className={styles.foot} aria-label="Reader controls" data-foot-bar="">
      <div className={`wrap ${styles.barIn}`}>
        <Link className={`${styles.quiet} ${styles.back}`} href={AREAS.library.href} transitionTypes={["page-turn"]} aria-label="Back to the library"><Icon name="back" />Library</Link>
        {book && place ? (
          <Drop {...book.goto} chevron={false} className={`icon-btn ${styles.quiet} ${styles.where}`} panelClass={`${styles.menu} ${styles.footMenu} ${styles.gotoMenu}`} panelLabel="Go to"
            ariaLabel="Go to a line or book" describedBy={`${id}-at`} title="Go to a line, or to another part of the book"
            label={<>
              <Icon name="goto" />
              <span className={styles.part}>{place.part}</span>
              <span className={styles.rule} aria-hidden="true"><span className={styles.mark} style={{ "--p": place.progress } as CSSProperties} /></span>
              <span id={`${id}-at`} className={styles.at}>{place.level} {place.num}{place.of !== null ? ` of ${place.of}` : ""}</span>
            </>}>
            {book.goto.open && book.gotoMenu}
          </Drop>
        ) : <span />}
        {book && (
          <div className={styles.tools}>
            <AaStudy bar="foot" aa={book.aa} study={book.study} aaMenu={book.aaMenu} studyMenu={book.studyMenu} modesOn={book.modesOn} />
          </div>
        )}
      </div>
    </nav>
  );
}

"use client";
/**
 * "A to Z": a row of letters to jump by, and (on author pages) a button that opens the list under them. The owner asked for
 * it on 2026-10-16: "on author pages, there should be a dedicated button for expanding their works into a list from a to z,
 * with a row from a to z that you can click on each letter to take you to the works in alphabetical order. And on phone it
 * should be on the right side and is touch interactive". For the library they then asked for just the side scroller, beside
 * the list itself (no button, nothing separate): first on the left, then (2026-10-17) on the right, carved in the stone, with
 * smooth scrolling.
 *
 * There are three parts, so that a page can use what it needs:
 *  - `AZRail`, the letters. Tap or click one and the page glides to that part of the list (lib/header.ts, glideTo); letters
 *    with nothing under them are dimmed and do nothing. On a phone, press a finger on it and slide up and down: the page
 *    keeps up with it letter by letter (going straight to each one: gliding there as well made the slide stutter), and a bubble beside the finger says which letter it is on. As the list scrolls, a lit
 *    slab with a gilded edge slides along the letters to the one you are reading under. It comes in two forms: "side", a slim rail down the side of a
 *    list that stays beside it as the page scrolls (the library, at every width), and "row", a row above the list on a
 *    computer that becomes a strip down the right-hand edge of a phone (the author's page, shown only while its list is open
 *    and on the screen, like the index of a phone's contacts).
 *  - `AZButton`, the "A to Z" button.
 *  - `AZPanel`, the list the button opens: the works in alphabetical order under letter headings, with a row of letters.
 *    It opens and closes as a carving is cut (DESIGN.md, Motion): a fine line is cut across the top, left to right; the
 *    panel sinks open beneath it while its shadow deepens; then the letters and the groups are cut in one after another.
 *    Closing goes back the same way, faster. With animation turned off (the site's setting or the device's) it opens at once.
 *    The list is built only when it is first opened, so the page without it stays light.
 * The sorting is in az.ts.
 */
import Link from "next/link";
import { Fragment, startTransition, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type RefObject } from "react";
import { headerHeight, scrollBelowHeader } from "@/lib/header";
import { scrollBehavior } from "@/lib/settings";
import { AZ_LETTERS, AZ_OTHER, groupAZ, type AZItem } from "./az";
import styles from "./AZList.module.css";

export type { AZItem } from "./az";
export { AZ_LETTERS, AZ_OTHER } from "./az";

/** The "A to Z" button. It shows whether the list is open, and tells screen readers which list it controls. */
export function AZButton({ open, onToggle, controls, className }: { open: boolean; onToggle: () => void; controls: string; className?: string }) {
  return (
    <button type="button" className={className ? `${styles.button} ${className}` : styles.button} aria-expanded={open} aria-controls={controls}
      onClick={(e) => {
        // closing a long list from far down it: bring the button back into view, so the page does not jump somewhere else
        const b = e.currentTarget;
        if (open && b.getBoundingClientRect().top < headerHeight()) scrollBelowHeader(b, 12, scrollBehavior() === "smooth");
        onToggle();
      }}>
      <span>A to Z</span>
      <svg className={styles.chev} viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
  );
}

const key = (k: string) => (k === AZ_OTHER ? "other" : k);

/**
 * The letters. `keys` are the letters to show, in order; `has` says which of them have anything under them; `jump` takes the
 * page to a letter's part of the list (gliding, or at once while a finger slides) and gives back that part's element.
 * `noun` is what the list holds, capitalised and in the plural ("Authors"): the labels read "Authors by first letter".
 * `show` (the row's form on a phone) says whether the strip is on the screen at all. `navRef` lets the page see the rail.
 * `part` finds a letter's part of the list, so the rail can mark the one being read; `parts` changes whenever those parts
 * are made afresh (another order), so it looks for them again.
 */
export function AZRail({ keys, has, jump, noun, variant = "row", show = true, navRef, part, parts = "" }: {
  keys: readonly string[]; has: (k: string) => boolean; jump: (k: string, instant: boolean) => HTMLElement | undefined;
  noun: string; variant?: "row" | "side"; show?: boolean; navRef?: RefObject<HTMLElement | null>;
  part?: (k: string) => HTMLElement | null | undefined; parts?: string;
}) {
  const [finger, setFinger] = useState<{ k: string; y: number } | null>(null);
  const [sliding, setSliding] = useState(false);   // a finger is on the strip (the bubble shows only over a letter with something under it)
  const own = useRef<HTMLElement>(null);
  const nav = navRef ?? own;
  const slide = useRef<{ from: string | null; last: string | null; moved: boolean } | null>(null);
  const touchedAt = useRef(0);

  // the letter of the part being read: the part that crosses a line a quarter of the way down the screen
  const [at, setAt] = useState(-1);
  const present = keys.filter(has).join("|");
  const partRef = useRef(part);
  useEffect(() => { partRef.current = part; });
  useEffect(() => {
    const find = partRef.current;
    if (!find || typeof IntersectionObserver === "undefined") return;
    const els = present.split("|").map((k) => [k, find(k)] as const).filter((e): e is readonly [string, HTMLElement] => !!e[1]);
    const crossing = new Set<string>();
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        const k = (e.target as HTMLElement).dataset.azPart ?? "";
        if (e.isIntersecting) crossing.add(k); else crossing.delete(k);
      }
      const k = keys.find((x) => crossing.has(x));
      setAt(k === undefined ? -1 : keys.indexOf(k));
    }, { rootMargin: "-25% 0px -74% 0px" });
    for (const [k, el] of els) { el.dataset.azPart = k; io.observe(el); }
    return () => io.disconnect();
  }, [present, parts, keys]);

  const choose = (k: string, e: MouseEvent) => {
    if (!has(k) || e.timeStamp - touchedAt.current < 600) return;   // (a finger has just dealt with this touch)
    const el = jump(k, false);
    // from the keyboard, the letter's heading takes the focus, so the next Tab begins at that letter's items
    if (el && e.detail === 0) el.querySelector<HTMLElement>("h2, h3")?.focus({ preventScroll: true });
  };

  // ---- a finger on the strip: press to choose a letter, slide to move through them
  // (the row's form is a strip only on a phone; the side rail is the same at every width)
  const fingerHere = () => variant === "side" || matchMedia("(max-width: 760px)").matches;
  /** The letter under a point on the strip, worked out from where the letters stand. */
  const letterAt = (clientY: number): { k: string; y: number } | null => {
    const bs = nav.current?.querySelectorAll<HTMLButtonElement>("button[data-k]");
    if (!bs || !bs.length) return null;
    const first = bs[0].getBoundingClientRect(), last = bs[bs.length - 1].getBoundingClientRect();
    const i = Math.min(bs.length - 1, Math.max(0, Math.floor(((clientY - first.top) / (last.bottom - first.top)) * bs.length)));
    return { k: bs[i].dataset.k ?? "", y: bs[i].offsetTop + bs[i].offsetHeight / 2 };
  };
  const touchOn = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" || !fingerHere()) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* a pointer that has already gone */ }
    const at = letterAt(e.clientY);
    slide.current = { from: at && has(at.k) ? at.k : null, last: at?.k ?? null, moved: false };
    setSliding(true);
    setFinger(at && has(at.k) ? at : null);
  };
  const touchMove = (e: PointerEvent<HTMLElement>) => {
    const s = slide.current;
    if (!s) return;
    const at = letterAt(e.clientY);
    if (!at || at.k === s.last) return;
    s.last = at.k;
    s.moved = true;
    if (has(at.k)) { setFinger(at); jump(at.k, true); } else setFinger(null);   // a letter with nothing under it: stay where we are
  };
  const touchOff = (e: PointerEvent<HTMLElement>) => {
    const s = slide.current;
    if (!s) return;
    slide.current = null;
    touchedAt.current = e.timeStamp;
    setSliding(false);
    setFinger(null);
    // a plain tap (the finger did not slide to another letter) goes to its letter smoothly
    if (e.type === "pointerup" && !s.moved && s.from) jump(s.from, false);
  };

  return (
    <nav ref={nav} className={variant === "side" ? `${styles.letters} ${styles.side}` : styles.letters} aria-label={`${noun} by first letter`} data-show={show ? "" : undefined}
      data-slide={sliding ? "" : undefined} style={{ "--n": keys.length, "--at": Math.max(at, 0) } as CSSProperties}
      onPointerDown={touchOn} onPointerMove={touchMove} onPointerUp={touchOff} onPointerCancel={touchOff}>
      {part && <i className={styles.mark} data-on={at >= 0 ? "" : undefined} aria-hidden="true" />}
      {keys.map((k, i) => (
        <button key={k} type="button" data-k={k} className={styles.letter} style={{ "--i": i } as CSSProperties} data-hot={finger?.k === k ? "" : undefined}
          data-at={i === at ? "" : undefined}
          aria-label={k === AZ_OTHER ? `${noun} that do not begin with a letter of the Latin alphabet` : `${noun} beginning with ${k}`}
          aria-disabled={has(k) ? undefined : true} tabIndex={has(k) ? undefined : -1} onClick={(e) => choose(k, e)}>{k}</button>
      ))}
      {finger && <span className={styles.bubble} style={{ "--by": `${finger.y}px` } as CSSProperties} aria-hidden="true">{finger.k}</span>}
    </nav>
  );
}

/**
 * The list the "A to Z" button opens: the row of letters, then the items under their letters. `kind` is what the items are,
 * as one and as many ("work", "works"); `layout` is "names" (short names in columns) or "rows" (each item brings its own
 * list item, as the author page's works do).
 */
export function AZPanel({ id, open, items, kind = ["item", "items"], layout = "names" }: {
  id: string; open: boolean; items: readonly AZItem[]; kind?: [string, string]; layout?: "names" | "rows";
}) {
  // The list is built while the page is idle (or when it is first opened, if that comes sooner), so that the first opening
  // is as smooth as the next; it is cut in a moment after it has been drawn closed, so that the cutting-in can be seen the
  // first time as well.
  const [ready, setReady] = useState(false);
  const [early, setEarly] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const shown = open && (ready || early);   // (a list built ahead has been drawn closed already: it is cut in at once)
  const built = open || ready || early;

  useEffect(() => {
    const idle = typeof requestIdleCallback === "function";
    const h = idle ? requestIdleCallback(() => startTransition(() => setEarly(true)), { timeout: 4000 }) : window.setTimeout(() => startTransition(() => setEarly(true)), 1500);
    return () => { if (idle) cancelIdleCallback(h); else clearTimeout(h); };
  }, []);

  useEffect(() => {
    if (!open || ready) return;
    let b = 0;
    const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setReady(true)); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, [open, ready]);

  // the strip down the side of a phone is there only while the list is open and some of it is on the screen
  useEffect(() => {
    const el = list.current;
    if (!shown || !el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => setOnScreen(es[es.length - 1].isIntersecting));
    io.observe(el);
    return () => { io.disconnect(); setOnScreen(false); };
  }, [shown]);

  const groups = useMemo(() => (built ? groupAZ(items) : []), [items, built]);
  const have = useMemo(() => new Set(groups.map((g) => g.key)), [groups]);
  const letters = useMemo(() => (have.has(AZ_OTHER) ? [...AZ_LETTERS, AZ_OTHER] : AZ_LETTERS), [have]);
  const [one, many] = kind;
  const noun = many.charAt(0).toUpperCase() + many.slice(1);

  /** Scroll to a letter's group, clear of the site's header and of the row of letters when that is stuck under it. */
  const jump = (k: string, instant: boolean): HTMLElement | undefined => {
    const el = list.current ? ([...list.current.children] as HTMLElement[]).find((c) => c.dataset.az === k) : undefined;
    if (!el) return undefined;
    const bar = nav.current;
    const stuck = !!bar && getComputedStyle(bar).position === "sticky";
    scrollBelowHeader(el, (stuck && bar ? bar.offsetHeight : 0) + 12, !instant && scrollBehavior() === "smooth" ? "glide" : false);
    return el;
  };
  const part = (k: string) => (list.current ? ([...list.current.children] as HTMLElement[]).find((c) => c.dataset.az === k) : undefined);

  return (
    <div id={id} className={styles.panel} data-open={shown ? "" : undefined} data-seen={ready || shown ? "" : undefined} data-layout={layout} inert={!open} role="region" aria-label={`${noun} from A to Z`}>
      <div className={styles.sink}>
        <div className={styles.well}>
          <div className={styles.body}>
            {built && <AZRail keys={letters} has={(k) => have.has(k)} jump={jump} noun={noun} navRef={nav} show={shown && onScreen} part={part} parts={String(groups.length)} />}
            {built && <div ref={list} className={styles.list}>
              {groups.map((g, gi) => (
                <section key={g.key} id={`${id}-${key(g.key)}`} data-az={g.key} className={styles.group} style={{ "--g": gi } as CSSProperties} aria-labelledby={`${id}-h-${key(g.key)}`}>
                  <h3 id={`${id}-h-${key(g.key)}`} className={styles.head} tabIndex={-1}>
                    <span className={styles.initial}>{g.key}</span>
                    <span className={styles.count}>{g.items.length} {g.items.length === 1 ? one : many}</span>
                  </h3>
                  <ul className={layout === "rows" ? styles.rows : styles.names}>
                    {g.items.map((it) => (
                      <Fragment key={it.id}>
                        {it.node ?? (
                          <li>
                            {it.href ? (
                              <Link href={it.href} transitionTypes={["page-turn"]} className={styles.link}>
                                <span>{it.title}</span>{it.note && <small className={styles.note}>{it.note}</small>}
                              </Link>
                            ) : <span className={styles.link}><span>{it.title}</span>{it.note && <small className={styles.note}>{it.note}</small>}</span>}
                          </li>
                        )}
                      </Fragment>
                    ))}
                  </ul>
                </section>
              ))}
            </div>}
          </div>
        </div>
        <span className={styles.cut} aria-hidden="true"><i className={styles.tip} /></span>
      </div>
    </div>
  );
}

"use client";
/**
 * The "Show me" tours (lib/tours.ts): with ?tour=<id> in the address, the page's controls are shown one at a
 * time. A soft light glides from control to control while the rest of the page dims, and a card beside it says
 * what the control does. The page stays usable underneath (the light lets clicks through), so a reader can try
 * each control as it is shown. Esc ends the tour; the arrow keys and Enter step through it.
 */
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CHAPTER_ORDER, TOURS, type Target } from "@/lib/tours";
import { holdBars } from "@/lib/header";
import { markTourDone } from "@/lib/tour-progress";
import styles from "./Tour.module.css";

const showing = (el: Element) => {
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== "hidden" && cs.display !== "none" && !el.closest("[hidden],[inert],[aria-hidden=true]");
};
/** the first element matching any of the targets that is showing on the screen */
function find(targets: Target[]): HTMLElement | null {
  for (const t of targets) {
    for (const el of document.querySelectorAll<HTMLElement>(t.sel)) {
      if (t.text && !(el.textContent ?? "").toLowerCase().includes(t.text.toLowerCase())) continue;
      if (showing(el)) return el;
    }
  }
  return null;
}
const wait = (targets: Target[], ms: number) => new Promise<HTMLElement | null>((resolve) => {
  const until = performance.now() + ms;
  const look = () => {
    const el = find(targets);
    if (el || performance.now() > until) resolve(el);
    else setTimeout(look, 120);
  };
  look();
});
const phoneScreen = () => matchMedia("(max-width: 760px)").matches;
const reduced = () => document.documentElement.dataset.motion === "reduce"
  || (document.documentElement.dataset.motion !== "full" && matchMedia("(prefers-reduced-motion: reduce)").matches);

interface Box { x: number; y: number; w: number; h: number }
const PAD = 8;

export default function Tour() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const id = params.get("tour");
  const tour = id ? TOURS[id] : undefined;
  const [step, setStep] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [finding, setFinding] = useState(false);
  const [done, setDone] = useState(false);
  const el = useRef<HTMLElement | null>(null);
  const extra = useRef<HTMLElement[]>([]);
  const escaping = useRef(false);
  const card = useRef<HTMLDivElement>(null);
  const dir = useRef(1);
  const [cardH, setCardH] = useState(200);
  const startPath = useRef<string | null>(null);

  // a new tour starts at its first step
  useEffect(() => { setStep(0); setDone(false); dir.current = 1; startPath.current = tour ? pathname : null; }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const end = useCallback(() => {
    const q = new URLSearchParams(params.toString());
    q.delete("tour");
    el.current = null;
    setBox(null);
    router.replace(`${pathname}${q.size ? `?${q}` : ""}`, { scroll: false });
  }, [params, pathname, router]);

  // leaving the page ends the tour (a link followed while trying a control)
  useEffect(() => { if (tour && startPath.current && pathname !== startPath.current) { el.current = null; setBox(null); } }, [pathname, tour]);

  // find the step's control, bring it into view and put the light on it
  useEffect(() => {
    if (!tour || done) return;
    const s = tour.steps[step];
    if (!s) return;
    let live = true;
    (async () => {
      setFinding(true);
      const skip = () => {
        // not on this page (no translation here, signed out…): go on in the direction the reader was going
        setFinding(false);
        const next = step + dir.current;
        if (next < 0 || next >= tour.steps.length) setDone(true); else setStep(next);
      };
      if (s.only && (s.only === "phone") !== phoneScreen()) { skip(); return; }
      if (s.esc) {
        // put away what the step before opened (the passage actions), without ending the tour
        escaping.current = true;
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        escaping.current = false;
      }
      if (s.click) {
        // a click that only applies on some screens (open a phone sheet) is not waited for long
        const c = await wait(s.click, s.at.length && find(s.at) ? 0 : 2500);
        if (!live) return;
        c?.click();
      }
      const target = await wait(s.at, s.click ? 4000 : 9000);
      if (!live) return;
      setFinding(false);
      if (!target) { skip(); return; }
      el.current = target;
      extra.current = (s.with ?? []).map((w) => find([w])).filter((x): x is HTMLElement => !!x);
      holdBars(1500);
      // a short way glides; a long way (far down a long list) jumps, rather than scrolling for seconds
      const far = Math.abs(target.getBoundingClientRect().top - innerHeight / 2) > innerHeight * 2;
      target.scrollIntoView({ block: "center", inline: "nearest", behavior: reduced() || far ? "auto" : "smooth" });
    })();
    return () => { live = false; };
  }, [tour, step, done]);

  // follow the control as the page scrolls or moves
  useEffect(() => {
    if (!tour) return;
    let frame = 0;
    const track = () => {
      const t = el.current;
      if (t && t.isConnected) {
        // one box round the control and any lit with it
        let { left, top, right, bottom } = t.getBoundingClientRect();
        for (const x of extra.current) {
          if (!x.isConnected) continue;
          const r = x.getBoundingClientRect();
          left = Math.min(left, r.left); top = Math.min(top, r.top); right = Math.max(right, r.right); bottom = Math.max(bottom, r.bottom);
        }
        const n = { x: left, y: top, w: right - left, h: bottom - top };
        setBox((b) => (b && Math.abs(b.x - n.x) < 0.5 && Math.abs(b.y - n.y) < 0.5 && Math.abs(b.w - n.w) < 0.5 && Math.abs(b.h - n.h) < 0.5 ? b : n));
      }
      frame = requestAnimationFrame(track);
    };
    frame = requestAnimationFrame(track);
    return () => cancelAnimationFrame(frame);
  }, [tour]);

  const go = useCallback((d: 1 | -1) => {
    if (!tour) return;
    dir.current = d;
    const next = step + d;
    if (next < 0) return;
    if (next >= tour.steps.length) { setDone(true); markTourDone(tour.id); el.current = null; extra.current = []; setBox(null); return; }
    setStep(next);
  }, [tour, step]);

  // the reader did what the step asks (opened the look-up, the passage actions): go on by itself
  useEffect(() => {
    const want = tour && !done && !finding ? tour.steps[step]?.advance : undefined;
    if (!want) return;
    const iv = setInterval(() => { if (find(want)) go(1); }, 250);
    return () => clearInterval(iv);
  }, [tour, step, done, finding, go]);

  // keys: Esc ends, arrows and Enter step (not while typing in a box)
  useEffect(() => {
    if (!tour) return;
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable=true]");
      if (e.key === "Escape") { if (!escaping.current) end(); return; }
      if (typing || e.altKey || e.ctrlKey || e.metaKey) return;
      const inCard = card.current?.contains(e.target as Node);
      if (e.key === "ArrowRight" || (e.key === "Enter" && inCard && (e.target as HTMLElement).tagName !== "BUTTON" && (e.target as HTMLElement).tagName !== "A")) { e.preventDefault(); e.stopPropagation(); if (!done) go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); if (!done) go(-1); }
    };
    addEventListener("keydown", onKey, true);
    return () => removeEventListener("keydown", onKey, true);
  }, [tour, go, end, done]);

  // the card takes the focus at each step, so a screen reader reads it and the keys work
  useLayoutEffect(() => { if (tour && (box || done)) card.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true }); }, [tour, step, done, box === null]); // eslint-disable-line react-hooks/exhaustive-deps

  // the card's real height at its placed width, for placing it (measured only while placed beside a control:
  // a docked card is wider and so shorter, and measuring it there would make the choice of place flicker)
  const dockedNow = useRef(false);
  const shown = !!(tour && (box || done || finding));
  useLayoutEffect(() => {
    const c = card.current;
    if (!c) return;
    const ro = new ResizeObserver(() => { if (!dockedNow.current) setCardH((h) => (Math.abs(h - c.offsetHeight) > 2 ? c.offsetHeight : h)); });
    ro.observe(c);
    return () => ro.disconnect();
  }, [shown]);

  if (!tour) return null;
  const s = tour.steps[step];
  const n = tour.steps.length;
  // the steps for this screen (some are only for phones, some only for wide screens), and where this one is among them
  const phoneNow = typeof window !== "undefined" && phoneScreen();
  const seen = tour.steps.filter((x) => !x.only || (x.only === "phone") === phoneNow);
  const pos = Math.max(0, seen.indexOf(s));
  const order = CHAPTER_ORDER as readonly string[];
  const chapterNo = order.indexOf(tour.id) + 1;
  const nextId = order[order.indexOf(tour.id) + 1];
  const nextTour = nextId ? TOURS[nextId] : undefined;

  // where the card goes: below the control if there is room, else above; on phones, along the bottom
  const vw = typeof window === "undefined" ? 1200 : innerWidth, vh = typeof window === "undefined" ? 800 : innerHeight;
  const phone = vw <= 760;
  const W = Math.min(360, vw - 24);
  let cardStyle: React.CSSProperties | undefined;
  let docked = phone || done;
  if (!docked && box) {
    // the side with room for the whole card: below, above, then beside the control; else along the bottom
    const H = cardH + 16, gap = PAD + 14;
    const clampX = (x: number) => Math.min(Math.max(12, x), vw - W - 12);
    const clampY = (y: number) => Math.min(Math.max(12, y), vh - cardH - 12);
    const below = vh - (box.y + box.h + gap), above = box.y - gap, right = vw - (box.x + box.w + gap), left = box.x - gap;
    if (below >= H) cardStyle = { top: box.y + box.h + gap, left: clampX(box.x + box.w / 2 - W / 2), width: W };
    else if (above >= H) cardStyle = { top: box.y - gap - cardH, left: clampX(box.x + box.w / 2 - W / 2), width: W };
    else if (right >= W + 16) cardStyle = { top: clampY(box.y), left: box.x + box.w + gap, width: W };
    else if (left >= W + 16) cardStyle = { top: clampY(box.y), left: box.x - gap - W, width: W };
    else docked = true;
  }
  dockedNow.current = docked;
  // docked along the bottom, unless the control is low on the screen (a phone's sheets open there): then along the top
  const dockTop = docked && !done && !!box && box.y + box.h / 2 > vh * 0.5;

  return (
    <>
      {box && !done && (
        <div className={styles.light} aria-hidden="true"
          style={{ transform: `translate(${box.x - PAD}px, ${box.y - PAD}px)`, width: box.w + PAD * 2, height: box.h + PAD * 2 }} />
      )}
      {(box || done || finding) && (
        <div ref={card} data-tour-card="" className={`${styles.card} ${docked ? styles.docked : ""} ${dockTop ? styles.dockTop : ""}`} style={cardStyle}
          role="dialog" aria-modal="false" aria-labelledby="tour-title" aria-describedby="tour-text">
          {done ? (
            <>
              <div className={styles.head}>
                <span className="label">The Guide · chapter {chapterNo} of {order.length}</span>
                <button type="button" className={styles.close} onClick={end} aria-label="Close the tour">×</button>
              </div>
              <h2 id="tour-title" tabIndex={-1}><span className={styles.tick} aria-hidden="true">✓</span> {tour.title}</h2>
              {nextTour ? (
                <>
                  <p id="tour-text">Try the controls yourself: nothing you do here can break anything. Next comes <b>{nextTour.title}</b>.</p>
                  <div className={styles.acts}>
                    <Link className="btn small ghost" href={`/guide#${tour.id}`}>The Guide</Link>
                    <Link className="btn small" href={`${nextTour.start}${nextTour.start.includes("?") ? "&" : "?"}tour=${nextTour.id}`}>Next: {nextTour.title} <span className="arr" aria-hidden="true">→</span></Link>
                  </div>
                </>
              ) : (
                <>
                  <p id="tour-text">You have seen the whole site. Where would you like to begin?</p>
                  <div className={styles.acts}>
                    <Link className="btn small ghost" href="/guide">The Guide</Link>
                    <Link className="btn small ghost" href="/read?w=tlg0012.tlg001&at=1.1">Open the Iliad</Link>
                    <Link className="btn small" href="/academy/alphabet">Begin with the alphabet <span className="arr" aria-hidden="true">→</span></Link>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className={styles.head}>
                <span className="label">Step {pos + 1} of {seen.length}</span>
                <span className={styles.dots} aria-hidden="true">{seen.map((_, i) => <i key={i} data-on={i === pos || undefined} data-past={i < pos || undefined} />)}</span>
                <button type="button" className={styles.close} onClick={end} aria-label="Close the tour">×</button>
              </div>
              <h2 id="tour-title" tabIndex={-1}>{finding ? "One moment…" : s.title}</h2>
              <p id="tour-text" aria-live="polite">{finding ? "Finding it on the page." : (phone && s.phoneText) || s.text}</p>
              {pos === 0 && !finding && <p className={styles.hint}>You can try each control while the light is on it.</p>}
              <div className={styles.acts}>
                <button type="button" className="btn small ghost" onClick={() => go(-1)} disabled={step === 0}>Back</button>
                <button type="button" className="btn small" onClick={() => go(1)} disabled={finding}>{pos === seen.length - 1 ? "Done" : "Next"}</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

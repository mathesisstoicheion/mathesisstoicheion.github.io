"use client";
/**
 * The phone's back gesture steps back through the look-up (the quiet desk, back routes, the owner, 2026-10-29).
 *
 * Opening the look-up adds one step to the browser's history (the same address, a marker in its state), and opening
 * "More about it" adds another. The browser's Back then goes second layer, first layer, closed, and never leaves the
 * reader or moves the text. Closing the look-up any other way (×, Escape, a tap outside, Previous and Next) keeps the
 * history in step: going from word to word adds nothing, and closing steps back over the steps added, once.
 */
import { useEffect, useRef } from "react";

const MARK = "lookupStep";

/** How many steps to add to the history, or step back over, to take it from `pushed` steps to `wanted`. */
export function stepsToTake(wanted: number, pushed: number): { add: number; back: number } {
  return wanted > pushed ? { add: wanted - pushed, back: 0 } : { add: 0, back: pushed - wanted };
}

/** Which of our steps a history entry's state stands for (0: none; the reader's own entries carry no mark). */
export function stepOf(state: unknown): number {
  const n = state && typeof state === "object" ? (state as Record<string, unknown>)[MARK] : 0;
  return typeof n === "number" && Number.isInteger(n) && n > 0 ? n : 0;
}

/** What the browser did when it landed on step `landed` while we stood on `pushed`: nothing new, back, or forward again. */
export function afterPop(landed: number, pushed: number): "same" | "back" | "forward" {
  return landed === pushed ? "same" : landed < pushed ? "back" : "forward";
}

/**
 * Keeps the browser's history level with how deep the look-up is.
 * @param depth    0 closed, 1 the first layer, 2 "More about it"
 * @param enabled  only the reader's own page (not the floating window, nor two books side by side)
 * @param onBack   the browser's Back (or Forward) landed on this depth: the look-up goes to it
 */
export function useBackSteps(depth: number, enabled: boolean, onBack: (depth: number) => void) {
  const wanted = useRef(0);
  const pushed = useRef(0);             // the steps we added that are still behind us
  const waiting = useRef(false);        // we asked the browser to step back and it has not landed yet
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scroll = useRef<string | null>(null);
  const onBackRef = useRef(onBack);
  const run = useRef<() => void>(() => {});
  useEffect(() => { onBackRef.current = onBack; });

  useEffect(() => {
    // The browser puts the page back where it stood at a step when it returns to it; the text has moved on since (the line
    // is brought up under the bar, the reader scrolls on), so while there are steps it leaves the scrolling alone.
    const keepScroll = (on: boolean) => {
      try {
        if (on && scroll.current === null) { scroll.current = history.scrollRestoration; history.scrollRestoration = "manual"; }
        else if (!on && scroll.current !== null) { history.scrollRestoration = scroll.current as ScrollRestoration; scroll.current = null; }
      } catch { /* a browser without it */ }
    };
    // a mark left on this entry by an earlier visit means nothing now: take it off
    if (stepOf(history.state) > 0) {
      const rest = { ...(history.state as Record<string, unknown>) };
      delete rest[MARK];
      history.replaceState(rest, "");
    }
    run.current = () => {
      if (waiting.current) return;                     // popstate calls this again when the step back has landed
      const { add, back } = stepsToTake(wanted.current, pushed.current);
      if (add) {
        keepScroll(true);
        for (let i = 0; i < add; i++) history.pushState({ [MARK]: ++pushed.current }, "");
      } else if (back) {
        // only from our own newest step: if the reader has moved on (a link followed, the address changed), going back
        // would undo that, so the steps behind are left (they are marks the reader ignores)
        if (stepOf(history.state) !== pushed.current) { pushed.current = 0; keepScroll(false); return; }
        const to = wanted.current;
        waiting.current = true;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => { waiting.current = false; run.current(); }, 400);
        history.go(to - pushed.current);
        pushed.current = to;
      }
    };
    const onPop = (e: PopStateEvent) => {
      const landed = stepOf(e.state);
      if (waiting.current) {                           // our own step back
        waiting.current = false; clearTimeout(timer.current);
        pushed.current = landed;
        if (landed === 0) setTimeout(() => keepScroll(false), 0);
        run.current();
        return;
      }
      const what = afterPop(landed, pushed.current);
      if (what === "back") {                           // the browser's Back: the look-up goes up to match
        pushed.current = landed;
        if (landed === 0) setTimeout(() => keepScroll(false), 0);
        onBackRef.current(landed);
      } else if (what === "forward") {                 // Forward onto a step already left: nothing to show there, so step back off it
        waiting.current = true;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => { waiting.current = false; run.current(); }, 400);
        history.go(pushed.current - landed);
      }
    };
    addEventListener("popstate", onPop);
    return () => { removeEventListener("popstate", onPop); clearTimeout(timer.current); waiting.current = false; keepScroll(false); run.current = () => {}; };
  }, []);

  useEffect(() => {
    wanted.current = enabled ? depth : 0;
    run.current();
  }, [depth, enabled]);
}

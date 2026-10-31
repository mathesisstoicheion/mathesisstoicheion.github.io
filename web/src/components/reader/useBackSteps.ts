"use client";
/**
 * The phone's back gesture closes what is open over the text, newest first (the quiet desk, ticket 11, the owner, 2026-10-30; before this
 * only the look-up had steps: back routes, 2026-10-29).
 *
 * In the reader of one book everything that opens over the text is a layer: the Aa, Study and Go to menus, every panel, the passage toolbar,
 * the look-up and its second layer "More about it". Each layer adds one step to the browser's history (the same address, a marker in its
 * state), and the browser's Back lands on the step before: the layers above it close, newest first (afterBack). A panel opened from a row
 * of Study leaves Study waiting under it, and the look-up waits under the Echoes or the sentence it opened, so Back shows that again and the
 * next Back closes it, as the panel's own "Back to …" does. Back never leaves the reader or moves the text. Closing a layer any other way
 * (×, Escape, a tap outside, a panel's own way back, a choice in a menu, Previous and Next in the look-up) keeps the history in step: going
 * from word to word adds nothing, closing steps back over the steps added, once, so that with everything closed one Back leaves the reader
 * as before and Forward never opens anything. A page turned (Go to, Previous, Next, another edition) first takes the history back over the
 * steps (afterSteps), so that the page is one step itself and the traversal does not undo it; so does a link that leaves the reader from a
 * menu that closes with the click (leaveBy: Study's Home, the bar's Library) and the tour's end, which changes the address as Esc puts Study away.
 */
import { useEffect, useRef } from "react";

const MARK = "readerStep";

/**
 * What can be open over the text. "word" and "word+" are the look-up (first layer, and "More about it") waiting under the Echoes or the sentence
 * it opened; they are shut for the while and come back when Back closes what covers them. "study" is the menu, and it waits under a panel opened
 * from one of its rows.
 */
export type Layer =
  | "aa" | "study" | "goto"
  | "find" | "vocab" | "places" | "ms" | "talk" | "cmp" | "echoes" | "sentence"
  | "note" | "share" | "notebook" | "books" | "mine" | "toolbar"
  | "look" | "more" | "word" | "word+";

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
 * The layers now in the history, oldest first: step 1 stands for the first, step 2 for the second, and so on. Those waiting under another
 * stand at the bottom; the rest keep the order they were opened in (a layer that has closed and opens again goes to the end), and those
 * opened just now go on the end in the order `open` lists them.
 * @param before   the stack as it stood
 * @param open     the layers open now
 * @param waiting  the layers shut for the while under what is open (Study under a panel, the look-up under Echoes)
 */
export function stackOf(before: Layer[], open: Layer[], waiting: Layer[] = []): Layer[] {
  const down = [...new Set(waiting)];
  const here = open.filter((l) => !down.includes(l));
  const kept = before.filter((l) => here.includes(l));
  return [...down, ...kept, ...here.filter((l) => !kept.includes(l))];
}

/**
 * What to do when the browser's Back lands on step `landed` while `stack` is open: the layers above that step close, newest first, and the layer
 * now on top is shown if it was shut (Study under the panel that has just closed). `isOpen` says whether a layer is open now.
 */
export function afterBack(stack: Layer[], landed: number, isOpen: (layer: Layer) => boolean): { close: Layer[]; show: Layer | null } {
  const at = Math.max(0, Math.min(landed, stack.length));
  const top = at > 0 ? stack[at - 1] : undefined;
  return { close: stack.slice(at).reverse(), show: top !== undefined && !isOpen(top) ? top : null };
}

/** The reader's hook, for `afterSteps` (set while the hook is on in a reader of one book). */
let level: ((go: () => void) => void) | null = null;

/**
 * Runs `go`, a page turned (a new address in the history), once the history stands level: the steps added for what is open are first stepped
 * back over, since a step back asked for in the same moment can land after the new address and undo it. With no steps added, `go` runs now.
 * Whatever is still open after the page has turned gets its steps again.
 */
export function afterSteps(go: () => void) {
  if (level) level(go); else go();
}

/**
 * A link that leaves the reader from a menu that closes with the click (Study's Home and the like, the bar's Library): with steps added, it waits for
 * the history to stand level, as a page turned does, since the menu's step back and the link's new address would race (the reader came back after
 * Home). A click meant for another tab (a modifier key, the middle button) is the browser's.
 */
export function leaveBy(e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; defaultPrevented: boolean; preventDefault: () => void }, go: () => void) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  afterSteps(go);
}

/**
 * Keeps the browser's history level with how many layers are open.
 * @param depth    how many layers are open (the length of the stack)
 * @param enabled  only the reader's own page of one book (not the floating window, nor two books side by side)
 * @param onBack   the browser's Back landed on this step: the layers above it close
 * @param address  the reader's address; a page turned by afterSteps is done when it changes
 */
export function useBackSteps(depth: number, enabled: boolean, onBack: (landed: number) => void, address = "") {
  const wanted = useRef(0);
  const pushed = useRef(0);             // the steps we added that are still behind us
  const waiting = useRef(false);        // we asked the browser to step back and it has not landed yet
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const held = useRef<(() => void)[]>([]);   // page turns (afterSteps) waiting for the history to stand level
  const going = useRef(false);          // a page turn has been let go and its address has not come: no steps are added till then
  const goTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scroll = useRef<string | null>(null);
  const onBackRef = useRef(onBack);
  const run = useRef<() => void>(() => {});
  const turn = useRef<(go: () => void) => void>((go) => go());
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
    // the history stands level: the page turns held can go, and no step is added till the address has come (or a moment has passed)
    const release = () => {
      const turns = held.current;
      held.current = [];
      if (!turns.length) return;
      going.current = true;
      clearTimeout(goTimer.current);
      goTimer.current = setTimeout(() => { going.current = false; run.current(); }, 1200);
      turns.forEach((go) => go());
    };
    const stepBack = (to: number) => {
      waiting.current = true;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { waiting.current = false; run.current(); }, 400);
      history.go(to - pushed.current);
      pushed.current = to;
    };
    run.current = () => {
      if (waiting.current || going.current) return;    // popstate calls this again when the step back has landed
      const goal = held.current.length ? 0 : wanted.current;
      const { add, back } = stepsToTake(goal, pushed.current);
      if (add) {
        keepScroll(true);
        for (let i = 0; i < add; i++) history.pushState({ [MARK]: ++pushed.current }, "");
      } else if (back) {
        // only from our own newest step: if the reader has moved on (a link followed, the address changed), going back
        // would undo that, so the steps behind are left (they are marks the reader ignores)
        if (stepOf(history.state) !== pushed.current) { pushed.current = 0; keepScroll(false); release(); return; }
        stepBack(goal);
      } else release();
    };
    turn.current = (go) => {
      if (!held.current.length && !waiting.current && !pushed.current) { go(); return; }   // nothing behind us
      held.current.push(go);
      run.current();
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
      if (what === "back") {                           // the browser's Back: the layers above the step go
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
    return () => {
      removeEventListener("popstate", onPop); clearTimeout(timer.current); clearTimeout(goTimer.current);
      waiting.current = false; going.current = false; keepScroll(false); run.current = () => {};
      const turns = held.current;                      // the reader is leaving: a page turn held goes at once
      held.current = [];
      turns.forEach((go) => go());
    };
  }, []);

  // the reader of one book answers afterSteps while it is on
  useEffect(() => {
    if (!enabled) return;
    const mine = (go: () => void) => turn.current(go);
    level = mine;
    return () => { if (level === mine) level = null; };
  }, [enabled]);

  useEffect(() => {
    wanted.current = enabled ? depth : 0;
    run.current();
  }, [depth, enabled]);

  // a page turned has come: what is still open gets its steps again
  useEffect(() => {
    if (!going.current) return;
    going.current = false;
    clearTimeout(goTimer.current);
    run.current();
  }, [address]);
}

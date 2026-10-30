import { useLayoutEffect, useState, type RefObject } from "react";
import { LIMITS, type GreekSize } from "./settings";

/**
 * The Greek's size as the reader shows it (the quiet desk, ticket 10, the owner, 2026-10-30). The setting is a number the reader chose or "auto", the size
 * that suits the device (styles/tokens.css, --greek-auto: about 26 px on a computer, 18 px on a phone, from the width of the page). Every control that
 * steps the size (Aa's and Settings' Greek size, the search's "bigger" and "smaller", the phone's two-finger pinch) starts from the size on the screen
 * now, which only the page can say; the first step from "auto" saves a number.
 */

/** The size in px and in rem as the reader shows it now. It is read from a probe set with the reader's own rule, so it is right for the width of the window as
 *  it is, for a size the reader has chosen, and for a page of verse set a little smaller than the reader's size to stand whole (lib/verseFit.ts, --fit on
 *  the reader): the stepper names the size the Greek has on the screen, and one step is one step from there, never a jump to some other size. It is never
 *  worked out a second time here.
 *  `from` is an element inside a reader (marked data-reader): the probe stands there and takes that reader's rule, which two books side by side and the
 *  floating window set for themselves (Reader.module.css). With no element named (the search's "bigger text") it is the page's reader, if there is one; with
 *  an element that is in no reader (the Settings page), or no reader on the page, it is the reader's rule as it would be, without any fitting. */
export function shownGreekSize(from?: Element | null): { px: number; rem: number } {
  const reader = (from === undefined ? document.querySelector("[data-reader]") : from?.closest("[data-reader]")) ?? null;
  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;font-size:${reader ? "calc(var(--greek-size) * var(--fit, 1))" : "var(--greek-chosen, var(--greek-auto))"}`;
  (reader ?? document.body).append(probe);
  const px = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  return { px, rem: inRem(px) };
}

/** A size in px as rem on this page (the rem grows a little above 1600 px: tokens.css, --root-grow). */
export const inRem = (px: number) => px / (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);

/** A size in rem on the step's grid (a whole number of px at 16 px to the rem), so that a size worked out from a probe, 18.007 px, is a size the buttons know: 1.125 rem. */
export const snapRem = (rem: number) => Math.round(rem / LIMITS.greekSize.step) * LIMITS.greekSize.step;

/**
 * The size one step (or `steps`) bigger (dir 1) or smaller (-1) than the one shown now, in rem, inside the limits. It starts from the saved size when the
 * reader chose one, and from the size shown now (`shownRem`) when it is "auto": the first step saves a number, and the Greek on the screen changes by the
 * step, not by a jump to some other size.
 */
export function steppedSize(current: GreekSize, shownRem: number, dir: 1 | -1, steps = 1): number {
  const { min, max, step } = LIMITS.greekSize;
  const from = typeof current === "number" ? current : snapRem(shownRem);
  return Math.min(max, Math.max(min, from + dir * steps * step));
}

/**
 * The size shown now, for a control that names it ("26 px"): read when the control appears, when the size is set, when the window changes size (the size
 * that suits the device follows the window) and when its reader's fit changes (a page of verse is fitted after it is drawn, and again when the window or the
 * book changes: Reader.tsx sets --fit on the reader's style). `ref` is an element of the control, which finds its reader (shownGreekSize). Until it is read
 * the size is 0.
 */
export function useShownGreekSize(ref: RefObject<Element | null>, size: GreekSize) {
  const [shown, setShown] = useState({ px: 0, rem: 0 });
  useLayoutEffect(() => {
    const read = () => {
      const now = shownGreekSize(ref.current);
      setShown((was) => (was.px === now.px && was.rem === now.rem ? was : now));
    };
    read();
    addEventListener("resize", read);
    const reader = ref.current?.closest("[data-reader]");
    const fit = reader ? new MutationObserver(read) : null;
    if (reader) fit?.observe(reader, { attributes: true, attributeFilter: ["style"] });
    return () => { removeEventListener("resize", read); fit?.disconnect(); };
  }, [ref, size]);
  return shown;
}

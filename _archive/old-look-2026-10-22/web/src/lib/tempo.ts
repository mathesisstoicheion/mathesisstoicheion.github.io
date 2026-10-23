/**
 * The site's tempo (--tempo in styles/tokens.css; the owner, 2026-10-20: "They need to animate faster"): every animation
 * that plays out once runs this many times as fast as the time written for it. Stylesheets divide their times by it; these
 * are for times set from a script.
 */
export function tempo(): number {
  if (typeof document === "undefined") return 1;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tempo"));
  return v > 0 ? v : 1;
}

/** a time in milliseconds for a script's animation, at the site's tempo */
export const atTempo = (ms: number): number => ms / tempo();

/** a CSS time for an inline style, at the site's tempo: "0.3s" becomes "calc(0.3s / var(--tempo))" */
export const cssTempo = (time: string): string => `calc(${time} / var(--tempo))`;

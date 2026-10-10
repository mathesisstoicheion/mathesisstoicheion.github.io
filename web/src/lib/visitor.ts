/**
 * First visit or returning? (Phase 11, the home page.) A first visit is asked where it is starting; a returning
 * visitor gets their desk instead. Someone counts as returning once they have chosen a start, opened a text, done
 * anything in the Academy, or visited any page besides the home page. All of it is kept on this device only.
 *
 * The answer is written on <html> as data-visitor="back" before the first paint (VISITOR_SCRIPT, in the layout's
 * head), so the home page shows the right half at once; markVisitor() refreshes it when the home page opens again
 * after moving around the site without a reload.
 */
export const START_KEY = "mathesis:start";

export type StartChoice = "none" | "some" | "read";

/** The rule as plain JavaScript, for the inline script (it runs before the app loads). */
export const RULE = `function(){try{var l=localStorage;if(l.getItem(${JSON.stringify(START_KEY)})||l.getItem("mathesis:academy"))return true;
if(Object.keys(JSON.parse(l.getItem("mathesis:positions")||"{}")).length)return true;
return (JSON.parse(l.getItem("mathesis:resume")||"{}").trail||[]).some(function(v){return v&&v.href!=="/"});}catch(_){return false}}`;

export const VISITOR_SCRIPT = `(function(){if((${RULE})())document.documentElement.setAttribute("data-visitor","back");})();`;

/** The same rule in TypeScript (visitor.test.ts checks that the two agree). */
export function isReturning(): boolean {
  try {
    const l = localStorage;
    if (l.getItem(START_KEY) || l.getItem("mathesis:academy")) return true;
    if (Object.keys(JSON.parse(l.getItem("mathesis:positions") || "{}")).length) return true;
    return ((JSON.parse(l.getItem("mathesis:resume") || "{}").trail ?? []) as { href?: string }[]).some((v) => v && v.href !== "/");
  } catch { return false; }
}

/** Bring <html>'s mark up to date (the home page calls this when it opens). */
export function markVisitor(): boolean {
  const back = isReturning();
  if (back) document.documentElement.setAttribute("data-visitor", "back");
  else document.documentElement.removeAttribute("data-visitor");
  return back;
}

/** Remember the answer to "Where are you starting?". */
export function saveStart(choice: StartChoice) {
  try { localStorage.setItem(START_KEY, JSON.stringify({ choice, t: Date.now() })); } catch { /* storage unavailable */ }
}

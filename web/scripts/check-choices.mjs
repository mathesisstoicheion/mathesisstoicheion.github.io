// The choices check (whole-site pass, 2026-10-29): a row of choices of which one is picked (a radiogroup, a row of tabs)
// reads as one control only when it holds together on a phone. On a narrow screen such a row may run onto a second line
// as even rows (the Oracle's five kinds of search, three then two), but not leave one choice alone on its line under
// the others (the alphabet's Classical Attic and Erasmian, with Modern Greek under them), and no choice's words may be
// cut off. A row that slides sideways (the Tables of forms' filters) stands on one line and is left alone.
// usage: node web/scripts/check-choices.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const PAGES = ["/academy/alphabet", "/academy/reading/letters", "/academy/reading", "/academy/practice", "/academy/tables",
  "/academy/lesson/letters", "/search", "/library", "/treasury", "/stoa"];
const WIDTHS = [360, 390];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true, serviceWorkers: "block", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const rows = await page.evaluate(() => {
      const out = [];
      for (const g of document.querySelectorAll('[role=radiogroup], [role=tablist]')) {
        const r = g.getBoundingClientRect();
        if (r.width < 2 || getComputedStyle(g).visibility === "hidden" || g.closest("[hidden],[inert]")) continue;
        const cs = getComputedStyle(g);
        if (/(auto|scroll)/.test(cs.overflowX) && g.scrollWidth > g.clientWidth + 1) continue;   // slides sideways
        const items = [...g.querySelectorAll('[role=radio], [role=tab]')].filter((b) => b.getBoundingClientRect().width > 1);
        if (items.length < 2) continue;
        const tops = new Map();
        for (const b of items) { const t = Math.round(b.getBoundingClientRect().top / 6); tops.set(t, (tops.get(t) ?? 0) + 1); }
        const counts = [...tops.entries()].sort((a, b) => a[0] - b[0]).map(([, n]) => n);
        const cut = items.filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent.trim());
        out.push({ name: g.getAttribute("aria-label") ?? "", counts, cut });
      }
      return out;
    });
    for (const { name, counts, cut } of rows) {
      if (counts.length > 1 && counts.at(-1) === 1) found.push(`${width}px ${path}: "${name}" leaves one choice alone on its line (rows of ${counts.join(" + ")})`);
      for (const c of cut) found.push(`${width}px ${path}: "${name}": the words of "${c}" are cut off`);
    }
  }
  await ctx.close();
}
await browser.close();

if (found.length) {
  console.log(`check-choices: ${found.length} problem${found.length === 1 ? "" : "s"}`);
  for (const f of found) console.log("  " + f);
  process.exit(1);
}
console.log(`check-choices: OK (${PAGES.length} pages at ${WIDTHS.join(" and ")} px: every row of choices holds together)`);

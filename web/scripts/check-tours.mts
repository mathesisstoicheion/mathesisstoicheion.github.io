/**
 * The tours check (whole-site pass, 2026-10-29): every step of the Guide's "Show me" tours (src/lib/tours.ts) still finds
 * the control it points at, on a phone and on a computer. A tour skips a step whose control is not on the page, so when
 * a page changes under it the tour quietly loses steps and nobody sees it; this check runs each tour as a reader would,
 * pressing Next, and lists every step it never showed, and every step shown with its light round nothing the reader can
 * see (a control in a phone's menu that had closed under it: the Make it yours tour's account step, 2026-10-30).
 *
 *   npx tsx scripts/check-tours.mts <base-url> [tour ids…]   (all tours when none are named; CHROMIUM=<path> picks the
 *                                                            browser; exits with 1 on a problem)
 */
import { chromium, type Page } from "playwright";
import { CHAPTER_ORDER, TOURS } from "../src/lib/tours";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const ids = only.length ? only : [...CHAPTER_ORDER];
const VIEWS = {
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  computer: { viewport: { width: 1440, height: 900 } },
};

/** the titles a tour shows, pressing Next until its last card (a step not found is skipped by the tour itself), and
 * those shown with their light round nothing (a light is the control's box and 8 px round it: 16 px round an empty one) */
async function run(page: Page, id: string): Promise<{ shown: string[]; dark: string[] }> {
  const tour = TOURS[id];
  const shown: string[] = [], dark: string[] = [];
  await page.goto(`${base}${tour.start}${tour.start.includes("?") ? "&" : "?"}tour=${id}`, { waitUntil: "load" });
  const card = page.locator("[data-tour-card]");
  for (let i = 0; i < tour.steps.length + 2; i++) {
    // the card says "One moment…" while it looks for the step's control (up to 9 s each, and the steps it skips add up),
    // then names the step
    const title = card.locator("#tour-title");
    await title.filter({ hasNotText: "One moment" }).waitFor({ timeout: 60_000 });
    const text = (await title.textContent())?.trim() ?? "";
    if (text.startsWith("✓")) break;        // the last card: the chapter is done
    if (shown.at(-1) !== text) {
      shown.push(text);
      await page.waitForTimeout(400);       // the light follows its control on the next frames
      const lit = await page.evaluate(() => {
        const r = document.querySelector("[data-tour-light]")?.getBoundingClientRect();
        return !!r && r.width > 20 && r.height > 20 && r.bottom > 0 && r.top < innerHeight;
      });
      if (!lit) dark.push(text);
    }
    await card.getByRole("button", { name: /^(Next|Done)$/ }).click();
    await page.waitForTimeout(300);
  }
  return { shown, dark };
}

// A step that first opens something (a phone's menu) races the tap on Next that brought it: the tap may close what the
// step opens, and which comes first varies from tap to tap (the Make it yours tour lost a step in 3 runs of 8). Such a
// tour is run five times on a phone, and a step lost in any run is listed once.
const RACES = 5;
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = new Set<string>();
for (const [view, opts] of Object.entries(VIEWS)) {
  const ctx = await browser.newContext({ ...opts, serviceWorkers: "block", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const id of ids) {
    const tour = TOURS[id];
    if (!tour) { found.add(`no tour "${id}"`); continue; }
    const want = tour.steps.filter((s) => !s.only || (s.only === "phone") === (view === "phone")).map((s) => s.title);
    const runs = view === "phone" && tour.steps.some((s) => s.click) ? RACES : 1;
    for (let r = 0; r < runs; r++) {
      let seen: { shown: string[]; dark: string[] };
      try { seen = await run(page, id); } catch (e) { found.add(`${view} ${id}: the tour stopped (${(e as Error).message.split("\n")[0]})`); continue; }
      for (const t of want) if (!seen.shown.includes(t)) found.add(`${view} ${id}: the step "${t}" finds nothing to point at`);
      for (const t of seen.dark) found.add(`${view} ${id}: the step "${t}" lights nothing on the screen`);
    }
  }
  await ctx.close();
}
await browser.close();

if (found.size) {
  console.log(`check-tours: ${found.size} problem${found.size === 1 ? "" : "s"}`);
  for (const f of found) console.log("  " + f);
  process.exit(1);
}
console.log(`check-tours: OK (${ids.length} tours, every step found and lit on a phone and a computer; those that open a menu run ${RACES} times on a phone)`);

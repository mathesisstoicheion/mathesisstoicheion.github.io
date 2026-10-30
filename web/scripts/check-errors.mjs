// The errors check (whole-site pass, 2026-10-29): the learning pages open without an error, on a phone and on a computer.
// A page built ahead of time must show, as it loads, exactly what the browser then draws: anything picked at random or
// read from this device (a drill's question, the learner's progress) is picked after the first paint. When the two
// differ, React throws the page away and draws it again (its error #418), so Today's session flickered and lost its
// first paint. This check opens each page and fails on any uncaught error or error in the console, apart from a file
// the network could not fetch (the packs come from another site and are checked elsewhere).
// A page is built once and read on every day after: what it shows for "today" (the passage of the day) must agree with
// what was built on that day too, or from the second day on it is drawn twice, as the home page was (2026-10-30). So each
// page is opened a third time, on a computer whose clock is a day ahead of the build's.
// usage: node web/scripts/check-errors.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const PAGES = [
  "/", "/academy", "/academy/today", "/academy/practice", "/academy/reading", "/academy/reading/letters",
  "/academy/reading/nothing-too-much", "/academy/reading/practice-1", "/academy/alphabet", "/academy/tables",
  "/academy/vocabulary", "/academy/lesson/letters", "/academy/lesson/case", "/academy/checkpoint/first-steps", "/guide", "/library", "/treasury",
];
const VIEWS = {
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  computer: { viewport: { width: 1440, height: 900 } },
  "computer, the next day": { viewport: { width: 1440, height: 900 }, later: 864e5 },
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const [view, { later, ...opts }] of Object.entries(VIEWS)) {
  const ctx = await browser.newContext({ ...opts, serviceWorkers: "block", reducedMotion: "reduce" });
  if (later) await ctx.clock.install({ time: Date.now() + later });   // the clock runs on from there
  const page = await ctx.newPage();
  let at = "";
  const note = (msg) => found.push(`${view} ${at}: ${String(msg).replace(/\s+/g, " ").slice(0, 200)}`);
  page.on("pageerror", (e) => note(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/^Failed to load resource/.test(m.text())) note(m.text()); });
  for (const path of PAGES) {
    at = path;
    const res = await page.goto(base + path, { waitUntil: "load" });
    if (!res || res.status() >= 400) note(`the page answered ${res?.status() ?? "nothing"}`);
    await page.waitForTimeout(1500);   // the first paint, then the effects that fill it in
  }
  await ctx.close();
}
await browser.close();

if (found.length) {
  console.log(`check-errors: ${found.length} problem${found.length === 1 ? "" : "s"}`);
  for (const f of found) console.log("  " + f);
  process.exit(1);
}
console.log(`check-errors: OK (${PAGES.length} pages, on a phone and a computer, and on a computer the day after, open without an error)`);

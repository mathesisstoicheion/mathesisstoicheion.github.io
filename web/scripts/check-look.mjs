// Paper or Night follows the device, and the reader's own choice wins (redesign decision 2, SPEC.md 7). On each page, at a
// computer's width and a phone's, for each of the three choices in Settings (Follow device, Paper, Night) with the device
// set light and set dark, it lists any page whose paper is not the one it should be:
//   first   - as the page first arrives (before the site's code has run), so no page ever flashes the wrong look
//   settled - once the page has loaded
//   bar     - the browser's own bar (theme-color) not in the page's colour
//   live    - the device changing between light and dark while the page is open: followed when the choice is Follow
//             device, and ignored when it is Paper or Night
// usage: node web/scripts/check-look.mjs [base-url]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        PROVE_CSS=<css> adds a fault to every page, to show the check catches it. Proved 2026-10-23: Night forced on the
//        page (html and body set to the night colour) was listed on every page where Paper was due.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const PAGES = ["/", "/library", "/read?w=tlg0012.tlg001", "/stoa", "/academy", "/treasury", "/no-such-page"];
// the paper and the night page (styles/tokens.css --paper, --night; lib/settings.ts THEME_COLOUR, THEME_COLOUR_NIGHT)
const LOOK = { paper: { bg: "rgb(243, 236, 224)", bar: "#f3ece0" }, night: { bg: "rgb(27, 24, 20)", bar: "#1b1814" } };
const CHOICES = ["auto", "paper", "night"];
const due = (choice, device) => (choice === "auto" ? (device === "dark" ? "night" : "paper") : choice);

const look = (page) => page.evaluate(() => {
  const bg = getComputedStyle(document.documentElement).backgroundColor;
  const bar = [...document.querySelectorAll('meta[name="theme-color"]')].find((m) => !m.media || matchMedia(m.media).matches)?.content;
  return { bg, bar };
});
const name = (bg) => Object.entries(LOOK).find(([, v]) => v.bg === bg)?.[0] ?? bg;

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const [w, h] of [[1280, 900], [390, 844]]) {
  for (const choice of CHOICES) {
    for (const device of ["light", "dark"]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: device, isMobile: w < 500, hasTouch: w < 500 });
      // the choice as Settings saves it (lib/settings.ts, version 2), with motion reduced so nothing is caught mid-fade
      await ctx.addInitScript((c) => { try { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: c, motion: "reduce" }, version: 2 })); } catch { /* none */ } }, choice);
      if (process.env.PROVE_CSS) await ctx.addInitScript((c) => document.addEventListener("readystatechange", () => document.head.append(Object.assign(document.createElement("style"), { textContent: c })), { once: true }), process.env.PROVE_CSS);
      const page = await ctx.newPage();
      for (const path of PAGES) {
        const want = due(choice, device), where = `${path} at ${w}px, ${choice === "auto" ? "Follow device" : choice}, device ${device}`;
        // first: the page as it arrives, before the site's own code has run
        await page.route("**/_next/static/chunks/**/*.js", (r) => r.abort());
        await page.goto(base + path, { waitUntil: "domcontentloaded" });
        const first = await look(page);
        if (first.bg !== LOOK[want].bg) found.push(`${where}: first: ${name(first.bg)} where ${want} is due`);
        await page.unrouteAll({ behavior: "ignoreErrors" });
        // settled: the page as it stands once loaded
        await page.goto(base + path, { waitUntil: "networkidle" });
        const settled = await look(page);
        if (settled.bg !== LOOK[want].bg) found.push(`${where}: settled: ${name(settled.bg)} where ${want} is due`);
        if (settled.bar !== LOOK[want].bar) found.push(`${where}: bar: the browser's bar is ${settled.bar} where ${LOOK[want].bar} is due`);
        // live: the device turns the other way while the page is open
        const other = device === "dark" ? "light" : "dark";
        await page.emulateMedia({ colorScheme: other });
        await page.waitForTimeout(150);
        const live = await look(page), wantLive = due(choice, other);
        if (live.bg !== LOOK[wantLive].bg) found.push(`${where}: live: ${name(live.bg)} after the device turned ${other}, where ${wantLive} is due`);
        if (live.bar !== LOOK[wantLive].bar) found.push(`${where}: live: the browser's bar is ${live.bar} after the device turned ${other}, where ${LOOK[wantLive].bar} is due`);
        await page.emulateMedia({ colorScheme: device });
      }
      await ctx.close();
    }
  }
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `Paper and Night follow the device, and the choice in Settings wins, from the first paint (${PAGES.length} pages, two widths)`);
process.exit(found.length ? 1 : 0);

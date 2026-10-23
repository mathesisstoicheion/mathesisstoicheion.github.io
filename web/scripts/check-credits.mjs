// Every photograph on a page has a visible credit (redesign SPEC.md 7; decision 6: "every photo shows its credit"). A
// photograph is any picture the site serves from /images/ (its museums' and Wikimedia Commons' photographs, lib/photos.ts).
// Each one carries data-photo with its name (components/plate/Plate.tsx), and somewhere on the same page, shown, there must
// be its credit: an element with data-credit of the same name, with a link to the licence. A plate prints it beneath
// itself; the small pictures in a list are credited in the page's list of plates (PlateList). It lists:
//   unnamed     - a photograph with no data-photo, so nothing ties it to a credit
//   uncredited  - a photograph whose credit is not on the page, or is there but not shown (hidden, no size, invisible)
//   unlicensed  - a credit with no link (its licence and source are links, as the record gives them)
// Each page is opened on a computer (1280 px) and a phone (390 px), with motion reduced so it is printed at once, and
// scrolled to its end so that whatever comes in as it is read is there too. Only photographs shown at that width count
// (the plate beside a page's title is held twice, once for each width).
// usage: node web/scripts/check-credits.mjs [base-url] [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/lesson/letters", "/academy/alphabet", "/academy/practice", "/library",
  "/library/author?a=tlg0012", "/author/tlg0012", "/work/tlg0012-tlg001", "/read?w=tlg0059.tlg002", "/search", "/stoa",
  "/stoa/kerameikos", "/stoa/authors", "/stoa/eras", "/stoa/manuscripts", "/stoa/lyre", "/stoa/antikythera-mechanism",
  "/stoa/delphi", "/stoa/kleroterion", "/stoa/mycenae", "/treasury", "/downloads", "/account", "/about", "/credits", "/guide", "/no-such-page",
];
const WIDTHS = [[1280, 900], [390, 844]];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
let photos = 0;
for (const [w, h] of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", isMobile: w < 500, hasTouch: w < 500 });
  // a visitor who has been here before (the home page shows the desk, no first-visit question), with motion reduced
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem("mathesis:settings")) localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 2 }));
    } catch { /* storage unavailable */ }
  });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    const where = `${path} at ${w}px`;
    try {
      await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
    } catch (e) {
      found.push(`${where}: did not open (${e.message.split("\n")[0]})`);
      continue;
    }
    // read to the end, so that what comes in on the way is there too, then back to the top
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    const res = await page.evaluate(() => {
      const shown = (e) => e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && e.getClientRects().length > 0
        && [...e.getClientRects()].some((r) => r.width > 0 && r.height > 0);
      const out = { photos: 0, problems: [] };
      for (const img of document.querySelectorAll("img")) {
        const src = img.getAttribute("src") ?? "";
        if (!/^\/images\//.test(src) || !shown(img)) continue;
        out.photos++;
        const id = img.dataset.photo;
        if (!id) { out.problems.push(`unnamed: ${src}`); continue; }
        const credits = [...document.querySelectorAll(`[data-credit="${CSS.escape(id)}"]`)];
        const credit = credits.find(shown);
        if (!credit) out.problems.push(`uncredited: ${id}${credits.length ? " (its credit is on the page but not shown)" : ""}`);
        else if (!credit.querySelector("a[href]")) out.problems.push(`unlicensed: ${id} (its credit has no link to the licence or source)`);
      }
      return out;
    });
    photos += res.photos;
    for (const p of new Set(res.problems)) found.push(`${where}: ${p}`);
  }
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `every photograph shown (${photos} on ${PAGES.length} pages at two widths) has its credit on the page`);
process.exit(found.length ? 1 : 0);

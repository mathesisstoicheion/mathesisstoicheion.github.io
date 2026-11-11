// The accessibility and touch check (review fix list, slice 10), over every room at a computer's width and on a phone. It lists:
//   axe      - what axe (the standard automated checker, WCAG 2.1 AA rules) calls serious or critical, contrast among them, in
//              Paper and in Night (redesign SPEC.md 7: readable contrast in both); the rest is the same in both, so it is
//              looked for in Paper
//   twice    - a heading a screen reader reads twice ("Five roomsFive rooms": the copy drawn for the animation not hidden from it)
//   empty    - a heading with nothing to read
//   tap      - on a phone, a link, button or field whose touch area is under 44 × 44 px (a link inside a sentence is exempt, as
//              WCAG 2.5.8 allows); a hit area widened by the CSS (a ::after) counts, since the area is found by touching it, unless
//              another link or button lies over it. The library's A to Z rail (data-touch-strip) is exempt: a finger slides along it
//              and a bubble beside the finger names the letter, so it works as one control the height of the list; so are the reader's
//              signs beside the scroll bar (data-touch-strip too), a map of the page: its marks are listed full size under Your notes and marks in Study, and the reader opens at the place it left off
//   online   - the header shows the word "Online" with nothing to say what it means
// usage: node web/scripts/check-a11y.mjs <base-url> [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/lesson/letters", "/academy/alphabet", "/academy/tables", "/academy/vocabulary", "/academy/practice",
  "/library", "/library/author?a=tlg0012", "/read?w=tlg0012.tlg001&tr=perseus-eng3", "/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1", "/search?q=μῆνιν",
  "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/manuscripts", "/stoa/lyre", "/stoa/census", "/stoa/antikythera-mechanism",
  "/treasury", "/treasury/word?l=λόγος", "/downloads", "/account", "/about", "/credits", "/guide", "/town-hall",
  // found by a sweep of 112 pages (2026-10-23): two books side by side, a reading lesson, a guide's sources, chips on two
  // lines, the map's sliding chips; and the home page again at the end, now as a returning visitor, so its desk is judged
  // (the pages before it are its trail)
  "/read?w=tlg0012.tlg001&w2=tlg0012.tlg002", "/academy/reading/desire-to-know", "/academy/guide/which-dictionary", "/stoa/editions",
  "/stoa/periplus", "/?back",
];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

for (const [w, h, phone, look] of [[1536, 900, false, "paper"], [1280, 900, false, "paper"], [1280, 900, false, "night"], [375, 812, true, "paper"], [375, 812, true, "night"]]) {
  if (w === 1536 && only.length) continue;
  const tag = `${w}px${look === "night" ? " Night" : ""}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: phone, isMobile: phone, serviceWorkers: "block" });
  // Paper or Night as Settings saves the choice (lib/settings.ts, version 2), with motion reduced so nothing is caught
  // half inked in
  await ctx.addInitScript((l) => {
    localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: l, motion: "reduce" }, version: 2 }));
  }, look);
  for (const path of w === 1536 ? ["/"] : PAGES) {   // at 1536 px only the header's own row (its buttons stand beside the rooms)
    const page = await ctx.newPage();
    try {
      await page.goto(base + path);
      await page.locator("h1").first().waitFor({ timeout: 30_000 }).catch(() => {});
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      await page.waitForTimeout(800);
      const at = `${path} ${tag}`;

      // words set only as a picture, marked data-decorative, are decoration (WCAG 1.4.3 exempts it); the printed page has none.
      // The book's title page no longer fades as it scrolls away, so it is judged wherever it stands.
      const ax = new AxeBuilder({ page }).exclude("[data-decorative]");
      const axe = await ax.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      for (const v of axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical"))
        found.push(`axe ${at}: ${v.id} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" · ")}`);
      if (look === "night") continue;   // the rest does not change with the look

      if (path === "/") await page.locator('header button[aria-label="Menu"]').click({ timeout: 2000 }).catch(() => {});
      const r = await page.evaluate((phoneOpts) => {
        const phone = !!phoneOpts, process_detail = !!phoneOpts?.detail;
        const shown = (e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== "hidden"; };
        // the text a screen reader reads: nothing under aria-hidden, display: none or a hidden attribute
        const said = (el) => {
          if (el.getAttribute("aria-label")) return el.getAttribute("aria-label");
          let t = "";
          const walk = (n) => {
            if (n.nodeType === 3) { t += n.textContent; return; }
            if (n.nodeType !== 1 || n.getAttribute("aria-hidden") === "true" || n.hidden || getComputedStyle(n).display === "none") return;
            if (n.tagName === "IMG") { t += n.alt ?? ""; return; }
            for (const c of n.childNodes) walk(c);
            if (getComputedStyle(n).display !== "inline") t += " ";
          };
          walk(el);
          return t.replace(/\s+/g, " ").trim();
        };
        const twice = [], empty = [];
        for (const hd of document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role=heading]")) {
          if (hd.closest("[aria-hidden=true]") || getComputedStyle(hd).display === "none") continue;
          const t = said(hd), s = t.replace(/\s+/g, "").toLowerCase();
          if (!t) empty.push(hd.outerHTML.slice(0, 80));
          else if (s.length >= 4 && s.length % 2 === 0 && s.slice(0, s.length / 2) === s.slice(s.length / 2)) twice.push(t.slice(0, 60));
        }
        // the header's connection word (in the menu, below 1040 px, opened before this)
        const header = document.querySelector("header");
        const online = !!header && [...header.querySelectorAll("*")].some((e) => e.children.length === 0 && shown(e) && e.textContent.trim() === "Online");

        const tap = [];
        if (phone) {
          const sel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=radio], [role=checkbox], [role=switch], [role=option], [role=menuitem]';
          const seen = new Set();
          for (const el of document.querySelectorAll(sel)) {
            if (el.disabled || el.closest("[inert], [aria-hidden=true], [data-touch-strip]") || !shown(el)) continue;
            if (el.closest("label") && el.matches("input[type=checkbox], input[type=radio]")) continue;   // its label is the target
            const b0 = el.getBoundingClientRect();
            if (b0.width >= 44 && b0.height >= 44) continue;
            // a link inside running text: the sentence around it is the target's spacing (WCAG 2.5.8, inline)
            if (el.tagName === "A") {
              const block = el.parentElement?.closest("p, li, dd, td, figcaption, blockquote, span");
              if (block && block.textContent.trim().length > el.textContent.trim().length + 2 && /\S/.test(block.textContent.replace(el.textContent, ""))) continue;
            }
            el.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
            const b = el.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
            // a point is the target's when the target (or its ::after, or its label) is anywhere under it and no other target lies on top
            const mine = (t) => t === el || el.contains(t) || (el.id && t.closest(`label[for="${CSS.escape(el.id)}"]`));
            const hits = (x, y) => {
              const under = document.elementsFromPoint(x, y);
              const i = under.findIndex(mine);
              return i >= 0 && !under.slice(0, i).some((t) => t.matches(sel) && !t.contains(el) && !t.closest("[data-touch-strip]"));
            };
            if (!mine(document.elementFromPoint(cx, cy) ?? document.body)) continue;   // covered here (a sheet, a sticky bar): not this check's to judge
            // a 44 px square that holds the target's middle, centred on it or shifted (WCAG does not ask for the area to be centred)
            const r = 21.5, square = (ox, oy) => [[-r, -r], [r, -r], [-r, r], [r, r], [0, -r], [0, r], [-r, 0], [r, 0]]
              .map(([dx, dy]) => [cx + ox + dx, cy + oy + dy]).filter(([x, y]) => x >= 0 && x < innerWidth && y >= 0 && y < innerHeight);
            const shifts = [[0, 0], [0, -12], [0, 12], [-12, 0], [12, 0], [-12, -12], [12, -12], [-12, 12], [12, 12]];
            if (shifts.some(([ox, oy]) => square(ox, oy).every(([x, y]) => hits(x, y)))) continue;
            const name = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("title") || el.tagName).replace(/\s+/g, " ").trim().slice(0, 30);
            const where = process_detail ? ` [${[el, el.parentElement, el.parentElement?.parentElement].map((x) => x?.className && typeof x.className === "string" ? x.className.split(" ")[0].replace(/^.*?-module__\w+__/, "") : x?.tagName).join(" < ")}]` : "";
            const k = `${name} ${Math.round(b.width)}×${Math.round(b.height)}${where}`;
            if (!seen.has(k)) { seen.add(k); tap.push(k); }
          }
        }
        return { twice, empty, online, tap };
      }, phone && { detail: !!process.env.DETAIL });
      for (const t of r.twice) found.push(`twice ${at}: "${t}"`);
      for (const t of r.empty) found.push(`empty ${at}: ${t}`);
      if (r.online) found.push(`online ${at}: the header says "Online" with nothing to say what it means`);
      if (r.tap.length) found.push(`tap ${at}: ${r.tap.length} target(s) under 44 × 44 px: ${(process.env.DETAIL ? r.tap : r.tap.slice(0, 12)).join(" · ")}${!process.env.DETAIL && r.tap.length > 12 ? " …" : ""}`);
    } catch (e) {
      found.push(`load ${path} ${tag}: ${String(e).split("\n")[0]}`);
    } finally {
      await page.close();
    }
  }
  await ctx.close();
}

await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "accessibility and touch are in order");
process.exit(found.length ? 1 : 0);

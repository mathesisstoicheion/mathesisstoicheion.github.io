// The reader's sheets on a narrow phone (ReaderBar.tsx: Text, Study and Go to; the owner, 2026-11-08, "fix visual bugs like this on all
// pages and submenus"). Opens a prose book and a verse book at 320 and 360 px, opens each sheet from the foot bar, and lists:
//   out    - anything in the sheet that runs past its sides or the screen's
//   cut    - a menu (a select) too narrow for the choice it shows, so its words are cut off ("Sections 17–2" in Go to at 320 px)
// usage: node web/scripts/check-narrow-menus.mjs [base-url]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        Proved 2026-11-08: before the fix Go to's page menu in the Apology was 132 px wide at 320 px and 149 at 360, too narrow for "Sections 17–22".
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const BOOKS = ["tlg0059.tlg002", "tlg0012.tlg001"];
const SHEETS = [["Text", (p) => p.locator("[data-foot-bar]").getByRole("button", { name: /^Text/ })],
  ["Study", (p) => p.locator("[data-foot-bar]").getByRole("button", { name: /^Study/ })],
  ["Go to", (p) => p.locator("[data-foot-bar]").getByRole("button", { name: /go to a line/ })]];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const w of [320, 360]) {
  for (const book of BOOKS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: "reduce", serviceWorkers: "block" });
    const page = await ctx.newPage();
    await page.goto(`${base}/read?w=${book}`, { waitUntil: "load" });
    await page.locator("article [data-key]").first().waitFor({ timeout: 30000 });
    await page.waitForTimeout(1200);
    for (const [name, button] of SHEETS) {
      const at = `${w} px, ${book}, ${name}`;
      try { await button(page).click({ timeout: 5000 }); } catch { found.push(`${at}: no button for the sheet`); continue; }
      await page.waitForTimeout(600);
      const bad = await page.evaluate(() => {
        const sheet = [...document.querySelectorAll("[data-foot-bar] [class*=menu]")].find((e) => e.offsetHeight && !e.hidden);
        if (!sheet) return ["the sheet did not open"];
        const s = sheet.getBoundingClientRect();
        const out = [];
        const name = (e) => `${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 30)}"`;
        for (const e of sheet.querySelectorAll("*")) {
          const r = e.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          if (r.right > Math.min(innerWidth, s.right) + 1 || r.left < Math.max(0, s.left) - 1) out.push(`out: ${name(e)} runs from ${Math.round(r.left)} to ${Math.round(r.right)} px`);
        }
        const ctx = document.createElement("canvas").getContext("2d");
        for (const sel of sheet.querySelectorAll("select")) {
          const cs = getComputedStyle(sel);
          ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const text = sel.selectedOptions[0]?.textContent ?? "";
          const need = ctx.measureText(text).width;
          // the room for the words: the box less its padding and the arrow (about one letter's height and a half)
          const room = sel.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 1.5 * parseFloat(cs.fontSize);
          if (need > room + 1) out.push(`cut: the menu "${sel.getAttribute("aria-label") ?? ""}" is ${Math.round(sel.clientWidth)} px wide; "${text}" needs ${Math.round(need)} px of words`);
        }
        return out;
      });
      for (const b of bad) found.push(`${at}: ${b}`);
      if (!bad.length) console.log(`✓ ${at}`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    }
    await ctx.close();
  }
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "\nevery sheet fits a narrow phone");
process.exit(found.length ? 1 : 0);

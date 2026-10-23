#!/usr/bin/env node
/**
 * A drawing that does not fill its own frame: a check.
 *
 * An <svg> with a viewBox is scaled to fit its box, keeping its shape ("meet"). When the box is not the drawing's shape
 * (a max-height, a fixed height), the drawing is centred in it with a margin on two sides, and whatever is drawn past the
 * viewBox shows in that margin: the Treasury's map of saved places showed its land as a band down the middle with the
 * coasts running on past it into the paper (found 2026-10-22).
 *
 * The rule checked, at a computer's width and a phone's: every visible <svg> with a viewBox, at least 120 px wide, whose
 * preserveAspectRatio is not "none" or "… slice", is drawn in a box of its own shape (within 2%).
 *
 *   node scripts/check-svg-fill.mjs <base-url> [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a finding)
 */
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/alphabet", "/library", "/stoa", "/stoa/kerameikos", "/stoa/eras", "/stoa/census", "/stoa/periplus",
  "/stoa/antikythera-mechanism", "/treasury", "/treasury?s=places", "/downloads", "/about", "/guide",
];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const [w, h] of [[1280, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block" });
  // calm, and three saved places, so the Treasury's map is drawn
  await ctx.addInitScript(() => {
    localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 2 }));
    if (!localStorage.getItem("mathesis:places")) localStorage.setItem("mathesis:places", JSON.stringify({ state: { saved: { 579885: 3, 540726: 2, 570685: 1 } }, version: 0 }));
  });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    try {
      await page.goto(base + path);
      await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
      await page.waitForTimeout(800);
      const bad = await page.evaluate(() => [...document.querySelectorAll("svg[viewBox]")].flatMap((s) => {
        const r = s.getBoundingClientRect();
        const par = (s.getAttribute("preserveAspectRatio") ?? "").trim();
        if (r.width < 120 || r.height < 20 || par === "none" || /slice/.test(par) || getComputedStyle(s).visibility === "hidden") return [];
        const vb = s.viewBox.baseVal;
        if (!vb || !vb.width || !vb.height) return [];
        const want = vb.height / vb.width, got = r.height / r.width;
        if (Math.abs(got - want) / want <= 0.02) return [];
        const name = s.getAttribute("aria-label") || s.className.baseVal || s.parentElement?.className || "svg";
        return [`"${String(name).slice(0, 60)}" is ${Math.round(r.width)}×${Math.round(r.height)} px, its drawing ${(1 / want).toFixed(2)}:1, the box ${(1 / got).toFixed(2)}:1`];
      }));
      for (const b of bad) found.push(`${path} at ${w}px: ${b}`);
    } catch (e) {
      found.push(`${path} at ${w}px: could not be checked (${e.message.split("\n")[0]})`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
if (found.length) {
  console.log(`check-svg-fill: ${found.length} finding${found.length === 1 ? "" : "s"}\n` + found.map((x) => "  " + x).join("\n"));
  process.exit(1);
}
console.log(`check-svg-fill: ${PAGES.length} pages at two widths, every drawing fills its frame`);

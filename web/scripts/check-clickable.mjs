// Everything that can be clicked looks it, before the pointer finds it (the owner, 2026-10-23: "It's not clear what is a
// clickable"). On the printed page a link or a button shows itself in one of a few ways, all of them visible at rest:
//   - words underlined (a link in a sentence, a small link in a list);
//   - words in the red (the page's colour for a link and for what is chosen);
//   - a frame or a field of ink round it (a button, a chip, a key);
//   - a mark that points on: an arrow (→), a small triangle, or a drawn icon (a button that is only a sign).
// It lists every link, button, summary or other control on the page that has none of these, as "plain": words that look
// like any other words until the pointer is on them. Fields to type in, tick boxes and drop-downs are their own kind and
// are left out. Each page is opened at a computer's width and a narrower window's, with motion reduced.
// usage: node web/scripts/check-clickable.mjs [base-url] [path…]   (WIDTHS=1440,1024 picks the widths; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/reading/letters", "/academy/lesson/letters", "/academy/alphabet",
  "/academy/tables", "/academy/vocabulary", "/academy/practice", "/academy/review", "/academy/checkpoint/first-steps",
  "/academy/guide/looking-up", "/library", "/library/author?a=tlg0012", "/author/tlg0012", "/work/tlg0012-tlg001",
  "/read?w=tlg0012.tlg001&tr=perseus-eng3", "/search", "/search?q=μῆνιν", "/stoa", "/stoa/authors", "/stoa/eras",
  "/stoa/manuscripts", "/stoa/lyre", "/stoa/antikythera-mechanism", "/stoa/kerameikos", "/stoa/ostracism", "/stoa/census",
  "/stoa/troy", "/treasury", "/treasury/word?l=λόγος", "/downloads", "/account", "/about", "/credits", "/guide", "/no-such-page",
];
const WIDTHS = (process.env.WIDTHS ?? "1440,1024").split(",").map(Number);

const LOOK = () => {
  const rgba = (s) => { const m = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0]; const k = s.startsWith("color(") ? 255 : 1; return [m[0] * k, m[1] * k, m[2] * k, m[3] ?? 1]; };   // rgb() or color(srgb …), which a colour mixed in CSS comes out as
  const same = (a, b) => a.slice(0, 3).every((x, i) => Math.abs(x - b[i]) < 3);
  const probe = document.createElement("i"); document.body.append(probe);
  const tone = (v) => { probe.style.color = `var(${v})`; return rgba(getComputedStyle(probe).color); };
  const REDS = ["--rubric", "--rubric-2", "--accent-on-ink"].map(tone);
  probe.remove();
  const paper = rgba(getComputedStyle(document.documentElement).backgroundColor);
  const shown = (e) => e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && e.getBoundingClientRect().width > 1;
  const visibleLine = (w, style, colour) => parseFloat(w) >= 0.5 && style !== "none" && rgba(colour)[3] > 0.05;
  const framed = (e) => {
    const s = getComputedStyle(e);
    const sides = ["Top", "Right", "Bottom", "Left"].filter((k) => visibleLine(s[`border${k}Width`], s[`border${k}Style`], s[`border${k}Color`]));
    if (sides.length >= 3) return true;
    if (/0px 0px 0px [1-9][\d.]*px inset/.test(s.boxShadow) || /inset/.test(s.boxShadow) && /0px 0px 0px [1-9]/.test(s.boxShadow)) return true;
    const bg = rgba(s.backgroundColor);
    if (bg[3] > 0.3 && !same(bg, paper)) return true;
    if (s.backgroundImage !== "none" && !/url\(/.test(s.backgroundImage)) return true;
    return false;
  };
  // a drawn mark beside the words: a small triangle or arrow cut from a box (clip-path), before or after them
  const drawn = (e) => ["::before", "::after"].some((p) => { const s = getComputedStyle(e, p); return s.content !== "none" && s.content !== "normal" && s.clipPath !== "none" && parseFloat(s.width) > 2; });
  // a button in a row of choices drawn in one frame (Both / Greek / English), or a tab ruled under (the chosen one in red)
  const inFrame = (e) => { for (let a = e.parentElement, i = 0; a && i < 2; a = a.parentElement, i++) if (framed(a)) return true; return false; };
  const tab = (e) => e.matches("button, [role='tab'], [role='radio']") && (() => { const s = getComputedStyle(e); return parseFloat(s.borderBottomWidth) >= 1 && rgba(s.borderBottomColor)[3] > 0.1; })();
  const marker = (e) => e.matches("summary") && getComputedStyle(e).display === "list-item" && getComputedStyle(e).listStyleType !== "none";
  const marks = (e) => /[→←↗↘›‹»«▸▾▴◂↓↑⟶⟵+×✕☞]/.test(e.textContent ?? "") || !!e.querySelector("svg, img, .tri, [class*='arr'], [class*='Arr'], [class*='chev'], [class*='icon']")
    || [e, ...[...e.querySelectorAll("*")].slice(0, 40)].some((t) => ["::before", "::after"].some((p) => { const c = getComputedStyle(t, p).content; return c && c !== "none" && c !== "normal" && /[→←↗›»▸↓↑+−]/.test(c); }));
  const underlined = (e) => {
    for (const t of [e, ...e.querySelectorAll("*")]) {
      if (!shown(t) || !(t.textContent ?? "").trim()) continue;
      const s = getComputedStyle(t);
      if (/underline/.test(s.textDecorationLine) && rgba(s.textDecorationColor)[3] > 0.1) return true;
    }
    return false;
  };
  const red = (e) => {
    for (const t of [e, ...e.querySelectorAll("*")]) {
      if (!shown(t)) continue;
      const own = [...t.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
      if (own && REDS.some((r) => same(rgba(getComputedStyle(t).color), r))) return true;
    }
    return false;
  };
  const out = [];
  const seen = new Set();
  for (const e of document.querySelectorAll("main a[href], main button, main summary, main [role='button'], main [role='link'], main [role='tab'], main [role='radio'], main [role='option'], main [tabindex='0'], footer a[href]")) {
    if (!shown(e) || e.closest("[aria-hidden='true'], .visually-hidden, .skip") || e.matches(":disabled, [aria-disabled='true']")) continue;
    if (e.matches("li[tabindex='0']") && !e.querySelector("a, button")) continue;   // a chart's row, to be read out, not clicked
    const ok = framed(e) || underlined(e) || red(e) || marks(e) || drawn(e) || marker(e) || tab(e) || inFrame(e)
      || [...e.querySelectorAll("*")].some((c) => shown(c) && (framed(c) || drawn(c)));
    if (ok) continue;
    const cls = (typeof e.className === "string" ? e.className.split(" ")[0] : "").replace(/^[A-Z][A-Za-z]+-module__\w+__/, "");
    const up = (typeof e.parentElement?.className === "string" ? e.parentElement.className.split(" ")[0] : "").replace(/^[A-Z][A-Za-z]+-module__\w+__/, "");
    const what = `${e.tagName.toLowerCase()}${cls ? "." + cls : ""}${up ? ` (in .${up})` : ""} "${(e.innerText || e.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40)}"`;
    if (!seen.has(what)) { seen.add(what); out.push(what); }
  }
  return out;
};

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
let n = 0;
for (const w of WIDTHS) {
  const phone = w < 761;
  const ctx = await browser.newContext({ viewport: { width: w, height: phone ? 844 : 900 }, reducedMotion: "reduce", isMobile: phone, hasTouch: phone });
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
    await page.waitForTimeout(400);
    n++;
    for (const p of await page.evaluate(LOOK)) found.push(`plain: ${where}: ${p}`);
  }
  await ctx.close();
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `everything that can be clicked looks it (${n} page views)`);
process.exit(found.length ? 1 : 0);

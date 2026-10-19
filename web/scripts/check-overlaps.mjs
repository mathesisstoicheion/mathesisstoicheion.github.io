// The overlap check (DESIGN.md, "Before anything goes live"): opens each page at phone, tablet and computer widths,
// scrolls through it so every window and heading has played, and lists what looks broken on the page:
//   wide  - the page is wider than the screen (it scrolls sideways)
//   spill - a piece of text, a picture or a box runs out of the box or card it belongs to (the owner, 2026-10-19:
//           "fix these kinds of overlaps")
//   clash - two pieces of text drawn over each other
// Fixed and sticky things (the header, sheets, bars) are left out: they cover the page on purpose. Each screenful is checked
// while it is on screen, since the reader skips drawing passages out of view (content-visibility) and their places are
// only right once drawn.
// usage: node web/scripts/check-overlaps.mjs <base-url> [out.json] [page-filter] [size-filter]   (CHROMIUM=<path> picks the browser)
import { chromium } from "playwright";
import fs from "node:fs";

const [base = "http://localhost:3202", out = "overlaps.json", only = "", sizeOnly = ""] = process.argv.slice(2);
const PAGES = ["/", "/library", "/library/author?a=tlg0059", "/read", "/read?w=tlg0059.tlg002", "/read?w=tlg0012.tlg001&at=1.1", "/work/tlg0012-tlg001",
  "/author/tlg0085", "/academy", "/academy/alphabet", "/academy/lesson/letters", "/academy/lesson/adjectives", "/academy/lesson/adjectives/practice",
  "/academy/reading", "/academy/reading/letters", "/academy/review", "/academy/studio", "/academy/tables", "/academy/today", "/academy/vocabulary",
  "/academy/practice", "/academy/guide/dictionary-form", "/guide", "/stoa", "/stoa/antikythera-mechanism", "/stoa/authors", "/stoa/census",
  "/stoa/editions", "/stoa/eras", "/stoa/kerameikos", "/stoa/lyre", "/stoa/manuscripts", "/stoa/periplus", "/stoa/variants", "/town-hall",
  "/town-hall/pnyx", "/treasury", "/treasury/word?w=%CE%BB%CF%8C%CE%B3%CE%BF%CF%82", "/search", "/search?q=logos", "/about", "/credits",
  "/downloads", "/account", "/no-such-page"].filter((p) => p.includes(only));
const SIZES = [[360, 780, "phone 360"], [390, 844, "phone 390"], [412, 915, "phone 412"], [768, 1024, "tablet"], [1280, 800, "computer 1280"], [1440, 900, "computer 1440"]]
  .filter(([, , label]) => label.includes(sizeOnly));

// runs inside the page
function inspect() {
  const onScreen = (r) => r.bottom > 0 && r.top < innerHeight;
  const vis = (el) => {
    // inside a closed <details>, or any part the browser skips drawing (content-visibility: hidden)
    if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.05) return false;
      if (e.getAttribute("aria-hidden") === "true" && e.closest("[data-st]")) continue;   // settling letters: drawn, checked as text
    }
    return true;
  };
  const pinned = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === "fixed" || p === "sticky") return true; } return false; };
  const name = (el) => {
    const c = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).split(/\s+/).filter(Boolean).map((k) => k.replace(/^.*?__/, "").replace(/__.*$/, "")).slice(0, 2).join(".");
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${c ? "." + c : ""}`;
  };
  const path = (el) => { const out = []; for (let e = el; e && e !== document.body && out.length < 4; e = e.parentElement) out.unshift(name(e)); return out.join(" > "); };
  const hasBox = (cs) => parseFloat(cs.borderTopWidth) + parseFloat(cs.borderRightWidth) + parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth) > 0
    || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || cs.boxShadow !== "none" || cs.backgroundImage !== "none";
  const isItem = (e) => { const p = e.parentElement; if (!p) return false; const d = getComputedStyle(p).display; return /grid|flex/.test(d); };
  // whether a rect is clipped away (mostly or wholly) by a scrolling or clipping box around it, the thing's own box included:
  // words kept for screen readers only sit in a 1px clipped box and are never drawn
  const clippedAway = (el, r) => {
    let L = r.left, R = r.right, T = r.top, B = r.bottom;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.clip && cs.clip !== "auto" && cs.position === "absolute") return true;
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible" || cs.clipPath !== "none") {
        const b = e.getBoundingClientRect();
        L = Math.max(L, b.left); R = Math.min(R, b.right); T = Math.max(T, b.top); B = Math.min(B, b.bottom);
        if (R - L < 2 || B - T < 2) return true;
      }
    }
    return (R - L) * (B - T) < 0.25 * r.width * r.height;
  };
  const host = (el) => {   // the box a thing belongs to: its nearest ancestor drawn as a box, or a grid or flex item
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === "contents" || cs.display === "inline") continue;
      if (hasBox(cs) || isItem(e)) return { e, cs };
    }
    return null;
  };
  // a box between a thing and its host that scrolls or clips sideways (a wide table in its own scroller): spilling is meant
  const inScroller = (el, hostEl, self = false) => { for (let e = self ? el : el.parentElement; e && e !== hostEl; e = e.parentElement) if (getComputedStyle(e).overflowX !== "visible") return true; return false; };
  const found = [];
  const W = document.documentElement.scrollWidth - innerWidth;
  if (W > 0) found.push({ kind: "wide", what: `the page is ${W}px wider than the screen` });

  // text runs
  const runs = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    const t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement; if (!el || el.closest("script,style,noscript,template,svg title")) continue;
    if (pinned(el) || !vis(el)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    for (const r of rg.getClientRects()) {
      if (r.width < 3 || r.height < 3 || !onScreen(r) || clippedAway(el, r)) continue;
      // a big display line set tight (line-height 1) reports the font's whole height, room for accents included, and so
      // "touches" the line above; the line's own height is the room it really takes
      const k = lh > 0 && lh < r.height ? (r.height - lh) / 2 : 0;
      runs.push({ r: k ? DOMRect.fromRect({ x: r.left, y: r.top + k, width: r.width, height: r.height - 2 * k }) : r, el, t: t.slice(0, 40) });
    }
  }
  // spill: text out of its box
  for (const run of runs) {
    const h = host(run.el); if (!h || h.cs.overflowX !== "visible" || inScroller(run.el, h.e, true)) continue;
    const b = h.e.getBoundingClientRect(), r = run.r, tol = 2;
    if (b.width < 8) continue;
    const over = Math.max(b.left - r.left, r.right - b.right);
    if (over > tol && !(r.left >= b.right || r.right <= b.left)) found.push({ kind: "spill", what: `text "${run.t}" runs ${Math.round(over)}px out of ${path(h.e)}`, at: [Math.round(r.left), Math.round(r.top + scrollY)] });
  }
  // spill: a picture or a box out of the box or card it belongs to
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.position === "absolute" || cs.display === "contents" || cs.display === "inline") continue;
    if (!(hasBox(cs) || /^(CANVAS|IMG|VIDEO|svg)$/.test(el.tagName))) continue;
    if (pinned(el) || !vis(el)) continue;
    const r = el.getBoundingClientRect(); if (r.width < 12 || r.height < 12 || !onScreen(r) || clippedAway(el, r)) continue;
    const h = host(el); if (!h || h.cs.overflowX !== "visible" || inScroller(el, h.e)) continue;
    const b = h.e.getBoundingClientRect(); if (b.width < 8) continue;
    const over = Math.max(b.left - r.left, r.right - b.right);
    if (over > 2) found.push({ kind: "spill", what: `${path(el)} runs ${Math.round(over)}px out of ${path(h.e)}`, at: [Math.round(r.left), Math.round(r.top + scrollY)] });
  }
  // clash: text over text
  runs.sort((a, b) => a.r.top - b.r.top);
  for (let i = 0; i < runs.length; i++) {
    const a = runs[i].r;
    for (let j = i + 1; j < runs.length && runs[j].r.top < a.bottom; j++) {
      const b = runs[j].r; if (runs[i].el === runs[j].el && runs[i].t === runs[j].t) continue;
      const st = runs[i].el.closest("[data-st]"); if (st && st === runs[j].el.closest("[data-st]")) continue;   // a settling title's own letters touch, as set
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (w < 4 || h < 0.35 * Math.min(a.height, b.height)) continue;
      if (w * h < 0.2 * Math.min(a.width * a.height, b.width * b.height)) continue;
      found.push({ kind: "clash", what: `"${runs[i].t}" (${path(runs[i].el)}) over "${runs[j].t}" (${path(runs[j].el)})`, at: [Math.round(Math.max(a.left, b.left)), Math.round(Math.max(a.top, b.top) + scrollY)] });
    }
  }
  // the same finding repeated down a list counts once
  const seen = new Map();
  for (const f of found) { const k = f.kind + f.what.replace(/"[^"]*"/g, '"…"'); const s = seen.get(k); if (s) s.n++; else seen.set(k, { ...f, n: 1 }); }
  return [...seen.values()];
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const report = [];
for (const [w, h, label] of SIZES) {
  const phone = w < 600;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone, serviceWorkers: "block" });
  await ctx.addInitScript(() => { try { localStorage.setItem("mathesis:tour-seen", "1"); localStorage.setItem("mathesis:guide-invite", "no"); } catch { /* private window */ } });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    try {
      await page.goto(base + p, { waitUntil: "networkidle", timeout: 45000 }).catch(() => undefined);
      await page.waitForTimeout(1200);
      // scroll through a screenful at a time; each window and heading plays as it comes into view, and is checked once it has
      const all = new Map();
      for (let y = 0, H = 1; y < H; y += Math.round(h * 0.85)) {
        // pages with windows or settling headings wait for them to finish playing; others need only a moment to draw
        const plays = await page.evaluate(() => document.querySelectorAll("[data-st], .awin-frame canvas, [class*='win'] > canvas").length > 0);
        await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(plays ? (y ? 2900 : 3200) : 400);
        for (const f of await page.evaluate(inspect)) { const k = f.kind + f.what + (f.at || ""); const o = all.get(k); if (!o) all.set(k, f); }
        H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight + 1);
        if (y > h * 25) break;   // a long book: its first 25 screens show every kind of line it has
      }
      const merged = new Map();
      for (const f of all.values()) { const k = f.kind + f.what.replace(/"[^"]*"/g, '"…"'); const o = merged.get(k); if (o) o.n += f.n; else merged.set(k, { ...f }); }
      const found = [...merged.values()];
      report.push({ size: label, page: p, found });
      console.log(`${label.padEnd(14)} ${p.padEnd(44)} ${found.length ? found.map((f) => f.kind).join(",") : "ok"}`);
    } catch (e) { report.push({ size: label, page: p, error: String(e).split("\n")[0] }); console.log(`${label} ${p} ERROR ${String(e).split("\n")[0]}`); }
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(out, JSON.stringify(report, null, 1));
const n = report.reduce((k, r) => k + (r.found?.length ?? 0), 0);
console.log(`${n} findings; details in ${out}`);

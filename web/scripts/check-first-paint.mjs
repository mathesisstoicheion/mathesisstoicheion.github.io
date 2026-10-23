// The first-paint check (review fix list, slice 1: "content appears instantly"). Words must be readable as soon as a page
// is drawn; only pictures and canvases may fade in, and they fade in over a visible placeholder, never a black box.
// For each page, at a phone and a computer size, it looks at the page 500 ms after it starts loading and lists:
//   hidden - the page's title (h1), its first paragraph, or any other words on the first screen are not fully drawn yet:
//            their opacity (multiplied up through their parents) is under 0.9 of what it is once the page has settled, 6 s
//            later, or the title is off the screen. Words the design keeps a little dim on purpose are not flagged.
//   black  - a window onto art on the first screen is still an empty black (or see-through) box
// Words still inking in (the printed page's decision 3: text inks in gently as it arrives, then nothing moves) are not
// flagged if they are clear once the ink-in has run; words that stay faint, or wait for anything else, are.
// It does this twice: once as a visitor sees it, and once with the site's scripts held back ("slow scripts"), which is how
// a phone on a slow connection sees the page for its first seconds. Words must not wait for the scripts.
// It also counts the requests each page makes in its first 3 seconds, and how many of them fetch other pages ahead.
// usage: node web/scripts/check-first-paint.mjs <base-url> [out.json] [page-filter]   (CHROMIUM=<path> picks the browser)
// It exits with 1 when anything is listed, so it can stand in the checks.
import { chromium } from "playwright";
import fs from "node:fs";

const [base = "http://localhost:3100", out = "", only = ""] = process.argv.slice(2);
export const PAGES = ["/", "/academy", "/academy/lesson/letters", "/library", "/stoa", "/stoa/ostracism", "/town-hall", "/treasury",
  "/account", "/guide", "/read?w=tlg0085.tlg005"].filter((p) => p.includes(only));
const SIZES = [[1024, 768, "computer"], [375, 812, "phone"]];
const AT_MS = 500;

// runs inside the page: what is not yet readable, and which windows are still black
function inspect() {
  const shown = (el) => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      if (e.tagName === "DETAILS" && !e.open && e !== el && !e.querySelector(":scope > summary")?.contains(el)) return false;
    }
    return el.getClientRects().length > 0;
  };
  // the opacity the eye sees: the element's own times every parent's
  // ...times the share of it that is not cut off by a parent that clips (a line slid down out of its own box, say)
  const seen = (el) => {
    let o = 1;
    const r = el.getBoundingClientRect();
    let [l, t, rt, b] = [r.left, r.top, r.right, r.bottom];
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      o *= parseFloat(cs.opacity);
      if (e !== el && (/(hidden|clip)/.test(cs.overflowX + cs.overflowY) || cs.clipPath !== "none")) {
        const c = e.getBoundingClientRect();
        if (/(hidden|clip)/.test(cs.overflowX) || cs.clipPath !== "none") { l = Math.max(l, c.left); rt = Math.min(rt, c.right); }
        if (/(hidden|clip)/.test(cs.overflowY) || cs.clipPath !== "none") { t = Math.max(t, c.top); b = Math.min(b, c.bottom); }
      }
    }
    const area = Math.max(0, rt - l) * Math.max(0, b - t), full = r.width * r.height;
    return full > 0 ? o * Math.min(1, area / full) : o;
  };
  const srOnly = (el) => { const r = el.getBoundingClientRect(); return r.width <= 1 || r.height <= 1; };
  // the parts of an element that hold its words; for a settling heading these are its letters
  const leaves = (root) => {
    const out = [];
    const walk = (el) => {
      if (!shown(el) || srOnly(el)) return;
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) out.push(el);
      for (const c of el.children) walk(c);
    };
    walk(root);
    return out;
  };
  const worst = (el) => { const ls = leaves(el); return ls.length ? Math.min(...ls.map(seen)) : null; };
  const label = (el) => (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 50);
  const onFirstScreen = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const main = document.querySelector("main") || document.body;
  const found = [];
  const items = [];
  const keyOf = (el) => { const path = []; for (let e = el; e && e !== document.body; e = e.parentElement) path.unshift([...e.parentElement.children].indexOf(e)); return path.join("."); };
  const note = (el, what, o) => items.push({ key: keyOf(el), what, o });

  const h1 = [...main.querySelectorAll("h1")].find(shown);
  if (!h1) found.push({ kind: "hidden", what: "no title (h1) drawn" });
  else {
    const o = worst(h1);
    if (!onFirstScreen(h1)) found.push({ kind: "hidden", what: `title off the first screen: "${label(h1)}"` });
    note(h1, `title "${label(h1)}"`, o === null ? 0 : o);
  }
  const p = [...main.querySelectorAll("p")].find((e) => shown(e) && !srOnly(e) && label(e).length > 20 && !e.closest("[aria-hidden='true'],figure,figcaption,dialog"));
  if (p) { const o = worst(p); if (o !== null) note(p, `first paragraph "${label(p)}"`, o); }

  // every other run of words on the first screen: headings, paragraphs, links, labels, buttons, the trail of pages above a title
  const seenEls = new Set();
  for (const el of document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button, main label, main li, nav[aria-label] a, header a, header button")) {
    if (seenEls.has(el) || el === h1 || el === p || !shown(el) || !onFirstScreen(el) || el.closest("[aria-hidden='true']:not([data-st] *)")) continue;
    // a picture's caption (and its ⓘ) comes up with the picture, once its window has opened: part of the art, not the page's words
    if (el.closest("[data-wcap]")) continue;
    if (!label(el)) continue;
    const ls = leaves(el).filter(onFirstScreen);
    if (!ls.length) continue;
    const o = Math.min(...ls.map(seen));
    note(el, `${el.tagName.toLowerCase()} "${label(el)}"`, o);
    for (const d of el.querySelectorAll("*")) seenEls.add(d);
  }

  // windows onto art: a canvas inside a frame; black means neither the picture nor a placeholder is showing yet
  for (const cv of document.querySelectorAll("main canvas[role='img']")) {
    if (!shown(cv) || !onFirstScreen(cv)) continue;
    const frame = cv.parentElement;
    let colour = "rgba(0, 0, 0, 0)";
    for (let e = frame; e && e !== document.documentElement; e = e.parentElement) {
      const bg = getComputedStyle(e).backgroundColor, img = getComputedStyle(e).backgroundImage;
      if (img && img !== "none") { colour = "image"; break; }
      if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") { colour = bg; break; }
      if (e === frame.parentElement?.parentElement) break;   // looked through the frame and its holder: nothing behind it
    }
    // a canvas that has drawn something shows it
    let drawn = false;
    try {
      if (cv.width && cv.height) {
        const g = cv.getContext("2d", { willReadFrequently: false });
        if (g) { const d = g.getImageData(0, 0, cv.width, cv.height).data; for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 20) { drawn = true; break; } }
        else drawn = true;   // a canvas drawn some other way: count it as drawn
      }
    } catch { drawn = true; }
    const m = colour.match(/\d+(\.\d+)?/g)?.map(Number);
    const dark = colour !== "image" && (!m || (m.length === 4 && m[3] < 0.5) || (m[0] + m[1] + m[2]) < 60);
    if (!drawn && dark) found.push({ kind: "black", what: `window "${cv.getAttribute("aria-label")?.slice(0, 50)}" is a black box (${colour})` });
  }
  return { found, items };
}

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const report = [];
const settled = new Map();
let problems = 0;
for (const [w, h, size] of SIZES) {
  for (const slow of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: size === "phone", hasTouch: size === "phone", serviceWorkers: "block" });
    for (const path of PAGES) {
      if (slow && path.startsWith("/read")) continue;   // the reader builds its text from the book in the browser: it needs its scripts
      const page = await ctx.newPage();
      const reqs = [];
      const t0 = Date.now();
      page.on("request", (r) => { if (Date.now() - t0 <= 3000) reqs.push(r.url()); });
      // "slow scripts": the page's own script files never arrive (inline scripts in the page still run, as they would)
      if (slow) await page.route(/\/_next\/static\/.*\.js(\?|$)/, (r) => r.abort());
      await page.goto(base + path, { waitUntil: "commit" });
      await page.waitForFunction((ms) => performance.now() >= ms && document.readyState !== "loading", AT_MS, { polling: 25 }).catch(() => {});
      const early = await page.evaluate(inspect).catch((e) => ({ found: [{ kind: "error", what: String(e).slice(0, 120) }], items: [] }));
      // what the same words look like once the page has settled (from the normal visit, for the slow one too)
      let late = settled.get(`${size} ${path}`);
      if (!late) { await page.waitForTimeout(6000); late = new Map((await page.evaluate(inspect)).items.map((i) => [i.key, i.o])); settled.set(`${size} ${path}`, late); }
      const found = [...early.found];
      const faint = early.items.filter((it) => it.o < 0.9 * (late.get(it.key) ?? 1));
      // words still inking in (styles/tokens.css: --ink-in, after up to four --ink-step delays, under 2 s in all) are looked
      // at again once the page's own finite animations have run (at most 2 s more): only words still faint then are flagged
      let after = null;
      if (faint.length) {
        await page.evaluate(() => Promise.race([
          Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))),
          new Promise((r) => setTimeout(r, 2000)),
        ])).catch(() => {});
        after = new Map((await page.evaluate(inspect).catch(() => ({ items: [] }))).items.map((i) => [i.key, i.o]));
      }
      for (const it of faint) {
        const end = late.get(it.key) ?? 1, then = after?.get(it.key) ?? it.o;
        if (then < 0.9 * end) found.push({ kind: "hidden", what: `${it.what} at opacity ${it.o.toFixed(2)}, still ${then.toFixed(2)} once the ink-in has run (settles at ${end.toFixed(2)})` });
      }
      const sameSite = reqs.filter((u) => u.startsWith(base));
      const ahead = sameSite.filter((u) => /_rsc=|\.txt(\?|$)/.test(u)).length;
      const images = sameSite.filter((u) => /\.(png|jpe?g|webp|avif|svg)(\?|$)/.test(u)).length;
      const row = { path, size, mode: slow ? "slow scripts" : "normal", found, requests: slow ? undefined : { total: reqs.length, pagesAhead: ahead, images } };
      report.push(row);
      problems += found.length;
      const req = slow ? "" : `  [${reqs.length} requests in 3 s, ${ahead} pages fetched ahead, ${images} images]`;
      console.log(`${found.length ? "✗" : "✓"} ${size.padEnd(8)} ${(slow ? "slow" : "normal").padEnd(6)} ${path}${req}`);
      for (const f of found) console.log(`    ${f.kind}: ${f.what}`);
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
if (out) fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(problems ? `\n${problems} problem(s)` : "\nnothing hidden, nothing black");
process.exit(problems ? 1 : 0);

// Nothing moves after the ink-in, and nothing moves at all with reduced motion (redesign SPEC.md 7; decision 3: text and
// photographs ink in gently as they arrive, "then nothing moves"). On each page, on a computer (1280 px) and a phone
// (390 px), with nobody touching it, it lists:
//   after    - full motion: anything still animating once the page has inked in, and again once the page has been read
//              to its end (every part that inks in as it comes into view has had its turn); an animation that repeats for
//              ever is listed as a loop
//   moved    - anything that changes its place or size on the screen while the page is left alone after its ink-in (the
//              same is asked with reduced motion), which also catches motion made by a script rather than by CSS
//   reduced  - with the device asking for less motion, the site's own setting left to follow it: any animation or
//              transition that runs at all, from the first paint on
//   held     - an animation that has finished but holds its last frame on a box (it fills forwards), when that frame
//              moves or filters it: the ink-in's rise and blur stay on the box at rest (a filter of blur(0px) on a
//              photograph, a box made a layer of its own that carries anything fixed inside it). Its end is the box's
//              own look, so it need not be held.
// Pictures drawn on a canvas (the pot to paint, the lyre) are not looked inside: only their place on the page is.
// usage: node web/scripts/check-still.mjs [base-url] [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        PROVE_CSS=<css> or PROVE_JS=<script> adds a fault to every page, to show the check catches it. Proved 2026-10-23
//        on the home page: a heading set to ink in for ever (a loop), a script nudging the title along every tenth of a
//        second (moved), and an ink-in forced through reduced motion (reduced) were each listed.
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/lesson/letters", "/academy/alphabet", "/academy/practice", "/library",
  "/library/author?a=tlg0012", "/read?w=tlg0059.tlg002", "/search?q=μῆνιν", "/stoa", "/stoa/kerameikos", "/stoa/eras",
  "/stoa/manuscripts", "/stoa/lyre", "/stoa/antikythera-mechanism", "/treasury", "/downloads", "/account", "/about",
  "/credits", "/guide", "/no-such-page",
];
const WIDTHS = [[1280, 900], [390, 844]];
// the ink-in's longest run: a line takes --ink-in (1.4 s) after up to four steps' delay, and a plate after three
const INKED = 3500;

/** what is animating now: CSS animations and transitions that are running or about to, on elements that are drawn */
const running = (page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" || a.pending).map((a) => {
  const t = a.effect?.getComputedTiming?.() ?? {};
  const el = a.effect?.target;
  const host = el?.nodeType === 1 ? el : el?.element;
  if (!host || !host.isConnected || !host.getClientRects().length) return null;
  const name = a.animationName ? `animation "${a.animationName}"` : a.transitionProperty ? `transition of ${a.transitionProperty}` : "animation";
  const who = `${host.tagName.toLowerCase()}${host.id ? `#${host.id}` : ""}${host.classList.length ? `.${[...host.classList].slice(0, 2).join(".")}` : ""}`;
  return { what: `${name} on ${who}`, loop: t.iterations === Infinity, duration: Number(t.duration) || 0 };
}).filter((x) => x && (x.loop || x.duration > 1)));

/** animations that have finished and still hold a last frame that moves or filters their box */
const held = (page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === "finished").map((a) => {
  const fill = a.effect?.getComputedTiming?.().fill;
  if (fill !== "forwards" && fill !== "both") return null;
  const props = new Set(a.effect.getKeyframes().flatMap((k) => Object.keys(k)));
  const left = ["transform", "translate", "scale", "rotate", "filter"].filter((p) => props.has(p));
  const el = a.effect.target;
  if (!left.length || !el?.isConnected || !el.getClientRects().length) return null;
  const who = `${el.tagName.toLowerCase()}${el.classList.length ? `.${[...el.classList].slice(0, 2).join(".")}` : ""}${a.effect.pseudoElement ?? ""}`;
  return `animation "${a.animationName ?? "?"}" on ${who} holds its ${left.join(" and ")}`;
}).filter(Boolean));

/** where everything on the screen is now (the page's own scroll aside) */
const places = (page) => page.evaluate(() => {
  const out = {};
  let i = 0;
  for (const e of document.querySelectorAll("body *")) {
    if (e.closest("script, style, noscript, svg *, [hidden]")) continue;
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) continue;
    e.dataset.stillCheck ??= String(i++);
    const who = `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${e.classList.length ? `.${[...e.classList].slice(0, 2).join(".")}` : ""}`;
    out[e.dataset.stillCheck] = [Math.round(r.x * 2) / 2, Math.round(r.y * 2) / 2, Math.round(r.width * 2) / 2, Math.round(r.height * 2) / 2, who];
  }
  return out;
});
async function moved(page) {
  const a = await places(page);
  await page.waitForTimeout(1500);
  const b = await places(page);
  const out = [];
  for (const [k, p] of Object.entries(a)) {
    const q = b[k];
    if (q && p.slice(0, 4).some((v, i) => Math.abs(v - q[i]) > 1)) out.push(`${p[4]} from ${p.slice(0, 4).join(",")} to ${q.slice(0, 4).join(",")}`);
  }
  return out;
}

/** a fault added on purpose (PROVE_CSS, PROVE_JS), once the page has been built */
async function prove(ctx) {
  const { PROVE_CSS: css, PROVE_JS: js } = process.env;
  if (css || js) await ctx.addInitScript(([c, j]) => addEventListener("load", () => {
    if (c) document.head.append(Object.assign(document.createElement("style"), { textContent: c }));
    if (j) new Function(j)();
  }), [css ?? "", js ?? ""]);
}

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const motion of ["no-preference", "reduce"]) {
  for (const [w, h] of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: motion, isMobile: w < 500, hasTouch: w < 500 });
    // with reduced motion, every animation or transition that starts is noted from the very first paint
    await ctx.addInitScript(() => {
      window.__moving = [];
      const note = (e) => {
        const s = getComputedStyle(e.target);
        const d = e.type === "transitionstart" ? s.transitionDuration : s.animationDuration;
        if (d.split(",").some((x) => parseFloat(x) * (x.trim().endsWith("ms") ? 1 : 1000) > 1))
          window.__moving.push(`${e.type === "transitionstart" ? `transition of ${e.propertyName}` : `animation "${e.animationName}"`} on ${e.target.tagName.toLowerCase()}${e.target.classList.length ? `.${[...e.target.classList].slice(0, 2).join(".")}` : ""}`);
      };
      addEventListener("animationstart", note, true);
      addEventListener("transitionstart", note, true);
    });
    await prove(ctx);
    const page = await ctx.newPage();
    for (const path of PAGES) {
      const where = `${path} at ${w}px${motion === "reduce" ? ", reduced motion" : ""}`;
      try {
        await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
      } catch (e) {
        found.push(`${where}: did not open (${e.message.split("\n")[0]})`);
        continue;
      }
      await page.waitForTimeout(motion === "reduce" ? 800 : INKED);
      if (motion === "reduce") {
        for (const m of new Set(await page.evaluate(() => window.__moving.splice(0)))) found.push(`${where}: reduced: ${m}`);
      } else {
        for (const a of await running(page)) found.push(`${where}: after${a.loop ? " (a loop)" : ""}: ${a.what}`);
        for (const h of new Set(await held(page))) found.push(`${where}: held: ${h}`);
      }
      for (const m of (await moved(page)).slice(0, 5)) found.push(`${where}: moved: ${m}`);
      // read to the end, then leave it: whatever inked in on the way has finished
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
      });
      await page.waitForTimeout(motion === "reduce" ? 600 : INKED);
      if (motion === "reduce") {
        for (const m of new Set(await page.evaluate(() => window.__moving))) found.push(`${where}, read to the end: reduced: ${m}`);
      } else {
        for (const a of await running(page)) found.push(`${where}, read to the end: after${a.loop ? " (a loop)" : ""}: ${a.what}`);
        for (const h of new Set(await held(page))) found.push(`${where}, read to the end: held: ${h}`);
      }
      for (const m of (await moved(page)).slice(0, 5)) found.push(`${where}, read to the end: moved: ${m}`);
    }
    await ctx.close();
  }
}
await browser.close();
const unique = [...new Set(found)];
for (const f of unique) console.log(`✗ ${f}`);
console.log(unique.length ? `\n${unique.length} problem(s)` : `nothing moves after the ink-in, and nothing at all with reduced motion (${PAGES.length} pages, two widths)`);
process.exit(unique.length ? 1 : 0);

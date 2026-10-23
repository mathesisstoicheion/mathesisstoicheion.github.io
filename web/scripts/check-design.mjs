// The design check (review fix list, slice 3; brought to the printed page's rules, redesign SPEC.md 7: "no typeface other
// than the three, and no colour outside the tokens"), on what each page actually draws, at a computer's width and a
// phone's, in Paper and in Night. For every visible piece of words it lists:
//   face    - a letter or sign drawn in a typeface other than the three (EB Garamond, GFS Didot, Gentium Book Plus). The
//             browser itself is asked which font drew each piece of words, so a sign none of the three has, which the
//             computer then draws in a font of its own (an arrow, a cross), is caught too, and named letter by letter.
//             Decoration counts: anything on the page is set in the three.
//   size    - a size below 12 px, or, up to the h3 step, not one of the type scale's steps (--step--2 … --step-2, with the
//             text's own --step-text, measured at this width); the titles above it are fluid by design, and lettering in
//             GFS Didot (titles, numerals) is display lettering, sized for its place
//   colour  - words in a colour that is not one of the tokens for words: the ink (--ink, --ink-2, --ink-3), the red
//             (--rubric), the marks' own colours (--ok, --ochre, --blue, --legend); on a block of ink, the paper and the red
//             made for it (--bg, --rubric-on-ink, --ink-2-on-ink); on a red field, the paper
//   button  - a filled button (not a card that is a link) whose fill is not the ink, the one primary fill: every page has
//             the same three kinds, primary (filled), secondary (a hairline frame) and the text link
// Pictures' own lettering (canvas) is not judged; nor are the sizes of the reader's lines (the text marked data-reading),
// of Greek quoted at the reader's Greek size (the reader's own choice in Settings), and of the marks inside a text quoted
// elsewhere (line and section numbers, sized from the text, which is judged). Words hidden from screen readers as
// decoration (the logo's name beside the seal, ornaments) are judged for their face only.
// Faces and sizes are the same in both looks, so they are measured in Paper; colours and buttons in both.
// usage: node web/scripts/check-design.mjs <base-url> [path…]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        SUMMARY=1 prints every distinct value found with a count, for working through the list
import { chromium } from "playwright";

const [base = "http://localhost:3100", ...only] = process.argv.slice(2);
const PAGES = only.length ? only : [
  "/", "/academy", "/academy/reading", "/academy/lesson/letters", "/academy/alphabet", "/academy/tables", "/academy/vocabulary",
  "/academy/practice", "/library", "/library/author?a=tlg0012", "/author/tlg0012", "/work/tlg0012-tlg001", "/stoa/kerameikos", "/read?w=tlg0012.tlg001&tr=perseus-eng3", "/search?q=μῆνιν",
  "/stoa", "/stoa/authors", "/stoa/eras", "/stoa/manuscripts", "/stoa/lyre", "/stoa/antikythera-mechanism", "/treasury",
  "/treasury/word?l=λόγος", "/downloads", "/account", "/about", "/credits", "/guide", "/town-hall", "/no-such-page",
];
const THREE = ["EB Garamond", "GFS Didot", "Gentium Book Plus"];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const tally = { face: new Map(), size: new Map(), colour: new Map(), fill: new Map() };
const count = (m, k, where) => { const x = m.get(k) ?? { n: 0, where: new Set() }; x.n++; x.where.add(where); m.set(k, x); };

// which fonts drew the words of each marked element, and for one that is not all in the three, which letters were not
async function faces(page, ctx, at) {
  const n = await page.evaluate(() => {
    let i = 0;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const e = t.parentElement;
      if (!e || !t.textContent.trim() || e.hasAttribute("data-face-check") || e.closest("canvas, script, style, noscript, [hidden], .visually-hidden")) continue;
      const b = e.getBoundingClientRect(), s = getComputedStyle(e);
      if (!b.width || !b.height || s.visibility === "hidden" || +s.opacity === 0) continue;
      e.setAttribute("data-face-check", String(i++));
    }
    return i;
  });
  if (!n) return [];
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: 0 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "[data-face-check]" });
  const off = (f) => !THREE.includes(f.familyName);
  const out = [];
  for (const nodeId of nodeIds) {
    const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    if (!fonts.some(off)) continue;
    // letter by letter, each in a probe of its own beside the element's words, in the element's own type
    const { attributes } = await cdp.send("DOM.getAttributes", { nodeId });
    const i = attributes[attributes.indexOf("data-face-check") + 1];
    const letters = await page.evaluate((i) => {
      const e = document.querySelector(`[data-face-check="${i}"]`);
      const own = [...e.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join("");
      const set = [...new Set(own.replace(/\s/g, ""))];
      set.forEach((c, k) => { const s = document.createElement("span"); s.textContent = c; s.setAttribute("data-face-probe", `${i}-${k}`); e.append(s); });
      return { set, words: own.replace(/\s+/g, " ").trim().slice(0, 30) };
    }, i);
    for (let k = 0; k < letters.set.length; k++) {
      const probe = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: `[data-face-probe="${i}-${k}"]` });
      if (!probe.nodeId) continue;
      const drawn = (await cdp.send("CSS.getPlatformFontsForNode", { nodeId: probe.nodeId })).fonts.filter(off);
      const c = letters.set[k];
      for (const f of drawn) out.push([`U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")} “${c}” in ${f.familyName}`, `${at} "${letters.words}"`]);
    }
    await page.evaluate((i) => document.querySelectorAll(`[data-face-probe^="${i}-"]`).forEach((p) => p.remove()), i);
  }
  await cdp.detach();
  return out;
}

for (const look of ["paper", "night"]) {
  for (const [w, h] of [[1280, 900], [375, 812]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block" });
    // the printed page's settings (version 2): the look, and no movement, so every word is measured where it rests
    await ctx.addInitScript((l) => localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: l, motion: "reduce" }, version: 2 })), look);
    for (const path of PAGES) {
      const page = await ctx.newPage();
      const at = `${path} ${w}px ${look}`;
      try {
        await page.goto(base + path);
        await page.locator("h1").first().waitFor({ timeout: 30_000 }).catch(() => {});
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(800);
        const r = await page.evaluate((measureType) => {
          const probe = document.createElement("span");
          document.body.append(probe);
          // the scale's steps, measured here (the titles' steps grow with the window)
          const steps = ["--step--2", "--step--1", "--step-0", "--step-sub", "--step-text", "--step-1", "--step-2", "--step-3", "--step-4"].map((v) => {
            probe.style.fontSize = `var(${v})`;
            return parseFloat(getComputedStyle(probe).fontSize);
          });
          // a colour as red, green, blue and opacity, however the browser writes it (rgb(), or color() for a mixed one)
          const pen = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true });
          const rgba = (c) => {
            probe.style.color = "";
            probe.style.color = c;
            pen.clearRect(0, 0, 1, 1);
            pen.fillStyle = getComputedStyle(probe).color;
            pen.fillRect(0, 0, 1, 1);
            const [r, g, b, a] = pen.getImageData(0, 0, 1, 1).data;
            return [r, g, b, a / 255];
          };
          const near = (x, y) => Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]) <= 9 && Math.abs(x[3] - y[3]) < 0.03;
          const token = (e, v) => rgba(getComputedStyle(e).getPropertyValue(v).trim());
          const show = (c) => `rgb${c[3] < 1 ? "a" : ""}(${c.slice(0, 3).join(", ")}${c[3] < 1 ? `, ${c[3].toFixed(2)}` : ""})`;
          // the fill the words sit on: the nearest box (the element or one around it) with a colour of its own
          const ground = (e) => {
            for (let x = e; x; x = x.parentElement) {
              const bg = rgba(getComputedStyle(x).backgroundColor);
              if (bg[3] >= 0.5) return bg;
            }
            return null;
          };
          const out = { size: [], colour: [], fill: [] };
          // GFS Didot, by the name the build gave it (only the titles' list of typefaces holds it)
          const didot = getComputedStyle(document.documentElement).getPropertyValue("--font-didot").split(",")[0].trim();
          // (words kept for screen readers only, .visually-hidden, are not drawn)
          const skip = (e) => e.closest("[data-decorative], canvas, svg, [aria-hidden=true], script, style, noscript, [hidden], .visually-hidden");
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          const seen = new Set();
          for (let t = walker.nextNode(); t; t = walker.nextNode()) {
            const e = t.parentElement;
            if (!e || seen.has(e) || !t.textContent.trim() || skip(e)) continue;
            seen.add(e);
            const b = e.getBoundingClientRect(), s = getComputedStyle(e);
            if (!b.width || !b.height || s.visibility === "hidden" || +s.opacity === 0) continue;
            const word = t.textContent.trim().slice(0, 24);
            if (measureType) {
              const px = parseFloat(s.fontSize);
              // the page's title is fluid by design, and lettering in GFS Didot (titles, numerals) is display lettering,
              // sized for its place; the Greek being read (the reader's lines, and Greek quoted at the reader's own size on
              // any page) is sized by the reader in Settings, and so is all that goes with the reader's lines (data-reading:
              // their numbers, speakers and metre marks, and the lines fitted to the width). A text quoted elsewhere (its
              // units, data-u, drawn as the reader draws them: the passage of the day, a lesson's passage) is judged at its
              // own size; its marks are sized from it, as an edition's are, and are not judged
              const unit = e.closest("[data-u]");
              let display = !!e.closest("h1, .page-title, [data-reading]") || (!!unit && Math.abs(parseFloat(getComputedStyle(unit).fontSize) - px) > 0.1);
              for (let x = e; x && !display && parseFloat(getComputedStyle(x).fontSize) === px; x = x.parentElement)
                display = getComputedStyle(x).fontFamily.includes(didot);
              probe.style.fontSize = "var(--greek-size)";
              e.append(probe);
              const reading = !!e.closest("[lang=grc]") && Math.abs(parseFloat(getComputedStyle(probe).fontSize) - px) < 0.6;
              document.body.append(probe);
              if (display || reading) { /* not judged */ }
              else if (px < 11.9) out.size.push([`${Math.round(px * 100) / 100}px (under 12)`, word]);
              // above the h3 step the titles are fluid (clamp()), so they are left as they are
              else if (px <= steps[6] + 0.6 && !steps.some((v) => Math.abs(v - px) < 0.6)) out.size.push([`${Math.round(px * 100) / 100}px`, word]);
            }
            // the colours for words on the ground they sit on: the page, a block of ink, or a red field
            const bg = ground(e);
            const onInk = bg && near(bg, token(e, "--ink")), onRed = bg && near(bg, token(e, "--rubric"));
            const ok = (onInk ? ["--bg", "--rubric-on-ink", "--ink-2-on-ink"] : onRed ? ["--bg"]
              : ["--ink", "--ink-2", "--ink-3", "--rubric", "--ok", "--ochre", "--blue", "--legend"]).map((v) => token(e, v));
            const colour = rgba(s.color);
            if (!ok.some((c) => near(c, colour))) out.colour.push([`${show(colour)}${onInk ? " on the ink" : onRed ? " on the red" : ""}`, word]);
          }
          // filled buttons: a link or button with an opaque fill and words, that is not a chip, a tab, a choice or a chosen state
          for (const e of document.querySelectorAll("main a, main button, footer a, footer button")) {
            if (skip(e) || e.matches(".chip, [role=tab], [role=radio], [role=checkbox], [role=switch], [role=option], [aria-pressed], [aria-selected], [aria-current]")) continue;
            const s = getComputedStyle(e), b = e.getBoundingClientRect();
            // a card that is a link (a heading or a picture inside) is not a button
            if (!b.width || !e.textContent.trim() || b.height > 72 || e.querySelector("h2, h3, h4, img, canvas, figure")) continue;
            const bg = rgba(s.backgroundColor);
            if (bg[3] < 0.5) continue;
            if (!near(bg, token(e, "--btn-bg"))) out.fill.push([`${show(bg)} with ${show(rgba(s.color))}`, e.textContent.trim().slice(0, 24)]);
          }
          probe.remove();
          return out;
        }, look === "paper");
        for (const k of ["size", "colour", "fill"]) for (const [v, word] of r[k]) count(tally[k], v, `${at} "${word}"`);
        if (look === "paper") for (const [v, where] of await faces(page, ctx, at)) count(tally.face, v, where);
      } catch (e) {
        found.push(`load ${at}: ${String(e).split("\n")[0]}`);
      }
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();

const report = (kind, entries) => {
  for (const [v, x] of [...entries].sort((a, b) => b[1].n - a[1].n)) found.push(`${kind} ${v}: ${x.n} time(s), e.g. ${[...x.where].slice(0, 3).join(" · ")}`);
};
report("face", tally.face.entries());
report("size", tally.size.entries());
report("colour", tally.colour.entries());
report("button", tally.fill.entries());
if (process.env.SUMMARY) for (const k of Object.keys(tally)) console.log(`${k}: ${tally[k].size} distinct off the tokens, ${[...tally[k].values()].reduce((n, x) => n + x.n, 0)} in all`);
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "every letter in the three typefaces; every size, colour and button one of the site's own");
process.exit(found.length ? 1 : 0);

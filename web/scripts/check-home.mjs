// The home page check (review fix list, slice 7). On a first visit and on a returning one, at a computer's width and a
// phone's, it lists:
//   invite   - the "New here?" card over the "Where are you starting?" panel or the words of the page's head
//   desk     - Your desk showing raw state: a position "at 0", the same lesson twice, an old page title ("My Library")
//              where a room has its one name, a page's whole tab title ("Which dictionary? · The Academy") for its name,
//              or a page that was not found offered to carry on with (the visitor really opens a guide and a missing page
//              first, so their real titles are in the trail)
//   pictures - more than one picture before the first words of the page's body (the passage of the day)
//   letters  - the floating letters reaching any words below the page's head
//   passage  - its title aligned otherwise than its text; on a computer, the English under the Greek, not beside it; its
//              caption smaller than the type scale's step for captions (14 px)
//   credits  - a long paragraph of picture credits on the page; a picture without an ⓘ for its credit
//   rooms    - the site's name said twice in the rooms' heading
//   stoa     - the feature from the Painted Stoa with no way to read more there
//   captions - pictures captioned in more than one style (here, on the Academy's page, and on pages with a window by their title)
// usage: node web/scripts/check-home.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
const MIN_TEXT = 14;   // the type scale's step for captions and small print (--step--1, 0.875rem)
const overlap = (a, b) => a && b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

for (const [w, h] of [[1280, 900], [375, 812]]) {
  const tag = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block" });
  const page = await ctx.newPage();

  // ---- a first visit (?invite lets the invitation appear in a test browser)
  await page.goto(base + "/?invite");
  await page.waitForTimeout(5200);
  await page.mouse.wheel(0, 40);
  await page.waitForTimeout(600);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  const first = await page.evaluate(() => {
    const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return r.width && r.height ? { left: r.left, right: r.right, top: r.top, bottom: r.bottom } : null; };
    const invite = document.querySelector('aside[aria-label="New here?"]');
    const panel = [...document.querySelectorAll("main div")].find((d) => d.firstElementChild?.textContent?.trim() === "Where are you starting?" && d.querySelector('[role="tablist"]'));
    const head = [...document.querySelectorAll("main h1, main h1 ~ p, main h1 ~ div a")].map(box).filter(Boolean);
    return { invite: box(invite), panel: box(panel), head };
  });
  if (first.invite && (overlap(first.invite, first.panel) || first.head.some((b) => overlap(first.invite, b)))) found.push(`invite ${tag}: the "New here?" card lies over the "Where are you starting?" panel or the page's head`);

  // ---- the floating letters: where they can be drawn (their canvas, less what its clip-path cuts off), against every line of
  // words below the page's head, at three places down the page
  for (const y of [0, h / 2, h * 1.2]) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
    await page.waitForTimeout(300);
    const hit = await page.evaluate(() => {
      const dust = document.querySelector("main canvas[aria-hidden=true]:not([role])");
      if (!dust || getComputedStyle(dust).visibility === "hidden" || getComputedStyle(dust).display === "none") return null;
      const r = dust.getBoundingClientRect(), cp = getComputedStyle(dust).clipPath.match(/inset\(([^)]*)\)/);
      const [t = 0, rt = t, bt = t, l = rt] = cp ? cp[1].split(/\s+/).map(parseFloat) : [];
      const area = { left: r.left + l, right: r.right - rt, top: r.top + t, bottom: r.bottom - bt };
      if (area.bottom <= area.top) return null;
      const head = document.querySelector("main h1")?.closest("[data-letters-area], div[class*=h-hero]");
      const words = [...document.querySelectorAll("main p, main h2, main h3, main section span")].filter((e) => !head?.contains(e) && e.textContent.trim());
      const over = words.find((e) => { const b = e.getBoundingClientRect(); return b.height && b.left < area.right && area.left < b.right && b.top < area.bottom && area.top < b.bottom; });
      return over ? over.textContent.trim().slice(0, 40) : null;
    });
    if (hit) { found.push(`letters ${tag}: the floating letters can be drawn over "${hit}", below the page's head`); break; }
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));

  // ---- the page's body: pictures, letters, passage, credits, rooms, the Stoa feature
  const body = await page.evaluate((MIN) => {
    const out = [];
    const pod = document.querySelector('section[aria-label="Passage of the day"]');
    const podTop = pod ? pod.getBoundingClientRect().top + scrollY : Infinity;
    const pics = [...document.querySelectorAll("main canvas[role=img]")].filter((c) => { const r = c.getBoundingClientRect(); return r.width > 0 && r.top + scrollY < podTop; });
    if (pics.length > 1) out.push(`pictures: ${pics.length} pictures before the passage of the day (${pics.map((c) => c.getAttribute("aria-label")?.slice(0, 40)).join("; ")})`);
    if (pod) {
      const blk = pod.querySelector("[lang=grc]");
      const title = blk?.querySelector("h1, h2, h3, h4, [class*=head], [class*=title]");
      const text = [...(blk?.querySelectorAll("[data-u]") ?? [])].map((u) => [...u.querySelectorAll("*")].find((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && e !== title && !title?.contains(e))).find(Boolean);
      if (title && text && getComputedStyle(title).textAlign !== getComputedStyle(text).textAlign) out.push(`passage: its title is ${getComputedStyle(title).textAlign}, its text ${getComputedStyle(text).textAlign}`);
      const en = pod.querySelector('[lang=grc] ~ div');
      if (innerWidth >= 1100 && blk && en) {
        const g = blk.getBoundingClientRect(), e = en.getBoundingClientRect();
        if (!(Math.abs(e.top - g.top) < 60 && e.left >= g.right - 1)) out.push("passage: on a computer the English stands under the Greek, not beside it");
      }
      for (const c of pod.querySelectorAll("p")) {
        const fs = parseFloat(getComputedStyle(c).fontSize);
        if (c.textContent.trim() && !c.closest("[lang=grc]") && !c.closest("[lang=grc] ~ div") && fs < MIN) out.push(`passage: "${c.textContent.trim().slice(0, 40)}…" is set at ${fs.toFixed(1)} px`);
      }
    }
    for (const p of document.querySelectorAll("main p")) {
      const lic = (p.textContent.match(/\bCC(?:0| BY)|public domain/g) ?? []).length;
      if (lic >= 3) out.push(`credits: a paragraph of ${lic} picture credits ("${p.textContent.trim().slice(0, 50)}…")`);
    }
    for (const c of document.querySelectorAll("main canvas[role=img]")) {
      const win = c.parentElement;
      if (!win.querySelector('button[aria-label^="About the picture"]') && !win.closest("figure")?.querySelector('button[aria-label^="About the picture"]')) out.push(`credits: the picture "${c.getAttribute("aria-label")?.slice(0, 50)}" has no ⓘ for its credit`);
    }
    const rooms = document.querySelector('section[aria-label="The rooms of the site"]');
    const head = rooms?.firstElementChild?.textContent ?? "";
    if (/Mathesis Stoicheion/i.test(head)) out.push(`rooms: the rooms' heading says "${head.trim()}"`);
    const stoa = document.querySelector('section[aria-label="From the Painted Stoa"]');
    if (stoa && !stoa.querySelector('a[href^="/stoa"]')) out.push("stoa: the feature from the Painted Stoa has no link to read more there");
    return out;
  }, MIN_TEXT);
  for (const f of body) found.push(`${f.split(":")[0]} ${tag}:${f.slice(f.indexOf(":") + 1)}`);

  // ---- a returning visitor: their desk
  await page.evaluate(() => {
    const now = Date.now();
    localStorage.setItem("mathesis:start", JSON.stringify({ choice: "none", t: now }));
    localStorage.setItem("mathesis:positions", JSON.stringify({ "tlg0085.tlg005": { ed: "", tr: null, at: "0", t: now - 1000 }, "tlg0012.tlg001": { ed: "", tr: null, at: "1.10", t: now - 2000 } }));
    localStorage.setItem("mathesis:resume", JSON.stringify({ scroll: {}, trail: [
      { href: "/academy/lesson/letters", title: "The letters · Mathesis Stoicheion", t: now - 500 },
      { href: "/treasury", title: "The Treasury · My Library", t: now - 3000 },
      { href: "/town-hall", title: "Town Hall · Mathesis Stoicheion", t: now - 4000 },
      { href: "/stoa", title: "The Stoa · Wiki", t: now - 5000 },
    ] }));
  });
  // pages really visited (a page is noted once it has stood for 0.8 s: components/Resume.tsx)
  for (const path of ["/academy/guide/which-dictionary", "/no-such-page"]) { await page.goto(base + path); await page.waitForTimeout(1200); }
  await page.goto(base + "/");
  await page.waitForTimeout(1500);
  const desk = await page.evaluate(() => {
    // the desk stands where a first visit's "Where are you starting?" stands, in the same section, under the heading
    // "Your desk" (the printed page's home, decision 7)
    const d = document.querySelector('section[aria-labelledby="start-title"] > .back-only');
    if (!d || !d.getBoundingClientRect().height) return null;
    return { text: d.innerText.replace(/\s+/g, " "), bold: [...d.querySelectorAll("b")].map((b) => b.textContent.trim()), also: [...(d.querySelector("p")?.querySelectorAll("a") ?? [])].map((a) => a.textContent.trim()) };
  });
  if (!desk) found.push(`desk ${tag}: no desk for a returning visitor`);
  else {
    if (/\bat 0\b/.test(desk.text)) found.push(`desk ${tag}: shows a book "at 0"`);
    // the same thing twice: one bold line the same as another, or ending with it ("Lesson 1: The letters" and "The letters")
    const twice = desk.bold.find((b, i) => desk.bold.some((c, k) => k !== i && (c === b || c.endsWith(`: ${b}`))));
    if (twice) found.push(`desk ${tag}: "${twice}" twice`);
    for (const a of desk.also) if (/My Library|Town Hall|\bWiki\b|The Stoa\b| · /.test(a)) found.push(`desk ${tag}: "Also recently" shows the page title "${a}"`);
    for (const b of desk.bold) if (/ · /.test(b)) found.push(`desk ${tag}: "${b}" is the page's tab title, not its name`);
    if (/\bNot found\b|has not survived/.test(desk.text)) found.push(`desk ${tag}: offers a page that was not found`);
  }

  // ---- one caption style: here, on the Academy's page, and on pages with a window by their title
  const styles = [];
  for (const path of ["/", "/academy", "/search", "/academy/lesson/letters", "/about"]) {
    await page.goto(base + path);
    await page.waitForTimeout(800);
    styles.push(...await page.evaluate((path) => [...document.querySelectorAll("main canvas[role=img]")].filter((c) => c.getBoundingClientRect().width).map((c) => {
      const win = c.closest("figure") ?? c.parentElement;
      const cap = win.querySelector("[data-wcap], figcaption");
      if (!cap) return { path, label: c.getAttribute("aria-label")?.slice(0, 40), style: "none" };
      const cs = getComputedStyle(cap);
      return { path, label: c.getAttribute("aria-label")?.slice(0, 40), style: `${cs.fontFamily.split(",")[0]} / ${cs.textTransform} / ${((parseFloat(cs.letterSpacing) || 0) / parseFloat(cs.fontSize)).toFixed(2)} em apart` };
    }), path));
  }
  const kinds = [...new Set(styles.map((x) => x.style))];
  for (const x of styles.filter((x) => x.style === "none")) found.push(`captions ${tag}: ${x.path} "${x.label}" has no caption`);
  if (kinds.filter((k) => k !== "none").length > 1) found.push(`captions ${tag}: ${kinds.filter((k) => k !== "none").length} caption styles (${kinds.filter((k) => k !== "none").join(" | ")})`);
  await ctx.close();
}

await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "the home page is in order");
process.exit(found.length ? 1 : 0);

// The reader check (review fix list, slice 8), on Aeschylus' Agamemnon with Smyth's English, at a computer's width and a phone's,
// on Paper, and once more at Night (the printed-page redesign: the case colours are chosen for each).
// It lists:
//   cover   - a reader coming back to the book (a saved position) who lands on its title page, not on the text
//   zero    - "line 0" where the foot bar says where you are, or a passage numbered 0 in the margin (Perseus's line 0 is only the
//             first speaker's name)
//   indent  - English set with a hanging indent (its first line pulled out to the left)
//   breaks  - a stretch of English that stops in the middle of a sentence ("…news from Troy and") with the rest beside the
//             next lines; English is cut only where a sentence or clause ends
//   grip    - the drag grip beside a passage number with nothing that says what it is for when it is pointed at
//   legend  - Colour by case with no key on screen as you read; two cases told apart by colour alone, or by colours that
//             look alike to a reader with red-green or blue-yellow colour blindness; a word's case not shown in its look-up
//   tools   - the Study menu: the modes (Transliteration, Colour by case…) not drawn as switches, the actions (Vocabulary,
//             Places…) drawn as switches; nothing on the Study button to say a mode is on
//   word    - the look-up: the same meaning twice, a dead-end "No Wiktionary entry", the reader's English hidden behind it
//   bar     - on a phone, the foot bar in more than one row, or its place in words cut short
//   alone   - a book that opens with an English column beside the Greek on a fresh profile (the quiet desk, ticket 07: it opens
//             on Greek alone); "Show the English" under a passage that does not show its English and credit, that shows it for
//             other passages too, that is not undone by "Hide the English", that opens the Greek look-up when its English is
//             tapped, that runs into the margin kept for the look-up or off the side of a phone; a saved "Both" that is lost
//             (or an old default "Both" that is not changed to Greek alone, once)
//   first   - a book that opens on a fresh profile without its title page; a second opening (the same profile, reloaded) that shows
//             the title page again, has no one-line title, or has it where the Greek does not start, or whose first line of Greek is
//             more than 200 px down (the quiet desk, ticket 08: a book opens on its text, and its title page shows only the first time)
//   numbers - the margin showing a passage's whole reference ("1.580") where its number in its book ("580") will do, or that whole
//             reference gone from the button that carries it (data-row, aria-label); a line's own number repeating the margin's
//   phone   - on a phone, a passage's number above its passage or beside a line other than its first, or wrapped in its column; the
//             number of every fifth line not in the same column and level with its line; the Greek not starting at one edge down the page
//   photos  - a photograph in the reader: on a book's title page (the Iliad had the Mask of Agamemnon) or on the reader with
//             no book open (the owner, 2026-10-26: "no useless photos plastered everywhere")
// and, for the Greek's size (the quiet desk, ticket 10, the owner, 2026-10-30; Iliad 1, 611 lines, already opened once so that it opens on its text):
//   verse   - the Greek not 16 to 18 px on a phone (390 and 412 px wide) or not 26 px on a computer (1440, 1920 and 2560, where the page's rem has grown to 18 px and
//             the size must not grow with it; at least 22 px at 1100, where the widest lines need the room), or Plato's prose at 390 not at the reader's size (18 px); on a phone a line that wraps though it fits its room, a wrapped line whose
//             second row is not at least 1 em in from its first, more than 5% of the lines wrapped, or the first rows not at one left edge; on a computer any
//             line wrapped; Aa not naming the size on the screen, or its first step not a step from there that saves a number. The spec's floor ("It never goes
//             below 16 px") wins over wholeness: the widest lines of the Iliad cannot stand whole in 342 px at 16 px, so a few wrap, hanging
// and, for the foot bar, Aa and Study (the quiet desk, ticket 09, the owner, 2026-10-30; the Iliad on its second opening, at 1440 and 390 px):
//   top     - anything fixed or sticky along the top of one book after 800 px of reading (the old top bar), or the paper's
//             darkened edges on the reader's page
//   foot    - the foot bar not saying "← Library", where you are, Aa and Study from the left in that order, a control under
//             44 px on a phone or 36 px tall on a computer, the place not moving as the page is read, Go to with page arrows;
//             the end of the text, Back to top, Listen's player or (on a computer) a side panel standing under the bar
//   slips   - on a phone, the bar not slipping away after 600 px read on, not back after 200 px read back or a tap on the paper,
//             or still standing under the look-up sheet, a panel's sheet or the passage toolbar (or not back when they are put away);
//             its movement not stopped by reduced motion
//   study   - a tool, a mode or a choice that is not in Study (or Aa, for the page, the size, the spacing and the columns), that
//             is there twice, or a button that leads to the same place as another; the Study button not showing the modes on
//   close   - a menu or a panel without a visible close; Escape not closing it and returning to its button; a panel opened from
//             Study without "Back to Study", or whose way back (Escape too) does not bring Study back; a panel opened some other
//             way with one
// The word packs and the dictionary are served from their own site (config/packs.ts); this check fetches them from the
// packs repository, and answers Wiktionary with "no entry" so that case is seen.
// usage: node web/scripts/check-reader.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        ONLY=verse (or agamemnon, alone, first, foot, compare, photos; several with commas) reads those parts only
//        PROVE_CSS=<css> or PROVE_JS=<script> adds a fault to every page, to show the check catches it
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const PACKS = "https://raw.githubusercontent.com/mathesisstoicheion/packs/main";
const WORK = "tlg0085.tlg005", URL_ = `/read?w=${WORK}&tr=perseus-eng3`;
const MODES = ["Transliteration", "Colour by case", "Words I know", "Metre", "Try it first"];
const ACTIONS = ["Vocabulary for this page", "Places on this page", "Find in this text", "Listen to the English", "How it was written"];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
// ONLY=verse reads that part only (the whole check is slow); with no ONLY, every part
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
const runs = (part) => !ONLY || ONLY.has(part);
// PROVE_CSS=<css> or PROVE_JS=<script> adds a fault to every page, to show the check catches it (as check-bar.mjs and check-still.mjs do)
if (process.env.PROVE_CSS || process.env.PROVE_JS) {
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (...a) => {
    const c = await newContext(...a);
    if (process.env.PROVE_CSS) await c.addInitScript((css) => addEventListener("load", () => document.head.append(Object.assign(document.createElement("style"), { textContent: css }))), process.env.PROVE_CSS);
    if (process.env.PROVE_JS) await c.addInitScript(process.env.PROVE_JS);
    return c;
  };
}

// what a colour looks like to a reader with protanopia, deuteranopia or tritanopia (Machado, Oliveira and Fernandes 2009, severity 1)
const CVD = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const unlin = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const seen = (rgb, m) => { const l = rgb.map(lin); return m.map((r) => unlin(Math.min(1, Math.max(0, r[0] * l[0] + r[1] * l[1] + r[2] * l[2])))); };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const rgbOf = (s) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map((x) => (s.startsWith("color(") ? +x * 255 : +x)).map(Math.round);
const MIN_APART = 45;   // how far apart (in 0–255 RGB) two case colours must stay, as each kind of colour blindness sees them

// the settings as the browser keeps them (lib/settings.ts): version 3 is the quiet desk's, version 2 the printed page's
const saved = (version, columns) => JSON.stringify({ state: { columns }, version });

/** a button of the foot bar by its name: on a phone the bar has slipped away once the page is read on, so the page is scrolled up a little to bring it back, as a reader does */
async function barButton(page, name) {
  const b = page.getByRole("button", { name }).first();
  if (!(await b.isVisible())) { await page.evaluate(() => scrollBy(0, -40)); await b.waitFor({ state: "visible" }); }
  return b;
}
async function reader(ctx, w, h, seed) {
  const page = await ctx.newPage();
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${path}` }) }); } catch { await route.abort(); }
  });
  await page.route(/wiktionary\.org/, (route) => route.fulfill({ status: 404, contentType: "application/json", body: "{}" }));
  // the sections below read the English beside the Greek, so these readers have chosen "Both" (the default is Greek alone)
  await page.addInitScript((v) => { localStorage.setItem("mathesis:settings", v); }, saved(3, "both"));
  if (seed) await page.addInitScript((work) => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    localStorage.setItem("mathesis:positions", JSON.stringify({ [work]: { ed: "", tr: "perseus-eng3", at: "0", t: Date.now() - 60000 } }));
  }, WORK);
  await page.goto(base + URL_);
  await page.waitForSelector('[data-u="1"]', { timeout: 45000 });
  await page.waitForTimeout(2500);
  return page;
}

for (const [w, h, scheme = "light"] of runs("agamemnon") ? [[1280, 900], [1100, 860], [375, 812], [1280, 900, "dark"]] : []) {
  const tag = `${w}px${scheme === "dark" ? " Night" : ""}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, serviceWorkers: "block", hasTouch: w < 700 });
  const page = await reader(ctx, w, h, true);

  // ---- cover: coming back to a book with a place saved, the text is on the screen, not the title page
  const cover = await page.evaluate(() => {
    const line = document.querySelector('[data-u="1"]')?.getBoundingClientRect();
    return { top: line?.top ?? 9999, scroll: scrollY };
  });
  if (cover.top > h * 0.6 || cover.top < 0) found.push(`cover ${tag}: a returning reader lands on the title page (the first line is ${Math.round(cover.top)} px down, the screen ${h} px tall)`);

  if (w !== 1100) {
    // ---- zero: the bar's page, and the margin
    const zero = await page.evaluate(() => {
      const label = document.querySelector('[data-foot-bar] button[aria-label="Go to a line or book"]')?.textContent ?? "";
      const zeros = [...document.querySelectorAll("article button[data-row], article [data-u] span, article [data-tr] span")]
        .filter((e) => !e.children.length && e.textContent.trim() === "0" && e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== "hidden");
      return { label, zeros: zeros.length };
    });
    if (/(^|\s)0(\s|$)/.test(zero.label)) found.push(`zero ${tag}: the bar says "${zero.label.trim()}"`);
    if (zero.zeros) found.push(`zero ${tag}: ${zero.zeros} passage or line number(s) "0" on the page`);

    // ---- indent and breaks: the English
    const eng = await page.evaluate(() => {
      const out = { indent: [], open: [] };
      const trs = [...document.querySelectorAll("article section[data-key] > [data-tr]")];
      for (const t of trs) for (const e of t.querySelectorAll("*")) {
        if (parseFloat(getComputedStyle(e).textIndent) < 0 && e.textContent.trim().length > 40) { out.indent.push(e.textContent.trim().slice(0, 40)); break; }
      }
      // each stretch's last block of prose, and whether the next begins with a new speaker (a cut there is a change of voice)
      const blocks = (t) => [...t.querySelectorAll(":scope > p, :scope > div")].filter((e) => e.innerText.trim());
      for (let i = 0; i < trs.length - 1; i++) {
        const last = blocks(trs[i]).at(-1), next = blocks(trs[i + 1])[0];
        const text = last?.innerText.replace(/\s+/g, " ").trim() ?? "";
        if (!next || next.querySelector("[data-speaker]") || text.length < 100) continue;
        if (/[\p{L}\p{N}]$/u.test(text)) out.open.push(`…${text.slice(-30)} | ${next.innerText.replace(/\s+/g, " ").trim().slice(0, 30)}…`);
      }
      return out;
    });
    if (eng.indent.length) found.push(`indent ${tag}: ${eng.indent.length} English passage(s) with a hanging indent ("${eng.indent[0]}…")`);
    for (const o of eng.open) found.push(`breaks ${tag}: the English breaks mid-sentence: ${o}`);
  }

  // ---- grip: pointed at, it says what it is for (desktop only: phones have no grip)
  if (w >= 1100) {
    const row = page.locator("article section[data-key]").nth(2);
    await row.hover();
    const grip = row.locator("[data-drag]");
    if (await grip.count()) {
      await grip.hover();
      await page.waitForTimeout(400);
      const tip = await grip.evaluate((g) => {
        const after = getComputedStyle(g, "::after"), before = getComputedStyle(g, "::before");
        const pseudo = [after, before].map((s) => (s.content && s.content !== "none" && s.content !== "normal" && s.opacity !== "0" && s.visibility !== "hidden" ? s.content : "")).join("");
        const label = document.getElementById(g.getAttribute("aria-describedby") ?? "");
        return pseudo.replace(/"/g, "") || (label && label.getBoundingClientRect().width ? label.textContent : "");
      });
      if (!/drag|quote/i.test(tip)) found.push(`grip ${tag}: the drag grip beside a passage number shows nothing to say what it does`);
    }
  }

  // ---- tools: modes as switches, actions as buttons, and a sign on Study when a mode is on
  const toolsBtn = await barButton(page, /^Study\b/);
  await toolsBtn.click();
  const panelId = await toolsBtn.getAttribute("aria-controls");
  const kinds = await page.evaluate(({ id, MODES, ACTIONS }) => {
    const p = document.getElementById(id);
    // a row's name is the first of the elements its aria-labelledby names (its quiet line is its description)
    const nameOf = (b) => (b.getAttribute("aria-labelledby") ?? "").split(" ").slice(0, 1).map((i) => document.getElementById(i)?.textContent ?? "").join("").trim() || b.textContent.trim().replace(/\s+/g, " ");
    const look = (b) => {
      const sw = b.querySelector("[data-switch]");
      return { pressed: b.getAttribute("aria-pressed"), switch: !!sw && sw.getBoundingClientRect().width >= 14 };
    };
    const get = (names) => names.map((n) => [n, [...(p?.querySelectorAll("button") ?? [])].find((b) => nameOf(b) === n)]).filter(([, b]) => b).map(([n, b]) => ({ n, ...look(b) }));
    return { modes: get(MODES), actions: get(ACTIONS) };
  }, { id: panelId, MODES, ACTIONS });
  if (kinds.modes.length < 3 || kinds.actions.length < 3) found.push(`tools ${tag}: the Study menu's modes and actions were not found (${kinds.modes.length} and ${kinds.actions.length})`);
  for (const m of kinds.modes) if (m.pressed === null || !m.switch) found.push(`tools ${tag}: "${m.n}" is a mode but is not drawn as a switch`);
  for (const a of kinds.actions) if (a.switch || a.pressed !== null) found.push(`tools ${tag}: "${a.n}" opens a panel but is drawn as an on/off switch`);
  const before = await toolsBtn.evaluate((b) => b.innerText + "|" + (b.querySelector("[data-on]") ? 1 : 0));
  await page.locator(`[id="${panelId}"]`).getByRole("button", { name: "Colour by case", exact: true }).click();
  await page.waitForTimeout(300);
  const after = await toolsBtn.evaluate((b) => b.innerText + "|" + (b.querySelector("[data-on]") ? 1 : 0));
  if (before === after) found.push(`tools ${tag}: nothing on the Study button changes when a mode is turned on`);
  await page.keyboard.press("Escape");

  // ---- legend: Colour by case, read some way down the page
  await page.waitForSelector("article [data-case]", { timeout: 30000 }).catch(() => null);
  await page.evaluate(() => scrollBy({ top: innerHeight * 1.5, behavior: "instant" }));
  await page.waitForTimeout(500);
  const legend = await page.evaluate(() => {
    const l = document.querySelector('[aria-label="Case colours"]');
    const r = l?.getBoundingClientRect();
    const onScreen = !!r && r.width > 0 && r.bottom > 0 && r.top < innerHeight && getComputedStyle(l).visibility !== "hidden";
    const cases = [...(l?.querySelectorAll("[data-case]") ?? [])].map((e) => {
      const s = getComputedStyle(e);
      return { c: e.dataset.case, colour: s.textDecorationColor, style: `${s.textDecorationLine} ${s.textDecorationStyle}` };
    }).filter((c) => c.style.startsWith("underline"));
    return { onScreen, cases };
  });
  if (legend.cases.length < 5) found.push(`legend ${tag}: the key shows ${legend.cases.length} of the five cases in their colours`);
  if (!legend.onScreen) found.push(`legend ${tag}: Colour by case is on, but its key is not on the screen as you read`);
  if (new Set(legend.cases.map((c) => c.style)).size < legend.cases.length) found.push(`legend ${tag}: some cases are told apart by colour alone (${legend.cases.map((c) => `${c.c}: ${c.style}`).join("; ")})`);
  for (const [kind, m] of Object.entries(CVD)) {
    for (let i = 0; i < legend.cases.length; i++) for (let j = i + 1; j < legend.cases.length; j++) {
      const a = legend.cases[i], b = legend.cases[j];
      const d = dist(seen(rgbOf(a.colour), m), seen(rgbOf(b.colour), m));
      if (d < MIN_APART) found.push(`legend ${tag}: with ${kind}, ${a.c} and ${b.c} look alike (${Math.round(d)} apart)`);
    }
  }

  // ---- word: the look-up of a word coloured by its case
  const word = page.locator("article [data-case]").filter({ visible: true }).first();
  if (await word.count()) {
    const wcase = await word.getAttribute("data-case");
    const rowKey = await word.evaluate((e) => e.closest("section[data-key]")?.dataset.key);
    await word.click();
    const panel = page.locator('aside[aria-label^="Look-up"]');
    await panel.waitFor({ timeout: 15000 });
    await page.waitForFunction(() => !/Opening the dictionary|Finding this word|Looking it up/.test(document.querySelector('aside[aria-label^="Look-up"]')?.textContent ?? ""), null, { timeout: 30000 }).catch(() => null);
    await page.waitForTimeout(500);
    const look = await panel.evaluate((p, rowKey) => {
      const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
      const glosses = [...p.querySelectorAll("p")].filter((e) => e.offsetParent && !e.closest("ol, ul") && e.textContent.trim().length > 2 && !e.querySelector("b, a, span[lang]") && !/^(GLAUx|From |Analysis|Text provided)/.test(e.textContent.trim()));
      const texts = glosses.map((e) => norm(e.textContent)).filter((t) => t.length > 2);
      const twice = texts.find((t, i) => texts.indexOf(t) !== i);
      const row = document.querySelector(`section[data-key="${CSS.escape(rowKey)}"] > [data-tr]`);
      const pr = p.getBoundingClientRect(), tr = row?.getBoundingClientRect();
      const covered = tr && tr.width ? Math.max(0, Math.min(pr.right, tr.right) - Math.max(pr.left, tr.left)) / tr.width : 0;
      const sheet = pr.top > innerHeight * 0.3 && pr.width >= innerWidth - 2;
      return { twice, dead: /No Wiktionary entry/.test(p.textContent), covered, sheet, swatch: p.querySelector("[data-case]")?.dataset.case ?? null };
    }, rowKey);
    if (look.twice) found.push(`word ${tag}: the look-up gives the same meaning twice ("${look.twice.slice(0, 50)}")`);
    if (look.dead) found.push(`word ${tag}: the look-up shows a dead end, "No Wiktionary entry for this form."`);
    if (!look.sheet && look.covered > 0.5) found.push(`word ${tag}: the look-up hides ${Math.round(look.covered * 100)}% of the English for the line being read`);
    if (look.swatch !== wcase) found.push(`word ${tag}: the word is coloured ${wcase}, but its look-up does not show the case's colour`);
    await page.keyboard.press("Escape");
  } else found.push(`legend ${tag}: no word was coloured by case`);
  // leave the setting as it was
  await (await barButton(page, /^Study\b/)).click();
  await page.locator(`[id="${panelId}"]`).getByRole("button", { name: "Colour by case", exact: true }).click();
  await page.keyboard.press("Escape");

  // ---- bar: one row on a phone, the place in words whole (the foot bar, ReaderBar.tsx)
  if (w < 700) {
    const bar = await page.evaluate(() => {
      const foot = document.querySelector("[data-foot-bar]");
      const inner = foot?.firstElementChild;
      const at = foot?.querySelector('[id$="-at"]');
      const tops = new Set([...(inner?.querySelectorAll("a, button") ?? [])].filter((c) => c.getBoundingClientRect().width).map((c) => Math.round(c.getBoundingClientRect().top / 20)));
      return { h: inner?.getBoundingClientRect().height ?? 0, rows: tops.size, place: at?.textContent ?? "", cut: at ? at.scrollWidth > at.clientWidth + 1 : true, width: at?.getBoundingClientRect().width ?? 0, sideways: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    if (bar.h > 64) found.push(`bar ${tag}: the reader's bar is ${Math.round(bar.h)} px tall (in more than one row)`);
    if (bar.rows > 1) found.push(`bar ${tag}: the reader's bar has its buttons in ${bar.rows} rows`);
    if (bar.cut || bar.width < 40) found.push(`bar ${tag}: the place the bar names is cut short ("${bar.place}", ${Math.round(bar.width)} px)`);
    if (bar.sideways) found.push(`bar ${tag}: the page scrolls sideways`);
  }
  await ctx.close();
}

// ---- alone: a book opens on Greek alone, and "Show the English" opens one passage's English under its Greek
const ILIAD = "/read?w=tlg0012.tlg001&tr=perseus-eng3";
async function iliad(ctx, settings) {
  const page = await ctx.newPage();
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${path}` }) }); } catch { await route.abort(); }
  });
  if (settings) await page.addInitScript((v) => { localStorage.setItem("mathesis:settings", v); }, settings);
  await page.goto(base + ILIAD);
  await page.waitForSelector('article [data-key="1.5"] [data-u] [data-w]', { timeout: 45000 });
  await page.waitForTimeout(1500);
  return page;
}
/** how many English columns are on the screen, and how many "Show the English" buttons */
const columnsShown = (page) => page.evaluate(() => ({
  tr: [...document.querySelectorAll("article [data-tr]")].filter((e) => e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== "none").length,
  buttons: [...document.querySelectorAll("article section[data-key] button")].filter((b) => /^Show the English$/.test(b.textContent.trim())).length,
}));
/** scroll to the true end of the page: the text grows as the rest of a long book is drawn, so it goes on until the height has stopped changing */
async function toEnd(page) {
  for (let i = 0, last = -1; i < 40; i++) {
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(450);
    const m = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, end: scrollY + innerHeight >= document.documentElement.scrollHeight - 2 }));
    if (m.end && m.h === last) return;
    last = m.h;
  }
}

for (const [w, h, touch] of runs("alone") ? [[1440, 900, false], [390, 844, true]] : []) {
  const tag = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block", hasTouch: touch });
  const page = await iliad(ctx);
  const first = await columnsShown(page);
  if (first.tr) found.push(`alone ${tag}: the Iliad opens on a fresh profile with ${first.tr} English column(s) beside the Greek`);
  if (!first.buttons) found.push(`alone ${tag}: no passage offers "Show the English"`);

  try {
    const row = (key) => page.locator(`article section[data-key="${key}"]`);
    const btn = (key) => row(key).locator("button", { hasText: /the English$/ });
    await row("1.5").scrollIntoViewIfNeeded();
    await btn("1.5").click();
    await page.waitForTimeout(700);
    const shown = await row("1.5").evaluate((r, w) => {
      const one = r.querySelector("[data-one]"), b = [...r.querySelectorAll("button")].find((x) => /the English$/.test(x.textContent.trim()));
      const grc = r.querySelector("[lang=grc]")?.getBoundingClientRect(), lastU = [...r.querySelectorAll("[data-u]")].at(-1)?.getBoundingClientRect(), box = one?.getBoundingClientRect(), rr = r.getBoundingClientRect();
      const track = getComputedStyle(r).gridTemplateColumns.split(" ").map(parseFloat).at(-1);
      return {
        text: one?.textContent.trim() ?? "", visible: !!box && box.width > 0 && box.height > 0,
        label: b?.textContent.trim(), expanded: b?.getAttribute("aria-expanded"),
        under: !!box && !!grc && !!lastU && box.top >= lastU.bottom - 2 && box.left >= grc.left - 1 && box.right <= grc.right + 1,
        margin: !!box && w >= 1100 && box.right > rr.right - track + 1,
        // the button and the English start where the Greek's words do, not under the line numbers (the quiet desk, ticket 07)
        lefts: [r.querySelector("[data-w]")?.getBoundingClientRect().left, b?.getBoundingClientRect().left, box?.left].map((x) => Math.round(x ?? -1)),
        sideways: document.documentElement.scrollWidth > innerWidth + 1,
      };
    }, w);
    if (!shown.visible || shown.text.length < 40) found.push(`show ${tag}: "Show the English" does not show the passage's English ("${shown.text.slice(0, 40)}")`);
    if (!/Murray/.test(shown.text) || !/Perseus/.test(shown.text)) found.push(`show ${tag}: the English has no credit for the translation ("${shown.text.slice(-70)}")`);
    if (shown.label !== "Hide the English" || shown.expanded !== "true") found.push(`show ${tag}: the button reads "${shown.label}" with aria-expanded=${shown.expanded}, not "Hide the English" and true`);
    if (!shown.under) found.push(`show ${tag}: the English is not under the Greek, in its column`);
    if (Math.abs(shown.lefts[1] - shown.lefts[0]) > 2 || Math.abs(shown.lefts[2] - shown.lefts[0]) > 2) found.push(`show ${tag}: the button (${shown.lefts[1]} px) and the English (${shown.lefts[2]} px) do not start where the Greek's words do (${shown.lefts[0]} px)`);
    if (shown.margin) found.push(`show ${tag}: the English runs into the margin kept for the look-up`);
    if (shown.sideways) found.push(`show ${tag}: the page scrolls sideways with the English open`);
    for (const key of ["1.1", "1.10"]) {
      const n = await row(key).evaluate((r) => ({ one: r.querySelectorAll("[data-one]").length, label: [...r.querySelectorAll("button")].find((x) => /the English$/.test(x.textContent.trim()))?.textContent.trim() }));
      if (n.one || n.label !== "Show the English") found.push(`show ${tag}: passage ${key} next to the opened one is not Greek alone (${n.one} English, button "${n.label}")`);
    }

    // a word tapped in the English does not open the Greek look-up
    const at = await row("1.5").locator("[data-one] p, [data-one] div").filter({ hasText: /\w{4}/ }).first().boundingBox();
    if (at) { await page.mouse.click(at.x + at.width / 3, at.y + Math.min(at.height / 2, 12)); await page.waitForTimeout(600); }
    if (await page.locator('aside[aria-label^="Look-up"]').count()) found.push(`show ${tag}: a word tapped in the English opened the Greek look-up`);

    await btn("1.5").click();
    await page.waitForTimeout(300);
    const hid = await row("1.5").evaluate((r) => ({ one: r.querySelectorAll("[data-one]").length, label: [...r.querySelectorAll("button")].find((x) => /the English$/.test(x.textContent.trim()))?.textContent.trim(), expanded: [...r.querySelectorAll("button")].find((x) => /the English$/.test(x.textContent.trim()))?.getAttribute("aria-expanded") }));
    if (hid.one || hid.label !== "Show the English" || hid.expanded !== "false") found.push(`hide ${tag}: "Hide the English" leaves the English open (${hid.one} shown, button "${hid.label}", aria-expanded=${hid.expanded})`);
  } catch (e) {
    found.push(`show ${tag}: "Show the English" could not be used (${String(e.message).split("\n")[0].slice(0, 90)})`);
  }
  await ctx.close();

  // a "Both" chosen after the upgrade is kept; the old default "Both" (saved at version 2) becomes Greek alone
  for (const [version, columns, wantTr, why] of [[3, "both", true, "a saved \"Both\" chosen after the upgrade is not kept"], [2, "both", false, "a \"Both\" saved before the quiet desk is not changed to Greek alone"]]) {
    const c = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block", hasTouch: touch });
    const p = await iliad(c, saved(version, columns));
    const n = await columnsShown(p);
    if (!!n.tr !== wantTr) found.push(`alone ${tag}: ${why} (${n.tr} English column(s))`);
    await c.close();
  }
}

// ---- first, numbers, phone: a book opens on its text (the quiet desk, ticket 08). The Iliad, on a fresh profile and then opened again
for (const [w, h, touch] of runs("first") ? [[1440, 900, false], [390, 844, true]] : []) {
  const tag = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block", hasTouch: touch });
  const page = await iliad(ctx);
  const opening = () => page.evaluate(() => {
    const shown = (e) => !!e && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0;
    const cover = document.querySelector("[data-cover]"), line = document.querySelector("[data-title-line]");
    const word = document.querySelector("article section[data-key] [data-u] [data-w]");
    return {
      cover: shown(cover), title: shown(line) ? line.innerText.replace(/\s+/g, " ").trim() : "", author: !!line?.querySelector('a[href*="author?a=tlg0012"]'),
      coverAuthor: !!cover?.querySelector('a[href*="author?a=tlg0012"]'), change: [...(cover?.querySelectorAll("button") ?? [])].some((b) => /^Change$/.test(b.textContent.trim())),
      top: word ? word.getBoundingClientRect().top : -1, titleLeft: shown(line) ? line.getBoundingClientRect().left : -1, wordLeft: word ? word.getBoundingClientRect().left : -1,
    };
  });
  try {
    // first: the first opening shows the title page, in place of the one-line title
    const one = await opening();
    if (!one.cover) found.push(`first ${tag}: the first opening of the Iliad on a fresh profile does not show its title page`);
    if (one.title) found.push(`first ${tag}: the first opening shows the one-line title as well as the title page ("${one.title}")`);
    // the author's name on the title page leads to the author's page, as the one-line title's does; "Change" is gone (Study's Edition and translation holds the choices)
    if (one.cover && !one.coverAuthor) found.push(`first ${tag}: the author's name on the title page is not a link to the author's page`);
    if (one.change) found.push(`first ${tag}: the title page still has a "Change" button, which Study's Edition and translation replaces`);
    await page.reload();
    await page.waitForSelector('article [data-key="1.5"] [data-u] [data-w]', { timeout: 45000 });
    await page.waitForTimeout(1500);
    const two = await opening();
    if (two.cover) found.push(`first ${tag}: the second opening of the Iliad shows its title page again`);
    // the author is on the phone's line too (the quiet desk, ticket 09, the owner, 2026-10-30: the author's page is reached from this line)
    const want = "Ἰλιάς · Homer, Iliad, Book 1";
    if (two.title !== want) found.push(`first ${tag}: the second opening's one-line title reads "${two.title}", not "${want}"`);
    if (!two.author) found.push(`first ${tag}: the one-line title has no link to the author's page`);
    if (two.top < 0 || two.top > 200) found.push(`first ${tag}: on a second opening the first line of Greek is ${Math.round(two.top)} px down, not within 200 px of the top of the screen`);
    if (Math.abs(two.titleLeft - two.wordLeft) > 2) found.push(`first ${tag}: the one-line title starts ${Math.round(two.titleLeft)} px from the left, where the Greek starts ${Math.round(two.wordLeft)} px`);

    // numbers: each passage's number in its book in the margin, the whole reference still on the button that carries it
    const nums = await page.evaluate(() => [...document.querySelectorAll("article section[data-key]")].map((r) => {
      const b = r.querySelector("button[data-row]"), has = (e, n) => [...e.classList].some((c) => c.endsWith(`__${n}`));
      return { key: r.dataset.key, text: b?.textContent.trim() ?? "", row: b?.getAttribute("data-row"), label: b?.getAttribute("aria-label"),
        lns: [...r.querySelectorAll("span")].filter((e) => has(e, "ln")).map((e) => e.textContent.trim()).filter(Boolean) };
    }));
    const first = nums.find((n) => n.key === "1.1");
    if (first?.text !== "1" || first?.row !== "1.1") found.push(`numbers ${tag}: the Iliad's first passage shows "${first?.text}" in the margin on a button for "${first?.row}", not "1" for "1.1"`);
    const long = nums.find((n) => n.text !== n.key.split(".").slice(1).join("."));
    if (long) found.push(`numbers ${tag}: passage ${long.key} shows "${long.text}" in the margin, not its number in its book ("${long.key.split(".").slice(1).join(".")}")`);
    const lost = nums.find((n) => n.row !== n.key || n.label !== n.key);
    if (lost) found.push(`numbers ${tag}: passage ${lost.key}'s number no longer carries the whole reference (data-row "${lost.row}", label "${lost.label}")`);
    const twice = nums.find((n) => n.lns.includes(n.text));
    if (twice) found.push(`numbers ${tag}: passage ${twice.key} shows its number ${twice.text} twice, in the margin and beside its first line`);

    // phone: a passage 200 lines in, which has the number of its fifth line (205) as well
    if (touch) {
      await page.goto(base + ILIAD + "&at=1.200");
      await page.waitForSelector('article [data-key="1.200"] [data-u] [data-w]', { timeout: 45000 });
      await page.waitForTimeout(1500);
      const lay = await page.evaluate(() => {
        const r = document.querySelector('article section[data-key="1.200"]');
        r.scrollIntoView({ block: "start" });
        const box = (e) => { const b = e.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, c: (b.top + b.bottom) / 2, h: b.height }; };
        const has = (e, n) => [...e.classList].some((c) => c.endsWith(`__${n}`));
        const spans = [...r.querySelectorAll("span")];
        const lt = spans.filter((e) => has(e, "lt")), ln = spans.filter((e) => has(e, "ln") && e.textContent.trim());
        return {
          num: box(r.querySelector("button[data-row]")), word: box(r.querySelector("[data-u] [data-w]")),
          lns: ln.map((e) => ({ ...box(e), text: e.textContent.trim(), word: box(e.nextElementSibling.querySelector("[data-w]")) })),
          lefts: lt.map((e) => e.querySelector("[data-w]")?.getBoundingClientRect().left).filter((x) => x != null),
        };
      });
      // level: the number's middle stands within 6 px of the middle of the first line's words (a small number on the line's baseline, as in print)
      if (Math.abs(lay.num.c - lay.word.c) > 6 || lay.num.t < lay.word.t - 6) found.push(`phone ${tag}: the passage number is not level with the first line of its passage (its middle ${Math.round(lay.num.c)} px down, the line's ${Math.round(lay.word.c)} px)`);
      if (lay.num.r > lay.word.l) found.push(`phone ${tag}: the passage number is not in a column of its own to the left of the Greek`);
      if (lay.num.h > 24) found.push(`phone ${tag}: the passage number wraps in its column (${Math.round(lay.num.h)} px tall)`);
      if (!lay.lns.length) found.push(`phone ${tag}: no line number (205) shown beside the Iliad's passage 1.200`);
      for (const n of lay.lns) {
        if (Math.abs(n.c - n.word.c) > 6) found.push(`phone ${tag}: the number of line ${n.text} is not level with its line (its middle ${Math.round(n.c)} px down, the line's ${Math.round(n.word.c)} px)`);
        if (n.r > n.word.l || Math.abs(n.r - lay.num.r) > 2) found.push(`phone ${tag}: the number of line ${n.text} is not in the passage number's column (it ends at ${Math.round(n.r)} px, the passage number at ${Math.round(lay.num.r)} px, the Greek starts at ${Math.round(n.word.l)} px)`);
      }
      if (lay.lefts.length < 5 || Math.max(...lay.lefts) - Math.min(...lay.lefts) > 1.5) found.push(`phone ${tag}: the Greek does not start at one edge down the page (${lay.lefts.length} lines, from ${Math.round(Math.min(...lay.lefts))} to ${Math.round(Math.max(...lay.lefts))} px)`);
    }
  } catch (e) {
    found.push(`first ${tag}: the Iliad's openings could not be read (${String(e.message).split("\n")[0].slice(0, 90)})`);
  }
  await ctx.close();
}

// ---- top, foot, slips, study, close: the foot bar, Aa and Study (the quiet desk, ticket 09). The Iliad on its second opening, reading Greek and English together
/** the Iliad opened once and then again, so that it opens on its text under the one-line title */
async function returning(ctx, settings) {
  const page = await iliad(ctx, settings);
  await page.reload();
  await page.waitForSelector('article [data-key="1.5"] [data-u] [data-w]', { timeout: 45000 });
  await page.waitForTimeout(1500);
  return page;
}
const STUDY_ROWS = ["Find in this text", "Colour by case", "Metre", "Transliteration", "Try it first", "Vocabulary for this page", "Your notes and marks",
  "Open a second book beside this one", "Float the reader", "Places on this page", "How it was written", "Listen to the English", "Signs beside the scroll bar"];
// a panel a row of Study opens: the row's name, and what the panel's own first control is
const STUDY_PANELS = ["Find in this text", "Vocabulary for this page", "Places on this page", "How it was written"];
/** open a menu of the bar by its button's name (unless open), and give back its panel */
async function openMenu(page, name) {
  const b = await barButton(page, name);
  if ((await b.getAttribute("aria-expanded")) !== "true") await b.click();
  await page.waitForTimeout(450);
  return page.locator(`[id="${await b.getAttribute("aria-controls")}"]`);
}
const BAR = { aa: /^Aa\b/, study: /^Study\b/, goto: "Go to a line or book" };
/** whether the foot bar is out of sight (slipped away: hidden, or stood below the window) */
const awayNow = (page) => page.evaluate(() => { const f = document.querySelector("[data-foot-bar]"); if (!f) return true; const r = f.getBoundingClientRect(); return getComputedStyle(f).visibility === "hidden" || r.top >= innerHeight - 1; });

for (const [w, h, touch] of runs("foot") ? [[1440, 900, false], [390, 844, true]] : []) {
  const tag = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block", hasTouch: touch });
  const page = await returning(ctx, saved(4, "both"));
  const bar = page.locator("[data-foot-bar]");
  page.setDefaultTimeout(10000);
  // each part is read on its own: one that cannot be read (a menu that is not there) is listed as a problem, and the others are still read
  const section = async (name, fn) => {
    try { await fn(); } catch (e) { found.push(`${name} ${tag}: could not be read (${String(e.message).split("\n")[0].slice(0, 120)})`); }
  };
  await section("foot", async () => {
    // ---- foot: "← Library", where you are, Aa, Study, from the left; the sizes; the place moving with the reading; Go to without arrows
    if (!(await bar.count())) found.push(`foot ${tag}: no bar along the foot of the reader`);
    else {
      const parts = [["← Library", bar.getByRole("link", { name: /library/i })], ["where you are", bar.getByRole("button", { name: BAR.goto })],
        ["Aa", bar.getByRole("button", { name: BAR.aa })], ["Study", bar.getByRole("button", { name: BAR.study })]];
      const boxes = [];
      for (const [n, loc] of parts) {
        const b = (await loc.count()) ? await loc.first().boundingBox() : null;
        if (!b) found.push(`foot ${tag}: the foot bar has no "${n}"`); else boxes.push([n, b]);
      }
      for (let i = 1; i < boxes.length; i++) if (boxes[i][1].x <= boxes[i - 1][1].x) found.push(`foot ${tag}: "${boxes[i][0]}" is not to the right of "${boxes[i - 1][0]}" in the foot bar`);
      for (const [n, b] of boxes) {
        if (touch && (b.width < 43.5 || b.height < 43.5)) found.push(`foot ${tag}: "${n}" is ${Math.round(b.width)} × ${Math.round(b.height)} px, under 44 × 44 for a finger`);
        if (!touch && b.height < 35.5) found.push(`foot ${tag}: "${n}" is ${Math.round(b.height)} px tall, under 36`);
      }
      const fb = await bar.boundingBox();
      if (!fb || Math.abs(fb.y + fb.height - h) > 1.5 || fb.width < w - 2) found.push(`foot ${tag}: the bar does not stand along the foot of the window across its whole width`);
      if (fb && (fb.height < 50 || fb.height > 72)) found.push(`foot ${tag}: the bar is ${Math.round(fb.height)} px tall, not about 56`);
      const link = parts[0][1];
      if ((await link.count()) && !/\/library\/?$/.test((await link.first().getAttribute("href")) ?? "")) found.push(`foot ${tag}: "Library" does not lead to the library`);
      // where you are: "Book 1", a rule with a mark, "line 25 of 611" on a computer; only "line 25 of 611" on a phone
      // (by its name in the page, not its role: a bar that has slipped away is hidden from the roles, and still says where you are)
      const where = bar.locator('button[aria-label="Go to a line or book"]');
      const said = async (words = false) => ((await where.count()) ? ((await (words ? where.first().innerText() : where.first().textContent())) ?? "").replace(/\s+/g, " ").trim() : "");
      const first = await said(true);
      const n1 = +(first.match(/line (\d+) of 611/)?.[1] ?? -1);
      if (n1 < 0) found.push(`foot ${tag}: where you are reads "${first}", not "line N of 611"`);
      if (touch && /Book/.test(first)) found.push(`foot ${tag}: a phone's bar also names the book ("${first}"), not only the line`);
      if (!touch && !/Book 1/.test(first)) found.push(`foot ${tag}: a computer's bar does not name the book where you are ("${first}")`);
      const mark = bar.locator('[class$="__mark"]');
      const markAt = async () => ((await mark.count()) ? (await mark.first().boundingBox())?.x ?? -1 : -1);
      if (!touch && !(await mark.count())) found.push(`foot ${tag}: a computer's bar has no progress rule with a mark`);
      const m1 = await markAt();
      await page.evaluate(() => scrollTo({ top: innerHeight * 3, behavior: "instant" }));
      await page.waitForTimeout(900);
      const n2 = +((await said()).match(/line (\d+) of 611/)?.[1] ?? -1);
      if (n2 <= n1) found.push(`foot ${tag}: the place stays at line ${n1} after reading on (now line ${n2})`);
      if (!touch && (await markAt()) <= m1) found.push(`foot ${tag}: the progress mark does not move on as the page is read`);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(500);
      // clear: the end of the text ("Continue to Book 2"), Back to top, Listen's player, and (on a computer) the side panels stand clear of the bar
      await toEnd(page);
      const fbEnd = await bar.boundingBox();
      const above = async (name, loc) => {
        const b = (await loc.count()) ? await loc.first().boundingBox() : null;
        if (!b) { found.push(`foot ${tag}: ${name} was not found near the end of the page`); return; }
        if (fbEnd && b.y + b.height > fbEnd.y + 1) found.push(`foot ${tag}: ${name} stands ${Math.round(b.y + b.height - fbEnd.y)} px under the bar`);
      };
      await above('"Continue to Book 2"', page.getByRole("button", { name: /^Continue to Book 2/ }));
      await above("Back to top", page.getByRole("button", { name: "Back to top" }));
      await (await openMenu(page, BAR.study)).getByRole("button", { name: "Listen to the English", exact: true }).click();
      await page.waitForTimeout(900);
      await above("Listen's player", page.getByRole("region", { name: "Listen to the translation" }));
      await page.getByRole("region", { name: "Listen to the translation" }).getByRole("button", { name: "Stop and close" }).click().catch(() => null);
      if (!touch) {
        // (Ctrl+F: the "/" key also opens the site's own search, which takes the keyboard away from Find, on the old bar as well)
        await page.keyboard.press("Control+f");
        await page.waitForTimeout(900);
        const side = page.locator('aside[aria-label="Find in this text"]');
        const sb = (await side.count()) ? await side.boundingBox() : null;
        if (!sb) found.push(`foot ${tag}: Find did not open beside the text`);
        else {
          if (fbEnd && sb.y + sb.height > fbEnd.y + 1) found.push(`foot ${tag}: a side panel stands ${Math.round(sb.y + sb.height - fbEnd.y)} px under the bar (it runs down to the bar's top)`);
          if (sb.y > 8) found.push(`foot ${tag}: a side panel starts ${Math.round(sb.y)} px down, not at the top of the window`);
        }
        await page.keyboard.press("Escape");
      }
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(500);
      // Go to: the page and a reference to type, no arrows, and the only button of its kind
      const goto = await openMenu(page, BAR.goto);
      if (!(await goto.getByRole("combobox", { name: "Page" }).count())) found.push(`foot ${tag}: Go to has no page to choose`);
      if (!(await goto.locator("#reader-goto").count())) found.push(`foot ${tag}: Go to has no field for a reference`);
      if (await goto.getByRole("button", { name: /^(Previous|Next) page$/ }).count()) found.push(`foot ${tag}: Go to has ← → page arrows (the foot of each page has the way on and back)`);
      await page.keyboard.press("Escape");
    }
    if (await page.getByRole("button", { name: /^(Tools|Marks|More)\b/ }).count()) found.push(`foot ${tag}: the old bar's Tools, Marks or More button is still on the page`);
    if (await page.getByRole("button", { name: BAR.goto }).count() !== 1) found.push(`foot ${tag}: Go to is not one button (${await page.getByRole("button", { name: BAR.goto }).count()})`);
  });

  await section("top", async () => {
    // ---- top: nothing fixed or sticky along the top of one book after 800 px of reading; the paper's darkened edges are gone on the reader
    await page.evaluate(() => scrollTo({ top: 800, behavior: "instant" }));
    await page.waitForTimeout(800);
    const pinned = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => {
      const st = getComputedStyle(e);
      if ((st.position !== "fixed" && st.position !== "sticky") || st.display === "none" || st.visibility === "hidden") return false;
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.top <= 8 && r.top >= -8 && r.bottom > 8;
    }).map((e) => `${e.tagName.toLowerCase()}${typeof e.className === "string" && e.className ? "." + e.className.split(" ")[0].replace(/^.*__([^_]+)__/, "") : ""}`));
    for (const p of pinned) found.push(`top ${tag}: ${p} is fixed or sticky along the top of one book after reading 800 px`);
    const shade = await page.evaluate(() => getComputedStyle(document.body, "::after").display);
    if (shade !== "none") found.push(`top ${tag}: the paper's darkened edges are still drawn on the reader's page`);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(500);
  });

  await section("slips", async () => {
    // ---- slips: on a phone the bar goes as the page is read on and returns as it is read back; the look-up sheet stands where it was; no movement under reduced motion
    if (touch) {
      await page.waitForTimeout(3500);   // (a jump the reader asked for holds the bar for a few seconds)
      if (await awayNow(page)) found.push(`slips ${tag}: the bar is out of sight at the top of the page`);
      const dur = () => bar.evaluate((e) => getComputedStyle(e).transitionDuration);
      if (/^0s(, 0s)*$/.test(await dur())) found.push(`slips ${tag}: the bar's slipping has no motion even without reduced motion`);
      await page.evaluate(() => scrollBy({ top: 600, behavior: "instant" }));
      await page.waitForTimeout(1300);
      if (!(await awayNow(page))) found.push(`slips ${tag}: the bar does not slip away after the page is read on 600 px`);
      await page.evaluate(() => scrollBy({ top: -200, behavior: "instant" }));
      await page.waitForTimeout(1300);
      if (await awayNow(page)) found.push(`slips ${tag}: the bar is not back after the page is read back 200 px`);
      // a tap on the paper, away from any word, brings it back too
      await page.evaluate(() => scrollBy({ top: 600, behavior: "instant" }));
      await page.waitForTimeout(1300);
      if (!(await awayNow(page))) found.push(`slips ${tag}: the bar does not slip away when the page is read on again`);
      else {
        await page.touchscreen.tap(6, Math.round(h / 2));
        await page.waitForTimeout(900);
        if (await awayNow(page)) found.push(`slips ${tag}: a tap on the paper does not bring the bar back`);
      }
      // the look-up sheet stands where the bar was
      const wordAt = await page.evaluate(() => {
        const e = [...document.querySelectorAll("article [data-u] [data-w]")].find((x) => { const r = x.getBoundingClientRect(); return r.top > 120 && r.bottom < innerHeight - 260 && r.width > 8; });
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      if (!wordAt) found.push(`slips ${tag}: no word in view to look up`);
      else {
        await page.mouse.click(wordAt.x, wordAt.y);
        await page.locator('aside[aria-label^="Look-up"]').waitFor({ timeout: 15000 });
        await page.waitForTimeout(900);
        if (!(await awayNow(page))) found.push(`slips ${tag}: the bar still stands under the look-up sheet`);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(900);
        if (await awayNow(page)) found.push(`slips ${tag}: the bar does not come back when the look-up sheet is closed`);
      }
      // a panel's sheet (Find in this text, opened from Study) stands where the bar was too, and the bar is back when it is put away
      const fromStudy = await openMenu(page, BAR.study);
      await fromStudy.getByRole("button", { name: "Find in this text", exact: true }).click();
      const sheet = page.locator("aside").filter({ has: page.getByRole("button", { name: "Back to Study" }) });
      await sheet.waitFor({ timeout: 15000 });
      await page.waitForTimeout(900);
      if (!(await awayNow(page))) found.push(`slips ${tag}: the bar still stands under a panel's sheet (Find in this text)`);
      await sheet.focus();
      await page.keyboard.press("Escape");   // back to Study
      await page.waitForTimeout(500);
      await page.keyboard.press("Escape");   // and to the text
      await page.waitForTimeout(900);
      if (await awayNow(page)) found.push(`slips ${tag}: the bar does not come back when the panel's sheet is put away`);
      // the passage toolbar, docked at the foot, stands where the bar was as well
      const numberAt = await page.evaluate(() => {
        const e = [...document.querySelectorAll("article button[data-row]")].find((x) => { const r = x.getBoundingClientRect(); return r.top > 100 && r.bottom < innerHeight - 200 && r.width > 8; });
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      if (!numberAt) found.push(`slips ${tag}: no passage number in view to tap`);
      else {
        await page.touchscreen.tap(numberAt.x, numberAt.y);
        await page.getByRole("toolbar", { name: "Passage actions" }).waitFor({ timeout: 15000 });
        await page.waitForTimeout(900);
        if (!(await awayNow(page))) found.push(`slips ${tag}: the bar still stands under the passage toolbar`);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(900);
        if (await awayNow(page)) found.push(`slips ${tag}: the bar does not come back when the passage toolbar is put away`);
      }
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(200);
      if (!/^0s(, 0s)*$/.test(await dur())) found.push(`slips ${tag}: the bar's slipping still moves under reduced motion (${await dur()})`);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(800);
    }
  });

  await section("study", async () => {
    // ---- study: every tool in Study, or in Aa; each once
    const study = await openMenu(page, BAR.study);
    // (only what is drawn counts: a row hidden by a rule of the style sheet is a tool the reader cannot reach)
    const rowNames = await study.evaluate((p) => [...p.querySelectorAll("button, a")].filter((b) => b.getBoundingClientRect().width > 0 && getComputedStyle(b).visibility !== "hidden").map((b) => {
      const l = (b.getAttribute("aria-labelledby") ?? "").split(" ").slice(0, 1).map((i) => document.getElementById(i)?.textContent ?? "").join("").trim();
      return l || (b.getAttribute("aria-label") ?? b.textContent.trim().replace(/\s+/g, " "));
    }));
    for (const n of STUDY_ROWS) if (!rowNames.includes(n)) found.push(`study ${tag}: "${n}" is not in Study`);
    if (w > 900 && !rowNames.includes("Keys")) found.push(`study ${tag}: "Keys" is not in Study`);
    for (const n of ["Greek text", "Translation"]) if (!(await study.getByRole("combobox", { name: n }).count())) found.push(`study ${tag}: the "${n}" choice is not in Study`);
    for (const n of ["Edition and translation", "Reading help", "Go deeper"]) if (!(await study.getByRole("heading", { name: n }).count())) found.push(`study ${tag}: Study has no group "${n}"`);
    // in order: Reading help, then Go deeper, then Edition and translation
    const heads = await study.getByRole("heading", { level: 3 }).allInnerTexts();
    const order = ["Reading help", "Go deeper", "Edition and translation"].map((n) => heads.findIndex((t) => t.toLowerCase() === n.toLowerCase()));
    if (order.some((i, k) => i < 0 || (k && i < order[k - 1]))) found.push(`study ${tag}: the groups of Study are not in order (${heads.join(", ")})`);
    // nothing twice, and nothing that Study should not have
    const dupes = rowNames.filter((n, i) => rowNames.indexOf(n) !== i);
    for (const d of new Set(dupes)) found.push(`study ${tag}: "${d}" is in Study twice`);
    for (const n of rowNames) if (/^(Go to|About |Echoes|Change$|Tools|More$)/.test(n)) found.push(`study ${tag}: Study has "${n}", which another button of the reader already leads to`);
    // "Fit lines" is gone: a page of verse is fitted by itself (the quiet desk, ticket 10), so there is nothing to switch on
    if (rowNames.includes("Fit lines")) found.push(`study ${tag}: Study still has "Fit lines", which the fitting of verse replaced`);
    await page.keyboard.press("Escape");
  });

  await section("study", async () => {
    // ---- study: Aa holds the page, the size, the spacing and the columns, and nothing else
    const aa = await openMenu(page, BAR.aa);
    for (const g of ["Page", "Columns"]) if (!(await aa.getByRole("radiogroup", { name: g }).count())) found.push(`study ${tag}: Aa has no "${g}" choice`);
    for (const n of ["Follow device", "Paper", "Night"]) if (!(await aa.getByRole("radio", { name: n }).count())) found.push(`study ${tag}: Aa's page has no "${n}"`);
    for (const n of ["Greek", "Both", "English"]) if (!(await aa.getByRole("radio", { name: n, exact: true }).count())) found.push(`study ${tag}: Aa's columns have no "${n}"`);
    for (const n of ["Decrease Greek text size", "Increase Greek text size", "Decrease line spacing", "Increase line spacing"]) if (!(await aa.getByRole("button", { name: n }).count())) found.push(`study ${tag}: Aa has no "${n}"`);
    if (await aa.getByText(/typeface/i).count()) found.push(`study ${tag}: Aa still offers a choice of Greek typeface`);
    if (await aa.locator("[lang=grc]").count()) found.push(`study ${tag}: Aa shows a sample of the Greek (the sample is on the Settings page only)`);
    await page.keyboard.press("Escape");

    // ---- study: the author's page from the title line
    if (!(await page.locator('[data-title-line] a[href*="author?a=tlg0012"]:visible').count())) found.push(`study ${tag}: the author's page is not reached from the one-line title`);
  });

  await section("close", async () => {
    // ---- close: every menu has a visible close, and Escape; Tab goes from its button into it
    for (const [name, key] of [[BAR.aa, "Aa"], [BAR.study, "Study"], [BAR.goto, "Go to"]]) {
      const btn = page.getByRole("button", { name }).first();
      const menu = await openMenu(page, name);
      const close = menu.getByRole("button", { name: "Close", exact: true });
      const cb = (await close.count()) ? await close.first().boundingBox() : null;
      if (!cb || cb.width < 24 || cb.height < 24 || cb.y < 0 || cb.y + cb.height > h) found.push(`close ${tag}: ${key} has no visible close button`);
      else {
        await close.first().click();
        await page.waitForTimeout(300);
        if ((await btn.getAttribute("aria-expanded")) !== "false") found.push(`close ${tag}: ${key}'s close button leaves it open`);
        if (!(await btn.evaluate((e) => document.activeElement === e))) found.push(`close ${tag}: after ${key}'s close button the keyboard is not back on its button`);
      }
      await btn.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);
      await page.keyboard.press("Tab");
      if (!(await menu.evaluate((m) => m.contains(document.activeElement)))) found.push(`close ${tag}: Tab does not go from ${key}'s button into its menu`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      if ((await btn.getAttribute("aria-expanded")) !== "false") found.push(`close ${tag}: Escape does not close ${key}`);
      if (!(await btn.evaluate((e) => document.activeElement === e))) found.push(`close ${tag}: after Escape the keyboard is not back on ${key}'s button`);
    }
  });

  await section("close", async () => {
    // ---- close: a panel opened from a row of Study has "Back to Study" and a close; its way back (and Escape) bring Study back; × closes to the text
    for (const row of STUDY_PANELS) {
      const sbtn = page.getByRole("button", { name: BAR.study }).first();
      const panel = page.locator("aside").filter({ has: page.getByRole("button", { name: "Back to Study" }) });
      for (const how of ["back", "Escape", "close"]) {
        await openMenu(page, BAR.study);
        await page.locator(`[id="${await sbtn.getAttribute("aria-controls")}"]`).getByRole("button", { name: row, exact: true }).click();
        await page.waitForTimeout(900);
        if ((await panel.count()) !== 1) { found.push(`close ${tag}: the panel "${row}" opens from Study without "Back to Study"`); await page.keyboard.press("Escape"); continue; }
        const x = await panel.getByRole("button", { name: /^Close/ }).first().boundingBox().catch(() => null);
        if (!x || x.width < 24 || x.x + x.width > w + 1 || x.y < 0) found.push(`close ${tag}: the panel "${row}" has no visible close button`);
        if (how === "back") await panel.getByRole("button", { name: "Back to Study" }).click();
        else if (how === "Escape") { await panel.focus(); await page.keyboard.press("Escape"); }
        else await panel.getByRole("button", { name: /^Close/ }).first().click();
        await page.waitForTimeout(700);
        const open = (await sbtn.getAttribute("aria-expanded")) === "true";
        const gone = (await page.locator("aside").filter({ has: page.getByRole("button", { name: "Back to Study" }) }).count()) === 0;
        if (!gone) found.push(`close ${tag}: "${how === "back" ? "Back to Study" : how}" does not close the panel "${row}"`);
        if (how !== "close" && !open) found.push(`close ${tag}: "${how === "back" ? "Back to Study" : how}" in the panel "${row}" does not bring Study back`);
        if (how === "close" && open) found.push(`close ${tag}: the close button of the panel "${row}" brings Study back (it closes to the text)`);
        if (open) await page.keyboard.press("Escape");
        await page.waitForTimeout(300);
      }
    }
    // the list of books for a second one is a window, and has the same way back (and Escape does what it does)
    for (const how of ["back", "Escape"]) {
      const sbtn = page.getByRole("button", { name: BAR.study }).first();
      const dlg = page.getByRole("dialog", { name: "Open a second book" });
      await openMenu(page, BAR.study);
      await page.locator(`[id="${await sbtn.getAttribute("aria-controls")}"]`).getByRole("button", { name: "Open a second book beside this one", exact: true }).click();
      await page.waitForTimeout(900);
      if (!(await dlg.getByRole("button", { name: "Back to Study" }).count())) { found.push(`close ${tag}: the list of books for a second one opens from Study without "Back to Study"`); await page.keyboard.press("Escape"); continue; }
      if (how === "back") await dlg.getByRole("button", { name: "Back to Study" }).click(); else await page.keyboard.press("Escape");
      await page.waitForTimeout(700);
      if ((await sbtn.getAttribute("aria-expanded")) !== "true" || (await dlg.count())) found.push(`close ${tag}: ${how === "back" ? '"Back to Study"' : "Escape"} in the list of books for a second one does not bring Study back`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }
    // a panel opened another way (Find, by the key) has a close but no way back to Study
    await page.locator("body").click({ position: { x: 4, y: 300 } }).catch(() => null);
    await page.keyboard.press("Control+f");
    await page.waitForTimeout(900);
    const found2 = page.locator('aside[aria-label*="Find" i]');
    if (await found2.count()) {
      if (await found2.getByRole("button", { name: /^Back to/ }).count()) found.push(`close ${tag}: Find, opened by the key, has a way back to Study`);
      if (!(await found2.getByRole("button", { name: /^Close/ }).count())) found.push(`close ${tag}: Find, opened by the key, has no close button`);
      await page.keyboard.press("Escape");
    }
  });
  await ctx.close();
}

// ---- study: Compare with another edition (a work with two editions), and the shade kept elsewhere on the site
if (runs("compare")) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: "block" });
  const page = await ctx.newPage();
  try {
    await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
      const path = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
      try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${path}` }) }); } catch { await route.abort(); }
    });
    await page.goto(base + "/read?w=tlg0085.tlg005&tr=perseus-eng3&at=80");
    await page.waitForSelector('[data-u="80"]', { timeout: 45000 });
    await page.waitForTimeout(1500);
    const study = await openMenu(page, BAR.study);
    const cmpRow = study.getByRole("button", { name: "Compare with another edition", exact: true });
    if (!(await cmpRow.count())) found.push("study Agamemnon: Compare with another edition is not in Study");
    else {
      await cmpRow.click();
      const pick = study.getByRole("combobox", { name: "Compare with" });
      if (!(await pick.count()) || (await pick.locator("option").count()) < 2) found.push("study Agamemnon: Compare with another edition shows no other edition to choose");
    }
    await page.goto(base + "/library");
    await page.waitForTimeout(800);
    if ((await page.evaluate(() => getComputedStyle(document.body, "::after").display)) === "none") found.push("top: the paper's darkened edges are gone from the library too (only the reader's page loses them)");
  } catch (e) {
    found.push(`study Agamemnon: could not be read (${String(e.message).split("\n")[0].slice(0, 120)})`);
  }
  await ctx.close();
}

// ---- photos: none in the reader
for (const path of runs("photos") ? ["/read?w=tlg0012.tlg001", "/read"] : []) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
  const page = await ctx.newPage();
  await page.goto(base + path);
  await page.waitForSelector(path === "/read" ? "[data-nobook]" : "article [data-w]", { timeout: 45000 });
  await page.waitForTimeout(1500);
  const pics = await page.evaluate(() => [...document.querySelectorAll("main img, main picture, [data-nobook] img, header[class*='tp'] img")]
    .filter((i) => i.getBoundingClientRect().width > 40).map((i) => i.getAttribute("src") ?? i.querySelector("img")?.getAttribute("src") ?? "?"));
  for (const p of new Set(pics)) found.push(`photos ${path}: a photograph in the reader (${p.split("/").pop()})`);
  await ctx.close();
}

// ---- verse: the Greek's size for a page set in verse (the quiet desk, ticket 10, the owner, 2026-10-30)
// Iliad 1 has 611 lines; at 20 px the widest are 456, 454 and 452 px, the median 381 px. The spec's rule decides: "It never goes below 16 px. A line that still
// does not fit wraps with a hanging indent." So a phone is asked for 16 px, for lines that wrap only when they must and then hang, and for few of them (5% at
// most; 342 px of room at 390 px wide leaves about 4%); a computer for its proper size (26 px, or at 1100 px as much as the widest line leaves) and no wrapped line.
const VERSE_PAGE = "/read?w=tlg0012.tlg001&tr=perseus-eng3", PROSE_PAGE = "/read?w=tlg0059.tlg030&tr=perseus-eng1";
const greekPx = (page) => page.evaluate(() => { const w = document.querySelector("article [data-u] [data-w]"); return w ? Math.round(parseFloat(getComputedStyle(w).fontSize) * 100) / 100 : -1; });
/** a book opened once before, so that it opens on its text and not on its title page; it is read once the Greek's size has stopped changing (the fitting is done
 *  as the page is drawn and again when the typeface arrives) */
async function openedBook(ctx, path) {
  const page = await ctx.newPage();
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const file = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${file}` }) }); } catch { await route.abort(); }
  });
  await page.addInitScript(() => { localStorage.setItem("mathesis:opened", JSON.stringify(["tlg0012.tlg001", "tlg0059.tlg030"])); });
  await page.goto(base + path);
  await page.waitForSelector("article [data-u] [data-w]", { timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);
  for (let i = 0, last = -1; i < 40; i++) {
    await page.waitForTimeout(250);
    const now = await greekPx(page);
    if (i > 3 && now === last) break;
    last = now;
  }
  return page;
}
/** the Greek's size on the screen and each line of verse as the page sets it: where its words start, whether a second row begins, and how wide the line is on one row.
 *  (Measured in the page: a line's width is what its words take with wrapping off, not what a canvas would make of the text.) */
const verseNow = (page) => page.evaluate(() => {
  const has = (e, n) => [...e.classList].some((c) => c.endsWith(`__${n}`));
  const lines = [...document.querySelectorAll("article [data-u] span")].filter((e) => has(e, "lt"));
  const word = document.querySelector("article [data-u] [data-w]");
  const out = { size: word ? parseFloat(getComputedStyle(word).fontSize) : 0, lines: lines.length, room: 0, lefts: [], wraps: [] };
  const rooms = [], wrapped = [];
  for (const lt of lines) {
    const words = [...lt.querySelectorAll("[data-w]")];
    if (!words.length) continue;
    const px = parseFloat(getComputedStyle(lt).fontSize), rects = words.map((x) => x.getBoundingClientRect());
    out.lefts.push(rects[0].left);
    rooms.push(lt.getBoundingClientRect().width);
    const next = rects.findIndex((r) => r.top - rects[0].top > 0.8 * px);   // the first word on a second row, a good part of a size lower than the line's first
    if (next >= 0) wrapped.push({ lt, px, hang: rects[next].left - rects[0].left, room: lt.getBoundingClientRect().width, ref: lt.closest("[data-u]")?.dataset.u ?? "?" });
  }
  // the width on one row of the lines that wrapped: wrapping off for all of them at once, read, and put back
  for (const x of wrapped) x.lt.style.whiteSpace = "nowrap";
  for (const x of wrapped) { const r = document.createRange(); r.selectNodeContents(x.lt); x.natural = r.getBoundingClientRect().width; }
  for (const x of wrapped) x.lt.style.whiteSpace = "";
  out.wraps = wrapped.map(({ px, hang, room, natural, ref }) => ({ px, hang, room, natural, ref }));
  rooms.sort((a, b) => a - b);
  out.room = rooms[rooms.length >> 1] ?? 0;
  return out;
});
// (the last place of each row is the slack the Greek's size may have: a few hundredths for a size the stylesheet works out from the width, 18.007 px at 390 px; none for 22 px)
for (const [w, h, touch, path, want, name, slack = 0.06] of runs("verse") ? [
  [390, 844, true, VERSE_PAGE, [16, 18], "Iliad 1"], [412, 915, true, VERSE_PAGE, [16, 18], "Iliad 1"],
  [1440, 900, false, VERSE_PAGE, [26, 26], "Iliad 1"], [1100, 800, false, VERSE_PAGE, [22, 26], "Iliad 1", 0],
  // (the page's rem grows with the window above 1600 px, to 18 px from 1920: the cap of 26 px is in px, not in rem, or the Greek would be 29.25 px there)
  [1920, 1080, false, VERSE_PAGE, [26, 26], "Iliad 1"], [2560, 1440, false, VERSE_PAGE, [26, 26], "Iliad 1"],
  [390, 844, true, PROSE_PAGE, [18, 18], "Plato's Republic 1"],
] : []) {
  const tag = `${w}px`, verse = path === VERSE_PAGE;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block", hasTouch: touch });
  try {
    const page = await openedBook(ctx, path);
    page.setDefaultTimeout(10000);
    const m = await verseNow(page);
    const [lo, hi] = want;
    if (m.size < lo - slack || m.size > hi + slack) found.push(`verse ${tag}: ${name} has its Greek at ${m.size.toFixed(2)} px, not ${lo === hi ? lo : `${lo} to ${hi}`} px`);
    if (verse) {
      const pct = (100 * m.wraps.length) / (m.lines || 1);
      console.log(`verse ${tag}: ${name}, ${m.lines} lines, the Greek at ${m.size.toFixed(2)} px, room ${m.room.toFixed(1)} px, ${m.wraps.length} line(s) wrap (${pct.toFixed(1)}%)`);
      if (m.lines !== 611) found.push(`verse ${tag}: ${m.lines} lines of the Iliad's first book were read, not 611`);
      // a line wraps only if its words are wider than its room, and then its second row hangs 1 em in at least (the stylesheet hangs it 1.5 em)
      const fits = m.wraps.filter((x) => x.natural <= x.room - 1), flat = m.wraps.filter((x) => x.hang < x.px);
      if (fits.length) found.push(`verse ${tag}: ${fits.length} line(s) wrap though they fit their room (line ${fits[0].ref}: ${fits[0].natural.toFixed(1)} px in ${fits[0].room.toFixed(1)} px)`);
      if (flat.length) found.push(`verse ${tag}: ${flat.length} wrapped line(s) whose second row starts less than 1 em in from the first (line ${flat[0].ref}: ${flat[0].hang.toFixed(1)} px at ${flat[0].px.toFixed(1)} px)`);
      if (Math.max(...m.lefts) - Math.min(...m.lefts) > 1.5) found.push(`verse ${tag}: the first rows of the lines do not start at one left edge (from ${Math.min(...m.lefts).toFixed(1)} to ${Math.max(...m.lefts).toFixed(1)} px)`);
      if (touch ? m.wraps.length > 0.05 * m.lines : m.wraps.length) found.push(`verse ${tag}: ${m.wraps.length} of ${m.lines} lines wrap${touch ? ` (${pct.toFixed(1)}%, more than 5%)` : "; on a computer none should"}`);
    }
    // Aa names the size on the screen, and its first step is one step on from there that saves a number (the size stays "auto" until then)
    const aa = await openMenu(page, BAR.aa);
    const more = aa.getByRole("button", { name: "Increase Greek text size" });
    const said = ((await more.locator("xpath=..").locator("output").innerText()) ?? "").trim();
    const was = await greekPx(page);
    if (said !== `${Math.round(was)} px`) found.push(`verse ${tag}: ${name}: Aa names the Greek's size "${said}", but it is ${was.toFixed(2)} px on the screen`);
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings") ?? "{}").state?.greekSize);
    if (before !== undefined && before !== "auto") found.push(`verse ${tag}: ${name}: the size was ${JSON.stringify(before)} before any step, not "auto"`);
    await more.click();
    await page.waitForTimeout(700);
    const now = await greekPx(page), saved = await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings") ?? "{}").state?.greekSize);
    if (typeof saved !== "number") found.push(`verse ${tag}: ${name}: the first step of Aa's Greek size saved ${JSON.stringify(saved)}, not a number`);
    if (Math.abs(now - (Math.round(was) + 1)) > 0.3) found.push(`verse ${tag}: ${name}: the first step of Aa's Greek size took the Greek from ${was.toFixed(2)} to ${now.toFixed(2)} px, not one step (1 px) on`);
  } catch (e) {
    found.push(`verse ${tag}: ${name} could not be read (${String(e.message).split("\n")[0].slice(0, 120)})`);
  }
  await ctx.close();
}

await browser.close();
// (a fault found by each of the ways a menu or a panel is left is told once)
const problems = [...new Set(found)];
for (const f of problems) console.log(`✗ ${f}`);
console.log(problems.length ? `\n${problems.length} problem(s)` : "the reader is in order");
process.exit(problems.length ? 1 : 0);

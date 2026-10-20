// The reader check (review fix list, slice 8), on Aeschylus' Agamemnon with Smyth's English, at a computer's width and a phone's.
// It lists:
//   cover   - a reader coming back to the book (a saved position) who lands on its title page, not on the text
//   zero    - "Lines 0–103" in the bar, or a passage numbered 0 in the margin (Perseus's line 0 is only the first speaker's name)
//   indent  - English set with a hanging indent (its first line pulled out to the left)
//   breaks  - a stretch of English that stops in the middle of a sentence ("…news from Troy and") with the rest beside the
//             next lines; English is cut only where a sentence or clause ends
//   grip    - the drag grip beside a passage number with nothing that says what it is for when it is pointed at
//   legend  - Colour by case with no key on screen as you read; two cases told apart by colour alone, or by colours that
//             look alike to a reader with red-green or blue-yellow colour blindness; a word's case not shown in its look-up
//   tools   - the Tools menu: the modes (Transliteration, Colour by case…) not drawn as switches, the actions (Vocabulary,
//             Places…) drawn as switches; nothing on the Tools button to say a mode is on
//   word    - the look-up: the same meaning twice, a dead-end "No Wiktionary entry", the reader's English hidden behind it
//   bar     - on a phone, the bar in more than one row, or the work's title cut short
// The word packs and the dictionary are served from their own site (config/packs.ts); this check fetches them from the
// packs repository, and answers Wiktionary with "no entry" so that case is seen.
// usage: node web/scripts/check-reader.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const PACKS = "https://raw.githubusercontent.com/mathesisstoicheion/packs/main";
const WORK = "tlg0085.tlg005", URL_ = `/read?w=${WORK}&tr=perseus-eng3`;
const MODES = ["Transliteration", "Colour by case", "Words I know", "Metre", "Try it first", "Fit lines"];
const ACTIONS = ["Vocabulary", "Places", "Find in this text", "Listen", "Manuscript"];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];

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

async function reader(ctx, w, h, seed) {
  const page = await ctx.newPage();
  await page.route("**/data/{words,lsj,lexicon,syntax}/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(/^\/data\//, "");
    try { await route.fulfill({ response: await route.fetch({ url: `${PACKS}/${path}` }) }); } catch { await route.abort(); }
  });
  await page.route(/wiktionary\.org/, (route) => route.fulfill({ status: 404, contentType: "application/json", body: "{}" }));
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

for (const [w, h] of [[1280, 900], [1100, 860], [375, 812]]) {
  const tag = `${w}px`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, serviceWorkers: "block", hasTouch: w < 700 });
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
      const bar = document.querySelector('a[aria-label="Back to the library"]')?.parentElement;
      const label = [...(bar?.querySelectorAll(".label") ?? [])].map((e) => e.textContent).join(" ");
      const zeros = [...document.querySelectorAll("article button[data-row], article [data-u] span, article [data-tr] span")]
        .filter((e) => !e.children.length && e.textContent.trim() === "0" && e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== "hidden");
      return { label, zeros: zeros.length };
    });
    if (/(^|\s)0\s*[–-]/.test(zero.label)) found.push(`zero ${tag}: the bar says "${zero.label.trim()}"`);
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

  // ---- tools: modes as switches, actions as buttons, and a sign on Tools when a mode is on
  const toolsBtn = page.getByRole("button", { name: /^Tools\b/ }).first();
  await toolsBtn.click();
  const panelId = await toolsBtn.getAttribute("aria-controls");
  const kinds = await page.evaluate(({ id, MODES, ACTIONS }) => {
    const p = document.getElementById(id);
    const look = (b) => {
      const sw = b.querySelector("[data-switch]");
      return { pressed: b.getAttribute("aria-pressed"), switch: !!sw && sw.getBoundingClientRect().width >= 14 };
    };
    const get = (names) => names.map((n) => [n, [...p.querySelectorAll("button")].find((b) => b.textContent.trim().replace(/\s+/g, " ") === n || b.getAttribute("aria-label") === n)]).filter(([, b]) => b).map(([n, b]) => ({ n, ...look(b) }));
    return { modes: get(MODES), actions: get(ACTIONS) };
  }, { id: panelId, MODES, ACTIONS });
  if (kinds.modes.length < 3 || kinds.actions.length < 3) found.push(`tools ${tag}: the Tools menu's modes and actions were not found (${kinds.modes.length} and ${kinds.actions.length})`);
  for (const m of kinds.modes) if (m.pressed === null || !m.switch) found.push(`tools ${tag}: "${m.n}" is a mode but is not drawn as a switch`);
  for (const a of kinds.actions) if (a.switch || a.pressed !== null) found.push(`tools ${tag}: "${a.n}" opens a panel but is drawn as an on/off switch`);
  const before = await toolsBtn.evaluate((b) => b.innerText + "|" + (b.querySelector("[data-on]") ? 1 : 0));
  await page.locator(`#${panelId}`).getByRole("button", { name: "Colour by case", exact: true }).click();
  await page.waitForTimeout(300);
  const after = await toolsBtn.evaluate((b) => b.innerText + "|" + (b.querySelector("[data-on]") ? 1 : 0));
  if (before === after) found.push(`tools ${tag}: nothing on the Tools button changes when a mode is turned on`);
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
  await (await page.getByRole("button", { name: /^Tools\b/ }).first()).click();
  await page.locator(`#${panelId}`).getByRole("button", { name: "Colour by case", exact: true }).click();
  await page.keyboard.press("Escape");

  // ---- bar: one row on a phone, the title whole
  if (w < 700) {
    const bar = await page.evaluate(() => {
      const back = document.querySelector('a[aria-label="Back to the library"]');
      const inner = back?.parentElement, b = inner?.querySelector("b");
      const tops = new Set([...(inner?.children ?? [])].flatMap((c) => (getComputedStyle(c).display === "contents" ? [...c.children] : [c])).filter((c) => c.getBoundingClientRect().width).map((c) => Math.round(c.getBoundingClientRect().top / 20)));
      return { h: inner?.getBoundingClientRect().height ?? 0, rows: tops.size, title: b?.innerText ?? "", cut: b ? b.scrollWidth > b.clientWidth + 1 : true, width: b?.getBoundingClientRect().width ?? 0 };
    });
    if (bar.h > 64) found.push(`bar ${tag}: the reader's bar is ${Math.round(bar.h)} px tall (in more than one row)`);
    if (bar.cut || bar.width < 60) found.push(`bar ${tag}: the work's title is cut short ("${bar.title}", ${Math.round(bar.width)} px)`);
  }
  await ctx.close();
}

await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "the reader is in order");
process.exit(found.length ? 1 : 0);

// The vocabulary check (whole-site pass, 2026-10-29): what the Vocabulary page tells a learner is true. A word marked
// "in your lessons" is one of the lessons' own dictionary forms as written, not another word spelled the same but for
// its accents and breathings (εἷς, one, is not εἰς, into; οὐ, not, is not οὗ, where); every core word the lessons
// teach is marked; the row "The N words from your lessons" counts them all; and every text offered under "How much can
// you read?" has the word analyses its share is counted from (a text without them can only say it is not available).
// usage: npx tsx web/scripts/check-vocabulary.mts <base-url>   (CHROMIUM=<path> picks the browser; PACKS_INDEX=<url>
// the word analyses' index, by default the packs repository's on GitHub; exits with 1 on a problem)
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { wordsRead } from "../src/data/reading-path";
import { READING_ITEMS, pathKey, passageKey } from "../src/data/reading-index";
import { LESSON_INFO } from "../src/data/lesson-index";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const INDEX = process.env.PACKS_INDEX ?? "https://raw.githubusercontent.com/mathesisstoicheion/packs/main/words/_index.json";
const core = JSON.parse(readFileSync(new URL("../public/data/core.json", import.meta.url), "utf8")).words as Record<string, { head: string; rank: number }[]>;
const byRow = new Map(Object.entries(core).map(([k, [e]]) => [`${e.rank} ${e.head}`, k.normalize("NFC")]));

// two learners: one who has read the first four lessons and the practice after them (τις, someone, but not yet τίς,
// who?), and one who has finished everything on both tracks
const first = READING_ITEMS.slice(0, 5).map((i) => i.id);
const learners: [string, Record<string, number>][] = [
  ["after the first practice lesson", Object.fromEntries(first.map((id) => [pathKey(id), 1]))],
  ["with everything finished", Object.fromEntries([...READING_ITEMS.flatMap((i) => [pathKey(i.id), passageKey(i.id)]), ...LESSON_INFO.map((l) => l.id)].map((k) => [k, 1]))],
];

const found: string[] = [];
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
let texts: string[] = [];
let counted = 0;
for (const [who, completed] of learners) {
  const lessons = new Set([...LESSON_INFO.filter((l) => completed[l.id]).flatMap((l) => l.words), ...wordsRead(completed).map((w) => w.lemma)].map((w) => w.normalize("NFC")));
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block", reducedMotion: "reduce" });
  await ctx.addInitScript((s) => localStorage.setItem("mathesis:academy", s), JSON.stringify({ state: { completed, days: [], mastery: {} }, version: 1 }));
  const page = await ctx.newPage();
  await page.goto(base + "/academy/vocabulary", { waitUntil: "load" });
  await page.locator("tbody tr").first().waitFor();
  const more = page.getByRole("button", { name: /^Show the next/ });
  while (await more.count()) await more.click();
  await page.waitForTimeout(800);
  const { rows, label, missing } = await page.evaluate(() => ({
    rows: [...document.querySelectorAll("tbody tr")].map((tr) => {
      const [rank, word] = tr.querySelectorAll("td");
      const tick = word.querySelector('[title="In your lessons"]');
      return { rank: rank.textContent!.trim(), head: [...word.childNodes].filter((n) => n !== tick).map((n) => n.textContent).join("").trim(), ticked: !!tick };
    }),
    label: [...document.querySelectorAll("section span")].map((s) => s.textContent ?? "").find((t) => /from your lessons/.test(t)) ?? null,
    missing: /Not available for this text/.test(document.body.innerText),
  }));
  if (rows.length !== byRow.size) found.push(`${who}: the list shows ${rows.length} words, the core list has ${byRow.size}`);
  for (const r of rows) {
    const key = byRow.get(`${r.rank} ${r.head}`);
    if (!key) { found.push(`${who}: row ${r.rank} "${r.head}" is not in the core list`); continue; }
    if (r.ticked && !lessons.has(key)) found.push(`${who}: ${r.head} (#${r.rank}) is marked "in your lessons", but no lesson teaches ${key}`);
    if (!r.ticked && lessons.has(key)) found.push(`${who}: ${r.head} (#${r.rank}) is taught in a lesson but not marked`);
  }
  // (the shares need the word analyses, which a server without the packs does not have: there the page says so instead)
  if (!missing) {
    const n = label?.match(/The (\d+) words? from your lessons/)?.[1];
    if (Number(n) !== lessons.size) found.push(`${who}: the page counts "${label?.trim()}", the lessons teach ${lessons.size} words`);
    counted++;
  }
  texts = await page.locator("#coverage-text option").evaluateAll((os) => os.map((o) => `${(o as HTMLOptionElement).value} ${o.textContent}`));
  await ctx.close();
}
await browser.close();

const index = await fetch(INDEX).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${INDEX}: ${r.status}`))));
for (const t of texts) {
  const [id, ...name] = t.split(" ");
  if (!(id in index)) found.push(`"${name.join(" ")}" (${id}) is offered under "How much can you read?", but the word analyses have no such text`);
}

if (found.length) {
  console.log(`check-vocabulary: ${found.length} problem${found.length === 1 ? "" : "s"}`);
  for (const f of found) console.log("  " + f);
  process.exit(1);
}
console.log(`check-vocabulary: OK (two learners: every word marked is one their lessons teach, and every one taught is marked${counted ? ", and counted" : ""}; the ${texts.length} texts offered all have their word analyses${counted ? "" : "; the word analyses are not served here, so the count of the lessons' words was not checked"})`);

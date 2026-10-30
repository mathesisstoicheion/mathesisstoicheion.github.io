// The lessons check (review fix list, slice 4): the Academy has two tracks, "Learn by reading" and "The grammar course"
// (data/tracks.ts). Every place that names a lesson must agree with the Academy's own lists:
//   number - a lesson page's "Lesson N of M" is its place in its track's list on the Academy page, counted from 1, and
//            the reading path's "Lessons completed" numbers each finished lesson the same way
//   title  - the Academy's next-step button, Your desk on the home page and the lesson pages name the same lesson
//   unit   - every lesson's length in both lists is in one unit (words); practice and tests are marked the same way, with
//            the printed page's one mark (◆, from the site's own typefaces: docs/adr/0008-the-printed-page.md)
//   promise- the home page's promise about the first lesson names the track it is about
//   next   - one next step everywhere (the owner, 2026-10-29: "consistent logic across the whole website"): for a new
//            learner the Academy's next-step button, Your desk and the home page's ways in all lead to the reading path's
//            first lesson, the way in (data/tracks.ts nextReading); the grammar course is the second track
// usage: node web/scripts/check-lessons.mjs <base-url>   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 }, serviceWorkers: "block" });
const page = await ctx.newPage();
const found = [];
const clean = (t) => (t || "").replace(/\s+/g, " ").trim();
const MARK = "◆";   // practice and tests, in both lists (the old look's ✦ is in none of the three typefaces)

// the Academy's two lists: [number, title, length, href] for every row
await page.goto(base + "/academy");
await page.waitForTimeout(800);
const lists = await page.evaluate(() => {
  const rows = (sel) => [...document.querySelectorAll(`section[aria-labelledby="${sel}"] ol > li a`)].map((a) => {
    const cells = [...a.children];
    return { no: cells[0]?.textContent.trim(), title: a.querySelector("b")?.textContent.trim(), length: cells.at(-1)?.textContent.trim(), href: a.getAttribute("href") };
  });
  return { reading: rows("reading-title"), grammar: rows("lessons-title"),
    next: [...document.querySelectorAll("a.btn")].map((a) => ({ text: a.textContent.trim(), href: a.getAttribute("href"), before: a.previousElementSibling?.textContent.trim() }))
      .find((b) => /^\/academy\/(lesson|reading)\//.test(b.href ?? "")) };
});
const heads = await page.evaluate(() => [...document.querySelectorAll("section h2")].map((h) => h.textContent.trim()));
for (const t of ["Learn by reading", "The grammar course"]) if (!heads.includes(t)) found.push(`track: the Academy has no heading "${t}"`);

for (const [track, rows] of Object.entries({ reading: lists.reading, grammar: lists.grammar })) {
  if (!rows.length) { found.push(`${track}: no list found on the Academy page`); continue; }
  let n = 0;
  for (const r of rows) {
    if (r.no === MARK) {
      if (!/^(Practice|Test|Next|✓.*|Done|Passed.*)$/.test(r.length)) found.push(`unit: ${track} "${r.title}" marked ${MARK} but sized "${r.length}"`);
      // "Practice: lessons 2 to 4" must name the lessons just before it, by their numbers in the list
      const m = r.title.match(/lessons (\d+) to (\d+)/i);
      if (track === "reading" && m && (Number(m[2]) !== n || Number(m[1]) !== n - 2)) found.push(`number: "${r.title}" follows lessons ${n - 2} to ${n}`);
      continue;
    }
    if (!/^\d+$/.test(r.no)) { found.push(`marker: ${track} "${r.title}" is marked "${r.no}", not a number or ${MARK}`); continue; }
    n++;
    if (Number(r.no) !== n) found.push(`number: ${track} "${r.title}" is numbered ${r.no}, but is lesson ${n} (counted from 1)`);
    if (!/^(\d+ words?|Next|✓.*|read.*|Passed.*)$/.test(r.length)) found.push(`unit: ${track} "${r.title}" is sized "${r.length}", not in words`);
    r.n = n;
  }
  rows.total = n;
}

// each lesson page's eyebrow: "Lesson N of M", the same N as its row
for (const [track, rows] of Object.entries({ reading: lists.reading, grammar: lists.grammar })) {
  for (const r of rows.filter((x) => x.n)) {
    await page.goto(base + r.href);
    const trailText = clean(await page.locator("main nav, main .label, main p").first().textContent().catch(() => ""));
    const all = clean(await page.locator("main").first().innerText().catch(() => ""));
    const m = all.match(/Lesson (\d+) of (\d+)/) || trailText.match(/Lesson (\d+) of (\d+)/);
    if (!m) { found.push(`number: ${r.href} shows no "Lesson N of M"`); continue; }
    if (Number(m[1]) !== r.n || Number(m[2]) !== rows.total) found.push(`number: ${r.href} says "Lesson ${m[1]} of ${m[2]}", the Academy says lesson ${r.n} of ${rows.total} (${track})`);
    if (/Step \d+ of/.test(all)) found.push(`number: ${r.href} still says "Step … of …"`);
  }
}

// the Academy's next-step button names the reading path's first lesson, with its track and number in the words before it
const first = lists.reading.find((r) => r.n === 1);
if (!lists.next) found.push("next step: the Academy shows no next-step button to a lesson");
if (lists.next && first) {
  if (lists.next.href !== first.href || !lists.next.text.includes(first.title)) found.push(`next step: the Academy's button "${lists.next.text}" is not lesson 1 "${first.title}"`);
  if (/^(Begin|Carry on) with$/.test(lists.next.before || "")) found.push(`next step: the words before the button are "${lists.next.before}", a sentence left hanging`);
  if (!/lesson 1 of \d+/i.test(lists.next.before || "")) found.push(`next step: "${lists.next.before}" does not say which lesson of which track`);
}

// the home page: its ways in for a beginner lead to the same first lesson, and Your desk names it by the same number
await page.goto(base + "/");
await page.waitForTimeout(600);
const promise = clean(await page.locator("text=/real line of Homer/").first().textContent().catch(() => ""));
if (promise && !/grammar course/i.test(promise)) found.push(`promise: the home page says "${promise.slice(0, 90)}" without naming its track`);
if (first) {
  const ways = await page.evaluate(() => [...document.querySelectorAll("main a")].map((a) => ({ text: a.textContent.replace(/\s+/g, " ").trim(), href: a.getAttribute("href") }))
    .filter((a) => /Start with the letters|I know no Greek/.test(a.text)));
  if (!ways.length) found.push("next: the home page has no way in for a beginner (Start with the letters, I know no Greek)");
  for (const w of ways) if (w.href !== first.href) found.push(`next: the home page's "${w.text.slice(0, 40)}" leads to ${w.href}, not the first lesson ${first.href}`);
}
await page.goto(base + "/stoa"); await page.waitForTimeout(400);
await page.goto(base + "/");   // a second visit: Your desk is there
await page.waitForTimeout(900);
const desk = clean(await page.evaluate(() => [...document.querySelectorAll("main *")].find((e) => /Your next lesson|The first lesson/.test(e.textContent) && e.children.length < 6)?.parentElement?.textContent));
if (desk) {
  const m = desk.match(/lesson (\d+) of (\d+)/i);
  if (!m) found.push(`desk: Your desk names no "lesson N of M" ("${desk.slice(0, 80)}")`);
  else if (first && (Number(m[1]) !== 1 || Number(m[2]) !== lists.reading.total)) found.push(`desk: Your desk says lesson ${m[1]} of ${m[2]}, not lesson 1 of ${lists.reading.total} of the reading path`);
  if (first && !desk.includes(first.title)) found.push(`desk: Your desk does not name "${first.title}"`);
  if (/minutes?\b/.test(desk)) found.push("unit: Your desk sizes the lesson in minutes, the lists in words");
}

// the reading path's "Lessons completed": each finished lesson under the number it has in the path
const done = lists.reading.filter((r) => r.n).slice(0, 4);   // the letters and the three lessons after it
await page.evaluate((ids) => localStorage.setItem("mathesis:academy", JSON.stringify({
  state: { completed: Object.fromEntries(ids.map((id) => [`read:${id}`, Date.now()])), days: [] }, version: 0 })), done.map((r) => r.href.split("/").pop()));
await page.goto(base + "/academy/reading#completed");
await page.waitForTimeout(900);
const finished = await page.evaluate(() => {
  const head = [...document.querySelectorAll("main .label")].find((e) => /lessons you have finished/i.test(e.textContent));
  return head ? [...head.parentElement.querySelectorAll("ol > li a")].map((a) => ({ no: a.children[0]?.textContent.trim(), title: a.querySelector("b")?.textContent.trim() })) : null;
});
if (!finished?.length) found.push("number: the reading path's Lessons completed lists no finished lesson");
else for (const f of finished) {
  const r = lists.reading.find((x) => x.title === f.title);
  if (!r) found.push(`number: Lessons completed lists "${f.title}", which the Academy's list does not have`);
  else if (Number(f.no) !== r.n) found.push(`number: Lessons completed numbers "${f.title}" ${f.no}, the path numbers it ${r.n}`);
}
// ... and they are counted the same everywhere: its tab, its sentence, its list and the Learn page's "lessons read"
const said = await page.evaluate(() => ({
  tab: [...document.querySelectorAll("[role=radio]")].map((b) => b.textContent).find((t) => /^Lessons completed/.test(t)) ?? "",
  sentence: document.querySelector("main")?.innerText.match(/You have finished (\d+) of \d+ lessons/)?.[1] ?? null,
}));
await page.goto(base + "/academy");
await page.waitForTimeout(800);
const learn = await page.evaluate(() => [...document.querySelectorAll("section[aria-label='Your progress'] div")]
  .find((d) => d.querySelector("span")?.textContent.trim() === "lessons read")?.querySelector("b")?.firstChild?.textContent ?? null);
const counts = { "the tab": said.tab.match(/\((\d+)\)/)?.[1] ?? "none", "the sentence under the counts": said.sentence ?? "none",
  "the list": String(finished?.length ?? 0), "the Learn page": learn ?? "none" };
if (new Set(Object.values(counts)).size > 1 || counts["the tab"] !== String(done.length))
  found.push(`number: ${done.length} lessons finished are counted ${Object.entries(counts).map(([k, v]) => `${v} by ${k}`).join(", ")}`);

// the lit band means the next step and nothing else: in the Academy's two lists exactly the rows of the steps the Learn
// page offers are lit (its button, and the grammar course's lesson beside it once that course is begun), for a new
// learner and for one who has begun both tracks
const grammarFirst = lists.grammar.find((r) => r.n === 1)?.href.split("/").pop();
for (const [who, ids] of [["a new learner", []], ["a learner on both tracks", ["read:letters", "read:nothing-too-much", grammarFirst]]]) {
  await page.evaluate((ks) => localStorage.setItem("mathesis:academy", JSON.stringify({
    state: { completed: Object.fromEntries(ks.map((k) => [k, Date.now()])), days: [], mastery: {} }, version: 1 })), ids);
  await page.goto(base + "/academy");
  await page.waitForTimeout(800);
  const { lit, steps } = await page.evaluate(() => {
    const tinted = (e) => !!e && !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(getComputedStyle(e).backgroundColor);
    const rows = [...document.querySelectorAll('section[aria-labelledby="reading-title"] ol > li, section[aria-labelledby="lessons-title"] ol > li')];
    const offered = [document.querySelector("section[aria-label='Your progress'] a.btn"), ...document.querySelectorAll("section[aria-label='Your progress'] p.muted a")];
    return {
      lit: rows.filter((li) => tinted(li) || tinted(li.querySelector("a"))).map((li) => li.querySelector("a")?.getAttribute("href") ?? li.textContent.trim().slice(0, 40)),
      steps: offered.map((a) => a?.getAttribute("href")).filter((h) => h && /^\/academy\/(lesson|reading)\/[^/]+$/.test(h)),
    };
  });
  const a = [...lit].sort().join(", "), b = [...steps].sort().join(", ");
  if (a !== b) found.push(`next: for ${who} the Academy's lists light ${a || "no row"}, but the Learn page offers ${b || "no lesson"}`);
}

await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : `the two tracks agree everywhere (${lists.reading.total} and ${lists.grammar.total} lessons)`);
process.exit(found.length ? 1 : 0);

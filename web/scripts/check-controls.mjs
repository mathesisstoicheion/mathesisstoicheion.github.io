// The controls check: how the site's shared controls (globals.css: .btn and its kinds, .chip, a choice in a .segmented
// row, .icon-btn, .text-btn) answer the hand.
//   - On a phone, a tap leaves a control as it was: a phone takes a tap for the hand arriving, so a red "under the hand"
//     would stay after the tap as if the control were still pressed (the reader work found it, 2026-10-31).
//     scripts/check-hover.mjs finds the cause in every stylesheet; this sees the effect.
//   - On a computer, a control that cannot be pressed now looks it, faded beside its pressable twin, and stays as it is
//     under the hand (the reader's Echoes panel: "Close match" and "Loose match", for a selection too long, looked
//     pressable, 2026-10-31).
// Each control is set on a page of the built site twice, pressable and not, and the two are compared.
// usage: node web/scripts/check-controls.mjs [base-url]   (serve the built site first, node web/scripts/serve-out.mjs;
// exits with 1 on a problem)
import { chromium } from "playwright";

const [base = "http://localhost:3100"] = process.argv.slice(2);
// [what it is, its markup with {id} and {off} (what makes it unpressable) in place]
const CONTROLS = [
  ["a button", `<button type="button" class="btn" id="{id}" {off}>Go on</button>`],
  ["a second button", `<button type="button" class="btn ghost" id="{id}" {off}>Go on</button>`],
  ["a quiet button", `<button type="button" class="btn quiet" id="{id}" {off}>Go on</button>`],
  ["a small button", `<button type="button" class="btn small" id="{id}" {off}>Go on</button>`],
  ["a link drawn as a button", `<a class="btn" href="#controls" id="{id}" {off:aria}>Go on</a>`],
  ["a chip", `<button type="button" class="chip" id="{id}" {off}>Create</button>`],
  ["a choice in a row", `<span class="segmented" role="radiogroup" aria-label="Match"><button type="button" role="radio" aria-checked="false" id="{id}" {off}>Close match</button></span>`],
  ["a sign alone", `<button type="button" class="icon-btn" aria-label="Next" id="{id}" {off}>›</button>`],
  ["a sign in a frame", `<button type="button" class="icon-btn framed" aria-label="Next" id="{id}" {off}>›</button>`],
  ["a button in a sentence", `<button type="button" class="text-btn" id="{id}" {off}>show it</button>`],
];
const markup = (html, id, off) => html.replace("{id}", id).replace("{off:aria}", off ? 'aria-disabled="true"' : "").replace("{off}", off ? "disabled" : "");

async function open(context) {
  const page = await context.newPage();
  await page.goto(`${base}/about`, { waitUntil: "load" });
  await page.evaluate((rows) => {
    const still = document.createElement("style");
    still.textContent = "*, *::before, *::after { transition: none !important; animation: none !important; }";
    document.head.append(still);
    const box = document.createElement("div");
    box.id = "controls";
    box.style.cssText = "position: fixed; inset: 0 auto auto 0; z-index: 2147483647; display: grid; gap: 6px; padding: 12px; background: var(--bg);";
    box.innerHTML = rows.map(([on, off]) => `<div>${on} ${off}</div>`).join("");
    document.body.append(box);
  }, CONTROLS.map(([, html], i) => [markup(html, `c${i}`, false), markup(html, `c${i}-off`, true)]));
  return page;
}
const look = (page, id) => page.evaluate((id) => {
  const s = getComputedStyle(document.getElementById(id));
  return JSON.stringify([s.opacity, s.color, s.backgroundColor, s.borderTopColor, s.textDecorationColor]);
}, id);

const problems = [];
const browser = await chromium.launch();
try {
  // a computer, with a mouse
  const computer = await open(await browser.newContext({ viewport: { width: 1440, height: 900 } }));
  await computer.mouse.move(1400, 880);
  const atRest = await look(computer, "c0");
  await computer.hover("#c0");
  if (await look(computer, "c0") === atRest) problems.push("a button does not change under the mouse here, so this check cannot see the hand: is the built site served?");
  for (const [i, [what]] of CONTROLS.entries()) {
    await computer.mouse.move(1400, 880);
    const on = await look(computer, `c${i}`), off = await look(computer, `c${i}-off`);
    if (on === off) problems.push(`${what} that cannot be pressed looks the same as one that can`);
    await computer.hover(`#c${i}-off`, { force: true });
    if (await look(computer, `c${i}-off`) !== off) problems.push(`${what} that cannot be pressed changes under the mouse, as if it could be`);
  }
  // a phone: a finger, no hand that rests
  const phone = await open(await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }));
  for (const [i, [what]] of CONTROLS.entries()) {
    const before = await look(phone, `c${i}`);
    await phone.tap(`#c${i}`);
    await phone.waitForTimeout(100);
    if (await look(phone, `c${i}`) !== before) problems.push(`${what}, tapped on a phone, stays in its colour under the hand after the tap`);
  }
} finally {
  await browser.close();
}

if (!problems.length) { console.log(`check-controls: all ${CONTROLS.length} of the shared controls stay as they were after a tap on a phone, and look unpressable when they cannot be pressed`); process.exit(0); }
for (const p of problems) console.log(`✗ ${p}`);
console.log(`check-controls: ${problems.length} ${problems.length === 1 ? "problem" : "problems"}`);
process.exit(1);

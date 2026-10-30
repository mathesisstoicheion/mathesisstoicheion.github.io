import { test, expect, type Page } from "@playwright/test";
import { openAa, openGoto, openStudy, rowName } from "./reader-menus";
import { bothColumns } from "./both-columns";

// The reader on a phone: its one bar along the foot of the window (the way back, where you are, then Aa and Study; the quiet desk, ticket 09,
// the owner, 2026-10-30). These read texts from GitHub, so they need a connection.
test.describe.configure({ timeout: 60_000 });
test.beforeEach(async ({ page }) => { await bothColumns(page); });   // these read the English beside the Greek (the quiet desk, ticket 07)
test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

const openIliad = async (page: Page, at = "1.1") => {
  await page.goto(`/read?w=tlg0012.tlg001&tr=perseus-eng3&at=${at}`);
  await expect(page.locator(`[data-key="${at}"]`).first()).toBeVisible({ timeout: 30_000 });
};
const top = (page: Page, sel: string) => page.locator(sel).first().evaluate((e) => Math.round(e.getBoundingClientRect().top));

test("the reader's bar is along the foot: the way back, where you are, Aa and Study, all within the phone's width", async ({ page }) => {
  await openIliad(page);
  await expect(page.getByRole("link", { name: "Back to the library" })).toBeAttached();
  for (const name of ["Go to a line or book", /^Aa\b/, /^Study\b/]) await expect(page.getByRole("button", { name }).first()).toBeVisible();
  const foot = page.locator("[data-foot-bar]");
  await expect.poll(() => foot.evaluate((e) => Math.round(e.getBoundingClientRect().bottom))).toBe(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  // nothing along the top: the first passage is the first thing on the page
  expect(await top(page, '[data-key="1.1"]')).toBeLessThan(200);
  // one bar of four, every control a finger's size, and a phone's bar says only the line ("line 1 of 611")
  for (const b of await foot.locator("a, button").all()) {
    const r = (await b.boundingBox())!;
    expect(r.width, await b.getAttribute("aria-label") ?? "").toBeGreaterThanOrEqual(43.5);
    expect(r.height, await b.getAttribute("aria-label") ?? "").toBeGreaterThanOrEqual(43.5);
  }
  // (what is drawn: the page's name and the rule are left out on a phone, though they are in the button)
  await expect(page.getByRole("button", { name: "Go to a line or book" })).toContainText(/^line \d+ of 611$/, { useInnerText: true });
  // Aa holds the page and the columns; Study holds your marks
  const aa = await openAa(page);
  for (const name of ["Page", "Columns"]) await expect(aa.getByRole("radiogroup", { name })).toBeVisible();
  const study = await openStudy(page);
  await expect(study.getByRole("button", { name: "Your notes and marks" })).toBeVisible();
});

test("Go to says which book is open and chooses another, and the foot of the page turns to the next and the one before", async ({ page }) => {
  await openIliad(page);
  let goto = await openGoto(page);
  await expect(goto.getByRole("combobox", { name: "Page" }).locator("option:checked")).toHaveText("Book 1");
  // no page arrows in it: the foot of each page has the way on and back
  await expect(goto.getByRole("button", { name: /^(Previous|Next) page$/ })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(goto).toBeHidden();
  await page.getByRole("button", { name: /^Continue to Book 2/ }).click();
  await expect(page).toHaveURL(/at=2\.1/);
  goto = await openGoto(page);
  await expect(goto.getByRole("combobox", { name: "Page" }).locator("option:checked")).toHaveText("Book 2");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Book 1", exact: true }).click();
  await expect(page).toHaveURL(/at=1\.1/);
});

test("Go to lists the books and goes to a passage, which lands clear of the bar", async ({ page }) => {
  await openIliad(page);
  let goto = await openGoto(page);
  await goto.getByRole("combobox", { name: "Page" }).selectOption({ label: "Book 3" });
  await expect(page).toHaveURL(/at=3\.1/);
  goto = await openGoto(page);
  await goto.getByLabel("Go to reference").fill("1.40");
  await goto.getByRole("button", { name: "Go", exact: true }).click();
  await expect(goto).toBeHidden();
  await expect(page.locator('[data-key="1.40"]')).toBeVisible();
  await expect.poll(() => top(page, '[data-key="1.40"]')).toBeGreaterThanOrEqual(0);
  expect(await top(page, '[data-key="1.40"]')).toBeLessThan(220);
});

test("the reading aids are in Study and the text size in Aa, and a tap elsewhere puts them away", async ({ page }) => {
  await openIliad(page);
  const study = await openStudy(page);
  await study.getByRole("button", { name: "Transliteration" }).click();
  await expect(page.locator('[data-key="1.1"]').first()).toContainText("mēnin");
  if (await study.isHidden()) await openStudy(page);
  await study.getByRole("button", { name: "Transliteration" }).click();
  // a press outside the sheet (the page above it) puts it away
  await page.mouse.click(8, 60);
  await expect(study).toBeHidden();

  // the page's settings (Aa) are a sheet of their own
  const size = await openAa(page);
  await expect(size).toBeVisible();
  const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--greek-size"));
  await size.getByRole("button", { name: "Increase Greek text size" }).click();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--greek-size"))).not.toBe(before);
  await page.keyboard.press("Escape");
  await expect(size).toBeHidden();
});

test("the bar slips away as the page is read on, comes back when it is read back, and stands aside for the look-up sheet", async ({ page }) => {
  await openIliad(page, "1.1");
  const foot = page.locator("[data-foot-bar]");
  const away = () => foot.evaluate((e) => getComputedStyle(e).visibility === "hidden" || e.getBoundingClientRect().top >= innerHeight - 1);
  await page.waitForTimeout(3500);   // (a jump the reader asked for holds the bar for a few seconds)
  expect(await away()).toBe(false);
  await page.evaluate(() => scrollBy({ top: 600, behavior: "instant" }));
  await expect.poll(away).toBe(true);
  await page.evaluate(() => scrollBy({ top: -200, behavior: "instant" }));
  await expect.poll(away).toBe(false);
  // a tap on the paper (not on a word) brings it back after it has gone
  await page.evaluate(() => scrollBy({ top: 600, behavior: "instant" }));
  await expect.poll(away).toBe(true);
  await page.mouse.click(4, 400);
  await expect.poll(away).toBe(false);
  // the look-up sheet stands where it was, and it is back once the sheet is put away (a word well within the window, so that the click
  // does not scroll the page: a scroll down would send the bar away again)
  const word = await page.evaluateHandle(() => [...document.querySelectorAll<HTMLElement>("article [data-u] [data-w]")].find((e) => {
    const r = e.getBoundingClientRect();
    return r.top > 120 && r.bottom < innerHeight - 260 && r.width > 8;
  })!);
  await word.asElement()!.click();
  await expect(page.getByRole("complementary", { name: /^Look-up:/ })).toBeVisible();
  await expect.poll(away).toBe(true);
  await page.getByRole("button", { name: "Close look-up" }).click();
  await expect.poll(away).toBe(false);
});

test("pinching the Greek changes its size, and the passage under the fingers stays put", async ({ page }) => {
  await openIliad(page, "1.20");
  const key = '[data-key="1.20"]';
  await page.waitForTimeout(800);
  const y0 = await top(page, key);
  const size0 = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--greek-size")));
  // two fingers moving apart over the passage (synthetic touches: Playwright's touchscreen only taps)
  await page.evaluate(async (sel) => {
    const el = document.querySelector<HTMLElement>(sel)!, r = el.getBoundingClientRect(), y = r.top + 30, t = document.querySelector("article")!;
    const touches = (gap: number) => [0, 1].map((i) => new Touch({ identifier: i, target: t, clientX: 187 + (i ? gap : -gap), clientY: y }));
    const fire = (type: string, list: Touch[]) => t.dispatchEvent(new TouchEvent(type, { touches: type === "touchend" ? [] : list, changedTouches: list, bubbles: true, cancelable: true }));
    fire("touchstart", touches(50));
    for (let g = 55; g <= 90; g += 5) { fire("touchmove", touches(g)); await new Promise((f) => requestAnimationFrame(f)); }
    fire("touchend", touches(90));
  }, key);
  await expect.poll(() => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--greek-size")))).toBeGreaterThan(size0 * 1.4);
  // remembered in Settings
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings")!).state.greekSize);
  expect(saved).toBeGreaterThan(size0 * 1.4);
  expect(Math.abs((await top(page, key)) - y0)).toBeLessThan(40);
});

test("the look-up is a sheet: it opens at a peek, grows to half or all it may, steps word to word, and drags away, never over the line", async ({ page }) => {
  await openIliad(page);
  const words = page.locator('[data-u="1.1"] [data-w]');
  const first = await words.nth(0).getAttribute("data-w"), second = await words.nth(1).getAttribute("data-w");
  await words.nth(0).click();
  const sheet = page.getByRole("complementary", { name: `Look-up: ${first}` });
  await expect(sheet).toBeVisible();
  const height = () => sheet.evaluate((e) => Math.round(e.getBoundingClientRect().height));
  // how far the sheet may rise: to just below the line being read (redesign SPEC.md 4.3: it never covers the Greek)
  const room = () => page.evaluate(() => 812 - Math.round(document.querySelector("article [data-w][class*='__sel']")!.getBoundingClientRect().bottom));
  const clear = async (s = sheet) => {
    const [top, line] = await s.evaluate((e) => [e.getBoundingClientRect().top, document.querySelector("article [data-w][class*='__sel']")!.getBoundingClientRect().bottom]);
    expect(top, "the sheet stops below the line being read").toBeGreaterThanOrEqual(line - 1);
  };
  const peek = Math.round(Math.min(Math.max(812 * 0.25, 2.25 * 80), 400));   // about a quarter of the screen (the quiet desk, ticket 04)
  await expect.poll(height).toBe(Math.min(peek, (await room()) - 12));
  await clear();
  const rest = await height();
  // all it may, by the button: the second layer, as tall as it can be without reaching the line
  await sheet.getByRole("button", { name: "More about it" }).click();
  await expect.poll(height).toBeGreaterThan(peek);
  await expect.poll(async () => (await room()) - (await height())).toBeLessThanOrEqual(14);
  await clear();
  const tall = await height();
  // Back returns to the first layer at its resting height (the quiet desk, ticket 06)
  await sheet.getByRole("button", { name: "Back" }).click();
  await expect.poll(height).toBe(rest);
  await expect(sheet.getByRole("button", { name: "More about it" })).toBeFocused();
  // the next word, by the button and back by a swipe to the right
  await sheet.getByRole("button", { name: "Next word" }).click();
  const next = page.getByRole("complementary", { name: `Look-up: ${second}` });
  await expect(next).toBeVisible();
  await clear(next);
  const head = async () => (await next.locator("div").first().boundingBox())!;
  let h = await head();
  await page.mouse.move(h.x + 60, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + 220, h.y + h.height / 2 + 4, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("complementary", { name: `Look-up: ${first}` })).toBeVisible();
  await expect.poll(height).toBe(rest);   // moving word to word on one line keeps the height
  await clear();
  // the second layer again, then drag the handle down a little: back to the first layer, settled at half (or as near as the line allows)
  await page.getByRole("complementary", { name: `Look-up: ${first}` }).getByRole("button", { name: "More about it" }).click();
  await expect.poll(height).toBe(tall);
  const s = page.getByRole("complementary", { name: `Look-up: ${first}` });
  h = (await s.locator("div").first().boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + 10);
  await page.mouse.down();
  // (down to the height of half: with no bar along the top the sheet has more room, so "a little" is as far as that, not a fixed 60 px)
  const half = Math.min(Math.round(812 * 0.7), tall);
  await page.mouse.move(h.x + h.width / 2, h.y + 10 + Math.max(60, tall - half), { steps: 12 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await expect.poll(() => s.evaluate((e) => Math.round(e.getBoundingClientRect().height))).toBe(half);
  await clear(s);
  // and well down: it closes
  h = (await s.locator("div").first().boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + 10);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2, 790, { steps: 25 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await expect(s).toBeHidden();
});

test("press and hold a word: the passage actions dock at the bottom with the word's meaning, and More opens the look-up", async ({ page }) => {
  await openIliad(page);
  const word = page.locator('[data-u="1.1"] [data-w="ἄειδε"]');
  // a finger selects the word (the phone's own press-and-hold selection, made here by script after a touch)
  const box = (await word.boundingBox())!;
  await page.touchscreen.tap(box.x + 2, box.y - 30);
  await word.evaluate((el) => getSelection()!.selectAllChildren(el));
  const bar = page.getByRole("toolbar", { name: "Passage actions" });
  await expect(bar).toBeVisible();
  await expect.poll(() => bar.evaluate((e) => Math.round(e.getBoundingClientRect().bottom))).toBe(812);
  await expect(bar).toContainText("ἀείδω");
  await expect(bar).toContainText(/sing/);
  for (const b of await bar.getByRole("button").all()) {
    const r = (await b.boundingBox())!;
    if (!(await b.getAttribute("aria-label"))?.startsWith("Highlight")) expect(r.height, await b.textContent() ?? "").toBeGreaterThanOrEqual(44);
  }
  await bar.getByRole("button", { name: "More" }).click();
  await expect(page.getByRole("complementary", { name: "Look-up: ἄειδε" })).toBeVisible();
  await expect(bar).toBeHidden();

  // a passage number: the actions for the whole passage, without a word's meaning; × closes them
  await page.getByRole("button", { name: "Close look-up" }).click();
  await page.locator('[data-key="1.1"] button[data-row]').first().click();
  await expect(bar).toBeVisible();
  await expect(bar).not.toContainText("More");
  await bar.getByRole("button", { name: "Close passage actions" }).click();
  await expect(bar).toBeHidden();
});

test("Try it first hides each translation until it is tapped; Fit lines keeps every verse line whole", async ({ page }) => {
  await openIliad(page);
  let aids = await openStudy(page);
  await aids.getByRole("button", { name: "Try it first" }).click();
  await page.keyboard.press("Escape");
  const tr = page.locator('[data-key="1.1"] [data-veiled]');
  await expect(tr).toBeVisible();
  await expect(page.getByText("The wrath sing, goddess")).toBeHidden();
  await tr.getByRole("button", { name: /tap to see the translation/i }).click();
  await expect(page.getByText(/The wrath sing, goddess/)).toBeVisible();
  // the next passage is still veiled
  await expect(page.locator('[data-key="1.5"] [data-veiled]')).toBeAttached();

  aids = await openStudy(page);
  await aids.getByRole("button", { name: "Try it first" }).click();
  if (await aids.isHidden()) aids = await openStudy(page);
  await aids.getByRole("button", { name: "Fit lines" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-veiled]")).toHaveCount(0);
  const fit = () => page.locator("article").evaluate((a) => parseFloat(getComputedStyle(a).getPropertyValue("--fit")) || 1);
  await expect.poll(fit).toBeLessThan(1);
  expect(await fit()).toBeGreaterThanOrEqual(0.5);
  // every line of the book on this page fits its column, including those drawn only when scrolled to
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((f) => setTimeout(f, 20)); } });
  const over = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("article [class*='_lt_']")].filter((lt) => lt.scrollWidth > lt.clientWidth + 1).length);
  expect(over).toBe(0);
  // remembered
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings")!).state.fitLines)).toBe(true);
});

test("a reading aid that opens a panel puts Study away, so the panel is not hidden under it", async ({ page }) => {
  await openIliad(page);
  for (const [aid, panel] of [["Vocabulary", /vocabulary/i], ["Places", "Places on this page"], ["Manuscript", "The manuscript"]] as const) {
    const aids = await openStudy(page);
    await expect(aids).toBeVisible();
    await aids.getByRole("button", { name: rowName(aid), exact: true }).click();
    await expect(aids).toBeHidden();
    const shown = page.getByRole("complementary", { name: panel }).first();
    await expect(shown).toBeVisible();
    await shown.getByRole("button", { name: /^Close/ }).first().click();
    await expect(shown).toBeHidden();
  }
});

test("nothing makes the page wider than the phone, not even while the scroll markers slide in on a second visit", async ({ page }) => {
  // the widest the layout gets, sampled every frame from the very start of each page
  await page.addInitScript(() => {
    const w = window as unknown as { __widest: number };
    w.__widest = 0;
    const tick = () => { w.__widest = Math.max(w.__widest, innerWidth, document.documentElement.scrollWidth); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await openIliad(page);
  await page.locator('[data-u="1.1"] [data-w="μῆνιν"]').first().click();
  await openIliad(page);
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => (window as unknown as { __widest: number }).__widest)).toBeLessThanOrEqual(375);
  // and a box that is too wide is clipped by the page, not given room by widening the screen
  await page.evaluate(() => { const d = document.createElement("div"); d.style.cssText = "width:600px;height:10px"; document.querySelector("main")!.prepend(d); });
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => innerWidth)).toBe(375);
});

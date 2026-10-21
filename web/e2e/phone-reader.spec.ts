import { test, expect, type Page } from "@playwright/test";
import { openAids, openMore } from "./reader-menus";

// The reader on a phone: design A's bar along the top of the window (the way back, the book and its page, then the
// page's settings, Aa; Tools; your marks; More). These read texts from GitHub, so they need a connection.
test.describe.configure({ timeout: 60_000 });
test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

const openIliad = async (page: Page, at = "1.1") => {
  await page.goto(`/read?w=tlg0012.tlg001&tr=perseus-eng3&at=${at}`);
  await expect(page.locator(`[data-key="${at}"]`).first()).toBeVisible({ timeout: 30_000 });
};
const top = (page: Page, sel: string) => page.locator(sel).first().evaluate((e) => Math.round(e.getBoundingClientRect().top));

test("the reader's bar is at the top: the way back, the book, and its buttons, all within the phone's width", async ({ page }) => {
  await openIliad(page);
  await expect(page.getByRole("link", { name: "Back to the library" })).toBeAttached();
  for (const name of ["Tools", "More"]) await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  // one row (review fix list, slice 8): the columns, the page's settings and your marks wait in More (⋯)
  const more = await openMore(page);
  for (const name of ["Columns on a phone", "Page and text on a phone", "Your marks on a phone"]) await expect(more.getByRole("group", { name })).toBeVisible();
});

test("Tools turns to the next and previous book, and says which one is open", async ({ page }) => {
  await openIliad(page);
  let tools = await openAids(page);
  await expect(tools.getByRole("combobox", { name: "Page" }).locator("option:checked")).toHaveText("Book 1");
  await tools.getByRole("button", { name: "Next page" }).click();
  await expect(page).toHaveURL(/at=2\.1/);
  tools = await openAids(page);
  await expect(tools.getByRole("combobox", { name: "Page" }).locator("option:checked")).toHaveText("Book 2");
  await tools.getByRole("button", { name: "Previous page" }).click();
  await expect(page).toHaveURL(/at=1\.1/);
});

test("Tools lists the books and goes to a passage, which lands clear of the bar", async ({ page }) => {
  await openIliad(page);
  let tools = await openAids(page);
  await tools.getByRole("combobox", { name: "Page" }).selectOption({ label: "Book 3" });
  await expect(page).toHaveURL(/at=3\.1/);
  tools = await openAids(page);
  await tools.getByLabel("Go to reference").fill("1.40");
  await tools.getByRole("button", { name: "Go", exact: true }).click();
  await expect(tools).toBeHidden();
  await expect(page.locator('[data-key="1.40"]')).toBeVisible();
  await expect.poll(() => top(page, '[data-key="1.40"]')).toBeGreaterThanOrEqual(0);
  expect(await top(page, '[data-key="1.40"]')).toBeLessThan(220);
});

test("the reading aids are in Tools and the text size in Aa, and a tap elsewhere puts them away", async ({ page }) => {
  await openIliad(page);
  const tools = await openAids(page);
  await tools.getByRole("button", { name: "Transliteration" }).click();
  await expect(page.locator('[data-key="1.1"]').first()).toContainText("mēnin");
  if (await tools.isHidden()) await openAids(page);
  await tools.getByRole("button", { name: "Transliteration" }).click();
  // a press outside the panel puts it away
  await page.mouse.click(8, 600);
  await expect(tools).toBeHidden();

  // on a phone the page's settings (Aa) are in More (⋯)
  await openMore(page);
  const size = page.getByRole("group", { name: "Page and text on a phone" });
  await expect(size).toBeVisible();
  const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--greek-size"));
  await size.getByRole("button", { name: "Increase Greek text size" }).click();
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--greek-size"))).not.toBe(before);
  await page.keyboard.press("Escape");
  await expect(size).toBeHidden();
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

test("the look-up is a sheet: it opens at a peek, drags to half or full height, steps word to word, and drags away", async ({ page }) => {
  await openIliad(page);
  const words = page.locator('[data-u="1.1"] [data-w]');
  const first = await words.nth(0).getAttribute("data-w"), second = await words.nth(1).getAttribute("data-w");
  await words.nth(0).click();
  const sheet = page.getByRole("complementary", { name: `Look-up: ${first}` });
  await expect(sheet).toBeVisible();
  const height = () => sheet.evaluate((e) => Math.round(e.getBoundingClientRect().height));
  await expect.poll(height).toBe(Math.round(Math.min(812 * 0.46, 400)));
  // all of it, by the button
  await sheet.getByRole("button", { name: "Show all of the look-up" }).click();
  await expect.poll(height).toBe(812 - 10);
  // the next word, by the button and back by a swipe to the right
  await sheet.getByRole("button", { name: "Next word" }).click();
  const next = page.getByRole("complementary", { name: `Look-up: ${second}` });
  await expect(next).toBeVisible();
  const head = async () => (await next.locator("div").first().boundingBox())!;
  let h = await head();
  await page.mouse.move(h.x + 60, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + 220, h.y + h.height / 2 + 4, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("complementary", { name: `Look-up: ${first}` })).toBeVisible();
  await expect.poll(height).toBe(812 - 10);   // moving word to word keeps the height
  // drag the handle down to about half: it settles at half
  const s = page.getByRole("complementary", { name: `Look-up: ${first}` });
  h = (await s.locator("div").first().boundingBox())!;
  await page.mouse.move(h.x + h.width / 2, h.y + 10);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2, h.y + 10 + 250, { steps: 25 });
  await page.waitForTimeout(100);
  await page.mouse.up();
  await expect.poll(() => s.evaluate((e) => Math.round(e.getBoundingClientRect().height))).toBe(Math.round(812 * 0.7));
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
  let aids = await openAids(page);
  await aids.getByRole("button", { name: "Try it first" }).click();
  await page.keyboard.press("Escape");
  const tr = page.locator('[data-key="1.1"] [data-veiled]');
  await expect(tr).toBeVisible();
  await expect(page.getByText("The wrath sing, goddess")).toBeHidden();
  await tr.getByRole("button", { name: /tap to see the translation/i }).click();
  await expect(page.getByText(/The wrath sing, goddess/)).toBeVisible();
  // the next passage is still veiled
  await expect(page.locator('[data-key="1.5"] [data-veiled]')).toBeAttached();

  aids = await openAids(page);
  await aids.getByRole("button", { name: "Try it first" }).click();
  if (await aids.isHidden()) aids = await openAids(page);
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

test("a reading aid that opens a panel puts Tools away, so the panel is not hidden under it", async ({ page }) => {
  await openIliad(page);
  for (const [aid, panel] of [["Vocabulary", /vocabulary/i], ["Places", "Places on this page"], ["Manuscript", "The manuscript"]] as const) {
    const aids = await openAids(page);
    await expect(aids).toBeVisible();
    await aids.getByRole("button", { name: aid, exact: true }).click();
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

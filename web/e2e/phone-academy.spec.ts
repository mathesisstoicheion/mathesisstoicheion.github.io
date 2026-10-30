import { test, expect, type Page } from "@playwright/test";

// Phase 10, step 3: the Academy on a phone.
test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

/** Record every call to navigator.vibrate (phones that allow it buzz; the test browser does not). */
const recordBuzz = (page: Page) => page.addInitScript(() => {
  const w = window as unknown as { buzzes: unknown[] };
  w.buzzes = [];
  Object.defineProperty(Navigator.prototype, "vibrate", { configurable: true, value: (p: unknown) => { w.buzzes.push(p); return true; } });
});
const buzzes = (page: Page) => page.evaluate(() => (window as unknown as { buzzes: unknown[] }).buzzes.length);

test("practice answers are large buttons, and a right answer buzzes", async ({ page }) => {
  await recordBuzz(page);
  await page.goto("/academy/practice");
  const options = page.locator("[class*='options'] button");
  await expect(options.first()).toBeVisible();
  for (const b of await options.all()) expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(56);
  await options.first().click();
  const right = await options.first().evaluate((e) => /right/.test(e.className));
  expect(await buzzes(page)).toBe(right ? 1 : 0);
});

test("trace a letter over its guide: a good tracing is praised, a scribble is not", async ({ page }) => {
  await page.goto("/academy/alphabet");
  await page.getByRole("button", { name: "Trace" }).click();
  const box = page.getByRole("img", { name: /^Write α here/ });
  await expect(box).toBeVisible();
  // follow the guide stroke (α has one), point by point
  const pts = await box.evaluate((svg) => {
    const path = svg.querySelector<SVGPathElement>("path")!, m = (svg as SVGSVGElement).getScreenCTM()!, len = path.getTotalLength();
    return Array.from({ length: 41 }, (_, i) => { const p = path.getPointAtLength((len * i) / 40); const s = new DOMPoint(p.x, p.y).matrixTransform(m); return [s.x, s.y]; });
  });
  await page.mouse.move(pts[0][0], pts[0][1]);
  await page.mouse.down();
  for (const [x, y] of pts.slice(1)) await page.mouse.move(x, y);
  await page.mouse.up();
  await expect(page.getByRole("status").filter({ hasText: "Well written!" })).toBeVisible();
  // a line across the box instead
  const b = (await box.boundingBox())!;
  await page.mouse.move(b.x + 10, b.y + 10);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width - 10, b.y + 20, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByRole("status").filter({ hasText: "Not quite" })).toBeVisible();
});

test("today's session: full screen, pages turned by Next or a swipe, and a last page with the days in a row", async ({ page }) => {
  await page.goto("/academy/today");
  const top = page.getByRole("list", { name: "Pages of today's session" });
  await expect(top).toBeVisible();
  // it covers the whole screen, the site's bars included
  const session = top.locator("xpath=../..");
  expect(await session.boundingBox()).toEqual({ x: 0, y: 0, width: 375, height: 812 });
  await expect(page.getByRole("heading", { name: /One ending/ })).toBeVisible();
  // a swipe to the left turns the page
  const h = (await page.getByRole("heading", { name: /One ending/ }).boundingBox())!;
  await page.mouse.move(h.x + 300, h.y + 10);
  await page.mouse.down();
  await page.mouse.move(h.x + 60, h.y + 16, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("heading", { name: /One real sentence/ })).toBeVisible();
  // skipping is offered, but quietly: the main button is never the one that skips the work
  await expect(page.getByRole("button", { name: /^Skip/ })).toHaveClass(/\bghost\b/);
  await page.getByRole("button", { name: /^Skip/ }).click();
  await expect(page.getByRole("heading", { name: /Done for today/ })).toBeVisible();
  // the last page offers the one next step every page offers: for a beginner, the reading path's first lesson
  await expect(page.getByRole("link", { name: /Your next lesson: The letters/ })).toHaveAttribute("href", "/academy/reading/letters");
  await expect(page.getByText(/1 day in a row/)).toBeVisible();
  await expect(page.getByText("The ending was skipped")).toBeVisible();
  await expect(page.getByText("The sentence was skipped")).toBeVisible();
  // back goes to the previous page
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("heading", { name: /One real sentence/ })).toBeVisible();
});

test("the vibration switch in Settings stops the buzzes", async ({ page }) => {
  await recordBuzz(page);
  await page.goto("/academy/practice");
  // on a phone, Settings are in the header's menu
  await page.locator("header").getByRole("button", { name: "Menu" }).click();
  await page.getByRole("navigation", { name: "Menu" }).getByRole("button", { name: "Settings" }).click();
  const sheet = page.getByRole("dialog", { name: "Settings" });
  await sheet.getByRole("radiogroup", { name: "Short vibrations" }).getByRole("radio", { name: "Off" }).click();
  await sheet.getByRole("button", { name: "Close settings" }).click();
  const options = page.locator("[class*='options'] button");
  await expect(options.first()).toBeVisible();
  // answer until one is right: a right answer would buzz if vibrations were on
  for (let i = 0; i < 6; i++) {
    await options.first().click();
    if (await options.first().evaluate((e) => /right/.test(e.className))) break;
    await page.reload();
    await expect(options.first()).toBeVisible();
  }
  expect(await buzzes(page)).toBe(0);
});

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The Guide (/guide) and its "Show me" tours: the light and card point at the real controls, step by step.
test.describe.configure({ timeout: 120_000 });

const card = (page: import("@playwright/test").Page) => page.locator("[data-tour-card]");

test("the Guide lists ten chapters, Learn Greek first, each with Show me", async ({ page }) => {
  await page.goto("/guide");
  await expect(page.getByRole("heading", { level: 1, name: "How to use the site" })).toBeVisible();
  const chapters = page.locator("ol > li[id]").filter({ has: page.getByRole("link", { name: /^Show me/ }) });
  await expect(chapters).toHaveCount(10);
  await expect(chapters.first()).toHaveAttribute("id", "learn");
  // (the page itself is checked by axe in both themes with every other page, in a11y.spec.ts)
});

test("a tour goes on by itself when the reader does what it asks, and ends by naming the next chapter", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&at=1.1&tour=word");
  await expect(card(page)).toContainText("Step 1 of 3", { timeout: 30_000 });
  await expect(card(page)).toContainText("You can try each control");
  // clicking the word itself, not Next, moves the tour on
  await page.locator('[data-u="1.1"] [data-w]').first().click();
  await expect(card(page)).toContainText("Step 2 of 3");
  await expect(page.locator('aside[aria-label^="Look-up:"]')).toBeVisible();
  await card(page).getByRole("button", { name: "Next" }).click();
  await expect(card(page)).toContainText("Step 3 of 3");
  await card(page).getByRole("button", { name: "Done" }).click();
  await expect(card(page)).toContainText("chapter 4 of 10");
  await expect(card(page).getByRole("link", { name: /Next: Reading aids/ })).toBeVisible();
  // the Guide ticks the chapter
  await card(page).getByRole("link", { name: "The Guide" }).click();
  await expect(page.locator('a[href="#word"]')).toHaveAttribute("data-done");
  await expect(page.locator("#word")).toContainText("Show me again");
});

test("Esc ends a tour, and the passage actions are put away before the Treasury step", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&at=1.1&tour=keep");
  await expect(card(page)).toContainText("Step 1 of 3", { timeout: 30_000 });
  await card(page).getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("toolbar", { name: "Passage actions" })).toBeVisible();
  await card(page).getByRole("button", { name: "Next" }).click();
  await expect(card(page)).toContainText("Mine: the Treasury");
  await expect(page.getByRole("toolbar", { name: "Passage actions" })).toBeHidden();
  const r = await new AxeBuilder({ page }).include("[data-tour-card]").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(r.violations.map((x) => x.id)).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(card(page)).toBeHidden();
  await expect(page).not.toHaveURL(/tour=/);
});

test("a first visit is invited to the Guide once; either answer is remembered", async ({ page }) => {
  await page.goto("/?invite");
  const invite = page.getByRole("complementary", { name: "New here?" });
  await page.mouse.wheel(0, 300);
  await expect(invite).toBeVisible({ timeout: 10_000 });
  await invite.getByRole("button", { name: "No thanks" }).click();
  await expect(invite).toBeHidden();
  await page.goto("/?invite");
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(5500);
  await expect(invite).toBeHidden();
});

test("on a phone, the reading-aids tour opens the Aids sheet and keeps it open as it steps through", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto("/read?w=tlg0012.tlg001&at=1.1&tour=aids");
  await expect(card(page)).toContainText("Step 1 of", { timeout: 30_000 });
  await card(page).getByRole("button", { name: "Next" }).click();
  await expect(card(page)).toContainText("Transliteration");
  await expect(page.locator("#read-aids")).toBeVisible();
  await card(page).getByRole("button", { name: "Next" }).click();
  await expect(card(page)).toContainText("Colour by case");
  await expect(page.locator("#read-aids")).toBeVisible();
  await ctx.close();
});

import { test, expect, type Page } from "@playwright/test";

// Find in this text: a word or phrase through the whole book, in the Greek and in the translation.
// Needs a connection (the texts come from GitHub).
test.describe.configure({ timeout: 90_000 });

const marked = (page: Page, name: string) =>
  page.evaluate((n) => ((CSS as unknown as { highlights?: Map<string, { size: number }> }).highlights?.get(n)?.size ?? 0), name);

async function openIliad(page: Page) {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
}

test("Ctrl+F finds a phrase typed in Latin letters through the whole book, and goes from match to match", async ({ page }) => {
  await openIliad(page);
  await page.locator("article").click({ position: { x: 5, y: 5 } });
  await page.keyboard.press("Control+f");
  const panel = page.getByRole("complementary", { name: "Find in this text" });
  await expect(panel).toBeVisible();
  const box = panel.getByRole("searchbox");
  await expect(box).toBeFocused();
  await box.fill("podas okys achilleus");
  await expect(panel.getByRole("status")).toContainText("in the Greek");
  const items = panel.getByRole("listitem");
  expect(await items.count()).toBeGreaterThan(5);
  // every match on the page is marked; Enter chooses the next one from here, and marks it strongly
  await expect.poll(() => marked(page, "find-1")).toBeGreaterThan(0);
  await box.press("Enter");
  await expect(panel.getByRole("status")).toContainText(/^1 of /);
  await expect.poll(() => marked(page, "find-now-1")).toBe(3);
  await box.press("Enter");
  await expect(panel.getByRole("status")).toContainText(/^2 of /);
  await box.press("Shift+Enter");
  await expect(panel.getByRole("status")).toContainText(/^1 of /);
  // a match in a later book turns the page to it
  const last = items.last();
  const ref = (await last.locator("span").first().innerText()).trim();
  await last.click();
  await expect(page).toHaveURL(new RegExp(`at=${ref.replace(/\./g, "\\.")}`));
  await expect(page.locator(`[data-u="${ref}"]`)).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => marked(page, "find-now-1")).toBe(3);
  // Escape closes it, and the marks go with it
  await box.press("Escape");
  await expect(panel).toBeHidden();
  await expect.poll(() => marked(page, "find-1")).toBe(0);
});

test("Latin letters also search the translation, and Greek letters ignore accents", async ({ page }) => {
  await openIliad(page);
  await page.getByRole("button", { name: "Find", exact: true }).click();
  const panel = page.getByRole("complementary", { name: "Find in this text" });
  const box = panel.getByRole("searchbox");
  await box.fill("wrath");
  const scope = panel.getByRole("radiogroup", { name: "Look in" });
  await expect(scope.getByRole("radio", { name: /Translation/ })).toBeChecked();
  await box.press("Enter");
  await expect(panel.getByRole("status")).toContainText(/^1 of .* in the translation/);
  await expect.poll(() => marked(page, "find-now-1")).toBe(1);
  // plain Greek letters find the accented word
  await box.fill("μηνιν");
  await expect(panel.getByRole("status")).toContainText("in the Greek");
  await expect(panel.getByRole("listitem").first()).toContainText("1.1");
  await box.fill("xq");
  await expect(panel.getByRole("status")).toContainText("Not found");
});

test("on a phone, Find is in the reading aids, and shrinks to its search row once a match is chosen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openIliad(page);
  await page.getByRole("toolbar", { name: "Reading" }).getByRole("button", { name: "Aids" }).click();
  await page.getByRole("dialog", { name: "Reading aids" }).getByRole("button", { name: "Find in this text" }).click();
  const panel = page.getByRole("complementary", { name: "Find in this text" });
  await expect(panel).toBeVisible();
  await panel.getByRole("searchbox").fill("menin");
  await panel.getByRole("listitem").first().click();
  await expect(panel).toHaveAttribute("data-compact", "true");
  await expect(panel.getByRole("list")).toBeHidden();
  await expect.poll(() => marked(page, "find-now-1")).toBe(1);
  const pb = (await panel.boundingBox())!;
  expect(pb.height).toBeLessThan(200);
  await panel.getByRole("button", { name: "Show the list" }).click();
  await expect(panel.getByRole("list")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

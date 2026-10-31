import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openCompare, openStudy } from "./reader-menus";
import { bothColumns } from "./both-columns";

// Comparing two editions in the reader: Aeschylus' Agamemnon, Smyth (1926) against Sidgwick (1902).
// Needs a connection (the texts come from GitHub).
test.describe.configure({ timeout: 120_000 });
test.beforeEach(async ({ page }) => { await bothColumns(page); });   // the editions are compared in two columns, so the page starts as that layout (the quiet desk, ticket 07)

const AGAM = "/read?w=tlg0085.tlg005&ed=perseus-grc2";
const marked = (page: Page, name: string) =>
  page.evaluate((n) => [...((CSS as unknown as { highlights?: Map<string, Set<Range>> }).highlights?.get(n) ?? [])].map((r) => r.toString()), name);
const total = async (page: Page) =>
  Number((await page.getByRole("region", { name: "Comparing two editions" }).innerText()).match(/([\d,]+) in the whole text/)![1].replace(/,/g, ""));

test("choose an edition to compare with, and the readings that differ are marked on both sides", async ({ page }) => {
  await page.goto(`${AGAM}&at=80`);
  await expect(page.locator('[data-u="80"]').first()).toBeVisible({ timeout: 60_000 });
  // Compare is in Study (Go deeper): its row unfolds the choice of edition
  await (await openCompare(page)).getByRole("combobox", { name: "Compare with" }).selectOption("1st1K-grc1");
  const bar = page.getByRole("region", { name: "Comparing two editions" });
  await expect(bar).toContainText("in the whole text", { timeout: 60_000 });
  // line 87: Smyth prints πειθοῖ, Sidgwick πευθοῖ
  await expect.poll(() => marked(page, "diff-a-1")).toContain("πειθοῖ");
  await expect.poll(() => marked(page, "diff-b-1")).toContain("πευθοῖ");
  // the second column is Greek, the translation is set aside, and Listen (English only) is not offered
  await expect(page.getByText(/^Greek · Sidgwick/)).toBeVisible();
  const study = await openStudy(page);
  await expect(study.getByRole("combobox", { name: "Translation" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Listen" })).toHaveCount(0);

  // the next difference, from Study (Compare, under Go deeper); the strip above the text has one too
  await page.locator('[data-key="80"]').first().scrollIntoViewIfNeeded();
  await (await openCompare(page)).getByRole("button", { name: "Next difference", exact: true }).click();
  await expect.poll(() => page.locator('[data-key="87"]').first().evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(300);

  // the list, like an apparatus; a line of it goes to its passage
  await bar.getByRole("button", { name: "List of differences" }).click();
  const list = page.getByRole("complementary", { name: "Differences between the editions" });
  await expect(list.getByRole("button", { name: /^87\s*πειθοῖ\s*\]\s*πευθοῖ/ })).toBeVisible();
  await list.getByRole("button", { name: /^106\s/ }).click();
  await expect.poll(() => page.locator('[data-key="106"]').first().evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(300);

  // spelling too: more differences
  const readings = await total(page);
  await bar.getByLabel("Spelling too").click();   // (it is kept in the address, so it ticks once the address changes)
  await expect(bar.getByLabel("Spelling too")).toBeChecked();
  await expect.poll(() => total(page)).toBeGreaterThan(readings);

  // stop: the translation comes back
  await bar.getByRole("button", { name: "Stop comparing" }).click();
  await expect(page.getByText(/^English \S/).first()).toBeVisible({ timeout: 60_000 });   // the edition line again names the English
  await expect(page).not.toHaveURL(/cmp=/);
});

test("on a phone, the differences are reached from Study", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${AGAM}&cmp=1st1K-grc1&at=80`);
  await expect(page.getByRole("region", { name: "Comparing two editions" })).toContainText("in the whole text", { timeout: 60_000 });
  // on a phone they wait under Study, in Compare with another edition (the bar along the foot has no room for them)
  await (await openCompare(page)).getByRole("button", { name: "Next difference", exact: true }).click();
  await expect.poll(() => page.locator('[data-key="87"]').first().evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(400);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("editions that number their passages differently are shown side by side, not compared word by word", async ({ page }) => {
  // the Constitution of the Athenians: Perseus by section and subsection, First1K by paragraph
  await page.goto("/read?w=tlg0086.tlg003&ed=perseus-grc2&cmp=1st1K-grc1");
  await expect(page.getByRole("region", { name: "Comparing two editions" })).toContainText("number their passages differently", { timeout: 60_000 });
});

for (const scheme of ["light", "dark"] as const) {
  test(`comparing editions passes the accessibility checks (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(`${AGAM}&cmp=1st1K-grc1&at=80`);
    const bar = page.getByRole("region", { name: "Comparing two editions" });
    await expect(bar).toContainText("in the whole text", { timeout: 60_000 });
    await bar.getByRole("button", { name: "List of differences" }).click();
    await expect(page.getByRole("complementary", { name: "Differences between the editions" })).toBeVisible();
    await page.waitForTimeout(500);
    const r = await new AxeBuilder({ page }).include("main").exclude("article").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(r.violations.map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

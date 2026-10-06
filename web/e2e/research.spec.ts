import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

// The Oracle's research tools: the concordance, the statistics, and "near another word".
// The concordance reads the texts themselves, so it needs a connection (they come from GitHub).
test.describe.configure({ timeout: 120_000 });

const DIKE = encodeURIComponent("δίκη"), THEOS = encodeURIComponent("θεός");
const count = async (page: Page) => Number((await page.getByText(/results? in/).first().innerText()).replace(/,/g, "").replace(/\D[\s\S]*$/, ""));

test("the concordance lines up every result, sorts by the word before, and downloads as a spreadsheet", async ({ page }) => {
  await page.goto(`/search?m=lemma&q=${DIKE}&a=tlg0059&v=conc`);
  const conc = page.getByRole("region", { name: "Concordance" });
  await expect(conc.getByText(/Showing \d+ of/)).toBeVisible({ timeout: 60_000 });
  const lines = conc.locator("ol > li");
  expect(await lines.count()).toBeGreaterThan(50);
  // every line has its match in the middle, a form of δίκη
  for (const k of await conc.locator("ol > li mark").filter({ hasNotText: /^$/ }).first().allInnerTexts()) expect(k).toMatch(/^δ[ιί]κ/);
  const first = await lines.first().innerText();
  await conc.getByRole("radio", { name: "By the word before" }).click();
  await expect.poll(() => lines.first().innerText()).not.toBe(first);
  // more lines on request
  const n = await lines.count();
  await conc.getByRole("button", { name: /^Show \d+ more$/ }).click();
  await expect.poll(() => lines.count(), { timeout: 60_000 }).toBeGreaterThan(n);
  const [dl] = await Promise.all([page.waitForEvent("download"), conc.getByRole("button", { name: /^Download .* lines/ }).click()]);
  const csv = readFileSync((await dl.path())!, "utf8");
  expect(csv.charCodeAt(0)).toBe(0xfeff);
  expect(csv).toContain("Author,Work,Passage,Edition,Text (CTS URN),Before,Match,After,Grammar (GLAUx),Link");
  expect(csv).toMatch(/Plato,[^,]+,\d/);
  expect(csv).toContain("/read?w=tlg0059");
});

test("the statistics show where a word is used most, per 10,000 words, century by century, and its grammar", async ({ page }) => {
  await page.goto(`/search?m=lemma&q=${DIKE}&v=stats`);
  const stats = page.getByRole("region", { name: "Statistics" });
  await expect(stats.getByRole("heading", { name: "Century by century" })).toBeVisible({ timeout: 60_000 });
  await expect(stats.getByRole("heading", { name: "In each work" })).toBeVisible();
  await expect(stats.getByRole("heading", { name: "Its grammar" })).toBeVisible();
  await expect(stats.getByRole("heading", { name: "Case" })).toBeVisible();
  // each bar says what it stands for, for those who cannot see it
  const bar = stats.locator("li[aria-label]").first();
  await expect(bar).toHaveAttribute("aria-label", /results? in [\d,]+ words, [\d.]+ per 10,000/);
  await stats.getByRole("radio", { name: "Number of results" }).click();
  await expect(stats.getByRole("radio", { name: "Number of results" })).toBeChecked();
});

test("near another word keeps only the results with it close by", async ({ page }) => {
  await page.goto(`/search?m=lemma&q=${DIKE}&a=tlg0012`);
  await expect(page.getByText(/results? in/).first()).toBeVisible({ timeout: 60_000 });
  const all = await count(page);
  const near = page.locator("form").filter({ has: page.getByText("Near another word") });
  await near.getByRole("textbox").fill("θεός");
  await near.getByRole("combobox").selectOption("p");
  await near.getByRole("button", { name: "Find them together" }).click();
  await expect(page).toHaveURL(new RegExp(`n=${THEOS}`, "i"));
  await expect(page.getByText(/^Only results with/)).toBeVisible({ timeout: 60_000 });
  const some = await count(page);
  expect(some).toBeGreaterThan(0);
  expect(some).toBeLessThan(all);
});

for (const scheme of ["light", "dark"] as const) {
  test(`the concordance and statistics pass the accessibility checks (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    for (const v of ["conc", "stats"]) {
      await page.goto(`/search?m=lemma&q=${DIKE}&a=tlg0059&v=${v}`);
      const region = page.getByRole("region", { name: v === "conc" ? "Concordance" : "Statistics" });
      await expect(v === "conc" ? region.getByText(/Showing \d+ of/) : region.getByRole("heading", { name: "In each work" })).toBeVisible({ timeout: 60_000 });
      await page.waitForTimeout(700);   // the bars finish growing
      const r = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(r.violations.map((x) => `${v} ${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    }
  });
}

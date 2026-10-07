import { test, expect } from "@playwright/test";

// Passages a translation leaves out are said to be untranslated (not a fault), and translations that number or
// divide their text differently still stand beside the right Greek. Needs a connection (texts from GitHub).
test.describe.configure({ timeout: 90_000 });

test("a page the translation does not cover says so, and so does a single verse it leaves out", async ({ page }) => {
  // Ottley's Isaiah stops before chapter 24
  await page.goto("/read?w=tlg0527.tlg048&ed=1st1K-grc1&tr=1st1K-eng1&at=24.1");
  const note = page.getByRole("note", { name: "About the translation on this page" });
  await expect(note).toContainText("This page has no English translation.", { timeout: 30_000 });
  await expect(note).toContainText("It is not a bug");
  await expect(page.getByText("This translation leaves this passage out.").first()).toBeVisible();
  // Luke 17:36 is in the Greek but not in the World English Bible
  await page.goto("/read?w=tlg0031.tlg003&at=17.36");
  await expect(page.getByRole("note", { name: "About the translation on this page" })).toContainText("Some passages on this page have no English.", { timeout: 30_000 });
  await expect(page.locator('[data-key="17.36"] [data-untranslated]')).toBeVisible();
  // English only: the left-out verse still says why it is empty
  await page.getByRole("radio", { name: "English", exact: true }).click();
  await expect(page.locator('[data-key="17.36"] [data-untranslated]')).toBeVisible();
});

test("the Septuagint Psalms, Andocides and Euclid stand beside the right English", async ({ page }) => {
  await page.goto("/read?w=tlg0527.tlg027&at=22.1");
  await expect(page.locator('[data-key="22.1"]')).toContainText("Yahweh is my shepherd", { timeout: 30_000 });
  await page.goto("/read?w=tlg0027.tlg001&at=6");
  await expect(page.locator('[data-key="6"] [data-tr]')).toContainText(/\w{4}/, { timeout: 30_000 });
  await expect(page.getByRole("note", { name: "About the translation on this page" })).toHaveCount(0);
  await page.goto("/read?w=tlg1799.tlg001&at=10.def2.1");
  const def = page.locator('[data-key="10.def2.1"] [data-tr]');
  await expect(def).toBeVisible({ timeout: 30_000 });
  await expect(def).not.toContainText("Not translated");
  await expect(def).not.toHaveText("—");
});

test("a translation numbered out of step is offered after the others and says so; a misnumbered stretch is corrected", async ({ page }) => {
  // Lucian's Demonax opens with Fowler's English, which lines up; Harmon's says it is out of step
  await page.goto("/read?w=tlg0062.tlg008&at=30");
  await expect(page.locator('[data-key="30"]')).toContainText("Cethegus", { timeout: 30_000 });
  await page.goto("/read?w=tlg0062.tlg008&tr=perseus-eng2&at=30");
  await expect(page.getByRole("note", { name: "About the translation on this page" })).toContainText("numbered out of step", { timeout: 30_000 });
  // the Trial in the Court of Vowels: Cadmus and Palamedes beside their Greek
  await page.goto("/read?w=tlg0062.tlg014&at=5");
  await expect(page.locator('[data-key="5"]')).toContainText("Cadmus", { timeout: 30_000 });
});

import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

// Research notebooks: gather a passage from the reader, a concordance line and a difference between editions,
// then cite, order, annotate and download them in the Treasury. Needs a connection (texts from GitHub).
test.describe.configure({ timeout: 150_000 });

test("gather from the reader, the concordance and a comparison, then cite and download in the Treasury", async ({ page }) => {
  // a passage, from the reader's passage actions, into a new notebook
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await page.locator('[data-row="1.1"]').click();
  await page.getByRole("toolbar", { name: "Passage actions" }).getByRole("button", { name: "Notebook" }).click();
  const pick = page.getByRole("dialog", { name: /Add this passage to a notebook/ });
  await pick.getByLabel("Start your first notebook").fill("Wrath and justice");
  await pick.getByRole("button", { name: "Create and add" }).click();
  await expect(pick).toBeHidden();
  await expect(page.getByText("Added 1 thing to “Wrath and justice”.")).toBeVisible();

  // a concordance line
  await page.goto(`/search?m=lemma&q=${encodeURIComponent("δίκη")}&a=tlg0059&v=conc`);
  const conc = page.getByRole("region", { name: "Concordance" });
  await expect(conc.getByText(/Showing \d+ of/)).toBeVisible({ timeout: 60_000 });
  await conc.locator("ol > li").first().getByRole("button", { name: /to a notebook/ }).click();
  await page.getByRole("dialog", { name: /Add this line/ }).getByRole("button", { name: /Wrath and justice/ }).click();
  await expect(page.getByText("Added 1 thing to “Wrath and justice”.")).toBeVisible();

  // a difference between two editions
  await page.goto("/read?w=tlg0085.tlg005&ed=perseus-grc2&cmp=1st1K-grc1&at=80");
  const bar = page.getByRole("region", { name: "Comparing two editions" });
  await expect(bar).toContainText("in the whole text", { timeout: 60_000 });
  await bar.getByRole("button", { name: "List them all" }).click();
  await page.getByRole("complementary", { name: "Differences between the editions" }).getByRole("button", { name: "Add 87 to a notebook" }).click();
  await page.getByRole("dialog", { name: /Add this difference/ }).getByRole("button", { name: /Wrath and justice/ }).click();
  await expect(page.getByText("Added 1 thing to “Wrath and justice”.")).toBeVisible();

  // the Treasury: the notebook, cited
  await page.goto("/treasury?s=notebooks");
  await page.getByRole("button", { name: /Wrath and justice/ }).click();
  const items = page.locator("ol > li").filter({ has: page.getByRole("button", { name: "Move up" }) });
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText("Il. 1.1");
  await expect(items.nth(0)).toContainText("μῆνιν");
  await expect(items.nth(1)).toContainText("Pl. Lg.");
  await expect(items.nth(2)).toContainText("A. Ag. 87");
  await expect(items.nth(2)).toContainText("πευθοῖ");
  // a note, a paragraph of one's own moved to the top, and the Chicago style
  await items.nth(0).getByLabel("Your note on this").fill("The first word is wrath.");
  await page.getByRole("button", { name: "Add a paragraph of your own" }).click();
  await items.nth(3).getByLabel("Your paragraph").fill("Why does the Iliad begin with anger?");
  for (let i = 0; i < 3; i++) await items.nth(3 - i).getByRole("button", { name: "Move up" }).click();
  await expect(items.nth(0).getByLabel("Your paragraph")).toHaveValue("Why does the Iliad begin with anger?");
  await page.getByRole("combobox", { name: "Citation style" }).selectOption("chicago");
  await expect(items.nth(1)).toContainText("urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1");
  // Markdown, as downloaded
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Markdown" }).click()]);
  const md = readFileSync((await dl.path())!, "utf8");
  expect(md).toMatch(/^# Wrath and justice\n\nWhy does the Iliad begin with anger\?/);
  expect(md).toContain("The first word is wrath.");
  expect(md).toContain("## Editions cited");
  // the notebook travels in the Treasury's own file
  const [file] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download my Treasury" }).click()]);
  const html = readFileSync((await file.path())!, "utf8");
  expect(html).toContain("<h2>Notebooks</h2>");
  expect(html).toContain('"notebooks":[{');
  // and the page passes the accessibility checks
  const r = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(r.violations.map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
});

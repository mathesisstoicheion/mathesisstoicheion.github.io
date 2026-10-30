import { test, expect, type Page } from "@playwright/test";
import { openAa } from "./reader-menus";

// Which columns show: the reader's saved choice (Aa), the same for every book. A book opens on its Greek alone, and a book with
// no translation always shows its Greek (the quiet desk, ticket 07). Needs a connection (texts from GitHub).
test.describe.configure({ timeout: 90_000 });

// the columns are a choice in Aa, at the foot of the page (the quiet desk, ticket 09): Aa is opened first, as a reader does
const columns = async (page: Page) => (await openAa(page)).getByRole("radiogroup", { name: "Columns" });

test("a book opens on Greek alone; Both and English only are choices that stay, and a book with no translation always shows its Greek", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  const row = page.locator('[data-key="1.1"]').first();
  await expect(row).toBeVisible({ timeout: 30_000 });
  // Greek alone, with no English column
  await expect((await columns(page)).getByRole("radio", { name: "Greek" })).toBeChecked();
  await expect(row.locator("[data-u] [data-w]").first()).toBeVisible();
  await expect(row.locator("[data-tr]")).toBeHidden();

  // English only: the Greek is put away
  await (await columns(page)).getByRole("radio", { name: "English" }).click();
  await expect(row.locator("[lang=grc]").first()).toBeHidden();
  await expect(row.locator("[data-tr]")).toBeVisible();

  // a book with no translation: its Greek shows
  await page.goto("/read?w=tlg0545.tlg003");
  const first = page.locator("article [data-key]").first();
  await expect(first).toBeVisible({ timeout: 30_000 });
  await expect(first.locator("[data-u] [data-w]").first()).toBeVisible();
  await expect((await columns(page)).getByRole("radio", { name: "Greek" })).toBeChecked();

  // back to the first book: the choice of English only was kept; now Both, which is kept in turn
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(row).toBeVisible({ timeout: 30_000 });
  await expect((await columns(page)).getByRole("radio", { name: "English" })).toBeChecked();
  await (await columns(page)).getByRole("radio", { name: "Both" }).click();
  await expect(row.locator("[data-u] [data-w]").first()).toBeVisible();
  await expect(row.locator("[data-tr]")).toBeVisible();
  await page.reload();
  await expect(row).toBeVisible({ timeout: 30_000 });
  await expect((await columns(page)).getByRole("radio", { name: "Both" })).toBeChecked();
  await expect(row.locator("[data-tr]")).toBeVisible();
});

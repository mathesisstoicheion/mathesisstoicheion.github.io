import { test, expect } from "@playwright/test";

// Which columns show: chosen for the book being read. Every book opens with its Greek and the translation side
// by side, and a book with no translation always shows its Greek. Needs a connection (texts from GitHub).
test.describe.configure({ timeout: 90_000 });

test("English only for one book does not leave a Greek-only book empty, nor carry over to the next", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  const row = page.locator('[data-key="1.1"]').first();
  await expect(row).toBeVisible({ timeout: 30_000 });
  await page.getByRole("radiogroup", { name: "Columns" }).first().getByRole("radio", { name: "English" }).click();
  await expect(row.locator("[lang=grc]").first()).toBeHidden();
  await expect(row.locator("[data-tr]")).toBeVisible();

  // a book with no translation: its Greek shows
  await page.goto("/read?w=tlg0545.tlg003");
  const first = page.locator("article [data-key]").first();
  await expect(first).toBeVisible({ timeout: 30_000 });
  await expect(first.locator("[data-u] [data-w]").first()).toBeVisible();
  await expect(page.getByRole("radiogroup", { name: "Columns" }).first().getByRole("radio", { name: "Greek" })).toBeChecked();

  // back to the first book: Greek and English side by side again
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(row).toBeVisible({ timeout: 30_000 });
  await expect(row.locator("[data-u] [data-w]").first()).toBeVisible();
  await expect(row.locator("[data-tr]")).toBeVisible();
  await expect(page.getByRole("radiogroup", { name: "Columns" }).first().getByRole("radio", { name: "Both" })).toBeChecked();
});

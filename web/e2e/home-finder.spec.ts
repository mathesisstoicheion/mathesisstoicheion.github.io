import { test, expect } from "@playwright/test";

// The home page (design A, 2026-10-19) has no search of its own: the library's, at the top of its page, finds the works.
test("the Library opens with the search it was handed", async ({ page }) => {
  await page.goto("/library?q=odyssey");
  await expect(page.getByRole("searchbox", { name: "Search the library" })).toHaveValue("odyssey");
  await expect(page.locator("#author-tlg0012")).toBeVisible();
});

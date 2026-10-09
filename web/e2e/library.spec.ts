import { test, expect } from "@playwright/test";

test("the library opens with its search, and lists authors who open to show their works", async ({ page }) => {
  await page.goto("/library");
  const search = page.getByRole("searchbox", { name: "Search the library" });
  const first = page.locator("section[id^=lib-]").first();
  await expect(first).toBeVisible();
  // the search comes before everything else in the list
  expect((await search.boundingBox())!.y).toBeLessThan((await first.boundingBox())!.y);
  // an author is one row, closed, that says who they were and how many works there are
  const aristotle = page.locator("#author-tlg0086");
  const row = aristotle.getByRole("button", { name: /^Aristotle/ });
  await expect(row).toHaveAttribute("aria-expanded", "false");
  await expect(row).toContainText("Greek philosopher");
  await expect(row).toContainText("48 works");
  await expect(aristotle.getByRole("link", { name: /^Poetics/ })).toHaveCount(0);
  // clicking the name opens the works in place, those with English first; the author's page is a link inside
  await row.click();
  await expect(row).toHaveAttribute("aria-expanded", "true");
  await expect(aristotle.getByRole("heading", { name: /With English beside the Greek/ })).toBeVisible();
  await expect(aristotle.getByRole("link", { name: /^Poetics/ })).toHaveAttribute("href", /\/read\?w=tlg0086\./);
  await expect(page).toHaveURL(/\/library$/);
  await expect(aristotle.getByRole("link", { name: /^About Aristotle/ })).toHaveAttribute("href", "/library/author?a=tlg0086");
  await row.click();
  await expect(row).toHaveAttribute("aria-expanded", "false");
});

test("a search marks what matched, and offers the authors it names first", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("searchbox", { name: "Search the library" }).fill("aristot");
  const hits = page.getByRole("button", { name: /^Aristotle \d+$/ });
  await expect(hits).toBeVisible();
  await expect(page.locator("#author-tlg0086 mark").first()).toHaveText("Aristot");
  // matching authors are open, and "where to begin" steps aside
  await expect(page.locator("#author-tlg0086").getByRole("button", { name: /^Aristotle/ })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Not sure where to begin?")).toBeHidden();
  await hits.click();
  await expect(page.locator("#author-tlg0086")).toBeInViewport();
});

test("the library sorts by title and by period, and jumps to a letter", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("radio", { name: "Title A–Z" }).click();
  await expect(page.locator("#lib-I").getByRole("link", { name: /^Iliad.*Homer/ })).toBeAttached();
  await page.getByRole("navigation", { name: "Jump to a letter" }).getByRole("button", { name: "O", exact: true }).click();
  await expect(page.locator("#lib-O")).toBeInViewport();
  await page.getByRole("radio", { name: "By period" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^Archaic/ })).toBeVisible();
});

test("the genre chips count and filter, and a long list of works folds", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("button", { name: /^Drama \d+/ }).click();
  await expect(page.locator("#author-tlg0011")).toBeVisible();      // Sophocles
  await expect(page.locator("#author-tlg0012")).toHaveCount(0);     // Homer wrote no drama
  await expect(page.getByText(/of 1,\d{3} works/)).toBeVisible();
  // while a filter narrows the list, the authors stand open
  await expect(page.locator("#author-tlg0011").getByRole("link", { name: /^Antigone/ })).toBeVisible();
  await page.getByRole("button", { name: "Show everything" }).click();
  await expect(page.locator("#author-tlg0011").getByRole("link", { name: /^Antigone/ })).toHaveCount(0);
  // "Open every author" opens them all, and closes them again
  await page.getByRole("button", { name: "Open every author" }).click();
  await expect(page.locator("#author-tlg0059").getByRole("link", { name: /^Apology/ })).toBeVisible();
  await page.getByRole("button", { name: "Close every author" }).click();
  await expect(page.locator("#author-tlg0059").getByRole("link", { name: /^Apology/ })).toHaveCount(0);
});

test("wiki categories have their signs, and the featured entry its picture or sign", async ({ page }) => {
  await page.goto("/stoa");
  await expect(page.locator("#people svg")).toBeVisible();
  const featured = page.getByRole("link", { name: /On the wall today/ });
  await expect(featured.locator("img, svg").first()).toBeVisible();
});

test("the map and the Town Hall put their search first", async ({ page }) => {
  await page.goto("/stoa/periplus");
  const find = page.getByRole("searchbox", { name: "Find a place" });
  const map = page.getByRole("application");
  expect((await find.boundingBox())!.y).toBeLessThan((await map.boundingBox())!.y);
  await page.goto("/town-hall");
  const hall = page.getByRole("searchbox", { name: "Search the Town Hall" });
  const cats = page.getByRole("navigation", { name: "Categories" });
  expect((await hall.boundingBox())!.y).toBeLessThan((await cats.boundingBox())!.y);
});

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

test("the search and the filters are kept in the address, so Back and shared links return to the same list", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("searchbox", { name: "Search the library" }).fill("odyssey");
  await page.getByRole("radio", { name: "With translation" }).click();
  await expect(page).toHaveURL(/[?&]q=odyssey/);
  await expect(page).toHaveURL(/[?&]tr=with/);
  await page.goto("/library?q=medea&tr=greek");
  await expect(page.getByRole("searchbox", { name: "Search the library" })).toHaveValue("medea");
  await expect(page.getByRole("radio", { name: "Greek only" })).toHaveAttribute("aria-checked", "true");
});

test("arrow keys move between the authors, and the best-known work comes first", async ({ page }) => {
  await page.goto("/library");
  const first = page.locator("[data-author-row]").first();
  await first.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("[data-author-row]").nth(1)).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator("[data-author-row]").last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
  // Plato's Republic leads his works, marked as his best known; each work gives its length in words
  const plato = page.locator("#author-tlg0059");
  await plato.getByRole("button", { name: /^Plato/ }).click();
  await expect(plato.locator("ul li").first()).toContainText("Republic");
  await expect(plato.locator("ul li").first()).toContainText("Best known");
  await expect(plato.getByText(/^about [\d,]+ words$/).first()).toBeVisible();
});

test("a book in progress is offered above the list and leads its author's works", async ({ page }) => {
  await page.goto("/library");
  await page.evaluate(() => localStorage.setItem("mathesis:positions", JSON.stringify({ "tlg0012.tlg002": { ed: "", tr: null, at: "5.1", t: Date.now() } })));
  await page.reload();
  const now = page.getByRole("group", { name: "Your books in progress" });
  await expect(now.getByRole("link", { name: /Odyssey/ })).toHaveAttribute("href", "/read?w=tlg0012.tlg002&at=5.1");
  const homer = page.locator("#author-tlg0012");
  await homer.getByRole("button", { name: /^Homer/ }).click();
  await expect(homer.locator("ul li").first()).toContainText("Reading · at 5.1");
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

test("authors are found by their other names and their Greek name, and Latin labels read in English", async ({ page }) => {
  await page.goto("/library");
  const search = page.getByRole("searchbox", { name: "Search the library" });
  // Wikidata's other names: Aristoteles, and the Greek Ἀριστοτέλης typed without accents
  await search.fill("aristoteles");
  await expect(page.locator("#author-tlg0086")).toContainText("also called Aristoteles");
  await search.fill("αριστοτελης");
  await expect(page.locator("#author-tlg0086").getByRole("button", { name: /^Aristotle/ })).toBeVisible();
  // a Latin label is shown in English, with the Latin beside it, and either finds it
  await search.fill("vitae homeri");
  const lives = page.locator("#author-tlg1805");
  await expect(lives.getByRole("button", { name: /^Lives of Homer/ })).toBeVisible();
  await expect(lives).toContainText("Vitae Homeri");
});

test("a shelf of famous works opens the library, each with how hard its words are", async ({ page }) => {
  await page.goto("/library");
  const shelf = page.getByRole("region", { name: /Famous works/ });
  await expect(shelf.getByRole("link", { name: /Ἰλιάς.*Iliad.*Homer/ })).toHaveAttribute("href", "/read?w=tlg0012.tlg001");
  await expect(shelf.locator("[data-level]").first()).toBeVisible();
  // it steps aside while a search narrows the list
  await page.getByRole("searchbox", { name: "Search the library" }).fill("medea");
  await expect(shelf).toHaveCount(0);
});

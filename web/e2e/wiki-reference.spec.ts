import { test, expect } from "@playwright/test";

test("the Wiki front offers the reference pages as the colonnade's last panel", async ({ page }) => {
  await page.goto("/stoa");
  const ref = page.getByRole("navigation", { name: "Reference" });
  await expect(ref.getByRole("link", { name: /Authors/ })).toBeVisible();
  await expect(ref.getByRole("link", { name: /Eras of Greek/ })).toBeVisible();
  await expect(ref.getByRole("link", { name: /Editions & translations/ })).toBeVisible();
  await expect(ref.getByRole("link", { name: /The lyre/ })).toBeVisible();
  await expect(ref.getByRole("link")).toHaveCount(6);
  // it is a panel of the colonnade, like the categories
  await expect(page.locator("ol > li#reference")).toBeAttached();
});

test("the Kerameikos article has an address of its own, apart from the Archaeology page", async ({ page }) => {
  // the colonnade's line opens the article, not the Archaeology page it used to be hidden behind
  await page.goto("/stoa");
  await expect(page.locator("#archaeology").getByRole("link", { name: "The Kerameikos" })).toHaveAttribute("href", "/stoa/kerameikos-cemetery");
  await page.goto("/stoa/kerameikos-cemetery");
  await expect(page.getByRole("heading", { level: 2, name: "Potters and a hero" })).toBeVisible();
  // and so does the card in the Archaeology page's "Great sites"
  await page.goto("/stoa/kerameikos");
  await expect(page.locator("#sites").getByRole("link", { name: /The Kerameikos/ })).toHaveAttribute("href", "/stoa/kerameikos-cemetery");
});

test("the Explore door leads with the map, the Census and Archaeology, drawn from the site's own data", async ({ page }) => {
  await page.goto("/stoa");
  const lead = page.getByRole("navigation", { name: "Explore the Greek world" });
  const links = lead.getByRole("link");
  await expect(links).toHaveCount(3);
  expect(await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(["/stoa/periplus", "/stoa/census", "/stoa/kerameikos"]);
  // the map names the most-named towns; the Census card shows its real top god
  await expect(lead.locator("svg text", { hasText: "Athens" })).toHaveCount(1);
  await expect(lead.getByText("Ζεύς")).toBeVisible();
  // it comes first, above the search; the search sits on the colonnade, whose place the results take while one is typed
  const search = page.getByRole("searchbox", { name: "Search the Painted Stoa" });
  expect((await lead.boundingBox())!.y).toBeLessThan((await search.boundingBox())!.y);
  await expect(page.locator("#people")).toBeAttached();
  await search.fill("melos");
  await expect(page.locator("#people")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /The Melian Dialogue/ }).first()).toBeVisible();
  await expect(lead).toHaveCount(1);
});

test("the Authors index groups by period, filters by period and kind, and opens an author", async ({ page }) => {
  await page.goto("/stoa/authors");
  await expect(page.getByRole("heading", { level: 1, name: /^Authors/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Archaic" })).toBeVisible();
  // a link's filters are applied: Classical drama is Aeschylus, Sophocles, Euripides and the like, and not Homer
  await page.goto("/stoa/authors?e=classical&k=Drama");
  await expect(page.getByRole("link", { name: /^Sophocles/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Homer/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Classical \d+/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: /^Sophocles/ }).click();
  await expect(page).toHaveURL(/\/library\/author\?a=tlg0011/);
  await expect(page.getByRole("heading", { level: 1, name: "Sophocles" })).toBeVisible();
  await expect(page.getByText("From Wikidata")).toBeVisible();
});

test("the Authors index searches by name and says when nothing matches", async ({ page }) => {
  await page.goto("/stoa/authors");
  const search = page.getByRole("searchbox", { name: "Search authors" });
  await search.fill("plutarch");
  await expect(page.getByRole("link", { name: /^Plutarch/ })).toBeVisible();
  await search.fill("zzzzqq");
  await expect(page.getByText("No author matches")).toBeVisible();
});

test("Eras of Greek draws a column for each century and a section for each period", async ({ page }) => {
  await page.goto("/stoa/eras");
  await expect(page.getByRole("heading", { level: 2, name: "Greek through the centuries" })).toBeVisible();
  await expect(page.locator("li[aria-label^='5th c. BC']")).toBeAttached();
  await expect(page.locator("li[aria-label^='2nd c. AD']")).toBeAttached();
  for (const era of ["Archaic", "Classical", "Hellenistic", "Roman Imperial", "Late Antique", "Byzantine"]) {
    await expect(page.getByRole("heading", { level: 2, name: era, exact: true })).toBeVisible();
  }
  // each period's bracket under the chart is a link to its card
  await expect(page.locator("a[href='#classical']").first()).toBeVisible();
  // a period's kinds of writing, folded away until asked for, lead to the Authors index, filtered
  await expect(page.locator("#classical").getByRole("link", { name: /^Drama/ })).toBeHidden();
  await page.locator("#classical").getByText("Kinds of writing and dialects").click();
  await page.locator("#classical").getByRole("link", { name: /^Drama/ }).click();
  await expect(page).toHaveURL(/\/stoa\/authors\?e=classical&k=Drama/);
  await expect(page.getByRole("link", { name: /^Sophocles/ })).toBeVisible();
});

test("Editions & translations groups texts by publisher and opens the exact text in the reader", async ({ page }) => {
  await page.goto("/stoa/editions");
  await expect(page.getByRole("heading", { level: 1, name: /^Editions & translations/ })).toBeVisible();
  await expect(page.getByText(/Loeb Classical Library/).first()).toBeVisible();
  await page.getByRole("searchbox", { name: /Search editions/ }).fill("Butler Odyssey");
  const row = page.getByRole("link", { name: /Homer, Odyssey.*Translation/ }).first();
  await expect(row).toBeVisible();
  await row.click();
  await expect(page).toHaveURL(/\/read\?w=tlg0012\.tlg002&tr=/);
});

test("Manuscripts & transmission and Textual variants gather the checked author articles' accounts", async ({ page }) => {
  await page.goto("/stoa");
  const ref = page.getByRole("navigation", { name: "Reference" });
  await ref.getByRole("link", { name: /Manuscripts & transmission/ }).click();
  await expect(page).toHaveURL(/\/stoa\/manuscripts$/);
  await expect(page.getByRole("heading", { level: 1, name: /Manuscripts & transmission/ })).toBeVisible();
  // the roads of the texts: one row per checked author, in time order, Homer first
  const chart = page.getByRole("figure", { name: /timelines of \d+ author articles/ });
  await expect(chart.locator("ol li").first()).toContainText("Homer");
  // the key stands above the chart (with the years), not below its last row
  expect((await chart.locator("ul").first().boundingBox())!.y).toBeLessThan((await chart.locator("ol").first().boundingBox())!.y);
  // each author's account links to the whole of it, on the author's page
  const homer = page.getByRole("link", { name: /^7th century BC Homer/ });
  await expect(homer).toHaveAttribute("href", "/author/tlg0012#survive-title");
  await page.goto("/stoa/variants");
  await expect(page.getByRole("heading", { level: 1, name: /Textual variants/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Herodotus/ }).first()).toHaveAttribute("href", "/author/tlg0016#survive-title");
  // no markup left in the excerpts
  expect(await page.locator("main ol").first().innerText()).not.toMatch(/\*|\[\^/);
});

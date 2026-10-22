import { test, expect, type Page } from "@playwright/test";
import { FORUM_OPEN } from "../src/config/areas";

/** The filters wait behind one button beside the order, over the list (the printed page's library): open them. */
async function openFilters(page: Page) {
  const b = page.getByRole("button", { name: /^Filters/ });
  if ((await b.getAttribute("aria-expanded")) !== "true") await b.click();
}

test("the library opens with its search, and lists authors who open to show their works", async ({ page }) => {
  await page.goto("/library?sort=author");   // one plain A to Z list: each author once, with all their works
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
  await expect(page).toHaveURL(/\/library\?sort=author$/);
  await expect(aristotle.getByRole("link", { name: /^About Aristotle/ })).toHaveAttribute("href", "/library/author?a=tlg0086");
  await row.click();
  await expect(row).toHaveAttribute("aria-expanded", "false");
});

test("the search and the filters are kept in the address, so Back and shared links return to the same list", async ({ page }) => {
  await page.goto("/library");
  await page.getByRole("searchbox", { name: "Search the library" }).fill("odyssey");
  await page.getByRole("radiogroup", { name: "Show" }).getByRole("radio", { name: "With English" }).click();
  await expect(page).toHaveURL(/[?&]q=odyssey/);
  await expect(page).toHaveURL(/[?&]tr=with/);
  await page.goto("/library?q=medea&tr=greek");
  await expect(page.getByRole("searchbox", { name: "Search the library" })).toHaveValue("medea");
  await expect(page.getByRole("radiogroup", { name: "Show" }).getByRole("radio", { name: "Greek only" })).toHaveAttribute("aria-checked", "true");
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
  // matching authors are open
  await expect(page.locator("#author-tlg0086").getByRole("button", { name: /^Aristotle/ })).toHaveAttribute("aria-expanded", "true");
  await hits.click();
  await expect(page.locator("#author-tlg0086")).toBeInViewport();
});

test("a search that names one author puts that author first, opened, as the best match; the rest stay in their kinds", async ({ page }) => {
  await page.goto("/library");
  const search = page.getByRole("searchbox", { name: "Search the library" });
  await openFilters(page);
  const chips = page.getByRole("group", { name: "Kind of writing" }).getByRole("button");
  await expect(chips.first()).toBeVisible();
  const all = await chips.count();
  await search.fill("plato");
  const sections = page.locator("section[id^=lib-]");
  await expect(sections.first()).toHaveAttribute("id", "lib-best");
  await expect(sections.first().getByRole("heading", { name: "Best match" })).toBeVisible();
  await expect(sections.first().locator("#author-tlg0059").getByRole("button", { name: /^Plato/ })).toHaveAttribute("aria-expanded", "true");
  await expect(sections.nth(1)).toHaveAttribute("id", /^lib-[a-z-]+$/);   // then the kinds of writing, as before
  // while a search is on, the kinds of writing with nothing left in them are not offered
  await expect.poll(() => chips.count()).toBeLessThan(all);
  // two authors equally close (no one in particular) lead nothing
  await search.fill("anonymous");
  await expect(page.locator("#lib-best")).toHaveCount(0);
});

test("the library sorts by title and by period, and jumps to a letter", async ({ page }) => {
  await page.goto("/library");
  await openFilters(page);
  await page.getByRole("radio", { name: "Titles A–Z" }).click();
  await expect(page.locator("#lib-I").getByRole("link", { name: /^Iliad.*Homer/ })).toBeAttached();
  // the rail of letters down the right of the list (AZList.tsx) follows the order in use
  await page.getByRole("navigation", { name: "Titles by first letter" }).getByRole("button", { name: "Titles beginning with O" }).click();
  await expect(page.locator("#lib-O")).toBeInViewport();
  await page.getByRole("radio", { name: "By period" }).click();
  await expect(page.getByRole("navigation", { name: /by first letter/ })).toHaveCount(0);   // periods have no letters, so no rail
  await expect(page.getByRole("heading", { level: 3, name: /^Archaic/ })).toBeVisible();
});

test("the genre chips count and filter, and a long list of works folds", async ({ page }) => {
  await page.goto("/library");
  await openFilters(page);
  await page.getByRole("button", { name: /^Drama \d+/ }).click();
  await expect(page.locator("#author-tlg0011")).toBeVisible();      // Sophocles
  await expect(page.locator("#author-tlg0012")).toHaveCount(0);     // Homer wrote no drama
  await expect(page.getByText(/of 1,\d{3} works/).first()).toBeVisible();
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

test("the map and the Agora put their search first", async ({ page }) => {
  await page.goto("/stoa/periplus");
  const find = page.getByRole("searchbox", { name: "Find a place" });
  const map = page.getByRole("application");
  expect((await find.boundingBox())!.y).toBeLessThan((await map.boundingBox())!.y);
  if (!FORUM_OPEN) return;
  await page.goto("/town-hall");
  // the Agora's search stands in the toolbar, straight above the list it narrows
  const hall = page.getByRole("searchbox", { name: "Search the Agora" });
  const list = page.locator("#threads-h");
  await expect(hall).toBeVisible();
  await expect(list).toBeVisible();
  expect((await hall.boundingBox())!.y).toBeLessThan((await list.boundingBox())!.y);
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

test("the library opens with its search and the famous books, then the order and filters standing on the list", async ({ page }) => {
  await page.goto("/library");
  const search = page.getByRole("searchbox", { name: "Search the library" });
  await expect(search).toBeVisible();
  const famous = page.getByRole("region", { name: "Famous books to begin with" });
  await expect(famous.getByRole("link", { name: /Iliad/ }).first()).toHaveAttribute("href", "/read?w=tlg0012.tlg001");
  // the order and the filters come straight before the list they narrow
  const list = page.getByRole("region", { name: "Every work in the library" });
  await expect(list.getByRole("radiogroup", { name: "Order" })).toBeVisible();
  await openFilters(page);
  await expect(list.getByRole("group", { name: "Kind of writing" })).toBeVisible();
  await expect(list.locator("#lib-epic")).toBeAttached();
  // while a search is on, the famous books stand aside, so the list comes up right under the search
  await page.goto("/library?q=medea");
  await expect(famous).toHaveCount(0);
  await expect(search).toHaveValue("medea");
  await expect(list).toBeInViewport();
});

test("\"Not sure where to begin?\" follows the famous books, open on a first visit, and stays shut once shut", async ({ page }) => {
  await page.goto("/library");
  const begin = page.locator("details", { hasText: "Not sure where to begin?" });
  // after the famous books (the printed page: search, then the famous books, then the ways in), and open
  expect(await begin.evaluate((d) => !!(d.compareDocumentPosition(document.querySelector('[aria-label="Famous books to begin with"]') ?? document.body) & Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
  await expect(begin.getByRole("heading", { level: 4 })).toHaveCount(6);
  await begin.getByText("Not sure where to begin?").click();
  await expect(begin.getByRole("heading", { name: "First steps in Greek prose" })).toBeHidden();
  await page.reload();
  await expect(page.locator("details", { hasText: "Not sure where to begin?" }).getByRole("heading", { name: "First steps in Greek prose" })).toBeHidden();
  await begin.getByText("Not sure where to begin?").click();
  // the first level starts with it, and so does the first path
  await expect(begin.getByRole("link", { name: "Lysias, On the Murder of Eratosthenes" }).first()).toHaveAttribute("href", "/read?w=tlg0540.tlg001");
});

test("the catalogue is grouped by kind, authors A to Z inside each; a switch gives one plain A to Z list", async ({ page }) => {
  await page.goto("/library");
  const list = page.getByRole("region", { name: "Every work in the library" });
  const order = list.getByRole("radiogroup", { name: "Order" });
  await expect(order.getByRole("radio", { name: "By kind" })).toHaveAttribute("aria-checked", "true");
  // the kinds in their order, each with its authors A to Z
  const drama = list.locator("#lib-drama");
  await expect(drama.getByRole("heading", { level: 3, name: /^Drama/ })).toBeVisible();
  const names = (await drama.locator("[data-author-row]").allInnerTexts()).map((t) => t.split("\n")[0].trim());
  expect(names.length).toBeGreaterThan(3);
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })));
  expect(await list.locator("section[id^=lib-]").evaluateAll((s) => s.map((e) => e.id).slice(0, 3))).toEqual(["lib-epic", "lib-lyric-and-elegy", "lib-drama"]);
  // an author who wrote in more than one kind stands in each, with the works of that kind
  await expect(list.locator("#lib-philosophy [data-author-row]", { hasText: /^Aristotle/ })).toHaveCount(1);
  await expect(list.locator("#lib-science-and-mathematics [data-author-row]", { hasText: /^Aristotle/ })).toHaveCount(1);
  // the switch: one plain A to Z list, kept in the address
  await order.getByRole("radio", { name: "Authors A–Z" }).click();
  await expect(page).toHaveURL(/[?&]sort=author/);
  await expect(list.locator("#lib-A")).toBeAttached();
  await expect(list.locator("#lib-drama")).toHaveCount(0);
});

test("on a computer, pointing at an author shows a plate in the margin, with its credit", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/library");
  const margin = page.getByRole("complementary", { name: "The plate of the work pointed at" });
  await expect(margin.locator("[data-photo]").first()).toBeVisible();
  await page.locator("#author-tlg0016 [data-author-row]").hover();   // Herodotus, his bust
  await expect(margin.locator(".plate-on [data-photo]")).toHaveAttribute("data-photo", "herodotos-bust");
  await expect(margin.locator("[data-credit]")).toHaveAttribute("data-credit", "herodotos-bust");
});

test("on a phone, each author and each famous book shows a small picture, and the margin plate is not drawn", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/library");
  await expect(page.getByRole("complementary", { name: "The plate of the work pointed at" })).toBeHidden();
  const famous = page.getByRole("region", { name: "Famous books to begin with" });
  await expect(famous.locator("a img[data-photo]").first()).toBeVisible();
  await expect(page.locator("#lib-history-and-biography h3 img[data-photo]")).toBeVisible();
  // the pictures' credits are in the page's list of plates
  const plates = page.getByRole("region", { name: "Plates" });
  await expect(plates.locator("[data-credit=herodotos-bust]")).toBeAttached();
});

import { test, expect } from "@playwright/test";

test("the Census ranks gods and heroes, and an item shows where it is mentioned", async ({ page }) => {
  await page.goto("/stoa/census");
  const ranking = page.getByRole("region", { name: "Gods and heroes in The whole library" });
  await expect(ranking.getByRole("button", { name: /^1 Ζεύς Zeus .*8,397/ })).toBeVisible();
  await ranking.getByRole("button", { name: /^1 Ζεύς/ }).click();
  await expect(page).toHaveURL(/[?&]i=/);
  await expect(page.getByRole("heading", { level: 2, name: "Ζεύς" })).toBeVisible();
  await expect(page.locator("header dl")).toContainText("words read");
  const more = page.getByRole("navigation", { name: "More about it" });
  await expect(more.getByRole("link", { name: "Word Study" })).toHaveAttribute("href", /\/treasury\/word\?l=/);
  await expect(more.getByRole("link", { name: /Every mention/ })).toHaveAttribute("href", /\/search\?m=lemma&q=/);
});

test("the Census filters by author, lists the rarest, and compares two side by side", async ({ page }) => {
  await page.goto("/stoa/census?c=place");
  await page.getByRole("button", { name: /^Where:/ }).click();
  await page.getByRole("combobox", { name: "Author" }).first().selectOption({ label: "Herodotus" });
  await expect(page).toHaveURL(/[?&]a=tlg0016/);
  await expect(page.getByRole("region", { name: "Places in Herodotus" }).getByRole("button", { name: /^1 Αἴγυπτος/ })).toBeVisible();
  await page.getByRole("button", { name: /Compare side by side/ }).click();
  await expect(page).toHaveURL(/[?&]cmp=1/);
  await expect(page.getByRole("region", { name: "Places in Homer" })).toBeVisible();

  // every word, the rarest first: words used once
  await page.goto("/stoa/census?c=words&o=least");
  const all = page.getByRole("region", { name: "All words in The whole library" });
  await expect(all).toContainText("119,708 words");
  await expect(all.locator("ol li").first()).toContainText(/\b1$/);
});

test("the Census searches, counts phrases, and pages through its findings in a window", async ({ page }) => {
  await page.goto("/stoa/census?c=words");
  await page.getByRole("searchbox", { name: /Find a word/ }).fill("λογος");
  await expect(page).toHaveURL(/[?&]q=/);
  await expect(page.getByRole("region", { name: "All words in The whole library" }).getByRole("button", { name: /^1 λόγος/ })).toBeVisible();

  await page.goto("/stoa/census?c=phrase");
  await expect(page.getByRole("region", { name: "Phrases in The whole library" }).getByRole("button", { name: /^1 ὦ ἄνδρες Ἀθηναῖοι/ })).toBeVisible();

  const y = await page.evaluate(() => { document.getElementById("facts-h")!.scrollIntoView(); return window.scrollY; });
  await page.getByRole("button", { name: /Open/ }).first().click();
  const win = page.getByRole("dialog", { name: "Did you know?" });
  await expect(win).toBeVisible();
  await expect(win.getByRole("tab", { name: "Finding 1", exact: true })).toHaveAttribute("aria-selected", "true");
  await win.getByRole("button", { name: "Next" }).click();
  await expect(win.getByRole("tab", { name: "Finding 2", exact: true })).toHaveAttribute("aria-selected", "true");
  await win.getByRole("button", { name: "Close" }).click();
  await expect(win).toBeHidden();
  // closing leaves the page where it was
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - y)).toBeLessThan(5);
  await expect(page.getByRole("heading", { name: "How the counting was done" })).toBeVisible();
});

test("the Census charts can be used from the keyboard alone", async ({ page }) => {
  await page.goto("/stoa/census");
  // the Coverage curve is a slider: reach it by focus, then move it with the arrow keys
  const slider = page.getByRole("slider", { name: "How many of the commonest words" });
  await slider.scrollIntoViewIfNeeded();
  await slider.focus();
  await expect(slider).toBeFocused();
  const before = Number(await slider.getAttribute("aria-valuenow"));
  await page.keyboard.press("ArrowRight");
  expect(Number(await slider.getAttribute("aria-valuenow"))).toBeGreaterThan(before);
  await page.keyboard.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "1");

  // a Moving map age button is operated with Enter, and says which age is chosen
  const second = page.getByRole("group", { name: "Age" }).getByRole("button").nth(1);
  await second.scrollIntoViewIfNeeded();
  await second.focus();
  await expect(second).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("aria-pressed", "true");
});

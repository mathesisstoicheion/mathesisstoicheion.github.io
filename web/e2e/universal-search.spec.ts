import { test, expect, type Page } from "@playwright/test";
import { headerButton } from "./header";

// The universal search (Quick search), its recent searches, and the typeface choice in Settings.
const open = async (page: Page) => {
  const box = page.getByRole("dialog", { name: "Quick search" });
  // the key does nothing until the page has started up, so press it until the box opens
  await expect(async () => {
    if (!(await box.isVisible())) await page.keyboard.press("/");
    await expect(box).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 20_000 });
  return box;
};

test("remembers recent searches, which can be forgotten one by one or all at once", async ({ page }) => {
  await page.goto("/");
  let box = await open(page);
  await box.getByRole("combobox").fill("Il. 1.1");
  await expect(box.getByRole("option").first()).toContainText("Iliad");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/read\?w=tlg0012\.tlg001/);
  await page.goto("/");
  box = await open(page);
  await box.getByRole("combobox").fill("symposi");
  await box.getByRole("option", { name: /The symposium/ }).click();
  await page.goto("/");
  box = await open(page);
  const recent = box.getByRole("region", { name: "Recent searches" });
  await expect(recent.getByRole("button", { name: "symposi", exact: true })).toBeVisible();
  await expect(recent.getByRole("button", { name: "Il. 1.1", exact: true })).toBeVisible();
  // a recent search fills the box again
  await recent.getByRole("button", { name: "Il. 1.1", exact: true }).click();
  await expect(box.getByRole("combobox")).toHaveValue("Il. 1.1");
  await box.getByRole("button", { name: "Clear the search" }).click();
  await box.getByRole("button", { name: "Forget “symposi”" }).click();
  await expect(recent.getByRole("button", { name: "symposi", exact: true })).toHaveCount(0);
  await box.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(box.getByRole("heading", { name: "Recent searches" })).toHaveCount(0);
});

test("finds a word's meaning, a place, a lesson, and does what is asked", async ({ page }) => {
  await page.goto("/");
  let box = await open(page);
  await box.getByRole("combobox").fill("μῆνις");
  await expect(box.getByRole("option", { name: /wrath/ })).toBeVisible();
  await expect(box.getByRole("option").first()).toContainText("wrath");

  // a place named exactly comes first, under its group's title "On the map"
  await box.getByRole("combobox").fill("sparta");
  await expect(box.getByRole("option").first()).toContainText("Σπάρτη");
  await expect(box.getByRole("group", { name: "On the map" }).getByRole("option").first()).toContainText("Sparta");

  await box.getByRole("combobox").fill("aorist");
  await expect(box.getByRole("option", { name: /The past: imperfect and aorist/ })).toBeVisible();

  await box.getByRole("combobox").fill("homer");
  await expect(box.getByRole("option").nth(0)).toContainText("Homer");
  await expect(box.getByRole("option").nth(1)).toContainText("Iliad");

  // "daylight" asks for the page in Paper (the printed page has Paper and Night, redesign SPEC.md 3.1)
  await box.getByRole("combobox").fill("daylight");
  await expect(box.getByRole("option").first()).toContainText("The page: Paper");
  await expect(box.getByRole("option", { name: /Search the Greek/ })).toHaveCount(0);
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "paper");
  box = page.getByRole("dialog", { name: "Quick search" });
  await expect(box).toBeVisible();
});

test("the Greek is always set in Gentium and the English in EB Garamond: Settings has no typeface to choose, and a saved Didot becomes Gentium", async ({ page }) => {
  // (the quiet desk, ticket 09, the owner, 2026-10-30: GFS Didot leaves the reading choices; titles keep it through their own variable)
  await page.goto("/");
  await (await headerButton(page, "Settings")).click();
  const settings = page.getByRole("dialog", { name: "Settings" });
  // the printed page has three typefaces and no fourth (redesign SPEC.md 3.2): neither the English nor the Greek is a choice
  await expect(settings.getByRole("radiogroup", { name: "English typeface" })).toHaveCount(0);
  await expect(settings.getByRole("radiogroup", { name: "Greek typeface" })).toHaveCount(0);
  // the page and the sizes are still there, with a sample of the Greek
  await expect(settings.getByRole("radiogroup", { name: "Page" })).toBeVisible();
  await expect(settings.locator("[lang=grc]").first()).toBeVisible();
  // the face a piece of Greek and the English around it are set in
  const faces = () => page.evaluate(() => {
    const g = document.createElement("span");
    g.lang = "grc";
    g.textContent = "λόγος";
    document.body.append(g);
    const out = [getComputedStyle(g).fontFamily, getComputedStyle(document.body).fontFamily];
    g.remove();
    return out;
  });
  expect(await faces()).toEqual([expect.stringMatching(/gentium/i), expect.stringMatching(/garamond/i)]);
  // a Didot saved before the quiet desk (settings version 3) is read as Gentium, before the first paint and after
  await page.evaluate(() => localStorage.setItem("mathesis:settings", JSON.stringify({ state: { greekFace: "didot", greekSize: 1.5 }, version: 3 })));
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-greek-face");
  expect((await faces())[0]).toMatch(/gentium/i);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings")!).state.greekFace)).toBe("gentium");
});

test("an unknown address shows the not-found page, with a way into the search", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("This page has not survived");
  await expect(page.getByRole("img", { name: /ΥΔ, 404 in Greek numerals/ })).toBeVisible();
  await page.getByRole("button", { name: "Search for what you were looking for" }).click();
  await expect(page.getByRole("dialog", { name: "Quick search" })).toBeVisible();
});

test("the reader names the book in the browser tab, and shows a Latin title beside its English one", async ({ page }) => {
  await page.goto("/read?w=tlg0085.tlg001&at=1");
  await expect(page).toHaveTitle("Suppliant Maidens · Aeschylus · Mathesis Stoicheion", { timeout: 30_000 });
  await expect(page.getByText("English title from the library's translation")).toBeVisible();
  await expect(page.locator("i[lang='la']", { hasText: "Supplices" }).first()).toBeVisible();
});

test("searching the Painted Stoa from its own front page fills in its search box", async ({ page }) => {
  await page.goto("/stoa");
  const box = await open(page);
  await box.getByRole("combobox").fill("sparta");
  await box.getByRole("option", { name: /Search the Painted Stoa/ }).click();
  await expect(page).toHaveURL(/\/stoa\?q=sparta/);
  await expect(page.getByRole("searchbox", { name: "Search the Painted Stoa" })).toHaveValue("sparta");
});

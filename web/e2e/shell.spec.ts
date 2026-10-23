import { test, expect } from "@playwright/test";
import { headerButton } from "./header";
import { FORUM_OPEN } from "../src/config/areas";

test("home page shows the site name, the passage and the rooms", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toHaveAccessibleName("Read the Greeks in their own words");
  await expect(page.getByText("ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Passage of the day" })).toBeVisible();
  // the rooms, as a book's contents page
  const contents = page.getByRole("region", { name: "Contents" });
  await expect(contents).toBeVisible();
  expect(await contents.getByRole("link").evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(
    FORUM_OPEN ? ["/academy", "/library", "/stoa", "/town-hall", "/treasury"] : ["/academy", "/library", "/stoa", "/treasury"]);
});

test("moving between areas does not reload the page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { (window as unknown as { marker: string }).marker = "kept"; });
  await page.locator("header").first().getByRole("link", { name: /Learn/ }).click();
  await expect(page).toHaveURL(/\/academy$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The Academy");
  expect(await page.evaluate(() => (window as unknown as { marker?: string }).marker)).toBe("kept");
});

test("the header is the printed page's rooms beside the device, each its English name over its Greek name; Read is current in the reader", async ({ page }) => {
  await page.goto("/read");
  const rooms = page.locator("header").first().getByRole("navigation", { name: "The rooms of the site" }).getByRole("link");
  expect(await rooms.evaluateAll((as) => as.map((a) => a.firstElementChild?.textContent))).toEqual(FORUM_OPEN ? ["Learn", "Read", "Explore", "Talk", "Mine"] : ["Learn", "Read", "Explore", "Mine"]);
  expect(await rooms.evaluateAll((as) => as.map((a) => a.querySelector("i[lang='grc']")?.textContent))).toEqual(FORUM_OPEN ? ["Ἀκαδήμεια", "Μουσεῖον", "Στοὰ Ποικίλη", "Ἀγορά", "Θησαυρός"] : ["Ἀκαδήμεια", "Μουσεῖον", "Στοὰ Ποικίλη", "Θησαυρός"]);
  // the reader belongs to Read, which is the current room, in red
  await expect(rooms.filter({ hasText: "Read" })).toHaveAttribute("aria-current", "page");
  await expect(rooms.filter({ hasText: "Learn" })).not.toHaveAttribute("aria-current", "page");
  await expect(page.locator("header").first().getByRole("link", { name: "Learn Ἀκαδήμεια" })).toBeVisible();
});

test("the page chosen in Settings (Paper or Night) is remembered after a reload, and Follow device lets go", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  const choose = async (name: string) => {
    await (await headerButton(page, "Settings")).click();
    await page.getByRole("dialog", { name: "Settings" }).getByRole("radiogroup", { name: "The page" }).getByRole("radio", { name }).click();
    await page.keyboard.press("Escape");
  };
  await choose("Night");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await choose("Paper");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "paper");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "paper");
  await choose("Follow device");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
});

test("every area page opens and explains its name", async ({ page }) => {
  for (const path of ["/library", "/read", "/academy", "/stoa", "/stoa/kerameikos", "/stoa/census", "/stoa/periplus",
    "/town-hall", "/town-hall/pnyx", "/treasury", "/downloads", "/search", "/about", "/credits"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1").first(), path).toBeVisible();
  }
});

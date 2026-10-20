import { test, expect } from "@playwright/test";
import { headerButton } from "./header";
import { FORUM_OPEN } from "../src/config/areas";

test("home page shows the site name, the passage and the rooms", async ({ page }) => {
  await page.goto("/");
  // the title is set in lines for design A's rising entrance; it is read out as one sentence
  await expect(page.locator("h1").first()).toHaveAccessibleName("Read the Greeks in their own words");
  await expect(page.getByText("ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("region", { name: "Passage of the day" })).toBeVisible();
  await expect(page.getByRole("region", { name: "The rooms of the site" })).toBeVisible();
});

test("moving between areas does not reload the page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { (window as unknown as { marker: string }).marker = "kept"; });
  await page.locator("header").first().getByRole("link", { name: /The Academy/ }).click();
  await expect(page).toHaveURL(/\/academy$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The Academy");
  expect(await page.evaluate(() => (window as unknown as { marker?: string }).marker)).toBe("kept");
});

test("the header is design A's four doors around the mark, each its Greek name over its English name; the Mouseion is current in the reader", async ({ page }) => {
  await page.goto("/read");
  const header = page.locator("header").first();
  const doors = header.locator("a:has(> span[lang='grc'])");
  expect(await doors.evaluateAll((as) => as.map((a) => a.firstElementChild?.textContent))).toEqual(FORUM_OPEN ? ["Ἀκαδήμεια", "Μουσεῖον", "Στοὰ Ποικίλη", "Ἀγορά"] : ["Ἀκαδήμεια", "Μουσεῖον", "Στοὰ Ποικίλη", "Θησαυρός"]);
  expect(await doors.evaluateAll((as) => as.map((a) => a.children[1]?.textContent))).toEqual(FORUM_OPEN ? ["The Academy", "The Mouseion", "The Painted Stoa", "The Agora"] : ["The Academy", "The Mouseion", "The Painted Stoa", "The Treasury"]);
  await expect(doors.filter({ hasText: "Μουσεῖον" })).toHaveAttribute("aria-current", "page");
  await expect(header.getByRole("link", { name: "Ἀκαδήμεια The Academy" })).toBeVisible();
  if (FORUM_OPEN) await expect(header.getByRole("link", { name: "The Treasury: bookmarks and notes" })).toBeVisible();
});

test("the reader's page chosen in Settings (Lamplight or Daylight) is remembered after a reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-reader-page", "day");
  await (await headerButton(page, "Settings")).click();
  await page.getByRole("radio", { name: "Daylight" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-reader-page", "day");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-reader-page", "day");
  await (await headerButton(page, "Settings")).click();
  await page.getByRole("radio", { name: "Lamplight" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-reader-page", "day");
});

test("every area page opens and explains its name", async ({ page }) => {
  for (const path of ["/library", "/read", "/academy", "/stoa", "/stoa/kerameikos", "/stoa/census", "/stoa/periplus",
    "/town-hall", "/town-hall/pnyx", "/treasury", "/downloads", "/search", "/about", "/credits"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1").first(), path).toBeVisible();
  }
});

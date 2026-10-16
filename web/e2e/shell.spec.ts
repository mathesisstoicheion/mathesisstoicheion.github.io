import { test, expect } from "@playwright/test";

test("home page shows the site name, the passage and the offline block", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toHaveAccessibleName("Read the Greeks in their own words");
  await expect(page.locator("h1").first()).toHaveText("Read the Greeks in their own words");
  await expect(page.getByText("ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Passage of the day" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Read without a connection" })).toBeVisible();
  await expect(page.getByRole("link", { name: "canonical-greekLit" })).toHaveAttribute("href", /canonical-greekLit\/archive/);
});

test("moving between areas does not reload the page", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { (window as unknown as { marker: string }).marker = "kept"; });
  await page.getByRole("navigation", { name: "Areas of the site" }).getByRole("link", { name: /The Academy/ }).click();
  await expect(page).toHaveURL(/\/academy$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The Academy");
  expect(await page.evaluate(() => (window as unknown as { marker?: string }).marker)).toBe("kept");
});

test("the menu is the five doors, in plain words with their Greek names, then Research (the Oracle); Read is current in the reader", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001");
  const doors = page.getByRole("navigation", { name: "Areas of the site" }).getByRole("link");
  expect(await doors.evaluateAll((as) => as.map((a) => a.querySelector("b")?.textContent))).toEqual(["Learn", "Read", "Explore", "Talk", "Mine", "Research"]);
  await expect(doors.filter({ hasText: "Μουσεῖον" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Learn: The Academy" })).toBeVisible();
});

test("the reader's page chosen in Settings (Night or Daylight) is remembered after a reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-reader-page", "day");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "Daylight" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-reader-page", "day");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-reader-page", "day");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "Night" }).click();
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

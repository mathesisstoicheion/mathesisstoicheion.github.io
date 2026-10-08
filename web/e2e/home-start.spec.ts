import { test, expect, type Page } from "@playwright/test";

const settings = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings") || "{}").state ?? {});

test("a first visit is asked where it is starting, and the answer sets up the reading aids", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-visitor", "back");
  await expect(page.getByRole("heading", { name: "Where are you starting?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your desk" })).toBeHidden();
  // the five doors, at a glance
  await expect(page.getByRole("heading", { name: "Five doors" })).toBeVisible();
  // nothing is set until Begin: picking a card only opens the panel
  const none = page.getByRole("button", { name: /I know no Greek/ });
  await none.click();
  await expect(none).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Latin letters shown under the Greek in the reader")).toBeVisible();
  expect((await settings(page)).translit ?? false).toBe(false);
  // a second click closes it again
  await none.click();
  await expect(page.getByText("Latin letters shown under the Greek in the reader")).toBeHidden();
  await none.click();
  await page.locator("#start-setup").getByRole("link", { name: /Meet the alphabet/ }).click();
  await expect(page).toHaveURL(/\/academy\/alphabet$/);
  expect((await settings(page)).translit).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:start") || "{}").choice)).toBe("none");
  // back on the home page, the visitor is returning: the desk instead of the question
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-visitor", "back");
  await expect(page.getByRole("heading", { name: "Your desk" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Where are you starting?" })).toBeHidden();
  await expect(page.getByRole("heading", { name: "Five doors" })).toBeHidden();
});

test("I just want to read: the library, with reading aids off", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /I just want to read/ }).click();
  await page.locator("#start-setup").getByRole("link", { name: /Open the library/ }).click();
  await expect(page).toHaveURL(/\/library$/);
  const s = await settings(page);
  expect([s.translit, s.columns]).toEqual([false, "both"]);
});

test("a returning visitor's desk: carry on reading, today's practice, the next lesson", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("mathesis:positions", JSON.stringify({ "tlg0012.tlg001": { ed: "", tr: null, at: "1.5", t: Date.now() } }));
    localStorage.setItem("mathesis:academy", JSON.stringify({ state: { completed: { letters: Date.now() }, days: [], deck: {} }, version: 0 }));
  });
  await page.reload();
  const desk = page.getByRole("region", { name: "Your desk" });
  await expect(desk.getByRole("link", { name: /Homer, Iliad/ }).first()).toHaveAttribute("href", "/read?w=tlg0012.tlg001&at=1.5");
  await expect(desk.getByText("Your pile is empty")).toBeVisible();
  // lesson 1 is done, so lesson 2 is next
  await expect(desk.getByText("Breathings, accents and punctuation")).toBeVisible();
  await expect(desk.getByRole("link", { name: /Open the lesson/ })).toHaveAttribute("href", "/academy/lesson/marks");
  // the desk comes before the site's title
  const deskY = (await desk.boundingBox())!.y, titleY = (await page.locator("#hero-title").boundingBox())!.y;
  expect(deskY).toBeLessThan(titleY);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("the question comes straight after the title, before the vase", async ({ page }) => {
    await page.goto("/");
    const q = (await page.getByRole("heading", { name: "Where are you starting?" }).boundingBox())!.y;
    const vase = (await page.locator("main figure").first().boundingBox())!.y;
    expect(q).toBeLessThan(vase);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
});

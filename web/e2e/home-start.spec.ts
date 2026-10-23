import { test, expect, type Page } from "@playwright/test";

const settings = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:settings") || "{}").state ?? {});
/** where an element starts down the page */
const top = async (page: Page, sel: string) => (await page.locator(sel).first().boundingBox())!.y;

test("a first visit is asked where it is starting, and the answer sets up the reading aids", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveAttribute("data-visitor", "back");
  await expect(page.getByRole("heading", { name: "Your desk" })).toBeHidden();
  // the printed page's question: three numbered paragraphs, each the way to where it says to begin
  await expect(page.getByRole("heading", { name: "Where are you starting?" })).toBeVisible();
  const starts = page.getByRole("region", { name: "Where are you starting?" }).getByRole("link", { name: /^I (know|just)/ });
  expect(await starts.evaluateAll((as) => as.map((a) => a.querySelector("h3")?.textContent))).toEqual(["I know no Greek.", "I know a little.", "I just want to read."]);
  // and under them, the invitation to the Guide
  await expect(page.getByRole("link", { name: /A short guide shows you round/ })).toHaveAttribute("href", "/guide");
  // nothing is set until a way in is followed
  expect((await settings(page)).translit ?? false).toBe(false);
  await page.getByRole("link", { name: /I know no Greek\..*Meet the alphabet/ }).click();
  await expect(page).toHaveURL(/\/academy\/alphabet$/);
  expect((await settings(page)).translit).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:start") || "{}").choice)).toBe("none");
  // back on the home page, the visitor is returning: the desk instead of the question
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-visitor", "back");
  await expect(page.getByRole("heading", { name: "Your desk" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Where are you starting?" })).toBeHidden();
});

test("I know a little: the Academy, with transliteration off", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /I know a little\..*Open the Academy/ }).click();
  await expect(page).toHaveURL(/\/academy$/);
  expect((await settings(page)).translit).toBe(false);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mathesis:start") || "{}").choice)).toBe("some");
});

test("I just want to read: the library, with reading aids off", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /I just want to read\..*Open the library/ }).click();
  await expect(page).toHaveURL(/\/library$/);
  const s = await settings(page);
  expect([s.translit, s.columns]).toEqual([false, "both"]);
});

test("a returning visitor's desk: carry on reading, the next lesson", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("mathesis:positions", JSON.stringify({ "tlg0012.tlg001": { ed: "", tr: null, at: "1.5", t: Date.now() } }));
    localStorage.setItem("mathesis:academy", JSON.stringify({ state: { completed: { letters: Date.now() }, days: [] }, version: 0 }));
  });
  await page.reload();
  const desk = page.getByRole("region", { name: "Your desk" });
  await expect(desk.getByRole("link", { name: /Homer, Iliad/ }).first()).toHaveAttribute("href", "/read?w=tlg0012.tlg001&at=1.5");
  // lesson 1 is done, so lesson 2 is next
  await expect(desk.getByText("Breathings, accents and punctuation")).toBeVisible();
  await expect(desk.getByRole("link", { name: /Open the lesson/ })).toHaveAttribute("href", "/academy/lesson/marks");
  // the desk stands where the question stood: after the title page, before the passage of the day (redesign SPEC.md 4.1)
  const deskY = (await desk.boundingBox())!.y;
  expect(deskY).toBeGreaterThan(await top(page, "h1"));
  expect(deskY).toBeLessThan(await top(page, "#pod-title"));
});

test("the home page is the printed page's five parts, in order, and nothing else", async ({ page }) => {
  await page.goto("/");
  // the title page with the Socrates plate and its credit; then the question, the passage, the contents, and the credits
  const plate = page.locator("figure").first();
  await expect(plate).toContainText("Plate I");
  await expect(plate.locator("figcaption")).toContainText(/Socrates/);
  const ys = [await top(page, "h1"), await top(page, "#start-title"), await top(page, "#pod-title"), await top(page, "#contents-title"), await top(page, "text=Colophon.")];
  expect([...ys].sort((a, b) => a - b)).toEqual(ys);
  // the plates of works in stone and the Stoics' story moved to Explore
  await expect(page.getByText("Why Stoics are called Stoics")).toHaveCount(0);
  expect(await page.locator("main h2").evaluateAll((hs) => hs.filter((h) => h.checkVisibility()).map((h) => (h as HTMLElement).innerText))).toEqual(["Where are you starting?", "Passage of the day", "Contents"]);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("the question comes after the title page, and nothing is wider than the screen", async ({ page }) => {
    await page.goto("/");
    const q = await top(page, "#start-title");
    expect(q).toBeGreaterThan(await top(page, "h1"));
    expect(q).toBeLessThan(await top(page, "#pod-title"));
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
});

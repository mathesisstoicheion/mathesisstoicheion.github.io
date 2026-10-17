import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The lyre (/stoa/lyre): keys, songs, the sheet music, phones, and the accessibility checks.

/** Count the notes the page starts (each pluck starts one buffer of sound). */
async function countPlucks(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __plucks: number };
    w.__plucks = 0;
    const make = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function (this: AudioContext) { w.__plucks++; return make.call(this); };
  });
}
const plucks = (page: Page) => page.evaluate(() => (window as unknown as { __plucks: number }).__plucks);

test("the keys pluck the strings, with no errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await countPlucks(page);
  await page.goto("/stoa/lyre");
  // the page opens on the Seikilos song, its strings tuned to its notes
  await expect(page.getByRole("radio", { name: /Seikilos/ })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("img", { name: /A lyre with 8 strings/ })).toBeVisible();
  await page.getByRole("radio", { name: /Free play/ }).click();
  const lyre = page.getByRole("img", { name: /A lyre with 15 strings/ });
  await expect(lyre).toBeVisible();
  for (const k of ["a", "s", "d"]) await page.keyboard.press(k);
  await expect.poll(() => plucks(page)).toBeGreaterThanOrEqual(3);
  // a click on the lyre plucks a string too
  await lyre.scrollIntoViewIfNeeded();
  const box = (await lyre.boundingBox())!;
  const before = await plucks(page);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45);
  await expect.poll(() => plucks(page)).toBeGreaterThan(before);
  expect(errors).toEqual([]);
});

test("a song shows its words, and the sheet music at the switch", async ({ page }) => {
  await page.goto("/stoa/lyre");
  await page.getByRole("radio", { name: /Seikilos/ }).click();
  await expect(page.getByRole("radio", { name: /Seikilos/ })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByLabel("The words, as sung")).toContainText("Ὅ");
  await expect(page.getByRole("button", { name: "Listen" })).toBeVisible();
  await page.getByRole("radio", { name: "Sheet music" }).click();
  await expect(page.locator(".abcjs-note").first()).toBeVisible();
  await page.getByRole("radio", { name: "Play-along roll" }).click();
  await expect(page.locator(".abcjs-note")).toHaveCount(0);
  // free play again: the two tunings
  await page.getByRole("radio", { name: /Free play/ }).click();
  await page.getByRole("radio", { name: "Modern tuning" }).click();
  await expect(page.getByText("Equal temperament, as on a piano.")).toBeVisible();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("a touch plucks a string, and nothing scrolls sideways", async ({ page }) => {
    await countPlucks(page);
    await page.goto("/stoa/lyre");
    const lyre = page.getByRole("img", { name: /Touch a string/ });
    await lyre.scrollIntoViewIfNeeded();
    const box = (await lyre.boundingBox())!;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height * 0.45);
    await expect.poll(() => plucks(page)).toBeGreaterThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

for (const scheme of ["light", "dark"] as const) {
  test(`the lyre passes the accessibility checks (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/stoa/lyre");
    await page.getByRole("radio", { name: /Seikilos/ }).click();
    await page.getByRole("radio", { name: "Sheet music" }).click();
    await expect(page.locator(".abcjs-note").first()).toBeVisible();
    const r = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

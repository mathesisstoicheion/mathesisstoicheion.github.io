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
/** Wait until the page runs in the browser: the lyre is drawn at its measured size (the built page has no size on it). */
const ready = (page: Page) => expect(page.getByRole("img", { name: /A lyre with/ })).toHaveAttribute("width", /^\d+$/);

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

test("the keys play the strings in order, from A", async ({ page }) => {
  await countPlucks(page);
  await page.goto("/stoa/lyre");
  await ready(page);
  // the Seikilos song's eight strings are on A S D F G H J K
  const lyre = page.getByRole("img", { name: /A lyre with 8 strings/ });
  await expect(lyre).toHaveAttribute("aria-label", /A is the lowest, then S D F/);
  for (const k of ["a", "k"]) {
    const before = await plucks(page);
    await page.keyboard.press(k);
    await expect.poll(() => plucks(page)).toBeGreaterThan(before);
  }
  // a key with no string plays nothing
  let before = await plucks(page);
  await page.keyboard.press("l");
  await page.waitForTimeout(300);
  expect(await plucks(page)).toBe(before);
  // fifteen strings: the higher half goes on to the row above, from Q
  await page.getByRole("radio", { name: /Free play/ }).click();
  const scale = page.getByRole("img", { name: /A lyre with 15 strings/ });
  await expect(scale).toHaveAttribute("aria-label", /row above, from Q/);
  before = await plucks(page);
  await page.keyboard.press("u");
  await expect.poll(() => plucks(page)).toBeGreaterThan(before);
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

test("each song has its own instrument, drawn at its own proportions", async ({ page }) => {
  await page.goto("/stoa/lyre");
  await ready(page);
  const lyre = page.getByRole("img", { name: /A lyre with/ });
  await expect(lyre).toHaveAttribute("aria-label", /8 strings \(a chelys\)/);
  await expect(page.getByText(/The instrument: a chelys/)).toBeVisible();
  await page.getByRole("radio", { name: /Second Delphic/ }).click();
  await expect(lyre).toHaveAttribute("aria-label", /15 strings \(a kithara\)/);
  await expect(page.getByText(/Limenios, who wrote the hymn, was a kithara-player/)).toBeVisible();
  await page.getByRole("radio", { name: /Orestes/ }).click();
  await expect(lyre).toHaveAttribute("aria-label", /\(a barbitos\)/);
});

test("the sheet music is one size for every song, chosen with Small, Medium and Large", async ({ page }) => {
  await page.goto("/stoa/lyre");
  await ready(page);
  const head = () => page.locator(".abcjs-notehead").first().boundingBox().then((b) => Math.round(b!.height * 10) / 10);
  await page.getByRole("radio", { name: "Sheet music" }).click();
  await expect(page.getByRole("radio", { name: "Medium" })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator(".abcjs-notehead").first()).toBeVisible();
  const seikilos = await head();
  // the First Delphic Hymn, whose phrases are very long, is drawn at the same size, its lines wrapped
  await page.getByRole("radio", { name: /First Delphic/ }).click();
  await page.getByRole("radio", { name: "Sheet music" }).click();
  await expect(page.locator(".abcjs-notehead").first()).toBeVisible();
  expect(await head()).toBe(seikilos);
  await page.getByRole("radio", { name: "Large" }).click();
  await expect.poll(head).toBeGreaterThan(seikilos);
  // the choice is kept for the next visit
  await page.reload();
  await ready(page);
  await page.getByRole("radio", { name: "Sheet music" }).click();
  await expect(page.getByRole("radio", { name: "Large" })).toHaveAttribute("aria-checked", "true");
});

test("a bead of light shows where the melody is, in the score and under the words", async ({ page }) => {
  await page.goto("/stoa/lyre");
  await ready(page);
  await page.getByRole("radio", { name: "Sheet music" }).click();
  await expect(page.locator(".abcjs-note").first()).toBeVisible();
  await page.getByRole("button", { name: "Listen" }).click();
  const mark = page.locator("[class*=markOn]");
  await expect(mark).toHaveCount(1, { timeout: 10_000 });
  const lit = page.locator("[class*=noteNow]").first();
  await expect(lit).toBeVisible();
  // the column of light stands over the note now sounding
  const m = (await mark.boundingBox())!, n = (await lit.locator(".abcjs-notehead").first().boundingBox())!;
  expect(Math.abs(m.x - (n.x + n.width / 2))).toBeLessThan(4);
  await expect(page.locator("[class*=beadOn]")).toHaveCount(1);
  await page.getByRole("button", { name: "Pause" }).click();
  await page.getByRole("button", { name: "From the start" }).click();
  await expect(page.locator("[class*=beadOn]")).toHaveCount(0);
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

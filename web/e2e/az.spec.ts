import { test, expect, type Locator } from "@playwright/test";

// "A to Z" (components/library/AZList.tsx; asked for by the owner on 2026-10-16): an author's works in alphabetical order with
// a row of letters (a strip down the right of a phone), and the library's rail of letters down the right of its list when it
// is in one plain A to Z order (by kind, the first order, it has a contents line of kinds instead).

const PLUTARCH = "/library/author?a=tlg0007";   // 145 works

/** A box once it has stopped moving (the strip slides a little as the site's header tucks away or comes back). */
async function stableBox(loc: Locator) {
  let last = JSON.stringify(await loc.boundingBox()), box = await loc.boundingBox();
  for (let i = 0; i < 40; i++) {
    await loc.page().waitForTimeout(100);
    box = await loc.boundingBox();
    const now = JSON.stringify(box);
    if (now === last) return box!;
    last = now;
  }
  return box!;
}

test("an author with many works opens them as an A to Z list and jumps by letter", async ({ page }) => {
  await page.goto(PLUTARCH);
  const button = page.getByRole("button", { name: "A to Z" });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#az-works")).toBeHidden();
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const letters = page.getByRole("navigation", { name: "Works by first letter" });
  await expect(letters).toBeVisible();
  // letters with no works are dimmed and do nothing
  const q = letters.getByRole("button", { name: "Works beginning with Q" });
  await expect(q).toHaveAttribute("aria-disabled", "true");
  const before = await page.evaluate(() => scrollY);
  await q.click({ force: true });
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  // a letter with works takes the page to that letter's group, below the stuck row of letters
  await letters.getByRole("button", { name: "Works beginning with T" }).click();
  const group = page.locator('#az-works [data-az="T"]');
  await expect(group).toBeInViewport();
  await expect.poll(async () => {
    const bar = (await letters.boundingBox())!, g = (await group.boundingBox())!;
    return g.y >= bar.y + bar.height - 1;
  }).toBe(true);
  // the works are in order of their English titles: "Table Talk" comes before "That a Philosopher Ought to Converse ..."
  const titles = await group.locator("li a > span:first-child").evaluateAll((els) => els.map((e) => e.textContent ?? ""));
  const at = (t: string) => titles.findIndex((x) => x.startsWith(t));
  expect(at("Table Talk")).toBeGreaterThanOrEqual(0);
  expect(at("Table Talk")).toBeLessThan(at("That a Philosopher"));
  // closing it brings the ordinary list back
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#az-works")).toBeHidden();
  await expect(page.getByRole("link", { name: /^Theseus/ }).first()).toBeVisible();
});

test("an author with a few works has no A to Z button", async ({ page }) => {
  await page.goto("/library/author?a=tlg0012");   // Homer, 3 works
  await expect(page.getByRole("heading", { name: "What Homer wrote" })).toBeVisible();
  await expect(page.getByRole("button", { name: "A to Z" })).toHaveCount(0);
});

test("the A to Z list opens at once when animation is turned off", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(PLUTARCH);
  await page.getByRole("button", { name: "A to Z" }).click();
  await expect(page.getByRole("navigation", { name: "Works by first letter" })).toBeVisible();
  expect(await page.locator("#az-works > div").evaluate((e) => getComputedStyle(e).transitionDuration)).toBe("0s");
});

test("the library's rail of letters stands beside its list and follows the order in use", async ({ page }) => {
  await page.goto("/library");
  await expect(page.getByRole("navigation", { name: "Kinds of writing in the catalogue" })).toBeVisible();   // by kind: no letters
  await expect(page.getByRole("navigation", { name: /by first letter/ })).toHaveCount(0);
  await page.getByRole("radiogroup", { name: "Order" }).getByRole("radio", { name: "Authors A–Z" }).click();
  expect(await page.getByRole("button", { name: "A to Z" }).count()).toBe(0);   // no button: the rail is part of the list
  const rail = page.getByRole("navigation", { name: "Authors by first letter" });
  await expect(rail).toBeVisible();
  const list = page.locator("#lib-A");
  const l = (await list.boundingBox())!;
  expect((await rail.boundingBox())!.x).toBeGreaterThanOrEqual(l.x + l.width);        // to the right of the list (the owner, 2026-10-17)
  await rail.getByRole("button", { name: "Authors beginning with S" }).click();
  await expect(page.locator("#lib-S")).toBeInViewport();
  await expect(rail).toBeInViewport();                                                 // and still beside it
  await page.getByRole("radio", { name: "Titles A–Z" }).click();
  await expect(page.getByRole("navigation", { name: "Titles by first letter" })).toBeVisible();
  await page.getByRole("radio", { name: "By period" }).click();
  await expect(page.getByRole("navigation", { name: /by first letter/ })).toHaveCount(0);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

  test("the author's letters are a strip down the right edge that a finger can slide along", async ({ page }) => {
    await page.goto(PLUTARCH);
    await page.getByRole("button", { name: "A to Z" }).tap();
    const strip = page.getByRole("navigation", { name: "Works by first letter" });
    const first = page.locator('#az-works [data-az="A"]');
    await expect(first).toBeVisible();
    await first.scrollIntoViewIfNeeded();                     // the list is on the screen, so the strip is too
    await expect(strip).toBeVisible();
    const box = await stableBox(strip);
    expect(box.x + box.width).toBeGreaterThan(370);          // at the right-hand edge
    expect(box.height).toBeGreaterThan(box.width * 6);       // a tall, narrow strip
    // a finger slides down it: the page follows, and a bubble names the letter it is on
    const cdp = await page.context().newCDPSession(page);
    const centre = async (letter: string) => { const b = (await stableBox(strip.getByRole("button", { name: `Works beginning with ${letter}` })))!; return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
    const touch = (type: "touchStart" | "touchMove" | "touchEnd", p?: { x: number; y: number }) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: p ? [p] : [] });
    const y0 = await page.evaluate(() => scrollY);
    const a = await centre("A"), t = await centre("T");
    await touch("touchStart", a);
    for (let i = 1; i <= 8; i++) await touch("touchMove", { x: a.x, y: a.y + ((t.y - a.y) * i) / 8 });
    await expect(strip.locator('span[aria-hidden="true"]')).toHaveText("T");
    await touch("touchEnd");
    await expect(strip.locator('span[aria-hidden="true"]')).toHaveCount(0);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(y0);
    // it goes when the list is closed
    await page.getByRole("button", { name: "A to Z" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "A to Z" }).tap();
    await expect(page.locator("#az-works")).toBeHidden();
  });

  test("the library's rail stays on the right and does not cover the list", async ({ page }) => {
    await page.goto("/library?sort=author");
    const rail = page.getByRole("navigation", { name: "Authors by first letter" });
    await expect(rail).toBeVisible();
    await page.locator("#lib-C").scrollIntoViewIfNeeded();
    const r = (await rail.boundingBox())!, g = (await page.locator("#lib-h-C").boundingBox())!;
    expect(r.x + r.width).toBeGreaterThan(335);              // at the right-hand edge
    expect(g.x + g.width).toBeLessThanOrEqual(r.x);          // the list ends to the left of the rail
    await expect(rail).toBeInViewport();
  });
});

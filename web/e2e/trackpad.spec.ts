import { test, expect, type Locator } from "@playwright/test";

// Trackpads: a pinch (sent as a wheel event with Ctrl held), a two-finger scroll (small, uneven steps, often
// sideways) and a mouse wheel's notch (100 pixels) each do what a hand means by them, on the vase, the map
// and a manuscript page.
test.describe.configure({ timeout: 90_000 });

/** A wheel event in the middle of an element; returns whether the page was left to handle it (not prevented). */
const wheel = (el: Locator, o: { deltaX?: number; deltaY?: number; ctrlKey?: boolean }) =>
  el.evaluate((e, o) => {
    const r = e.getBoundingClientRect();
    return e.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaMode: 0, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, ...o }));
  }, o);
const nums = async (el: Locator, attr: string) => ((await el.getAttribute(attr)) ?? "").split(" ").map(Number);

test("the vase studio: pinch to come closer, two fingers to turn and move along it, the wheel zooms", async ({ page }) => {
  await page.goto("/");
  const canvas = page.locator("canvas[aria-label*='amphora']");
  await expect(canvas).toBeVisible();
  const stage = canvas.locator("xpath=..");
  await expect(stage).toHaveAttribute("data-view", /\d/);
  // on the home page a sideways swipe turns it, and an up-and-down one is left to scroll the page
  const before = (await nums(stage, "data-view"))[2];
  expect(await wheel(canvas, { deltaY: 12.5 })).toBe(true);
  expect(await wheel(canvas, { deltaX: -40 })).toBe(false);
  await expect.poll(async () => (await nums(stage, "data-view"))[2]).not.toBeCloseTo(before, 2);

  await page.getByRole("button", { name: "Paint it yourself" }).click();
  await expect(page.getByRole("dialog", { name: "Paint your own vase" })).toBeVisible();
  const [z0, p0] = await nums(stage, "data-view");
  for (let i = 0; i < 8; i++) await wheel(canvas, { deltaY: -12, ctrlKey: true });
  await expect.poll(async () => (await nums(stage, "data-view"))[0]).toBeGreaterThan(z0 + 0.3);
  const [, , r1] = await nums(stage, "data-view");
  for (let i = 0; i < 6; i++) await wheel(canvas, { deltaX: 15.5, deltaY: 0 });
  await expect.poll(async () => (await nums(stage, "data-view"))[2]).toBeLessThan(r1 - 0.2);
  for (let i = 0; i < 6; i++) await wheel(canvas, { deltaY: 9.5 });
  await expect.poll(async () => (await nums(stage, "data-view"))[1]).toBeLessThan(p0 - 0.05);
  // a mouse wheel, after a pause: back out
  await page.waitForTimeout(400);
  const [z2] = await nums(stage, "data-view");
  for (let i = 0; i < 3; i++) await wheel(canvas, { deltaY: 100 });
  await expect.poll(async () => (await nums(stage, "data-view"))[0]).toBeLessThan(z2 - 0.2);
});

test("the map: two fingers move it, a pinch and the wheel zoom", async ({ page }) => {
  await page.goto("/stoa/periplus");
  const stage = page.getByRole("application", { name: /Map of the Greek world/ });
  await expect(stage).toHaveAttribute("data-view", /\d/);
  await page.waitForTimeout(1500);   // the opening glide
  const [k0, x0, y0] = await nums(stage, "data-view");
  for (let i = 0; i < 5; i++) await wheel(stage, { deltaX: 20.5, deltaY: 10.5 });
  await expect.poll(async () => (await nums(stage, "data-view"))[1]).toBeLessThan(x0 - 50);
  const [k1, , y1] = await nums(stage, "data-view");
  expect(k1).toBeCloseTo(k0, 4);
  expect(y1).toBeLessThan(y0);
  for (let i = 0; i < 6; i++) await wheel(stage, { deltaY: -15, ctrlKey: true });
  await expect.poll(async () => (await nums(stage, "data-view"))[0]).toBeGreaterThan(k1 * 1.5);
  await page.waitForTimeout(400);
  const [k2] = await nums(stage, "data-view");
  await wheel(stage, { deltaY: 100 });
  await expect.poll(async () => (await nums(stage, "data-view"))[0]).toBeLessThan(k2);
});

test("a manuscript page: a pinch zooms; two fingers then move about the page, or scroll the panel when the whole page shows", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce" }, version: 0 })); });
  await page.goto("/read?w=tlg0012.tlg001&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Manuscript", exact: true }).click();
  const panel = page.getByRole("complementary", { name: "The manuscript" });
  await expect(panel.getByText("f. 12r")).toBeVisible({ timeout: 30_000 });
  const canvas = panel.locator(".openseadragon-canvas");
  const box = panel.locator("[data-zoom]");
  await expect(box).toHaveAttribute("data-zoom", /\d/, { timeout: 30_000 });
  // it opens close in on the line: pinch out until the whole page shows
  for (let i = 0; i < 12; i++) await wheel(canvas, { deltaY: 30, ctrlKey: true });
  await expect.poll(async () => Number(await box.getAttribute("data-zoom"))).toBeLessThan(1.02);
  // the whole page showing: a two-finger scroll is the panel's, and does not zoom
  const z = Number(await box.getAttribute("data-zoom"));
  expect(await wheel(canvas, { deltaY: 14.5 })).toBe(true);
  await page.waitForTimeout(300);
  expect(Number(await box.getAttribute("data-zoom"))).toBeCloseTo(z, 2);
  for (let i = 0; i < 8; i++) await wheel(canvas, { deltaY: -15, ctrlKey: true });
  await expect.poll(async () => Number(await box.getAttribute("data-zoom"))).toBeGreaterThan(1.5);
  // zoomed in: two fingers move about the page
  expect(await wheel(canvas, { deltaX: 25.5, deltaY: 14.5 })).toBe(false);
});

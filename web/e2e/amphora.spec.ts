import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The home page vase and its studio: paint on it, change its patterns and words, undo, keep it, start again.
const KEY = "mathesis:amphora";
const stored = (page: Page) => page.evaluate((k) => { const s = localStorage.getItem(k); return s ? JSON.parse(s) : null; }, KEY);

async function openStudio(page: Page) {
  await page.goto("/");
  await expect(page.locator("canvas[aria-label*='amphora']")).toBeVisible();
  await page.getByRole("button", { name: "Paint it yourself" }).click();
  const studio = page.getByRole("dialog", { name: "Paint your own vase" });
  await expect(studio).toBeVisible();
  return studio;
}

test("paint on the vase, change it, undo, and find it again after a reload", async ({ page }) => {
  const studio = await openStudio(page);
  const c = (await page.locator("canvas[aria-label*='amphora']").boundingBox())!;
  const x = c.x + c.width / 2, y = c.y + c.height / 2;
  await studio.getByRole("button", { name: "Added red" }).click();
  await page.mouse.move(x - 40, y); await page.mouse.down();
  await page.mouse.move(x + 40, y + 10, { steps: 12 }); await page.mouse.up();
  await expect.poll(async () => (await stored(page))?.strokes.length).toBe(1);
  const s = (await stored(page)).strokes[0];
  expect(s.c).toBe(2);
  expect(s.p.length).toBeGreaterThan(6);

  await studio.getByRole("button", { name: "Red-figure" }).click();
  await studio.getByRole("combobox", { name: "Neck" }).selectOption("ivy");
  await studio.getByRole("textbox", { name: "Painted word, front" }).fill("sophia");
  await expect(studio.getByRole("textbox", { name: "Painted word, front" })).toHaveValue("ΣΟΦΙΑ");
  await expect.poll(async () => (await stored(page))?.words[0]).toBe("ΣΟΦΙΑ");
  expect((await stored(page)).style).toBe("red");

  // undo the word, then the neck
  await studio.getByRole("button", { name: "Undo" }).click();
  await studio.getByRole("button", { name: "Undo" }).click();
  await expect(studio.getByRole("textbox", { name: "Painted word, front" })).toHaveValue("ΜΑΘΗΣΙΣ");
  await expect(studio.getByRole("combobox", { name: "Neck" })).toHaveValue("dots");
  await studio.getByRole("button", { name: "Redo" }).click();
  await expect(studio.getByRole("combobox", { name: "Neck" })).toHaveValue("ivy");

  // Escape closes the studio; the home page now shows the visitor's own vase, and still does after a reload
  await page.keyboard.press("Escape");
  await expect(studio).toBeHidden();
  await expect(page.getByText("Your own vase, painted here")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Your own vase, painted here")).toBeVisible();
  await expect(page.locator("canvas[aria-label*='amphora']")).toHaveAttribute("aria-label", /red-figure style, with brushwork/);

  // back to the site's design: nothing is kept
  const again = await openStudio(page);
  await again.getByRole("button", { name: "The site's design" }).click();
  await expect.poll(() => stored(page)).toBeNull();
  await again.getByRole("button", { name: "Done" }).click();
  await expect(page.getByText("A neck-amphora in the black-figure style")).toBeVisible();
});

test("strike the vase to crack it, mend it, and paint in any colour", async ({ page }) => {
  const studio = await openStudio(page);
  const c = (await page.locator("canvas[aria-label*='amphora']").boundingBox())!;
  const x = c.x + c.width / 2, y = c.y + c.height / 2;
  await studio.getByRole("button", { name: "Strike" }).click();
  await studio.getByRole("button", { name: "Sound on" }).click();   // quiet, for the test
  // a tap, then a long press: the longer press is the harder blow
  await page.mouse.move(x - 20, y - 30); await page.mouse.down(); await page.mouse.up();
  await page.mouse.move(x + 20, y + 30); await page.mouse.down(); await page.waitForTimeout(900); await page.mouse.up();
  await expect.poll(async () => (await stored(page))?.cracks.length).toBe(2);
  const [light, hard] = (await stored(page)).cracks;
  expect(hard.f).toBeGreaterThan(light.f);
  await page.waitForTimeout(500);
  // undo takes the last blow back; Mend all cracks takes them all
  await studio.getByRole("button", { name: "Undo" }).click();
  await expect.poll(async () => (await stored(page))?.cracks.length).toBe(1);
  await studio.getByRole("button", { name: "Mend all cracks" }).click();
  // (whole again, it is the site's own design once more, so nothing needs keeping)
  await expect.poll(async () => (await stored(page))?.cracks.length ?? 0).toBe(0);
  // a colour no Athenian had
  await studio.getByRole("button", { name: "Paint", exact: true }).click();
  await studio.getByRole("button", { name: "Aegean" }).click();
  await page.mouse.move(x - 30, y); await page.mouse.down(); await page.mouse.move(x + 30, y, { steps: 8 }); await page.mouse.up();
  await expect.poll(async () => (await stored(page))?.strokes.at(-1)?.h).toBe("#1f6fb2");
  await page.reload();
  await expect(page.getByText("Your own vase, painted here")).toBeVisible();
});

test("on a phone, one finger paints and two fingers turn without painting", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const studio = await openStudio(page);
  await expect(studio.getByRole("button", { name: "Done" })).toBeInViewport();
  const canvas = page.locator("canvas[aria-label*='amphora']");
  const c = (await canvas.boundingBox())!;
  const x = c.x + c.width / 2, y = c.y + c.height / 2;
  const touch = (type: string, id: number, cx: number, cy: number) => canvas.dispatchEvent(type, { pointerId: id, pointerType: "touch", isPrimary: id === 1, clientX: cx, clientY: cy, button: 0, bubbles: true });
  // two fingers: a turn
  await touch("pointerdown", 1, x - 30, y); await touch("pointerdown", 2, x + 30, y);
  for (let i = 1; i <= 8; i++) { await touch("pointermove", 1, x - 30 + i * 6, y); await touch("pointermove", 2, x + 30 + i * 6, y); }
  await touch("pointerup", 2, x + 78, y); await touch("pointerup", 1, x + 18, y);
  await page.waitForTimeout(600);
  expect(await stored(page)).toBeNull();
  // one finger: a stroke
  await touch("pointerdown", 3, x - 20, y);
  for (let i = 1; i <= 8; i++) await touch("pointermove", 3, x - 20 + i * 5, y + i);
  await touch("pointerup", 3, x + 20, y + 8);
  await expect.poll(async () => (await stored(page))?.strokes.length).toBe(1);
  // the studio fills the screen with no sideways scrolling
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

for (const scheme of ["light", "dark"] as const) {
  test(`the studio passes the accessibility checks (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await openStudio(page);
    await page.waitForTimeout(800); // let the studio finish lifting into place
    const r = await new AxeBuilder({ page }).include("[role=dialog]").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

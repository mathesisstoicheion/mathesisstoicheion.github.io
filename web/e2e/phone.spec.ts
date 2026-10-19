import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The phone edition (design A, 2026-10-19): a one-row header with Search and a menu (the five doors, your account, Settings
// and the connection); no bar along the bottom (the owner's choice). Search opens as a full-screen sheet.
const PHONE = { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true };

const header = (page: Page) => page.locator("header").first();
const menu = (page: Page) => page.getByRole("navigation", { name: "Menu" });
const openMenu = async (page: Page) => { await header(page).getByRole("button", { name: "Menu" }).click(); await expect(menu(page)).toBeVisible(); };
const noSideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

test.describe("on a phone", () => {
  test.use(PHONE);

  test("the header fits in one row, with Search and a menu that holds every door", async ({ page }) => {
    await page.goto("/");
    // the doors give way to the menu; there is no bar along the bottom
    await expect(header(page).getByRole("link", { name: /Μουσεῖον/ })).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Areas of the site" })).toHaveCount(0);
    const search = header(page).getByRole("button", { name: "Search" }).filter({ visible: true });
    await expect(search).toHaveCount(1);
    await openMenu(page);
    const doors = menu(page).getByRole("list").first().getByRole("link");
    expect(await doors.evaluateAll((els) => els.map((e) => e.firstElementChild?.textContent))).toEqual(["Learn", "Read", "Explore", "Talk", "Mine", "Search"]);
    await expect(menu(page).getByRole("button", { name: "Settings" })).toBeVisible();
    // every door and button in it is finger-sized
    for (const el of await menu(page).locator("a, button").filter({ visible: true }).all()) {
      const b = (await el.boundingBox())!;
      expect(b.height, await el.textContent() ?? "").toBeGreaterThanOrEqual(40);
    }
    // the header is one row
    const box = (await header(page).locator("> div").first().boundingBox())!;
    expect(box.height).toBeLessThan(90);
    expect(await noSideways(page)).toBeLessThanOrEqual(0);
  });

  test("a door in the menu opens without reloading, is marked as the current one, and the menu closes", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => { (window as unknown as { marker: string }).marker = "kept"; });
    await openMenu(page);
    await menu(page).getByRole("link", { name: /^Learn/ }).click();
    await expect(page).toHaveURL(/\/academy$/);
    await expect(menu(page)).toBeHidden();
    expect(await page.evaluate(() => (window as unknown as { marker?: string }).marker)).toBe("kept");
    await openMenu(page);
    await expect(menu(page).getByRole("link", { name: /^Learn/ })).toHaveAttribute("aria-current", "page");
    // the reader belongs to the Read door (a book open in it has its own bar instead of the header, as in design A)
    await page.goto("/read");
    await openMenu(page);
    await expect(menu(page).getByRole("link", { name: /^Read/ })).toHaveAttribute("aria-current", "page");
    // pages outside the doors mark none
    await page.goto("/about");
    await openMenu(page);
    await expect(menu(page).locator("[aria-current]")).toHaveCount(0);
  });

  test("search opens as a full-screen sheet with Greek letters, and closes", async ({ page }) => {
    await page.goto("/");
    await header(page).getByRole("button", { name: "Search" }).filter({ visible: true }).click();
    const sheet = page.getByRole("dialog", { name: "Quick search" });
    await expect(sheet).toBeVisible();
    // it rises into place, then covers the whole screen
    await expect.poll(async () => { const b = (await sheet.boundingBox())!; return [b.x, b.y, b.width, b.height]; }).toEqual([0, 0, 375, 812]);
    await sheet.getByRole("button", { name: "Greek letters on screen" }).click();
    await sheet.getByRole("button", { name: "lambda" }).click();
    await sheet.getByRole("button", { name: "omicron", exact: true }).click();
    await sheet.getByRole("button", { name: "gamma" }).click();
    await expect(sheet.getByRole("combobox", { name: "Search" })).toHaveValue("λογ");
    await expect(sheet.getByRole("option").first()).toContainText("λογ");
    await sheet.getByRole("button", { name: "Close" }).click();
    await expect(sheet).toBeHidden();
  });

  test("Settings rise from the bottom, and go away with a drag down or the Close button", async ({ page }) => {
    await page.goto("/");
    const sheet = page.getByRole("dialog", { name: "Settings" });
    const top = () => sheet.evaluate((e) => Math.round(e.getBoundingClientRect().top));
    const bottom = () => sheet.evaluate((e) => Math.round(e.getBoundingClientRect().bottom));
    const open = async () => { await openMenu(page); await menu(page).getByRole("button", { name: "Settings" }).click(); };
    await open();
    await expect.poll(bottom).toBe(812);
    for (const b of await sheet.getByRole("button").or(sheet.getByRole("radio")).all()) {
      if (!await b.isVisible()) continue;
      expect((await b.boundingBox())!.height, await b.textContent() ?? "").toBeGreaterThanOrEqual(44);
    }
    // a short drag springs back
    const y0 = await top();
    await page.mouse.move(187, y0 + 12);
    await page.mouse.down();
    await page.mouse.move(187, y0 + 50, { steps: 5 });
    await page.mouse.up();
    await expect.poll(top).toBe(y0);
    await expect(sheet).toBeVisible();
    // a long one puts it away
    await page.mouse.move(187, y0 + 12);
    await page.mouse.down();
    await page.mouse.move(187, y0 + 260, { steps: 8 });
    await page.mouse.up();
    await expect(sheet).toBeHidden();
    // and it opens in place again, not where the finger left it
    await open();
    await expect.poll(top).toBe(y0);
    await sheet.getByRole("button", { name: "Close settings" }).click();
    await expect(sheet).toBeHidden();
  });

  for (const theme of ["light", "dark"] as const) {
    test(`the phone header, menu and sheets pass the accessibility check (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => {
        localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: t, motion: "reduce" }, version: 0 }));
      }, theme);
      const check = async (what: string) => {
        const res = await new AxeBuilder({ page }).include("header").include("dialog[open]")
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`), what).toEqual([]);
      };
      await page.goto("/academy");
      await expect(page.locator("h1").first()).toBeVisible();
      await check("header");
      await openMenu(page);
      await check("menu");
      await menu(page).getByRole("button", { name: "Settings" }).click();
      await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
      await check("Settings");
      await page.keyboard.press("Escape");
      await header(page).getByRole("button", { name: "Search" }).filter({ visible: true }).click();
      await page.getByRole("button", { name: "Greek letters on screen" }).click();
      await page.getByRole("combobox", { name: "Search" }).fill("logos");
      await check("Quick search");
    });
  }

  test("nothing pokes out sideways, even on the smallest phones", async ({ page }) => {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 700 });
      for (const path of ["/", "/library", "/academy", "/stoa", "/town-hall", "/treasury", "/read?w=tlg0012.tlg001"]) {
        await page.goto(path);
        await expect(page.locator("h1").first()).toBeVisible();
        // the library's famous books arrive after the heading (a row of books like them once widened the page to 2,100 px)
        if (path === "/library") await expect(page.getByRole("region", { name: "Famous books to begin with" }).getByRole("link").first()).toBeAttached();
        expect(await noSideways(page), `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    }
  });
});

test("the browser's bar is the colour of design A's black frame, whichever reader's page is chosen", async ({ page }) => {
  await page.goto("/");
  const bars = () => page.locator('meta[name="theme-color"]').evaluateAll((ms) => ms.map((m) => m.getAttribute("content")));
  expect(await bars()).toEqual(["#070504"]);
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "Daylight" }).click();
  await page.reload();
  expect(await bars()).toEqual(["#070504"]);
});

test("wide screens show the doors in the header and have no bottom bar", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header").getByRole("link", { name: /Μουσεῖον/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Areas of the site" })).toHaveCount(0);
  // the header's search button opens Quick search, which also leads to the Oracle's full page
  await page.locator("header").getByRole("button", { name: "Search" }).filter({ visible: true }).click();
  const box = page.getByRole("dialog", { name: "Quick search" });
  await box.getByRole("link", { name: /the full search/ }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(box).toBeHidden();
});

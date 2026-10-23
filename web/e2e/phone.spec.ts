import { test, expect, type Page } from "@playwright/test";
import { headerButton } from "./header";
import AxeBuilder from "@axe-core/playwright";
import { FORUM_OPEN } from "../src/config/areas";
import { expectLook, seedLook, LOOKS } from "./look";

// The phone edition of the printed page (redesign SPEC.md 3.6): the top keeps only the device, the name and a Menu button;
// the menu holds the rooms, Search, your account, Settings and the connection; a bar along the foot of the screen holds the
// four rooms, slips away as you scroll down, comes back as you scroll up, and never shows in the reader. Search opens as a
// full-screen sheet.
const PHONE = { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true };

const header = (page: Page) => page.locator("header").first();
const menu = (page: Page) => page.getByRole("navigation", { name: "Menu" });
const openMenu = async (page: Page) => { await header(page).getByRole("button", { name: "Menu" }).click(); await expect(menu(page)).toBeVisible(); };
const openSearch = async (page: Page) => { await openMenu(page); await menu(page).getByRole("button", { name: /^Search/ }).click(); };
const noSideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
/** the rooms along the foot of the screen (TabBar.tsx); on a phone the header's own list of rooms is not shown */
const footBar = (page: Page) => page.getByRole("navigation", { name: "The rooms of the site" });
const ROOMS = FORUM_OPEN
  ? [["Learn", "Ἀκαδήμεια"], ["Read", "Μουσεῖον"], ["Explore", "Στοὰ Ποικίλη"], ["Talk", "Ἀγορά"], ["Mine", "Θησαυρός"]]
  : [["Learn", "Ἀκαδήμεια"], ["Read", "Μουσεῖον"], ["Explore", "Στοὰ Ποικίλη"], ["Mine", "Θησαυρός"]];

test.describe("on a phone", () => {
  test.use(PHONE);

  test("the top holds only the device and the Menu; the menu holds every room and Search", async ({ page }) => {
    await page.goto("/");
    await expect(header(page).getByRole("link", { name: /Μουσεῖον/ })).toBeHidden();
    for (const small of ["Search", "Settings"]) await expect(header(page).getByRole("button", { name: small }).filter({ visible: true })).toHaveCount(0);
    await expect(header(page).getByRole("button", { name: "Menu" })).toBeVisible();
    await openMenu(page);
    const doors = menu(page).getByRole("list").first().getByRole("link");
    expect(await doors.evaluateAll((els) => els.map((e) => [e.firstElementChild?.textContent, e.querySelector("i[lang='grc']")?.textContent]))).toEqual(ROOMS);
    await expect(menu(page).getByRole("button", { name: /^Search/ })).toBeVisible();
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

  test("the rooms along the foot slip away as you read on, come back as you scroll up, and are not in the reader", async ({ page }) => {
    await page.goto("/library");
    const bar = footBar(page);
    await expect(bar).toBeVisible();
    expect(await bar.getByRole("link").evaluateAll((els) => els.map((e) => [e.firstElementChild?.firstChild?.textContent, e.querySelector("i[lang='grc']")?.textContent]))).toEqual(ROOMS);
    await expect(bar.getByRole("link", { name: /^Read/ })).toHaveAttribute("aria-current", "page");
    // at the foot of the screen, every room finger-sized
    const b = (await bar.boundingBox())!;
    expect(Math.round(b.y + b.height)).toBe(812);
    for (const link of await bar.getByRole("link").all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    // reading on puts it away; any scroll back up brings it back
    await page.evaluate(() => scrollTo({ top: 1400, behavior: "instant" }));
    await expect(bar).toHaveAttribute("data-away", "true");
    await page.evaluate(() => scrollTo({ top: 1100, behavior: "instant" }));
    await expect(bar).not.toHaveAttribute("data-away");
    // a book open in the reader has no bar at all
    await page.goto("/read?w=tlg0012.tlg001");
    await expect(page.locator("[data-reader-text], main").first()).toBeVisible();
    await expect(footBar(page)).toHaveCount(0);
  });

  test("a door in the menu opens without reloading, is marked as the current one, and the menu closes", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => { (window as unknown as { marker: string }).marker = "kept"; });
    await openMenu(page);
    await menu(page).getByRole("link", { name: /Ἀκαδήμεια/ }).click();
    await expect(page).toHaveURL(/\/academy$/);
    await expect(menu(page)).toBeHidden();
    expect(await page.evaluate(() => (window as unknown as { marker?: string }).marker)).toBe("kept");
    await openMenu(page);
    await expect(menu(page).getByRole("link", { name: /Ἀκαδήμεια/ })).toHaveAttribute("aria-current", "page");
    // the reader belongs to the Read door (a book open in it has its own bar instead of the header)
    await page.goto("/read");
    await openMenu(page);
    await expect(menu(page).getByRole("link", { name: /Μουσεῖον/ })).toHaveAttribute("aria-current", "page");
    // pages outside the doors mark none
    await page.goto("/about");
    await openMenu(page);
    await expect(menu(page).locator("[aria-current]")).toHaveCount(0);
  });

  test("search opens as a full-screen sheet with Greek letters, and closes", async ({ page }) => {
    await page.goto("/");
    await openSearch(page);
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

  for (const look of LOOKS) {
    test(`the phone header, menu and sheets pass the accessibility check (${look})`, async ({ page }) => {
      await seedLook(page, look);
      const check = async (what: string) => {
        const res = await new AxeBuilder({ page }).include("header").include("dialog[open]")
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`), what).toEqual([]);
      };
      await page.goto("/academy");
      await expect(page.locator("h1").first()).toBeVisible();
      await expectLook(page, look);
      await check("header");
      await openMenu(page);
      await check("menu");
      await menu(page).getByRole("button", { name: "Settings" }).click();
      await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
      await check("Settings");
      await page.keyboard.press("Escape");
      await openSearch(page);
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

test("the browser's bar is the page's own colour: Paper or Night as the device has it, or as chosen in Settings", async ({ page }) => {
  // the colour the browser shows: the theme-color whose media matches (app/layout.tsx, lib/settings.ts)
  const bar = () => page.evaluate(() => [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')].find((m) => !m.media || matchMedia(m.media).matches)?.content);
  const choose = async (name: string) => {
    await (await headerButton(page, "Settings")).click();
    await page.getByRole("dialog", { name: "Settings" }).getByRole("radiogroup", { name: "The page" }).getByRole("radio", { name }).click();
    await page.keyboard.press("Escape");
  };
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(await bar()).toBe("#f3ece0");
  await page.emulateMedia({ colorScheme: "dark" });
  expect(await bar()).toBe("#1b1814");
  // chosen in Settings, the look holds whatever the device says, and so does the bar, after a reload too
  await choose("Paper");
  await expectLook(page, "paper");
  expect(await bar()).toBe("#f3ece0");
  await page.reload();
  await expectLook(page, "paper");
  expect(await bar()).toBe("#f3ece0");
  await page.emulateMedia({ colorScheme: "light" });
  await choose("Night");
  await expectLook(page, "night");
  expect(await bar()).toBe("#1b1814");
  await page.reload();
  await expectLook(page, "night");
  expect(await bar()).toBe("#1b1814");
  // following the device again
  await choose("Follow device");
  await expectLook(page, "paper");
  expect(await bar()).toBe("#f3ece0");
});

test("wide screens show the rooms in the header and have no bar along the foot", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header").getByRole("link", { name: /Μουσεῖον/ })).toBeVisible();
  // the one list of rooms shown is the header's
  await expect(page.getByRole("navigation", { name: "The rooms of the site" })).toHaveCount(1);
  await expect(page.locator("header").getByRole("navigation", { name: "The rooms of the site" })).toBeVisible();
  // the header's search button opens Quick search, which also leads to the Oracle's full page
  await page.locator("header").getByRole("button", { name: "Search" }).filter({ visible: true }).click();
  const box = page.getByRole("dialog", { name: "Quick search" });
  await box.getByRole("link", { name: /the full search/ }).click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(box).toBeHidden();
});

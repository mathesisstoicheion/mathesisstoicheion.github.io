import { test, expect, type Page } from "@playwright/test";
import { FORUM_OPEN } from "../src/config/areas";

// The forum (the Agora and the Pnyx) is frozen and hidden (SPEC.md, owner 2026-10-18): no page may link
// to it or offer it, while sign-in keeps working. Runs only while FORUM_OPEN is false.
test.skip(FORUM_OPEN, "the forum is open");
test.describe.configure({ timeout: 90_000 });

const FORUM_WORDS = /Agora|Pnyx|Ask in the Agora|Talk about it|Report a bug|Suggest an idea|Tell us about/;

async function noForum(page: Page, words = true) {
  await expect(page.locator('a[href^="/town-hall"]')).toHaveCount(0);
  if (words) expect(await page.locator("body").innerText()).not.toMatch(FORUM_WORDS);
}

for (const path of ["/", "/academy/lesson/letters", "/stoa", "/guide", "/library", "/treasury", "/no-such-page"]) {
  test(`${path} neither links to nor mentions the forum`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await noForum(page);
  });
}

test("a wiki entry offers no debate in the Pnyx", async ({ page }) => {
  await page.goto("/stoa");
  const entry = page.locator('main a[href^="/stoa/"]').filter({ hasNotText: /Periplus|Census|Kerameikos|Authors|Eras|Editions|Manuscripts|Variants/ }).first();
  await entry.click();
  await page.waitForLoadState("networkidle");
  await noForum(page);
});

test("the home page asks the database for nothing", async ({ page }) => {
  const asked: string[] = [];
  page.on("request", (r) => { if (r.url().includes("supabase.co")) asked.push(r.url()); });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);
  expect(asked).toEqual([]);
});

test("the reader has no Talk panel and no Ask in the Agora", async ({ page }) => {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  const line = page.locator('[data-u="1.1"]').first();
  await expect(line).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("button", { name: "Talk about it" })).toHaveCount(0);
  // select a passage: the passage toolbar appears, without the forum
  await page.evaluate(() => {
    const el = document.querySelector('[data-u="1.1"]')!;
    const r = document.createRange(); r.selectNodeContents(el);
    const s = getSelection()!; s.removeAllRanges(); s.addRange(r);
    document.dispatchEvent(new Event("selectionchange"));
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
  });
  await expect(page.getByRole("button", { name: "Echoes" })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("button", { name: /Ask in the Agora/ })).toHaveCount(0);
  await noForum(page, false);
});

test("quick search offers neither the Agora nor the Pnyx", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const box = page.getByRole("combobox", { name: "Search" });
  await box.fill("town hall pnyx forum");
  await page.waitForTimeout(500);
  expect(await page.getByRole("dialog").innerText()).not.toMatch(FORUM_WORDS);
  await box.fill("achilles");
  await page.waitForTimeout(500);
  expect(await page.getByRole("dialog").innerText()).not.toMatch(FORUM_WORDS);
});

test("the forum's own pages say it is closed", async ({ page }) => {
  for (const path of ["/town-hall", "/town-hall/pnyx", "/town-hall/new"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/closed/i);
  }
});

test("sign-in still works: the account page offers it", async ({ page }) => {
  await page.goto("/account");
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" }).last()).toBeVisible();
  await noForum(page);
});

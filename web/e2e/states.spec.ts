import { test, expect, type Page } from "@playwright/test";
import { aid } from "./reader-menus";

// The states made explicit (2026-11-08): the reader's one tool at the side (components/reader/tool.ts) and the lyre's
// "Record what you play" (lib/lyre/own.ts). The board's buttons (lib/task.ts) are tried in board.spec.ts.
test.describe.configure({ timeout: 90_000 });

const panels = (page: Page) => page.getByRole("complementary").filter({ hasText: /./ });
const panel = (page: Page, name: string) => page.getByRole("complementary", { name });

test("the reader keeps one tool at the side: each opens in place of the last, Back closes it", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto("/read?w=tlg0016.tlg001&at=1.1.1");
  await expect(page.locator('[data-u="1.1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await aid(page, "Vocabulary");
  await expect(panel(page, "Vocabulary for this page")).toBeVisible();
  await aid(page, "Places");
  await expect(panel(page, "Places on this page")).toBeVisible();
  await expect(panel(page, "Vocabulary for this page")).toHaveCount(0);
  // Find by its key, over Places: Places goes
  await page.mouse.click(5, 300);
  await page.keyboard.press("Control+f");
  await expect(panel(page, "Find in this text")).toBeVisible();
  await expect(panel(page, "Places on this page")).toHaveCount(0);
  expect(await panels(page).count()).toBe(1);
  // the row of Study again closes it
  await aid(page, "Find");
  await expect(panel(page, "Find in this text")).toHaveCount(0);
  // a tool opened from Study, then the phone's (browser's) Back: it closes
  await aid(page, "Places");
  await expect(panel(page, "Places on this page")).toBeVisible();
  await page.goBack();
  await expect(panel(page, "Places on this page")).toHaveCount(0);
  await expect(page).toHaveURL(/w=tlg0016\.tlg001/);
});

test("the lyre records what you play, keeps it, plays it back, and says when a link is damaged", async ({ page }) => {
  await page.goto("/stoa/lyre");
  await expect(page.getByRole("img", { name: /A lyre with/ })).toHaveAttribute("width", /^\d+$/);
  await page.getByRole("button", { name: "Record what you play" }).click();
  await expect(page.getByText("Recording what you play.")).toBeVisible();
  for (const k of ["a", "s", "d"]) await page.keyboard.press(k);
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await expect(page.getByText(/Your tune: 3 notes/)).toBeVisible();
  await page.getByRole("button", { name: "Play it back" }).click();
  await expect(page.getByRole("button", { name: "Stop", exact: true })).toBeVisible();
  // it stops by itself once the tune has played
  await expect(page.getByRole("button", { name: "Play it back" })).toBeVisible({ timeout: 10_000 });
  // recording with nothing played keeps nothing
  await page.getByRole("button", { name: "Record again" }).click();
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await expect(page.getByRole("button", { name: "Record what you play" })).toBeVisible();
  await expect(page.getByText(/Your tune/)).toHaveCount(0);
  // a damaged link to a tune
  await page.goto("/stoa/lyre#tune=not-a-tune");
  await expect(page.getByText("That link to a tune is damaged or cut short.")).toBeVisible();
});

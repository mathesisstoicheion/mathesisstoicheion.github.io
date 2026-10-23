import { expect, type Page } from "@playwright/test";

/**
 * Paper or Night for a test: the look chosen in the site's own settings (lib/settings.ts), saved in the shape the printed
 * page saves them (version 2), with no animation.
 *
 * Settings saved in an older shape are upgraded when the site starts, and the old "dark" became the device's own choice,
 * which in a test browser is Paper: tests that seeded "dark" checked Paper while they meant Night (found 2026-10-23).
 * `expectLook` makes sure a page really is in the look a test asked for.
 */
export type Look = "paper" | "night";
export const LOOKS: Look[] = ["paper", "night"];

/** the colour of the page itself in each look (styles/tokens.css: --paper, --night) */
const BACKGROUND: Record<Look, string> = { paper: "rgb(243, 236, 224)", night: "rgb(27, 24, 20)" };

export async function seedLook(page: Page, look: Look, more: Record<string, unknown> = {}) {
  await page.addInitScript(([l, m]) => {
    localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: l, motion: "reduce", ...m }, version: 2 }));
  }, [look, more] as const);
}

export async function expectLook(page: Page, look: Look) {
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor), { message: `the page is in ${look}` })
    .toBe(BACKGROUND[look]);
}

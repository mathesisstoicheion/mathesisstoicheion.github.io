import type { Locator, Page } from "@playwright/test";

// The reader's one bar stands along the foot of the page (ReaderBar.tsx, Drop.tsx; the quiet desk, ticket 09, the owner, 2026-10-30): "Library" at
// the left, where you are in the middle (a button that opens Go to: the page and a reference to type), and Text (the Aa sign and the word), which holds the page and the type, and
// Study (every other tool) at the right. Two books side by side, and the floating window, have the same Text and Study in the top bar of each book.
// Each helper opens its menu unless it is already open and returns the menu's panel.
async function open(page: Page, name: string | RegExp) {
  const button = (typeof name === "string" ? page.getByRole("button", { name, exact: true }) : page.getByRole("button", { name })).first();
  if ((await button.getAttribute("aria-expanded")) !== "true") {
    // one menu at a time, as a reader opens them: another one open may lie over this one's button, so it is closed first, with Escape (Drop.tsx)
    if (await page.locator('button[aria-controls][aria-expanded="true"]').count()) await page.keyboard.press("Escape");
    // on a phone the bar slips away as the page is read on and comes back with a scroll up, as it does for a reader
    if (!(await button.isVisible())) {
      await page.evaluate(() => scrollBy(0, -40));
      await button.waitFor({ state: "visible" });
    }
    await button.click();
  }
  return page.locator(`[id="${await button.getAttribute("aria-controls")}"]`);
}
// Study says how many modes are on ("Study, 2 on")
export const openStudy = (page: Page) => open(page, /^Study(, \d+ on)?$/);
// Aa is the sign and the word "Text", and is named "Text: page and size" (the reader's tools, the owner, 2026-10-30: its name starts with the word it shows)
export const openAa = (page: Page) => open(page, /^Text: page and size$/);
// the middle of the bar is named from the words it shows (the place: "line 25 of 611") and then what it opens (the quiet desk, ticket 11, user story 23, the owner, 2026-10-30)
export const openGoto = (page: Page) => open(page, /, go to a line or book$/);
/** The edition, the translation, Compare with, a second book and the private collection: the groups of Study, with the reading help. */
export const openAids = openStudy;
export const openChange = openStudy;
export const openMore = openStudy;
/**
 * What the rows of Study say, for the names these tools had before the quiet desk (Tools, Places, Manuscript, Vocabulary, Find, Listen): a spec
 * says what it means, and this is the one place that knows the words on the rows.
 */
const ROW: Record<string, string> = {
  Places: "Places on this page", Manuscript: "How it was written", Vocabulary: "Vocabulary for this page", Find: "Find in this text", Listen: "Listen to the English",
};
export const rowName = (name: string) => ROW[name] ?? name;
/** The row of Study with this name (a tool), in an open Study. */
export const row = (panel: Locator, name: string) => panel.getByRole("button", { name: rowName(name), exact: true });
/** Press one of the reading aids (Transliteration, Metre, Vocabulary, Manuscript…), opening Study first. */
export async function aid(page: Page, name: string) {
  const panel = await openStudy(page);
  await row(panel, name).click();
}
/** Study with "Compare with another edition" unfolded (its choice of edition, and, once two are compared, the differences); returns the panel. */
export async function openCompare(page: Page) {
  const panel = await openStudy(page);
  const r = row(panel, "Compare with another edition");
  if ((await r.getAttribute("aria-expanded")) !== "true") await r.click();
  return panel;
}

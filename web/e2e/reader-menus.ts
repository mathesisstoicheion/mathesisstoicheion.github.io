import type { Page } from "@playwright/test";

// The reader's bar (design A's, at the top on every screen) keeps most controls behind drop-downs (Reader.tsx, Drop.tsx):
// "Change" beside the edition's name (the edition selects, Compare, a second book, the private collection), "Tools" (the
// page and passage, the reading aids, Find and Listen) and "More" (⋯: Markers, Float, Keys). Each helper opens its menu
// unless it is already open and returns the menu's panel.
async function open(page: Page, name: string) {
  const button = page.getByRole("button", { name, exact: true }).first();
  if ((await button.getAttribute("aria-expanded")) !== "true") await button.click();
  return page.locator(`#${await button.getAttribute("aria-controls")}`);
}
export const openAids = (page: Page) => open(page, "Tools");
export const openChange = (page: Page) => open(page, "Change");
export const openMore = (page: Page) => open(page, "More");
/** Press one of the reading aids (Transliteration, Metre, Vocabulary, Manuscript…), opening the Tools menu first. */
export async function aid(page: Page, name: string) {
  const panel = await openAids(page);
  await panel.getByRole("button", { name, exact: true }).click();
}

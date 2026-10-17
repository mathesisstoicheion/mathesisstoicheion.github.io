import type { Page } from "@playwright/test";

// The reader's wide-screen toolbar keeps most controls behind three drop-downs (Reader.tsx, Drop.tsx): "Change" beside the
// edition's name (the edition selects, Compare, a second book, the private collection), "Aids" and "More" (⋯: Markers,
// Float, Keys). Each helper opens its menu unless it is already open and returns the menu's panel.
async function open(page: Page, name: string) {
  const button = page.getByRole("button", { name, exact: true }).first();
  if ((await button.getAttribute("aria-expanded")) !== "true") await button.click();
  return page.locator(`#${await button.getAttribute("aria-controls")}`);
}
export const openAids = (page: Page) => open(page, "Aids");
export const openChange = (page: Page) => open(page, "Change");
export const openMore = (page: Page) => open(page, "More");
/** Press one of the reading aids (Transliteration, Metre, Vocabulary, Manuscript…), opening the Aids menu first. */
export async function aid(page: Page, name: string) {
  const panel = await openAids(page);
  await panel.getByRole("button", { name, exact: true }).click();
}

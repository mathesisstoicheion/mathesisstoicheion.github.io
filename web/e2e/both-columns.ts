import type { Page } from "@playwright/test";

/**
 * The reader's columns for a test that reads the English beside the Greek. A book now opens on Greek alone (the quiet desk,
 * ticket 07, the owner, 2026-10-29), so such a test first chooses "Both", as a reader does in Aa: the choice is saved in the
 * shape the quiet desk saves settings (version 3, which keeps a "Both" as chosen). It is put there only where the browser has
 * no saved settings yet, so a test that goes on to choose other columns is not undone when it opens another page.
 * (A test about the columns themselves, columns.spec.ts, picks "Both" with the control instead.)
 */
export async function bothColumns(page: Page) {
  await page.addInitScript(() => {
    try {
      if (!localStorage.getItem("mathesis:settings")) localStorage.setItem("mathesis:settings", JSON.stringify({ state: { columns: "both" }, version: 3 }));
    } catch { /* no storage: the test fails by itself */ }
  });
}

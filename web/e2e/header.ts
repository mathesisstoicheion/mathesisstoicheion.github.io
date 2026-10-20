import type { Locator, Page } from "@playwright/test";

// The header's small square buttons (the connection light, your account, Settings) stand beside the doors only from 1440 px,
// where there is room for them (Header.module.css); narrower, as on the tests' 1280 px screen, they wait in the menu. This
// returns the one that can be pressed, opening the menu first where it has to.
export async function headerButton(page: Page, name: string | RegExp): Promise<Locator> {
  const menuButton = page.locator("header").getByRole("button", { name: "Menu" });
  if (!(await menuButton.isVisible())) return page.locator("header").getByRole("button", { name });
  const menu = page.getByRole("navigation", { name: "Menu" });
  if (!(await menu.isVisible())) await menuButton.click();
  return menu.getByRole("button", { name });
}

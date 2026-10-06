import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// How the sentence is built: the first sentence of the Iliad, as the treebank analyses it (checked by hand).
// Needs a connection (the text comes from GitHub).
test.describe.configure({ timeout: 90_000 });

const marked = (page: Page, n: string) =>
  page.evaluate((n) => [...((CSS as unknown as { highlights?: Map<string, Set<Range>> }).highlights?.get(n) ?? [])].map((r) => r.toString()), n);

async function openSentence(page: Page) {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await page.locator('[data-u="1.1"] [data-w="ἄειδε"]').click();
  await page.getByRole("button", { name: "How the sentence is built" }).click();
  const panel = page.getByRole("complementary", { name: "How the sentence is built" });
  await expect(panel.getByRole("list", { name: /The sentence's structure/ })).toBeVisible({ timeout: 30_000 });
  return panel;
}

test("a word opens its sentence's structure: roles in plain words, phrases marked in the text", async ({ page }) => {
  const panel = await openSentence(page);
  await expect(panel).toContainText("Checked by hand");
  // ἄειδε, the word asked about, is the main verb; μῆνιν is its object; Ἀχιλῆος describes μῆνιν
  await expect(panel.getByRole("button", { name: /^ἄειδε\s*main verb/ })).toHaveAttribute("aria-current", "true");
  const menin = panel.getByRole("button", { name: /^μῆνιν\s*object/ });
  await expect(menin).toBeVisible();
  await expect(panel.getByRole("button", { name: /^Ἀχιλῆος\s*attribute/ })).toBeVisible();
  // the whole sentence is marked faintly in the text, and the word asked about strongly
  await expect.poll(async () => (await marked(page, "syn-s-1")).length).toBeGreaterThan(30);
  await expect.poll(() => marked(page, "syn-w-1")).toEqual(["ἄειδε"]);
  // choosing μῆνιν marks its whole phrase: the wrath of Achilles son of Peleus, accursed
  await menin.click();
  await expect.poll(() => marked(page, "syn-p-1")).toEqual(expect.arrayContaining(["μῆνιν", "Πηληϊάδεω", "Ἀχιλῆος", "οὐλομένην"]));
  expect(await marked(page, "syn-p-1")).not.toContain("ἄειδε");
  // the next sentence
  const first = await panel.locator("p[lang=grc] button").first().innerText();
  await panel.getByRole("button", { name: "Next sentence →" }).click();
  await expect.poll(() => panel.locator("p[lang=grc] button").first().innerText()).not.toBe(first);
  // a word clicked in the text while the panel is open is shown in its own sentence
  await page.locator('[data-u="1.1"] [data-w="μῆνιν"]').click();
  await expect(panel.getByRole("button", { name: /^μῆνιν\s*object/ })).toHaveAttribute("aria-current", "true");
  await panel.getByRole("button", { name: "Close the sentence" }).click();
  await expect(panel).toBeHidden();
  await expect.poll(async () => (await marked(page, "syn-s-1")).length).toBe(0);
});

test("on a phone, the sentence panel fits the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const panel = await openSentence(page);
  await expect(panel.getByRole("button", { name: /^μῆνιν\s*object/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

for (const scheme of ["light", "dark"] as const) {
  test(`the sentence panel passes the accessibility checks (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await openSentence(page);
    await page.waitForTimeout(600);
    const r = await new AxeBuilder({ page }).include("aside[aria-label='How the sentence is built']").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(r.violations.map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

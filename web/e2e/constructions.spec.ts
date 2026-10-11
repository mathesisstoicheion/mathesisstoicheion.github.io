import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

// The Oracle's construction finder: sentences found by how they are built (GLAUx's sentence analyses).
// The links into the reader are worked out from the texts themselves, so they need a connection (GitHub).
test.describe.configure({ timeout: 120_000 });

test("a ready-made construction: the genitive absolute in Herodotus, marked, linked to the reader", async ({ page }) => {
  await page.goto("/search?m=syntax");
  await expect(page.getByRole("tab", { name: "Constructions" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: /^Genitive absolute/ }).click();
  // no works chosen yet: a place to start is offered
  await page.getByRole("button", { name: "Herodotus, Histories" }).click();
  const found = page.getByRole("region", { name: "Sentences found" });
  await expect(found.getByRole("status")).toContainText(/\d+ matches for Genitive absolute in 1 work/, { timeout: 60_000 });
  await expect(found.getByRole("status")).not.toContainText("Reading");
  const first = found.locator("ol > li").first();
  await expect(first.locator("mark")).toHaveCount(2);
  await expect(first.getByText("checked by hand")).toBeVisible();
  // the link goes to the passage in the reader, with the found words marked there
  const link = first.getByRole("link").first();
  await expect(link).toHaveAttribute("href", /\/read\?w=tlg0016\.tlg001&ed=perseus-grc2&at=1\.\d+\.\d+&hl=\d+,\d+/, { timeout: 60_000 });
  await link.click();
  await expect(page).toHaveURL(/\/read\?/);
  await expect(page.locator("[data-u] [data-w]").first()).toBeVisible({ timeout: 60_000 });
});

test("a construction of one's own: what λέγω takes as its object, tallied and downloadable", async ({ page }) => {
  await page.goto(`/search?m=syntax&cx=own&xr=obj&xb=${encodeURIComponent("λέγω")}&a=tlg0059&w=tlg0059.tlg030`);
  const found = page.getByRole("region", { name: "Sentences found" });
  await expect(found.getByRole("status")).toContainText(/matches for anything as the object of λέγω in 1 work/, { timeout: 60_000 });
  await expect(found.getByRole("status")).not.toContainText("Reading");
  await expect(found.getByText("Word A, most often")).toBeVisible();
  // choosing a word from the tally narrows the search to it
  const bars = found.locator("figure").first().locator("li button");
  const top = (await bars.first().innerText()).trim();
  await bars.first().click();
  await expect(page).toHaveURL(new RegExp(`xa=${encodeURIComponent(top)}`));
  await expect(found.getByRole("status")).toContainText(`${top} as the object of λέγω`, { timeout: 60_000 });
  await expect(found.getByRole("status")).not.toContainText("Reading");
  const [dl] = await Promise.all([page.waitForEvent("download"), found.getByRole("button", { name: /^Download/ }).click()]);
  const csv = readFileSync((await dl.path())!, "utf8");
  expect(csv).toContain("Author,Work,Place (GLAUx),Sentence,Words found,Word A,Word B,Checked by hand,Link");
  expect(csv).toContain("Plato,Republic,");
});

test("the builder writes the search into the address; a mistake is explained", async ({ page }) => {
  await page.goto("/search?m=syntax&a=tlg0016&w=tlg0016.tlg001");
  await page.getByRole("button", { name: /^Describe your own/ }).click();
  const form = page.getByRole("form", { name: "Describe a construction" });
  await form.getByRole("button", { name: "Find" }).click();
  await expect(page.getByText(/^Say something about word A or word B/)).toHaveAttribute("role", "alert");
  await form.getByRole("group", { name: "Word A" }).getByLabel("Dictionary word").fill("ψυχή");
  await form.getByLabel("is the").selectOption("sbj");
  await form.getByRole("button", { name: "Find" }).click();
  await expect(page).toHaveURL(/cx=own/);
  await expect(page.getByRole("region", { name: "Sentences found" }).getByRole("status")).toContainText(/ψυχή as the subject of anything/, { timeout: 60_000 });
});

for (const scheme of ["light", "dark"] as const) {
  test(`the construction finder passes the accessibility checks (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/search?m=syntax&cx=own&xr=obj&xb=%CE%BB%CE%AD%CE%B3%CF%89&a=tlg0016&w=tlg0016.tlg001");
    const found = page.getByRole("region", { name: "Sentences found" });
    await expect(found.getByRole("status")).toContainText(/matches/, { timeout: 60_000 });
    await expect(found.getByRole("status")).not.toContainText("Reading");
    await page.waitForTimeout(700);   // the bars finish growing
    const r = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(r.violations.map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

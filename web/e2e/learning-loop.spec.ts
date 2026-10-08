import { test, expect, type Page } from "@playwright/test";

// Phase 11, stage 3: learning and reading as one loop
const openIliad = async (page: Page) => {
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
};

test("the word look-up names the lesson that explains the form, and saves the word for practice", async ({ page }) => {
  await openIliad(page);
  await page.locator('[data-u="1.1"] [data-w="μῆνιν"]').click();
  const panel = page.getByRole("complementary", { name: "Look-up: μῆνιν" });
  const lesson = panel.getByRole("link", { name: /Why the accusative\? Lesson 3: Who does what/ });
  await expect(lesson).toBeVisible();
  await expect(lesson).toHaveAttribute("href", "/academy/lesson/case");
  // saving is one tap near the top, and the button says when the word is saved
  const save = panel.getByRole("button", { name: "Save for practice" });
  await save.click();
  await expect(panel.getByRole("button", { name: "Saved for practice ✓" })).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("mathesis:academy") || "{}").state?.deck ?? {}))).toContain("μῆνις");
  // a present imperative points to the present-tense lesson
  await page.locator('[data-u="1.1"] [data-w="ἄειδε"]').click();
  await expect(page.getByRole("complementary", { name: "Look-up: ἄειδε" }).getByRole("link", { name: /Lesson 8: Verbs: the present tense/ })).toBeVisible();
});

test("a lesson ends with its real passage, to read for real", async ({ page }) => {
  await page.goto("/academy/lesson/letters");
  const real = page.getByRole("link", { name: /Now read it for real/ });
  await expect(real).toHaveAttribute("href", "/read?w=tlg0012.tlg001&at=1.1");
  await expect(real).toContainText("μῆνιν ἄειδε θεὰ");
  // and a way to ask about it: the first two lessons go to Beginners' questions, the rest to Grammar help
  await expect(page.getByRole("link", { name: "Ask in the Town Hall" })).toHaveAttribute("href", "/town-hall/new?c=beginners");
  await page.goto("/academy/lesson/participles");
  await expect(page.getByRole("link", { name: "Ask in the Town Hall" })).toHaveAttribute("href", "/town-hall/new?c=grammar");
});

test("Words I know marks the words learned in the daily practice", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const day = 864e5, now = Date.now();
    const card = { due: new Date(now + 10 * day).toISOString(), stability: 10, difficulty: 5, elapsed_days: 1, scheduled_days: 10,
      learning_steps: 0, reps: 2, lapses: 0, state: 2, last_review: new Date(now - day).toISOString() };
    localStorage.setItem("mathesis:academy", JSON.stringify({ state: { completed: {}, days: [], deck: {
      "θεά": { id: "θεά", lemma: "θεά", gloss: "goddess", source: "saved", added: now - 3 * day, card },
    } }, version: 0 }));
  });
  await openIliad(page);
  await page.getByRole("group", { name: "Reading aids" }).getByRole("button", { name: "Words I know" }).first().click();
  await expect(page.locator('[data-u="1.1"] [data-w="θεὰ"]')).toHaveAttribute("data-known", "");
  await expect(page.locator('[data-u="1.1"] [data-w="μῆνιν"]')).not.toHaveAttribute("data-known", "");
  await expect(page.getByText(/the 1 you have reviewed successfully/)).toBeVisible();
});

test("Talk about it lists the Town Hall's questions on this page, and says how to ask one", async ({ page }) => {
  // a stand-in for the forum's answer, so the test writes nothing to the real database
  const quote = (ref: string, at: string) => ({ work: "tlg0012.tlg001", ref, grc: "μῆνιν ἄειδε θεὰ", cite: `Homer, Iliad ${ref}`, href: `/read?w=tlg0012.tlg001&at=${at}` });
  await page.route(/\/rest\/v1\/threads\?.*quote-(%3E|>){2}work/, (route) => route.fulfill({ json: [
    { id: 991, title: "Test question about the first lines", reply_count: 2, answered_post_id: 5, last_activity_at: new Date().toISOString(), quote: quote("1.1–1.4", "1.1") },
    { id: 992, title: "Test question about book five", reply_count: 0, answered_post_id: null, last_activity_at: new Date().toISOString(), quote: quote("5.1", "5.1") },
  ] }));
  await openIliad(page);
  await page.getByRole("group", { name: "This passage" }).getByRole("button", { name: "Talk about it" }).first().click();
  const panel = page.getByRole("complementary", { name: "Talk about this passage" });
  await expect(panel.getByRole("link", { name: "Test question about the first lines" })).toHaveAttribute("href", "/town-hall/thread?id=991");
  await expect(panel.getByText("2 replies · answered")).toBeVisible();
  await expect(panel.getByText("Test question about book five")).toHaveCount(0);
  await expect(panel.getByText(/Ask in the forum/)).toBeVisible();
});

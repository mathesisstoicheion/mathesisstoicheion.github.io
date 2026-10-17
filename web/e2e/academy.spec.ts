import { test, expect } from "@playwright/test";

test.describe.configure({ timeout: 60_000 });

test("the alphabet shows each letter's sound in the chosen pronunciation", async ({ page }) => {
  await page.goto("/academy/alphabet");
  await page.getByRole("option", { name: /theta/ }).click();
  await expect(page.getByText("IPA [tʰ]")).toBeVisible();
  await page.getByRole("radio", { name: "Modern Greek" }).click();
  await expect(page.getByText("IPA [θ]")).toBeVisible();
});

test("a lesson shows a real sentence from the source file, and its quiz responds", async ({ page }) => {
  await page.goto("/academy/lesson/case");
  const real = page.locator('[data-real="tlg0031.tlg004:3.35"]');
  await expect(real).toContainText("ὁ πατὴρ ἀγαπᾷ τὸν υἱόν", { timeout: 30_000 });
  await expect(real.locator("[data-quote]")).toHaveCount(5);
  await page.getByRole("button", { name: "the father (ὁ πατήρ)" }).click();
  await expect(page.getByText(/Right\./).first()).toBeVisible();
});

test("lesson words go into the daily review, and a card can be answered", async ({ page }) => {
  await page.goto("/academy/lesson/letters");
  await page.getByRole("button", { name: /to my daily review/ }).click();
  await page.goto("/academy/review");
  await expect(page.getByRole("button", { name: "Show the meaning" })).toBeVisible();
  await page.getByRole("button", { name: "Show the meaning" }).click();
  await page.getByRole("button", { name: /^Good/ }).click();
  await expect(page.getByText(/to review|Done:/)).toBeVisible();
});

test("the tables find a form without accents", async ({ page }) => {
  await page.goto("/academy/tables");
  await page.getByLabel("Find a form").fill("λογου");
  await expect(page.getByText("λόγου = genitive, singular of λόγος")).toBeVisible();
});

test("a form the tables search finds is a link that takes you to its table", async ({ page }) => {
  await page.goto("/academy/tables");
  await page.getByLabel("Find a form").fill("λυσαι");
  const found = page.locator("p[class*=found] a").first();
  await expect(found).toBeVisible();
  await found.click();
  // the table's heading is where you land (it takes the focus)
  await expect(page.locator("h2:focus")).toBeInViewport();
});

test("vocabulary shows how much of a text the commonest words cover", async ({ page }) => {
  await page.goto("/academy/vocabulary");
  await expect(page.locator("[class*=covRow]").nth(1)).toContainText(/\d+%/, { timeout: 30_000 });
});

test("the alphabet is in lesson 1: tap a letter to see how it sounds", async ({ page }) => {
  await page.goto("/academy/lesson/letters");
  const grid = page.getByRole("listbox", { name: /The 24 letters/ });
  await expect(grid.getByRole("option")).toHaveCount(24);
  await grid.getByRole("option", { name: /gamma/ }).click();
  await expect(page.getByText(/always hard, as in "go"/)).toBeVisible();
  await page.getByRole("radio", { name: "Modern Greek" }).first().click();
  await expect(page.getByText(/a soft throaty g/)).toBeVisible();
  await page.getByRole("radio", { name: "Classical Attic" }).first().click();
});

test("the Academy's front page puts the tools first and names the next step", async ({ page }) => {
  await page.goto("/academy");
  // a first visit meets no zeros: the four numbers wait until something has been done
  await expect(page.getByLabel("Your progress")).not.toContainText("lessons done");
  await expect(page.getByLabel("Your progress").getByRole("link", { name: /^Lesson 1:/ })).toBeVisible();
  // the tools stand under it, before the lessons; Daily review is reached from the session, not listed here
  const tools = page.locator('section[aria-labelledby="tools-title"]');
  await expect(tools.getByRole("link")).toHaveCount(5);
  await expect(tools.getByRole("link", { name: /Daily review/ })).toHaveCount(0);
  const y = (s: string) => page.locator(s).evaluate((e) => e.getBoundingClientRect().top);
  expect(await y('section[aria-labelledby="tools-title"]')).toBeLessThan(await y('section[aria-labelledby="lessons-title"]'));
  // with a card due, the step is a button to today's session
  await page.evaluate(() => {
    const day = 864e5, now = Date.now();
    const card = { due: new Date(now - day).toISOString(), stability: 1, difficulty: 5, elapsed_days: 1, scheduled_days: 1,
      learning_steps: 0, reps: 1, lapses: 0, state: 2, last_review: new Date(now - 2 * day).toISOString() };
    localStorage.setItem("mathesis:academy", JSON.stringify({ state: { completed: {}, days: [], deck: {
      "θεά": { id: "θεά", lemma: "θεά", gloss: "goddess", source: "saved", added: now - 3 * day, card },
    } }, version: 0 }));
  });
  await page.reload();
  await expect(page.getByLabel("Your progress")).toContainText("cards due today");
  await expect(page.getByLabel("Your progress").getByRole("link", { name: /Start today's session/ })).toHaveAttribute("href", "/academy/today");
});

test("lessons 10 to 13: prepositions drawn, adjectives that move, the third declension and the past", async ({ page }) => {
  await page.goto("/academy/lesson/prepositions");
  await expect(page.getByText("ἐκ τῆς οἰκίας")).toBeVisible();
  await expect(page.getByRole("table")).toContainText("because of");
  await page.goto("/academy/lesson/adjectives");
  const first = page.getByRole("button", { name: "Move the adjective" }).first();
  await expect(page.getByText("“the good person”").first()).toBeVisible();
  await first.click();
  await expect(page.getByText("“the person is good”").first()).toBeVisible();
  await page.goto("/academy/lesson/third-declension");
  await expect(page.getByText("πόλεως").first()).toBeVisible();
  await page.goto("/academy/lesson/past-tenses");
  await expect(page.getByRole("link", { name: /Next: Middle and passive/ })).toBeVisible();
  await expect(page.locator("[data-quote]").first()).toBeVisible({ timeout: 30_000 });
});

test("lesson 14: one scene in three voices, and the middle and passive tables", async ({ page }) => {
  await page.goto("/academy/lesson/middle-passive");
  const scene = page.locator("figure").filter({ hasText: "The father ransoms his daughter." });
  await expect(scene).toBeVisible();
  for (const v of ["active", "middle", "passive"]) await expect(scene.getByText(v, { exact: true })).toBeVisible();
  await scene.getByRole("button", { name: "Again" }).click();
  await expect(page.getByRole("table").first()).toContainText("ἐλυόμην");
  await expect(page.getByRole("table").nth(1)).toContainText("ἐλύθησαν");
  await expect(page.getByRole("link", { name: /Next: Participles/ })).toBeVisible();
  await expect(page.locator("[data-quote]").first()).toBeVisible({ timeout: 30_000 });
});

test("lesson 15: participles on a timeline (before, at the same time, after) and their tables", async ({ page }) => {
  await page.goto("/academy/lesson/participles");
  const strips = page.locator("figure").filter({ hasText: "the other bar is the main verb" });
  for (const w of ["before", "at the same time", "after"]) await expect(strips.getByText(w, { exact: true })).toBeVisible();
  await expect(strips).toContainText("συλλαμβάνει Κῦρον ὡς ἀποκτενῶν");
  await strips.getByRole("button", { name: "Again" }).click();
  await expect(page.getByRole("table").first()).toContainText("λυούσης");
  await expect(page.getByRole("table").nth(1)).toContainText("λυσάντων");
  await expect(page.getByRole("link", { name: /Next:.*Infinitives/ })).toBeVisible();
  await expect(page.locator("[data-quote]").first()).toBeVisible({ timeout: 30_000 });
});

test("lesson 16: infinitives, and a statement turned into reported speech", async ({ page }) => {
  await page.goto("/academy/lesson/infinitives");
  await expect(page.getByRole("table").first()).toContainText("λυθῆναι");
  await expect(page.getByText("ὁ Κῦρος ἀναβαίνει.")).toBeVisible();
  await page.getByRole("button", { name: "Report it" }).first().click();
  await expect(page.getByText("φασὶ τὸν Κῦρον ἀναβαίνειν.", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("They say that Cyrus is going up.", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Say it plainly" })).toBeVisible();
  await expect(page.locator("[data-quote]").first()).toBeVisible({ timeout: 30_000 });
});

test("lesson 17: the future, with the stem, σ and ending drawn together", async ({ page }) => {
  await page.goto("/academy/lesson/future");
  const sigma = page.locator("figure").filter({ hasText: "Stem, σ, ending" });
  for (const w of ["γράψω", "ἄξω", "πείσω", "ποιήσω"]) await expect(sigma).toContainText(w);
  await sigma.getByRole("button", { name: "Again" }).click();
  await expect(page.getByRole("table").filter({ hasText: "ἔσονται" })).toBeVisible();
  await expect(page.locator("[data-quote]").first()).toBeVisible({ timeout: 30_000 });
});

test("lesson 18: pronouns joined to the words they stand for, and their tables", async ({ page }) => {
  await page.goto("/academy/lesson/pronouns");
  const refer = page.locator("figure").filter({ hasText: "the word it stands for" });
  await expect(refer).toContainText("Οὗτος ἦν ἐν ἀρχῇ");
  await expect(refer.locator("svg path[marker-end]")).toHaveCount(4);
  await page.getByRole("button", { name: "Move αὐτός" }).click();
  await expect(page.getByText("the king himself", { exact: false }).first()).toBeVisible();
  for (const f of ["ταύτης", "ἧς", "τίνος"]) await expect(page.getByRole("table").filter({ hasText: f }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Next:/ })).toHaveCount(0);
});

test("a lesson's test runs to the end and says what to go over; the lesson list shows its standing", async ({ page }) => {
  await page.goto("/academy/lesson/article/test");
  await expect(page.getByText(/^1 of \d+$/)).toBeVisible({ timeout: 30_000 });
  for (let i = 0; i < 12; i++) {
    const input = page.getByRole("textbox", { name: "Your answer" });
    if (await input.count()) { await input.fill("x"); await page.getByRole("button", { name: "Check" }).click(); }
    else if (await page.getByRole("group", { name: "Answers" }).count()) await page.getByRole("group", { name: "Answers" }).getByRole("button").first().click();
    else break;
    await page.getByRole("button", { name: /^(Next|See how you did)/ }).click();
  }
  await expect(page.getByText(/You need \d+ to pass|Lesson passed/)).toBeVisible();
  await page.goto("/academy");
  await expect(page.getByRole("link", { name: /The article/ })).toBeVisible();
});

test("a written form counts in Latin letters without accents", async ({ page }) => {
  await page.goto("/academy/lesson/second-declension/practice");
  await expect(page.getByText(/^1 of \d+$/)).toBeVisible({ timeout: 30_000 });
  // find a written question: answer the others, then write the form the prompt asks for
  const forms: Record<string, string> = { "nominative singular": "os", "genitive singular": "ou", "dative singular": "ō", "accusative singular": "on",
    "nominative plural": "oi", "genitive plural": "ōn", "dative plural": "ois", "accusative plural": "ous" };
  const neuter: Record<string, string> = { "nominative singular": "on", "genitive singular": "ou", "dative singular": "ō", "accusative singular": "on",
    "nominative plural": "a", "genitive plural": "ōn", "dative plural": "ois", "accusative plural": "a" };
  for (let i = 0; i < 60; i++) {
    if (await page.getByRole("button", { name: "Practise again" }).count()) { await page.getByRole("button", { name: "Practise again" }).click(); continue; }
    const input = page.getByRole("textbox", { name: "Your answer" });
    const prompt = (await page.locator("section p").first().textContent()) ?? "";
    const m = /Write the (\w+ \w+) of (λόγος|δῶρον)/.exec(prompt);
    if (await input.count() && m) {
      await input.fill(m[2] === "λόγος" ? `log${forms[m[1]]}` : `dōr${neuter[m[1]]}`);
      await page.getByRole("button", { name: "Check" }).click();
      await expect(page.getByRole("status").filter({ hasText: /Right|Yes|Well done|Exactly|Correct/ })).toBeVisible();
      return;
    }
    if (await input.count()) { await page.getByRole("button", { name: "I don't know yet" }).click(); }
    else if (await page.getByRole("group", { name: "Answers" }).count()) await page.getByRole("group", { name: "Answers" }).getByRole("button").first().click();
    else break;
    await page.getByRole("button", { name: /^(Next|See how you did)/ }).click();
  }
  throw new Error("no written question came up");
});

test("a checkpoint asks fifteen questions over its lessons and names the lessons to go back to", async ({ page }) => {
  await page.goto("/academy/checkpoint/first-steps");
  await expect(page.getByText(/^1 of 15$/)).toBeVisible({ timeout: 30_000 });
  for (let i = 0; i < 20; i++) {
    const input = page.getByRole("textbox", { name: "Your answer" });
    if (await input.count()) { await input.fill("x"); await page.getByRole("button", { name: "Check" }).click(); }
    else if (await page.getByRole("group", { name: "Answers" }).count()) await page.getByRole("group", { name: "Answers" }).getByRole("button").first().click();
    else break;
    await page.getByRole("button", { name: /^(Next|See how you did)/ }).click();
  }
  await expect(page.getByText(/You need 12 to pass|Checkpoint passed/)).toBeVisible();
});

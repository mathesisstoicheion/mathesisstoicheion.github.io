import { test, expect, type Page } from "@playwright/test";
import { openStudy } from "./reader-menus";
import { bothColumns } from "./both-columns";

// Listen: the English translation read aloud. The device's voice is replaced by a stand-in that "speaks" each
// piece of text at once, word by word, so the test runs the same everywhere. Needs a connection (texts from GitHub).
test.describe.configure({ timeout: 60_000 });
test.beforeEach(async ({ page }) => { await bothColumns(page); });   // these read the English beside the Greek (the quiet desk, ticket 07)

async function fakeVoice(page: Page, pace = 15) {   // `pace`: milliseconds a word takes
  await page.addInitScript((pace) => {
    const w = window as unknown as { __spoken: string[]; __words: number };
    w.__spoken = []; w.__words = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    class Utterance { text: string; voice: unknown = null; lang = ""; rate = 1;
      onboundary: ((e: { name: string; charIndex: number }) => void) | null = null;
      onend: (() => void) | null = null; onerror: ((e: { error: string }) => void) | null = null;
      constructor(t: string) { this.text = t; } }
    const synth = {
      getVoices: () => [{ name: "Test English", lang: "en-GB", localService: true, default: true, voiceURI: "test" }],
      speak(u: Utterance) {
        w.__spoken.push(u.text);
        const starts = [...u.text.matchAll(/\S+/g)].map((m) => m.index!);
        let i = 0;
        const next = () => {
          if (i < starts.length) { w.__words++; u.onboundary?.({ name: "word", charIndex: starts[i++] }); timer = setTimeout(next, pace); }
          else u.onend?.();
        };
        timer = setTimeout(next, pace);
      },
      cancel() { clearTimeout(timer); },
      pause() {}, resume() {},
      addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: Utterance, configurable: true });
  }, pace);
}

test("Listen reads the English translation aloud, marking the passage and the word, and can pause, skip and stop", async ({ page }) => {
  await fakeVoice(page);
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await (await openStudy(page)).getByRole("button", { name: "Listen to the English", exact: true }).click();   // Listen waits in Study (Go deeper)
  const bar = page.getByRole("region", { name: "Listen to the translation" });
  await expect(bar).toBeVisible();
  await expect(bar).toContainText("The Greek is not read aloud");
  await bar.getByRole("button", { name: "Read aloud" }).click();
  // the first passage's English is spoken, and only English (no Greek letters, no line numbers)
  await expect.poll(() => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.join(" "))).toContain("wrath");
  const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.join(" "));
  expect(spoken).not.toMatch(/[Ͱ-Ͽἀ-῿]/);
  // the passage being read is marked
  await expect(page.locator("article [data-listening]")).toHaveCount(1);
  // it moves on through the page by itself
  await expect.poll(() => page.evaluate(() => document.querySelector("article [data-listening]")?.getAttribute("data-key")), { timeout: 20_000 }).not.toBe("1.1");
  // pause, then skip ahead a passage
  await bar.getByRole("button", { name: "Pause" }).click();
  const at = await page.evaluate(() => document.querySelector("article [data-listening]")?.getAttribute("data-key"));
  await bar.getByRole("button", { name: "Next passage" }).click();
  await expect.poll(() => page.evaluate(() => document.querySelector("article [data-listening]")?.getAttribute("data-key"))).not.toBe(at);
  // speed is remembered
  await bar.getByRole("button", { name: /^Speed 1 times/ }).click();
  await expect(bar.getByRole("button", { name: /^Speed 1.2 times/ })).toBeVisible();
  // closing stops it and takes the marks away
  await bar.getByRole("button", { name: "Stop and close" }).click();
  await expect(bar).toBeHidden();
  await expect(page.locator("article [data-listening]")).toHaveCount(0);
});

test("on a phone, Listen is in Study and its player sits within the screen, above the foot bar", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await fakeVoice(page);
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  await expect(page.locator('[data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  const tools = await openStudy(page);
  await tools.getByRole("button", { name: "Listen to the English", exact: true }).click();
  const bar = page.getByRole("region", { name: "Listen to the translation" });
  await expect(bar).toBeVisible();
  await expect(tools).toBeHidden();
  // (it rises into place over 0.4 s: measure once it has settled)
  await expect.poll(async () => { const x = (await bar.boundingBox())!; return x.y + x.height; }).toBeLessThanOrEqual(812 + 1);
  const b = (await bar.boundingBox())!;
  expect(b.x).toBeGreaterThanOrEqual(0);
  expect(b.x + b.width).toBeLessThanOrEqual(375);
  // and it stands clear of the foot bar (the quiet desk, ticket 09)
  const foot = (await page.locator("[data-foot-bar]").boundingBox())!;
  expect(b.y + b.height).toBeLessThanOrEqual(foot.y + 1);
});

// With the Greek alone there is no English column to read from: Listen opens the English of the passage it is reading, under its Greek, and
// closes it when it moves on, except one the reader opened by hand (the quiet desk, the reader's tools, the owner, 2026-10-30).
test("with the Greek alone, Listen opens the English of the passage it reads and closes it on moving on, but never one the reader opened", async ({ page }) => {
  // (set after the columns the other tests choose: a book opens on Greek alone)
  await page.addInitScript(() => { try { localStorage.setItem("mathesis:settings", JSON.stringify({ state: { columns: "greek" }, version: 3 })); } catch { /* no storage */ } });
  await fakeVoice(page, 80);
  await page.goto("/read?w=tlg0012.tlg001&tr=perseus-eng3&at=1.1");
  const one = (key: string) => page.locator(`article [data-key="${key}"] [data-one]`);
  await expect(page.locator('article [data-key="1.1"]').first()).toBeVisible({ timeout: 30_000 });
  await expect(one("1.1")).toHaveCount(0);   // the English is shut: the Greek stands alone
  // the reader opens the English of the second passage by hand
  await page.locator('article [data-key="1.5"]').getByRole("button", { name: "Show the English" }).click();
  await expect(one("1.5")).toHaveCount(1);

  await (await openStudy(page)).getByRole("button", { name: "Listen to the English", exact: true }).click();
  const bar = page.getByRole("region", { name: "Listen to the translation" });
  await bar.getByRole("button", { name: "Read aloud" }).click();
  // the first passage's English opens, is marked, and is what is spoken: English only
  await expect(one("1.1")).toContainText("wrath");
  await expect(page.locator("article [data-listening]")).toHaveAttribute("data-key", "1.1");
  await expect.poll(() => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.join(" "))).toContain("wrath");
  const spoken = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.join(" "));
  expect(spoken).not.toMatch(/[Ͱ-Ͽἀ-῿]/);
  expect(spoken).not.toContain("CC BY");   // the credit under the English is not read
  // on to the second passage (open already) and the third: the first has closed again, the second stays, the third is open
  await expect.poll(() => page.evaluate(() => document.querySelector("article [data-listening]")?.getAttribute("data-key")), { timeout: 30_000 }).toBe("1.10");
  await bar.getByRole("button", { name: "Pause" }).click();
  await expect(one("1.1")).toHaveCount(0);
  await expect(one("1.5")).toHaveCount(1);
  await expect(one("1.10")).toHaveCount(1);
  // closing Listen closes what it opened; what the reader opened stays
  await bar.getByRole("button", { name: "Stop and close" }).click();
  await expect(one("1.10")).toHaveCount(0);
  await expect(one("1.5")).toHaveCount(1);
});

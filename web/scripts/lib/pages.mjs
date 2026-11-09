// Shared helpers for the check scripts.
//
// Lessons: src/config/lessons.ts holds LESSONS_SHOWN. While it is false, the reading lessons, the grammar lessons (with
// their practice and test pages) and the checkpoints show the "not found" page, so a check must not open them.
// (/academy, /academy/alphabet, /academy/tables, /academy/vocabulary, /academy/practice, /academy/today and
// /academy/guide/... are not gated and stay live.)
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../../src/config/lessons.ts", import.meta.url), "utf8");
export const lessonsShown = /export\s+const\s+LESSONS_SHOWN\s*=\s*true\b/.test(src);

const LESSON_ONLY = /^\/academy\/(reading|lesson|checkpoint)(\/|\?|#|$)/;
export const isLessonPage = (p) => LESSON_ONLY.test(p);

export function withoutLessons(pages) {
  if (lessonsShown) return pages;
  const kept = pages.filter((p) => !isLessonPage(p));
  if (kept.length !== pages.length) console.log(`(lessons are off: ${pages.length - kept.length} lesson page(s) left out)`);
  return kept;
}

// Sign-in settings: a build made without NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (src/config/supabase.ts)
// has accounts off, and /account then throws "Accounts are off: ..." and shows the "This page stumbled" page. That is a setup
// fact, not a bug, so a check that needs accounts says so and skips only those parts. The served build is asked directly:
// open /account and look for that message. (The GitHub "Site checks" run has the settings and covers the account pages.)
export const ACCOUNT_PAGES = ["/account", "/library/private", "/treasury/translations"];
export const SETUP_LINE = "SETUP: this build has no sign-in settings, so the account pages are skipped here; the GitHub 'Site checks' run covers them";

export async function accountsOff(base) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  try {
    const page = await browser.newPage();
    let off = false;
    page.on("pageerror", (e) => { if (/Accounts are off/.test(e.message)) off = true; });
    await page.goto(base + "/account", { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(500);
    return off;
  } catch { return false; } finally { await browser.close(); }
}

// pages without the account pages when this build has no sign-in settings (prints the SETUP line once)
export async function withoutAccountPages(base, pages) {
  if (!pages.some((p) => ACCOUNT_PAGES.includes(p)) || !(await accountsOff(base))) return pages;
  console.log(SETUP_LINE);
  return pages.filter((p) => !ACCOUNT_PAGES.includes(p));
}

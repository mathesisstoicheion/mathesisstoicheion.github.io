// A chapter's heading in the reader (Blocks.tsx, Reader.module.css .head) reads as a heading on a phone, not a poster: the owner's phone,
// 2026-11-08, "fix visual bugs like this", a private translation's heading at 25 px over 18 px text, in three loose lines 41 px apart with
// gaps between the words of a third of a letter's height. Opens a pretend private translation (a pretend account and database, as in
// e2e/private-translations.spec.ts; placeholder text only, since this repository is public) on phones of 320, 360 and 412 px and on a
// computer, and lists a heading that is:
//   too big     - over 1.25 times the size of the text under it on a phone (1.45 on a computer)
//   too loose   - its lines further apart than 1.35 times its size
//   too spread  - the space between its words wider than 0.3 of its size
// usage: node web/scripts/check-chapter-heads.mjs [base-url]   (CHROMIUM=<path> picks the browser; exits with 1 on a problem)
//        Proved 2026-11-08: before the fix it listed all three at every phone width (25.2 px over 18 px, lines 1.62 apart, spaces 0.35).
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const KEY = "sb-kxwppdhbvlamcmgckqpg-auth-token";
const me = "00000000-0000-0000-0000-000000000001";
const session = {
  access_token: "a.b.c", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r",
  user: { id: me, aud: "authenticated", role: "authenticated", email: "moderator@example.org", app_metadata: {}, user_metadata: {}, created_at: "2026-09-01T00:00:00Z" },
};
const profile = { id: me, display_name: "Test person", bio: "", role: "moderator", banned_until: null, ban_reason: null, created_at: "2026-09-01T00:00:00Z" };
const sentence = "Placeholder sentence of a translation, long enough to run over several lines of the page on a phone and on a computer alike.";
const doc = {
  format: "mathesis-translation/1", id: "p", author: "Placeholder Author", title: "Placeholder Work", greekTitle: "Λόγος", status: "draft", urn: "urn:cts:greekLit:tlg9999.tlg001",
  passages: [1, 2].map((n) => ({
    heading: "A placeholder heading for a chapter, long enough to take more than one line",
    rows: [1, 2, 3].map((i) => ({ ref: `${n}.${i}`, label: `${n}a${i}`, greek: "λόγος ἐστὶ βῆτα γάμμα δέλτα", english: sentence })),
  })),
};
const VIEWS = [
  ["phone 320", { viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true }, 1.25],
  ["phone 360", { viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true }, 1.25],
  ["phone 412", { viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true }, 1.25],
  ["computer", { viewport: { width: 1440, height: 900 } }, 1.45],
];

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const found = [];
for (const [label, opts, most] of VIEWS) {
  for (const columns of ["trans", "both"]) {
    const ctx = await browser.newContext({ ...opts, serviceWorkers: "block", reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.addInitScript(([k, s, c]) => {
      localStorage.setItem(k, s);
      localStorage.setItem("mathesis:settings", JSON.stringify({ state: { motion: "reduce", columns: c }, version: 5 }));
    }, [KEY, JSON.stringify(session), columns]);
    const cors = { "access-control-allow-origin": "*" };
    await page.route("**/rest/v1/**", async (r) => {
      const u = new URL(r.request().url());
      const one = (r.request().headers()["accept"] ?? "").includes("vnd.pgrst.object");
      if (u.pathname.endsWith("/private_translations")) { const row = { id: "p", doc, updated_at: "2026-10-12T09:30:00Z" }; return r.fulfill({ json: one ? row : [row], headers: cors }); }
      if (u.pathname.endsWith("/profiles")) return r.fulfill({ json: one ? profile : [profile], headers: cors });
      return r.fulfill({ json: [], headers: cors });
    });
    await page.route("**/auth/v1/**", (r) => r.fulfill({ status: 400, json: { error: "no" }, headers: cors }));
    await page.goto(`${base}/read?w=mine:p`, { waitUntil: "load" });
    const head = page.locator("article p[class*='__head']").first();
    try { await head.waitFor({ timeout: 30000 }); } catch { found.push(`${label} (${columns}): no chapter heading drawn`); await ctx.close(); continue; }
    const m = await head.evaluate((h) => {
      const cs = getComputedStyle(h);
      const size = parseFloat(cs.fontSize);
      const text = [...h.closest("article").querySelectorAll("p")].find((p) => p !== h && !p.className.includes("__head") && p.textContent.length > 60 && p.offsetHeight);
      const tn = [...h.childNodes].find((n) => n.nodeType === 3 && n.textContent.includes(" "));
      const r = document.createRange(); const i = tn.textContent.indexOf(" "); r.setStart(tn, i); r.setEnd(tn, i + 1);
      return { size, body: text ? parseFloat(getComputedStyle(text).fontSize) : size, gap: parseFloat(cs.lineHeight) / size, space: r.getBoundingClientRect().width / size };
    });
    const at = `${label} (${columns === "trans" ? "English" : "Greek and English"})`;
    const ratio = m.size / m.body;
    const bad = [];
    if (ratio > most) bad.push(`too big: ${m.size.toFixed(1)} px over ${m.body.toFixed(1)} px text (${ratio.toFixed(2)} times)`);
    if (m.gap > 1.35) bad.push(`too loose: lines ${m.gap.toFixed(2)} times its size apart`);
    if (m.space > 0.3) bad.push(`too spread: spaces ${m.space.toFixed(2)} of its size`);
    if (bad.length) found.push(`${at}: ${bad.join("; ")}`);
    else console.log(`✓ ${at}: ${m.size.toFixed(1)} px over ${m.body.toFixed(1)} px, lines ${m.gap.toFixed(2)}, spaces ${m.space.toFixed(2)}`);
    await ctx.close();
  }
}
await browser.close();
for (const f of found) console.log(`✗ ${f}`);
console.log(found.length ? `\n${found.length} problem(s)` : "\nevery chapter heading reads as a heading");
process.exit(found.length ? 1 : 0);

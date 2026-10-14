import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

// The moderator's private translations, in Mine (/treasury/translations). A pretend account and a pretend database: nothing is
// sent to, or written in, the real one. The translations here are made-up placeholders: no real translation may
// ever be in this repository, which is public.

const KEY = "sb-kxwppdhbvlamcmgckqpg-auth-token";
const me = "00000000-0000-0000-0000-000000000001";
const session = {
  access_token: "a.b.c", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r",
  user: { id: me, aud: "authenticated", role: "authenticated", email: "moderator@example.org", app_metadata: {}, user_metadata: {}, created_at: "2026-09-01T00:00:00Z" },
};
const profile = (role: "member" | "moderator") => ({ id: me, display_name: "Test person", bio: "", role, banned_until: null, ban_reason: null, created_at: "2026-09-01T00:00:00Z" });

/** Written in the format's own order, so a download can be compared key by key. */
const DOC_ONE = {
  format: "mathesis-translation/1",
  id: "placeholder-one",
  author: "Placeholder Author",
  title: "Placeholder Work One",
  greekTitle: "Λόγος πρῶτος",
  status: "draft",
  updated: "2026-10-01",
  urn: "urn:cts:greekLit:tlg9999.tlg001",
  greekEdition: "Placeholder edition",
  publishedTranslation: "Placeholder published translation",
  intro: "Placeholder introduction, *first* paragraph.\n\nPlaceholder introduction, second paragraph.",
  passages: [
    {
      heading: "Placeholder heading *one*",
      locator: "Placeholder locator 1",
      rows: [
        { ref: "1.7", label: "1a10", greek: "λόγος ἐστί ⟦ἄλφα⟧", english: "Placeholder sentence one.", published: "Published placeholder one." },
        { ref: "1.7", label: "1a15", greek: "βῆτα γάμμα", english: "Placeholder sentence two.", published: "Published placeholder two." },
        { ref: "1.7", greek: "δέλτα", english: "Placeholder sentence three." },
      ],
      notes: ["Placeholder note one.", "Placeholder note *two*."],
      differences: [{ greek: "γάμμα", published: "published placeholder", ours: "our placeholder", why: "Placeholder reason." }],
    },
    {
      heading: "Placeholder heading two",
      rows: [{ ref: "2.1", greek: "ἔψιλον ζῆτα", english: "Placeholder sentence four.", published: "Published placeholder four." }],
    },
  ],
};
const DOC_THREE = {
  format: "mathesis-translation/1", id: "placeholder-three", author: "Another Placeholder", title: "Placeholder Work Three", status: "sample",
  passages: [{ rows: [{ greek: "λόγος ἐστί", english: "Placeholder sentence one." }] }],
};
const DOC_TWO = {
  format: "mathesis-translation/1", id: "placeholder-two", author: "Placeholder Author", title: "Placeholder Work Two", status: "complete",
  passages: [{ rows: [{ ref: "1", greek: "λόγος ἐστί", english: "Placeholder sentence one." }, { ref: "2", greek: "ἄλφα", english: "Placeholder sentence two." }] }],
};

/** The database keeps a document's fields in its own order: stored here back to front, as a test of Download. */
const shuffled = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).reverse());

interface Db {
  rows: Map<string, { doc: Record<string, unknown>; updated_at: string }>;
  asked: string[];                 // every request for the private translations
  saved: { id: string; doc: unknown }[];
  removed: string[];
}

async function pretend(page: Page, o: { role?: "member" | "moderator" | null; theme?: "light" | "dark"; pub?: boolean; start?: Record<string, unknown>[] } = {}): Promise<Db> {
  const role = o.role === undefined ? "moderator" : o.role;
  const db: Db = { rows: new Map(), asked: [], saved: [], removed: [] };
  const start = o.start ?? [DOC_ONE, DOC_THREE];
  start.forEach((d, i) => db.rows.set(d.id as string, { doc: shuffled(d), updated_at: `2026-10-1${2 - i}T09:30:00Z` }));

  await page.addInitScript(([k, s, theme, pub]) => {
    if (s && !localStorage.getItem(k)) localStorage.setItem(k, s);
    localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme, motion: "reduce" }, version: 0 }));
    if (pub && !localStorage.getItem("mathesis:translations-published")) localStorage.setItem("mathesis:translations-published", "1");
  }, [KEY, role ? JSON.stringify(session) : "", o.theme ?? "light", o.pub ? "1" : ""] as const);

  const cors = { "access-control-allow-origin": "*" };
  await page.route("**/rest/v1/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const one = (req.headers()["accept"] ?? "").includes("vnd.pgrst.object");
    if (url.pathname.endsWith("/private_translations")) {
      db.asked.push(`${req.method()} ${url.search}`);
      const id = url.searchParams.get("id")?.replace(/^eq\./, "");
      if (req.method() === "POST") {
        const body = req.postDataJSON() as { id: string; doc: Record<string, unknown> };
        db.saved.push(body);
        db.rows.set(body.id, { doc: body.doc, updated_at: "2026-10-13T08:00:00Z" });
        return route.fulfill({ status: 201, body: "", headers: cors });
      }
      if (req.method() === "DELETE") {
        const had = !!id && db.rows.delete(id);
        if (had) db.removed.push(id!);
        return route.fulfill({ json: had ? [{ id }] : [], headers: cors });
      }
      if (id) {
        const r = db.rows.get(id);
        const row = r ? { id, doc: r.doc, updated_at: r.updated_at } : null;
        return route.fulfill({ json: one ? row : row ? [row] : [], headers: cors });
      }
      const list = [...db.rows.entries()].sort((a, b) => b[1].updated_at.localeCompare(a[1].updated_at)).map(([rid, r]) => ({
        id: rid, updated_at: r.updated_at, title: r.doc.title ?? null, author: r.doc.author ?? null, status: r.doc.status ?? null,
        greekTitle: r.doc.greekTitle ?? null, updated: r.doc.updated ?? null,
      }));
      return route.fulfill({ json: list, headers: cors });
    }
    if (url.pathname.endsWith("/profiles") && role) return route.fulfill({ json: one ? profile(role) : [profile(role)], headers: cors });
    return route.fulfill({ json: [], headers: cors });
  });
  await page.route("**/auth/v1/**", (route) => route.fulfill({ status: 400, json: { error: "no" }, headers: cors }));
  return db;
}

test.use({ timezoneId: "UTC", locale: "en-GB" });

test("signed out, the page only offers to sign in, and asks the database nothing", async ({ page }) => {
  const db = await pretend(page, { role: null });
  await page.goto("/treasury/translations");
  const main = page.getByRole("main");
  await expect(main).toContainText("Sign in to open this page.");
  await expect(main.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/account?next=%2Ftreasury%2Ftranslations");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(db.asked).toEqual([]);
});

test("signed in as anyone but the moderator, the page says only that it is private", async ({ page }) => {
  const db = await pretend(page, { role: "member" });
  await page.goto("/treasury/translations?id=placeholder-one");
  await expect(page.getByRole("heading", { level: 1, name: "This page is private." })).toBeVisible();
  await expect(page.getByRole("main")).toHaveText("This page is private.");
  await page.waitForTimeout(500);
  expect(db.asked).toEqual([]);
});

test("Mine shows the moderator the way in, with how many there are; the shelf lists each translation and opens it", async ({ page }) => {
  const db = await pretend(page);
  await page.goto("/treasury");
  const way = page.getByRole("link", { name: /Our own translations/ });
  await expect(way).toContainText("Private · only you can see this");
  await expect(way).toContainText("2 translations");
  await way.click();
  await expect(page).toHaveURL(/\/treasury\/translations$/);
  await expect(page.getByRole("navigation", { name: "Areas of the site" }).getByRole("link", { name: /^Mine/ })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { level: 1, name: "Private translations" })).toBeVisible();
  await expect(page.getByText("Private · only you can see this")).toBeVisible();
  await expect(page.getByText("2 translations")).toBeVisible();

  const books = page.getByRole("main").getByRole("listitem");
  await expect(books).toHaveCount(2);
  const one = books.filter({ hasText: "Placeholder Work One" });
  await expect(one).toContainText("Λόγος πρῶτος");
  await expect(one).toContainText("Placeholder Author");
  await expect(one).toContainText("Draft");
  await expect(one).toContainText("Saved 12 October 2026");
  await expect(books.nth(1)).toContainText("Placeholder Work Three");
  await expect(books.nth(1)).toContainText("Sample");
  // only the list's few fields are asked for, not the whole text
  expect(db.asked.some((q) => q.startsWith("GET") && q.includes("doc-%3E%3Etitle") && !/select=[^&]*%2Cdoc%2C/.test(q))).toBe(true);

  await one.getByRole("link", { name: /Placeholder Work One/ }).click();
  await expect(page).toHaveURL(/\/treasury\/translations\?id=placeholder-one$/);
  await expect(page.getByRole("heading", { level: 1, name: /Placeholder Work One/ })).toBeVisible();

  // and back to Mine
  await page.getByRole("main").getByRole("link", { name: "The Treasury" }).click();
  await expect(page).toHaveURL(/\/treasury$/);
  await expect(page.getByRole("link", { name: /Our own translations/ })).toBeVisible();
});

for (const role of [null, "member"] as const) {
  test(`Mine shows nobody else the way in, and asks the database for no translations (${role ?? "signed out"})`, async ({ page }) => {
    const db = await pretend(page, { role });
    await page.goto("/treasury");
    await expect(page.getByRole("navigation", { name: "Sections of the Treasury" })).toBeVisible();
    await page.waitForTimeout(1500);
    await expect(page.getByText("Our own translations")).toHaveCount(0);
    await expect(page.getByText("Private · only you can see this")).toHaveCount(0);
    expect(db.asked).toEqual([]);
  });
}

test("the first address leads to Mine, with the translation it named; the moderator's desk no longer has the way in", async ({ page }) => {
  await pretend(page);
  await page.goto("/admin/translations?id=placeholder-one");
  await expect(page).toHaveURL(/\/treasury\/translations\?id=placeholder-one$/);
  await expect(page.getByRole("heading", { level: 1, name: /Placeholder Work One/ })).toBeVisible();
  await page.goto("/admin/translations");
  await expect(page).toHaveURL(/\/treasury\/translations$/);
  await expect(page.getByRole("heading", { level: 1, name: "Private translations" })).toBeVisible();
  expect(await (await page.request.get("/admin/translations")).text()).toContain('<meta name="robots" content="noindex');

  await page.goto("/town-hall/moderation");
  await expect(page.getByText("Nothing waiting. The Town Hall is calm.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Our own translations/ })).toHaveCount(0);
});

test("the reader: Greek beside our English, labels in the margin, notes and differences, and the published English at a touch", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await pretend(page);
  await page.goto("/treasury/translations?id=placeholder-one");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Placeholder Work One");
  await expect(h1).toContainText("Λόγος πρῶτος");
  await expect(page.getByText("Placeholder Author", { exact: true })).toBeVisible();
  await expect(page.getByText(/Dated 1 October 2026; saved 12 October 2026/)).toBeVisible();
  await expect(page.locator("main i").filter({ hasText: "first" })).toBeVisible();
  await expect(page.locator("#passage-1-h i")).toHaveText("one");  // the light marks work in headings too

  const row1 = page.locator("#row-1-1"), row2 = page.locator("#row-1-2"), row3 = page.locator("#row-1-3");
  // the margin shows the label; the link into the site's reader goes by the reference, once for rows that share it
  const link = row1.getByRole("link", { name: /1a10/ });
  await expect(link).toHaveAttribute("href", "/read?w=tlg9999.tlg001&at=1.7");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toContainText("open in the reader");
  await expect(row2).toContainText("1a15");
  await expect(row2.getByRole("link")).toHaveCount(0);
  await expect(row3).not.toContainText("1.7");
  await expect(page.locator("#row-2-1").getByRole("link", { name: /2\.1/ })).toHaveAttribute("href", "/read?w=tlg9999.tlg001&at=2.1");

  // words the editor thinks were added later: fainter, and explained
  await expect(row1.locator("[data-added]")).toHaveAttribute("title", "The editor thinks these words were added later");
  await expect(page.getByText(/Words between double brackets, set fainter/)).toBeVisible();

  // Greek on the left, ours on the right, level with each other; no published English yet
  const greek = row1.locator('[lang="grc"] p'), ours = row1.getByText("Placeholder sentence one.");
  const [g, e] = [await greek.boundingBox(), await ours.boundingBox()];
  expect(g!.x + g!.width).toBeLessThanOrEqual(e!.x);
  expect(Math.abs(g!.y - e!.y)).toBeLessThan(2);
  await expect(page.getByText("Published placeholder one.")).toHaveCount(0);

  const toggle = page.getByRole("button", { name: "Published English" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  const pub = row1.getByText("Published placeholder one.");
  await expect(pub).toBeVisible();
  const [g2, e2, p2] = [await greek.boundingBox(), await ours.boundingBox(), await pub.boundingBox()];
  expect(g2!.x + g2!.width).toBeLessThanOrEqual(e2!.x);
  expect(e2!.x + e2!.width).toBeLessThanOrEqual(p2!.x);
  expect(Math.abs(p2!.y - e2!.y)).toBeLessThan(2);
  await expect(row3).toContainText("No published English for this row.");

  // the choice is remembered in this browser
  await page.reload();
  await expect(page.getByRole("button", { name: "Published English" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#row-1-1").getByText("Published placeholder one.")).toBeVisible();

  // notes, and the differences, each leading to its row
  await expect(page.getByRole("heading", { level: 3, name: "Translator's notes" })).toBeVisible();
  await expect(page.getByText("Placeholder note one.")).toBeVisible();
  const diff = page.getByRole("main").getByRole("listitem").filter({ hasText: "Placeholder reason." });
  await expect(diff).toContainText("published placeholder");
  await expect(diff).toContainText("our placeholder");
  await diff.getByRole("button", { name: "See it in the text" }).click();
  await expect(page.locator("#row-1-2")).toBeFocused();

  // more than one passage: a list of them, each leading to its place
  const contents = page.getByRole("navigation", { name: "Passages" });
  await contents.getByRole("link", { name: /Placeholder heading two/ }).click();
  await expect(page.locator("#passage-2")).toBeFocused();
});

test("on a phone each row is stacked: its reference, the Greek, ours, then the published English", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await pretend(page, { pub: true });
  await page.goto("/treasury/translations?id=placeholder-one");
  const row1 = page.locator("#row-1-1");
  const ref = row1.getByRole("link", { name: /1a10/ });
  await expect(ref).toBeVisible();
  const parts = [ref, row1.locator('[lang="grc"] p'), row1.getByText("Placeholder sentence one."), row1.getByText("Published placeholder one.")];
  const boxes = [];
  for (const p of parts) boxes.push((await p.boundingBox())!);
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].y, `part ${i} below part ${i - 1}`).toBeGreaterThanOrEqual(boxes[i - 1].y + boxes[i - 1].height - 1);
  for (const b of boxes) expect(Math.abs(b.x - boxes[1].x)).toBeLessThan(2);
  await expect(row1.getByText("Our English", { exact: true })).toBeVisible();
  await expect(row1.getByText("Published English", { exact: true })).toBeVisible();
  const sideways = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(sideways).toBeLessThanOrEqual(0);
});

test("adding a translation: the file is checked and shown first, then saved or replaced", async ({ page }) => {
  const db = await pretend(page, { start: [] });
  await page.goto("/treasury/translations");
  await expect(page.getByText("Nothing is stored yet.")).toBeVisible();
  const input = page.locator('input[type="file"]');
  const file = (name: string, text: string) => ({ name, mimeType: "application/json", buffer: Buffer.from(text) });

  // a file that is not JSON, one that fails the check, and one far too big: each refused in plain words
  await input.setInputFiles(file("broken.json", '{\n  "format": "mathesis-translation/1"\n  "id": "x"\n}'));
  await expect(page.getByText(/cannot be saved/)).toContainText("broken.json");
  await expect(page.getByText(/not written as valid JSON \(the first mistake is on line 3\)/)).toBeVisible();
  await input.setInputFiles(file("untitled.json", JSON.stringify({ ...DOC_TWO, title: undefined, status: "done" })));
  await expect(page.getByText(/untitled\.json cannot be saved: 2 things need mending/)).toBeVisible();
  await expect(page.getByText(`The title ("title") is missing.`)).toBeVisible();
  await input.setInputFiles({ name: "huge.json", mimeType: "application/json", buffer: Buffer.alloc(5 * 1024 * 1024 + 10, 32) });
  await expect(page.getByText("This file is 5.0 MB. A translation file may be at most 5 MB, so this is probably not the right file.")).toBeVisible();
  expect(db.saved).toEqual([]);

  // a good file: shown, then saved as it is
  await input.setInputFiles(file("placeholder-two.json", JSON.stringify(DOC_TWO, null, 2)));
  await expect(page.getByRole("heading", { level: 3, name: "Placeholder Work Two" })).toBeVisible();
  await expect(page.getByText("1 passage, 2 rows")).toBeVisible();
  await expect(page.getByText("This is new: nothing with this id is on the shelf yet.")).toBeVisible();
  await page.getByRole("button", { name: "Save it" }).click();
  await expect(page.getByText("Saved “Placeholder Work Two”.")).toBeVisible();
  expect(db.saved).toEqual([{ id: "placeholder-two", doc: DOC_TWO }]);
  await expect(page.getByRole("main").getByRole("listitem").filter({ hasText: "Placeholder Work Two" })).toBeVisible();

  // the same id again replaces it, and says so first
  await input.setInputFiles(file("placeholder-two.json", JSON.stringify({ ...DOC_TWO, status: "draft" })));
  await expect(page.getByText(/This replaces “Placeholder Work Two” on the shelf/)).toBeVisible();
  await page.getByRole("button", { name: "Replace it" }).click();
  await expect(page.getByText("Replaced “Placeholder Work Two”.")).toBeVisible();
  expect(db.saved).toHaveLength(2);
});

test("Download gives back the stored file in the format's order; Remove asks first, in the page", async ({ page }) => {
  const db = await pretend(page);
  page.on("dialog", (d) => { throw new Error(`a browser pop-up appeared: ${d.message()}`); });
  await page.goto("/treasury/translations");
  const one = page.getByRole("main").getByRole("listitem").filter({ hasText: "Placeholder Work One" });

  const [download] = await Promise.all([page.waitForEvent("download"), one.getByRole("button", { name: "Download" }).click()]);
  expect(download.suggestedFilename()).toBe("placeholder-one.json");
  const back = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(back).toEqual(DOC_ONE);
  expect(Object.keys(back)).toEqual(Object.keys(DOC_ONE));

  await one.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(one.getByText(/This cannot be undone/)).toBeVisible();
  await one.getByRole("button", { name: "Keep it" }).click();
  await expect(one.getByText(/This cannot be undone/)).toHaveCount(0);
  await one.getByRole("button", { name: "Remove", exact: true }).click();
  await one.getByRole("button", { name: "Yes, remove it" }).click();
  await expect(page.getByText("Removed “Placeholder Work One”.")).toBeVisible();
  expect(db.removed).toEqual(["placeholder-one"]);
  await expect(page.getByRole("main").getByRole("listitem").filter({ hasText: "Placeholder Work One" })).toHaveCount(0);
});

for (const theme of ["light", "dark"] as const) {
  test(`the way in from Mine, the shelf and the reader pass the accessibility check (${theme})`, async ({ page }) => {
    await pretend(page, { theme, pub: true });
    const check = async () => {
      await page.waitForTimeout(400);
      // as in a11y.spec.ts: the big faint Greek word behind the empty Treasury is decoration (WCAG 1.4.3 exempts it)
      const res = await new AxeBuilder({ page }).exclude("[data-decorative]").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => ({ id: v.id, nodes: v.nodes.slice(0, 5).map((n) => n.target.join(" ")) }));
      expect(bad, JSON.stringify(bad, null, 1)).toEqual([]);
    };
    await page.goto("/treasury");
    await expect(page.getByRole("link", { name: /Our own translations/ })).toContainText("2 translations");
    await check();
    await page.goto("/treasury/translations");
    const one = page.getByRole("main").getByRole("listitem").filter({ hasText: "Placeholder Work One" });
    await one.getByRole("button", { name: "Remove", exact: true }).click();
    await page.locator('input[type="file"]').setInputFiles({ name: "placeholder-two.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(DOC_TWO)) });
    await expect(page.getByRole("button", { name: "Save it" })).toBeVisible();
    await check();
    await page.goto("/treasury/translations?id=placeholder-one");
    await expect(page.locator("#row-1-1").getByText("Published placeholder one.")).toBeVisible();
    await check();
  });
}

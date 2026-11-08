import { test, expect, type Page } from "@playwright/test";
import { encodeTune } from "../src/lib/lyre/tune-link";

// The Painted Stoa's board (/stoa/board). A pretend account and a pretend database: nothing is sent to, or written in,
// the real one. The database's own rules are tested apart, on a throwaway Postgres (supabase/tests/stoa_board_test.sql).

const KEY = "sb-kxwppdhbvlamcmgckqpg-auth-token";
const MOD = "00000000-0000-0000-0000-000000000001", MEMBER = "00000000-0000-0000-0000-00000000000a";
const session = (id: string) => ({
  access_token: "a.b.c", token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r",
  user: { id, aud: "authenticated", role: "authenticated", email: "someone@example.org", app_metadata: {}, user_metadata: {}, created_at: "2026-09-01T00:00:00Z" },
});
const profile = (id: string, role: "member" | "moderator") => ({ id, display_name: role === "moderator" ? "Keeper" : "Reader", bio: "", role, banned_until: null, ban_reason: null, created_at: "2026-09-01T00:00:00Z" });
const PIC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface Row { id: number; author_id: string; kind: string; title: string; body: string; link: string | null; picture: string | null; status: string; decided_at: string | null; created_at: string; author: unknown }
const row = (o: Partial<Row> & Pick<Row, "id" | "kind" | "title">): Row => ({
  author_id: MEMBER, body: "", link: null, picture: null, status: "shown", decided_at: null, created_at: "2026-10-30T10:00:00Z",
  author: { id: o.author_id ?? MEMBER, display_name: "Reader", role: "member" }, ...o,
});

interface Db { rows: Row[]; posted: Record<string, unknown>[]; decided: { p_id: number; p_show: boolean }[]; asked: string[] }

async function pretend(page: Page, who: "visitor" | "member" | "moderator", rows: Row[] = []): Promise<Db> {
  const db: Db = { rows: [...rows], posted: [], decided: [], asked: [] };
  const uid = who === "moderator" ? MOD : who === "member" ? MEMBER : null;
  await page.addInitScript(([k, s]) => {
    if (s && !localStorage.getItem(k)) localStorage.setItem(k, s);
    localStorage.setItem("mathesis:settings", JSON.stringify({ state: { theme: "paper", motion: "reduce" }, version: 2 }));
  }, [KEY, uid ? JSON.stringify(session(uid)) : ""] as const);
  const cors = { "access-control-allow-origin": "*" };
  // what this visitor may see, as the database's rules allow (migrations/20261101120000_stoa_board.sql)
  const visible = (r: Row) => r.status === "shown" || r.author_id === uid || who === "moderator";
  await page.route("**/rest/v1/**", async (route) => {
    const req = route.request(), url = new URL(req.url());
    const one = (req.headers()["accept"] ?? "").includes("vnd.pgrst.object");
    if (url.pathname.endsWith("/rpc/decide_board_item")) {
      const b = req.postDataJSON() as { p_id: number; p_show: boolean };
      db.decided.push(b);
      const r = db.rows.find((x) => x.id === b.p_id);
      if (r) r.status = b.p_show ? "shown" : "declined";
      return route.fulfill({ status: 204, body: "", headers: cors });
    }
    if (url.pathname.endsWith("/board_items")) {
      db.asked.push(`${req.method()} ${url.search}`);
      if (req.method() === "POST") {
        const b = req.postDataJSON() as Record<string, unknown>;
        db.posted.push(b);
        const r = row({ ...(b as Partial<Row>), id: 100 + db.posted.length, kind: b.kind as string, title: b.title as string, author_id: uid!, status: who === "moderator" ? "shown" : "waiting" });
        db.rows.push(r);
        return route.fulfill({ status: 201, json: one ? r : [r], headers: cors });
      }
      if (req.method() === "DELETE") {
        const id = Number(url.searchParams.get("id")?.replace("eq.", ""));
        db.rows = db.rows.filter((r) => r.id !== id);
        return route.fulfill({ json: [{ id }], headers: cors });
      }
      let list = db.rows.filter(visible);
      const p = url.searchParams;
      if (p.get("id")) list = list.filter((r) => r.id === Number(p.get("id")!.replace("eq.", "")));
      if (p.get("status")?.startsWith("eq.")) list = list.filter((r) => r.status === p.get("status")!.slice(3));
      if (p.get("status")?.startsWith("neq.")) list = list.filter((r) => r.status !== p.get("status")!.slice(4));
      if (p.get("kind")) list = list.filter((r) => r.kind === p.get("kind")!.replace("eq.", ""));
      if (p.get("author_id")) list = list.filter((r) => r.author_id === p.get("author_id")!.replace("eq.", ""));
      return route.fulfill({ json: one ? (list[0] ?? null) : list, headers: cors });
    }
    if (url.pathname.endsWith("/profiles") && uid) return route.fulfill({ json: one ? profile(uid, who as "member" | "moderator") : [profile(uid, who as "member" | "moderator")], headers: cors });
    return route.fulfill({ json: [], headers: cors });
  });
  await page.route("**/auth/v1/**", (route) => route.fulfill({ status: 400, json: { error: "no" }, headers: cors }));
  return db;
}

test.use({ timezoneId: "UTC", locale: "en-GB" });

test("the Painted Stoa leads to the board, among the things to make and play", async ({ page }) => {
  await page.goto("/stoa");
  const make = page.getByRole("navigation", { name: "Make, play and share" });
  await expect(make.getByRole("link", { name: /The board/ })).toHaveAttribute("href", "/stoa/board");
});

test("a visitor sees what was approved, can narrow it, and is asked to sign in to put something up", async ({ page }) => {
  const db = await pretend(page, "visitor", [
    row({ id: 1, kind: "thought", title: "On the word logos", body: "It means more than word." }),
    row({ id: 2, kind: "pot", title: "My first amphora", picture: PIC, link: "/stoa/pot#v=AA" }),
    row({ id: 3, kind: "thought", title: "Waiting thought", body: "Not yet.", status: "waiting" }),
  ]);
  await page.goto("/stoa/board");
  const wall = page.getByRole("region", { name: "On the board" });
  await expect(wall.getByRole("article")).toHaveCount(2);
  await expect(wall.getByRole("link", { name: "On the word logos" })).toHaveAttribute("href", "/stoa/board/item?id=1");
  await expect(wall.getByRole("img", { name: "A painted pot: My first amphora" })).toBeVisible();
  await expect(page.getByText("Waiting thought")).toHaveCount(0);
  await wall.getByRole("button", { name: "Pots" }).click();
  await expect(page).toHaveURL(/[?&]k=pot/);
  await expect(wall.getByRole("article")).toHaveCount(1);
  expect(db.asked.some((a) => a.includes("kind=eq.pot"))).toBe(true);
  // a visitor asks only for what is up, never for what waits
  expect(db.asked.every((a) => a.includes("status=eq.shown"))).toBe(true);

  await page.getByRole("link", { name: "Put something on the board" }).click();
  await expect(page.getByRole("main").getByRole("link", { name: /^Sign in or join/ })).toHaveAttribute("href", "/account?next=%2Fstoa%2Fboard%2Fnew");
});

test("a member writes about an entry; it waits, seen only by them", async ({ page }) => {
  const db = await pretend(page, "member");
  await page.goto("/stoa/melos");
  await page.getByRole("button", { name: "Write about it on the board" }).click();
  await expect(page).toHaveURL(/\/stoa\/board\/new/);
  await expect(page.getByRole("radio", { name: "A thought" })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("link", { name: "The Melian Dialogue" })).toHaveAttribute("href", "/stoa/melos");
  await page.getByLabel("Title").fill("The Melian dialogue");
  await page.getByLabel("Your thought").fill("Thucydides gives both sides their say.");
  await page.getByRole("button", { name: "Put it up" }).click();
  await expect(page.getByText(/once the site.s keeper has looked at it/)).toBeVisible();
  expect(db.posted).toEqual([{ kind: "thought", title: "The Melian dialogue", body: "Thucydides gives both sides their say.", link: "/stoa/melos", picture: null }]);

  await page.getByRole("link", { name: "Back to the board" }).click();
  const mine = page.getByRole("region", { name: "Yours, not on the board yet" });
  await expect(mine.getByRole("article")).toHaveCount(1);
  await expect(mine).toContainText("Waiting to be approved");
});

test("the moderator approves what waits, and it goes up", async ({ page }) => {
  const db = await pretend(page, "moderator", [row({ id: 7, kind: "thought", title: "A first thought", body: "Hello.", status: "waiting" })]);
  await page.goto("/stoa/board");
  const waiting = page.getByRole("region", { name: /Waiting for you/ });
  await expect(waiting).toContainText("1");
  await waiting.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByRole("region", { name: "On the board" }).getByRole("link", { name: "A first thought" })).toBeVisible();
  await expect(page.getByRole("region", { name: /Waiting for you/ })).toHaveCount(0);
  expect(db.decided).toEqual([{ p_id: 7, p_show: true }]);
});

test("a tune's own page draws it and opens it on the lyre", async ({ page }) => {
  const code = await encodeTune({ song: null, tuning: "ancient", plucks: [{ t: 0, m: 60, s: 0.6 }, { t: 400, m: 64, s: 0.8 }, { t: 800, m: 67, s: 1 }] });
  await pretend(page, "visitor", [row({ id: 5, kind: "tune", title: "Three notes", link: `/stoa/lyre#tune=${code}` })]);
  await page.goto("/stoa/board/item?id=5");
  await expect(page.getByRole("heading", { level: 1, name: "Three notes" })).toBeVisible();
  await expect(page.getByRole("img", { name: /A tune: Three notes: 3 notes/ })).toBeVisible();
  await expect(page.getByRole("img", { name: /A tune/ }).locator("circle")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Play it on the lyre" })).toHaveAttribute("href", `/stoa/lyre#tune=${code}`);
});

test("a pot painted in the potter goes to the board with its picture", async ({ page }) => {
  const db = await pretend(page, "member");
  await page.goto("/stoa/pot");
  await page.getByRole("button", { name: "Paint it yourself" }).click();
  await page.getByRole("button", { name: "Put it on the board" }).click();
  await expect(page).toHaveURL(/\/stoa\/board\/new/);
  await expect(page.getByRole("radio", { name: "A painted pot" })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("img[alt^='A painted pot']")).toBeVisible();
  await page.getByLabel("Title").fill("A vase for Athena");
  await page.getByRole("button", { name: "Put it up" }).click();
  await expect(page.getByText(/^Thank you\./)).toBeVisible();
  expect(db.posted).toHaveLength(1);
  expect(db.posted[0].kind).toBe("pot");
  expect(String(db.posted[0].picture)).toMatch(/^data:image\/(webp|jpeg);base64,/);
  expect(String(db.posted[0].picture).length).toBeLessThan(200_000);
  expect(String(db.posted[0].link)).toMatch(/^\/stoa\/pot#v=/);
});

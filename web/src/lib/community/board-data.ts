"use client";
/**
 * Reading and writing the Painted Stoa's board. Everything goes through the database's row-level security rules
 * (supabase/migrations/20261101120000_stoa_board.sql): a visitor reads only what the moderator has approved, a member also
 * their own, and only the moderator approves. What is refused there is not just hidden here.
 */
import { supabase } from "./client";
import type { BoardDraft, BoardKind, BoardStatus } from "@/lib/board";

export interface BoardAuthor { id: string; display_name: string; role: "member" | "moderator" }
export interface BoardItem {
  id: number; author_id: string; kind: BoardKind; title: string; body: string; link: string | null; picture: string | null;
  status: BoardStatus; decided_at: string | null; created_at: string; author: BoardAuthor | null;
}

const COLUMNS = "id, author_id, kind, title, body, link, picture, status, decided_at, created_at, author:profiles!board_items_author_id_fkey(id, display_name, role)";
export const BOARD_PAGE = 24;

function must<T>(r: { data: T | null; error: unknown }): T {
  if (r.error) throw r.error;
  return r.data as T;
}

/** What is up on the board, newest first: approved items only (whatever else this visitor may see). */
export async function shownItems(o: { kind?: BoardKind | null; page?: number } = {}): Promise<{ rows: BoardItem[]; more: boolean }> {
  const from = (o.page ?? 0) * BOARD_PAGE;
  let q = supabase().from("board_items").select(COLUMNS).eq("status", "shown");
  if (o.kind) q = q.eq("kind", o.kind);
  const rows = must(await q.order("created_at", { ascending: false }).range(from, from + BOARD_PAGE)) as unknown as BoardItem[];
  return { rows: rows.slice(0, BOARD_PAGE), more: rows.length > BOARD_PAGE };
}

/** For the moderator: everything waiting, oldest first (the order it came in). For a member: their own not yet shown. */
export async function notYetShown(o: { mine?: string } = {}): Promise<BoardItem[]> {
  let q = supabase().from("board_items").select(COLUMNS).neq("status", "shown");
  if (o.mine) q = q.eq("author_id", o.mine); else q = q.eq("status", "waiting");
  return must(await q.order("created_at", { ascending: true }).limit(100)) as unknown as BoardItem[];
}

export async function boardItem(id: number): Promise<BoardItem | null> {
  return must(await supabase().from("board_items").select(COLUMNS).eq("id", id).maybeSingle()) as unknown as BoardItem | null;
}

/** Put something up; it waits for the moderator (theirs goes up at once). Returns the new item. */
export async function putUp(d: BoardDraft): Promise<BoardItem> {
  const row = { kind: d.kind, title: d.title.trim(), body: d.body.trim(), link: d.link || null, picture: d.picture || null };
  return must(await supabase().from("board_items").insert(row).select(COLUMNS).single()) as unknown as BoardItem;
}

export async function takeDown(id: number): Promise<void> {
  must(await supabase().from("board_items").delete().eq("id", id).select("id"));
}

/** The moderator shows an item on the board, or declines it. */
export async function decide(id: number, show: boolean): Promise<void> {
  must(await supabase().rpc("decide_board_item", { p_id: id, p_show: show }));
}

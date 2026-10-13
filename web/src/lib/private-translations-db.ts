"use client";
/**
 * Reading and writing the private translations (table private_translations). The database lets only the
 * moderator see or change a row (row-level security, supabase/migrations/20261013120000_private_translations.sql):
 * for anyone else every list is empty and every change is refused, whatever this page does. The answers are
 * never kept in the browser's cache (the client asks for them with cache "no-store", lib/community/client.ts),
 * and the page keeps them only in memory.
 */
import { supabase } from "./community/client";

export const TABLE = "private_translations";

/** A stored translation as the list shows it: a few fields read out of the document, not the whole text. */
export interface StoredSummary {
  id: string;
  updated_at: string;
  title: string | null;
  author: string | null;
  status: string | null;
  greekTitle: string | null;
  updated: string | null;
}
export interface StoredDoc { id: string; doc: unknown; updated_at: string }

function must<T>(r: { data: T | null; error: unknown }): T {
  if (r.error) throw r.error;
  return r.data as T;
}

export async function listTranslations(): Promise<StoredSummary[]> {
  return must(await supabase().from(TABLE)
    .select("id, updated_at, title:doc->>title, author:doc->>author, status:doc->>status, greekTitle:doc->>greekTitle, updated:doc->>updated")
    .order("updated_at", { ascending: false })) as StoredSummary[];
}

export async function getTranslation(id: string): Promise<StoredDoc | null> {
  return must(await supabase().from(TABLE).select("id, doc, updated_at").eq("id", id).maybeSingle()) as StoredDoc | null;
}

/** Add a translation, or replace the stored one with the same id. The database sets updated_at itself. */
export async function saveTranslation(id: string, raw: Record<string, unknown>): Promise<void> {
  const { error } = await supabase().from(TABLE).upsert({ id, doc: raw }, { onConflict: "id" });
  if (error) throw error;
}

/** Remove a translation; false when there was nothing to remove. */
export async function removeTranslation(id: string): Promise<boolean> {
  const rows = must(await supabase().from(TABLE).delete().eq("id", id).select("id")) as { id: string }[];
  return rows.length > 0;
}

/** A plain-English message for a failure. */
export function trouble(e: unknown): string {
  const m = (e as { message?: string } | null)?.message ?? String(e);
  const code = (e as { code?: string } | null)?.code ?? "";
  if (/Failed to fetch|NetworkError|Load failed|FetchError/i.test(m)) return "The site's database could not be reached. Check the connection light at the top of the page, then try again.";
  if (code === "42P01" || code === "PGRST205" || (/private_translations/.test(m) && /does not exist|schema cache/i.test(m))) {
    return "The database has no place for translations yet. Run the migration 20261013120000_private_translations.sql in the Supabase SQL editor first (PROGRESS.md says how).";
  }
  if (/JWT expired/i.test(m)) return "Your sign-in has run out. Sign in again, then try once more.";
  if (/JWT|not authenticated|permission denied|row-level security/i.test(m)) return "The database refused: only the moderator may do this. Are you signed in with the moderator's account?";
  if (/private_translations_id_check/.test(m)) return "The id may use only lowercase letters, digits and hyphens, at most 80 of them.";
  if (/too large|payload|413/i.test(m)) return "The database refused the file as too large.";
  return `Something went wrong: ${m}`;
}

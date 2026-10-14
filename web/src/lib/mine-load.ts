"use client";
/**
 * Opening a book of the private collection in the reader (lib/mine.ts). As on the shelf in Mine, the database is asked
 * only once the account is known to be the moderator's, and its library (lib/private-translations-db.ts, which brings
 * supabase-js) is loaded only then: everyone else's reader never loads it. The text is kept only in memory.
 */
import { useEffect, useState } from "react";
import { hasSavedSession, isModerator, useAccount } from "@/lib/community/account";
import { checkTranslation, type TranslationDoc } from "@/lib/private-translations";
import { isMine, mineId } from "@/lib/mine";

export type MineState =
  | { state: "none" }                                   // not a book of the private collection
  | { state: "waiting" }                                // reading the account, or the book
  | { state: "signed-out" }
  | { state: "private" }                                // signed in, but not as the moderator
  | { state: "missing" }                                // nothing with this id
  | { state: "broken"; problems: string[] }             // stored, but no longer passes the check
  | { state: "error"; message: string }
  | { state: "ready"; doc: TranslationDoc; savedAt: string };

/** Is this browser signed in as the moderator? (Supabase is contacted only if it is signed in at all.) */
export function useIsModerator(): boolean {
  const { profile, start } = useAccount();
  useEffect(() => { if (hasSavedSession()) start(); }, [start]);
  return isModerator(profile);
}

/** The private book `work` names (mine:<id>), fetched again when `retry` changes. */
export function useMineBook(work: string, retry = 0): MineState {
  const mine = isMine(work);
  const { ready, session, profile, start } = useAccount();
  useEffect(() => { if (mine) start(); }, [mine, start]);
  const mod = isModerator(profile);
  const [got, setGot] = useState<{ key: string; s: MineState } | null>(null);
  const key = `${work}|${retry}`;

  useEffect(() => {
    if (!mine || !mod) return;
    let live = true;
    import("@/lib/private-translations-db").then(async (db) => {
      try {
        const stored = await db.getTranslation(mineId(work));
        if (!live) return;
        if (!stored) { setGot({ key, s: { state: "missing" } }); return; }
        const c = checkTranslation(stored.doc);
        setGot({ key, s: c.ok ? { state: "ready", doc: c.doc, savedAt: stored.updated_at } : { state: "broken", problems: c.problems } });
      } catch (e) {
        if (live) setGot({ key, s: { state: "error", message: db.trouble(e) } });
      }
    }, () => { if (live) setGot({ key, s: { state: "error", message: "This page could not load what it needs. Check the connection, then try again." } }); });
    return () => { live = false; };
  }, [mine, mod, work, key]);

  if (!mine) return { state: "none" };
  if (!ready || (session && !profile)) return { state: "waiting" };
  if (!session) return { state: "signed-out" };
  if (!mod) return { state: "private" };
  // while a new try is under way, the book already open stays open
  if (got && (got.key === key || (got.s.state === "ready" && got.key.startsWith(`${work}|`)))) return got.s;
  return { state: "waiting" };
}

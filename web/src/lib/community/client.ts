"use client";
/**
 * The connection to Supabase (accounts, the Agora, the Pnyx). The signed-in member, and the
 * privacy rules for when Supabase is contacted, are in ./account (re-exported here).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ACCOUNTS_ON, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/config/supabase";
import { STORAGE_KEY } from "./account";

export * from "./account";

/**
 * Every request goes out as usual, except that the private translations (lib/private-translations-db.ts) are
 * asked for with cache "no-store": the browser neither keeps their text in its cache nor answers from it.
 * (The offline helper, public/sw.js, never touches another site's answers, Supabase's included.)
 */
const PRIVATE = "/rest/v1/private_translations";
const send: typeof fetch = (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  return fetch(input, url.includes(PRIVATE) ? { ...init, cache: "no-store" } : init);
};

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (!ACCOUNTS_ON) throw new Error("Accounts are off: this copy of the site was built without the Supabase settings (src/config/supabase.ts).");
  client ??=createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce", storageKey: STORAGE_KEY },
    global: { fetch: send },
  });
  return client;
}


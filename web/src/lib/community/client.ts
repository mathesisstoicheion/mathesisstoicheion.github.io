"use client";
/**
 * The connection to Supabase (accounts, the Town Hall, the Pnyx). The signed-in member, and the
 * privacy rules for when Supabase is contacted, are in ./account (re-exported here).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ACCOUNTS_ON, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/config/supabase";
import { STORAGE_KEY } from "./account";

export * from "./account";

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (!ACCOUNTS_ON) throw new Error("Accounts are off: this copy of the site was built without the Supabase settings (src/config/supabase.ts).");
  client ??=createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce", storageKey: STORAGE_KEY },
  });
  return client;
}


/**
 * The Supabase project behind accounts, the Town Hall and the Pnyx. Both values come from the build
 * settings: on GitHub, the repository's variables SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (passed in
 * by .github/workflows/deploy.yml); on a development computer, web/.env.local. A copy of the project
 * without them builds a site with no accounts, and never writes to this site's database.
 *
 * The publishable key only lets a browser do what the database's row-level security rules allow
 * (supabase/migrations). The secret key is never used by the site and must never be put anywhere here.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const ACCOUNTS_ON = SUPABASE_URL !== "" && SUPABASE_PUBLISHABLE_KEY !== "";

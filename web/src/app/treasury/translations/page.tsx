import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import PrivateTranslations from "@/components/admin/PrivateTranslations";
import { NOINDEX } from "@/lib/seo";

/**
 * The moderator's private translations, in Mine (the Treasury). Only the page's code is public: the translations
 * themselves live in the database, which hands them to the moderator alone (components/admin/PrivateTranslations.tsx).
 * Linked only from the Treasury, and only for the moderator (components/treasury/PrivateShelf.tsx); kept out of
 * search engines, the sitemap and the offline copy (config/pages.ts, ADMIN_PAGES).
 */
export const metadata: Metadata = { title: "Private translations", ...NOINDEX };

export default function PrivateTranslationsPage() {
  return (
    <Page>
      {/* each state of the page shows its own title */}
      <Suspense>
        <PrivateTranslations />
      </Suspense>
    </Page>
  );
}

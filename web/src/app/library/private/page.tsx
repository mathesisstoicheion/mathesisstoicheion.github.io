import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import PrivateCollection from "@/components/library/PrivateCollection";
import { NOINDEX } from "@/lib/seo";

/**
 * The private collection's own page, in the library (owner's request, 2026-10-14: "And it should be its own page"). Only
 * the page's code is public: the books live in the database, which hands them to the moderator alone. Linked only for
 * the moderator (components/library/MineButtons.tsx); kept out of search engines, the sitemap and the offline copy
 * (config/pages.ts, ADMIN_PAGES).
 */
export const metadata: Metadata = { title: "Private collection", ...NOINDEX };

export default function PrivateCollectionPage() {
  return (
    <Page>
      <Suspense>
        <PrivateCollection />
      </Suspense>
    </Page>
  );
}

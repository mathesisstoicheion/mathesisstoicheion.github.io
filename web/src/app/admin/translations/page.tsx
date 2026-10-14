import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Moved from "@/components/admin/Moved";
import { NOINDEX } from "@/lib/seo";

/** The private translations' first address: they now live in Mine (config/admin.ts), and this page sends any old link there. */
export const metadata: Metadata = { title: "Private translations", ...NOINDEX };

export default function MovedPage() {
  return (
    <Page>
      <Suspense>
        <Moved />
      </Suspense>
    </Page>
  );
}

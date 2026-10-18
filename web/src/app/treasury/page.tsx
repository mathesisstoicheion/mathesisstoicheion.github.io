import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Treasury from "@/components/treasury/Treasury";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.treasury.name} · ${AREAS.treasury.english}`, ...NOINDEX };

export default function TreasuryPage() {
  return (
    <Page>
      <Suspense fallback={null}>
        <Treasury />
      </Suspense>
    </Page>
  );
}

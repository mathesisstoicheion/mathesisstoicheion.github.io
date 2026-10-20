import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import Member from "@/components/community/Member";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: "A member · The Agora", ...NOINDEX };

export default function MemberPage() {
  return (
    <Page>
      <Suspense>
        <Member />
      </Suspense>
    </Page>
  );
}

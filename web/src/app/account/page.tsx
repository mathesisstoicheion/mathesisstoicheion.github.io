import type { Metadata } from "next";
import Page from "@/components/Page";
import Account from "@/components/community/Account";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: "Your account", ...NOINDEX };

export default function AccountPage() {
  return (
    <Page>
      <Account />
    </Page>
  );
}

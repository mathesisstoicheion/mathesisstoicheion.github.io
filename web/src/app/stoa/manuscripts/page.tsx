import type { Metadata } from "next";
import Page from "@/components/Page";
import RefHead from "@/components/stoa/RefHead";
import Transmission from "@/components/stoa/Transmission";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `Manuscripts & transmission · ${AREAS.wiki.name}`, description: PAGE_DESCRIPTIONS.manuscripts };

export default function ManuscriptsPage() {
  return (
    <Page>
      <RefHead title="Manuscripts & transmission" greek="Παράδοσις">How each author&apos;s words reached us: copied by hand on papyrus and parchment, edited, and at last printed. The accounts from the author articles, side by side.</RefHead>
      <Transmission part="transmission" />
    </Page>
  );
}

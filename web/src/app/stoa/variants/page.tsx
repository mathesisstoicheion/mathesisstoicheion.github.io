import type { Metadata } from "next";
import Page from "@/components/Page";
import RefHead from "@/components/stoa/RefHead";
import Transmission from "@/components/stoa/Transmission";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `Textual variants · ${AREAS.wiki.name}`, description: PAGE_DESCRIPTIONS.variants };

export default function VariantsPage() {
  return (
    <Page>
      <RefHead title="Textual variants" greek="Γραφαί">Where the copies disagree about the words, and how editors choose between them. The accounts from the author articles, side by side.</RefHead>
      <Transmission part="variants" />
    </Page>
  );
}

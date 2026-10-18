import type { Metadata } from "next";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import Alphabet from "@/components/academy/Alphabet";
import { AREAS, trail } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `The alphabet · ${AREAS.study.name}`, description: PAGE_DESCRIPTIONS.alphabet };

export default function AlphabetPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <PageHead bare path={trail("study", "The alphabet")} title="The alphabet" greek="τὰ γράμματα"
          purpose="Twenty-four letters, seven of them vowels. Choose a letter to see how it is written, what it is called, and how it sounded." />
        <Alphabet />
      </div>
    </Page>
  );
}

import type { Metadata } from "next";
import Page from "@/components/Page";
import PageHead from "@/components/PageHead";
import Tables from "@/components/academy/Tables";
import { AREAS, trail } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `Tables of forms · ${AREAS.study.name}`, description: PAGE_DESCRIPTIONS.tables };

export default function TablesPage() {
  return (
    <Page>
      <div className="wrap" style={{ paddingBlock: "0 clamp(32px, 5vw, 56px)", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
        <PageHead bare path={trail("study", "Tables of forms")} title="Tables of forms" greek="παραδείγματα"
          purpose="The standard patterns of Attic Greek. Learn the endings, not every word: thousands of words follow these same tables." />
        <Tables />
      </div>
    </Page>
  );
}

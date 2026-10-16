import type { Metadata } from "next";
import { Suspense } from "react";
import Page from "@/components/Page";
import AreaHeader from "@/components/AreaHeader";
import Search from "@/components/search/Search";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.search.name} · ${AREAS.search.english}`, ...NOINDEX };

export default function SearchPage() {
  return (
    <Page>
      <AreaHeader id="search" carve={{
        text: "Γνῶθι σαυτόν",
        caption: <><span lang="grc">Γνῶθι σαυτόν</span>, “Know thyself”: one of the maxims written in the fore-temple at Delphi
          (Pausanias, <i>Description of Greece</i> 10.24.1, translated by W. H. S. Jones and H. A. Ormerod).</>,
      }} />
      <Suspense fallback={null}>
        <Search />
      </Suspense>
    </Page>
  );
}

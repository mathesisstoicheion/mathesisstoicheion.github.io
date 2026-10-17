import type { Metadata } from "next";
import Page from "@/components/Page";
import Search from "@/components/search/Search";
import { AREAS } from "@/config/areas";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.search.name} · ${AREAS.search.english}`, ...NOINDEX };

// The Oracle's header (with its kinds of search and its box straight under the title) and its results are one client
// component (components/search/Search.tsx), because they share the address and the word typed in "Near another word".
export default function SearchPage() {
  return (
    <Page>
      <Search />
    </Page>
  );
}

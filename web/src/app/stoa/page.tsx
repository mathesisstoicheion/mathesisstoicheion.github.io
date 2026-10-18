import type { Metadata } from "next";
import Page from "@/components/Page";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import StoaIndex, { type RefCard } from "@/components/stoa/StoaIndex";
import { cardOf } from "@/wiki/cards";
import { ENTRIES } from "@/wiki/index";
import ExploreLead, { ExploreCredit } from "@/components/stoa/ExploreLead";
import type { Catalog } from "@/lib/catalog";
import { AREAS } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";

export const metadata: Metadata = { title: `${AREAS.wiki.name} · ${AREAS.wiki.english}`, description: PAGE_DESCRIPTIONS.stoa };

// The head with its search, the featured entry and the rooms (StoaIndex); the map, the Census and Archaeology follow
// (ExploreLead), and the reference pages are the last room. Counts for the reference pages, taken from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const TEXTS = CATALOG.authors.flatMap((a) => a.works.flatMap((w) => w.texts)).length;
const n = (x: number) => x.toLocaleString("en-GB");
const REFERENCE: RefCard[] = [
  { href: "/stoa/authors", title: "Authors", greek: "Συγγραφεῖς", blurb: `${n(CATALOG.authors.length)} authors, by period and by kind of writing.` },
  { href: "/stoa/eras", title: "Eras of Greek", greek: "Χρόνοι", blurb: "Greek through the centuries: what the library holds from each period." },
  // παράδοσις "handing down, transmission"; γραφή "MS. reading" (LSJ, παράδοσις A, γραφή II.2.d)
  { href: "/stoa/manuscripts", title: "Manuscripts & transmission", greek: "Παράδοσις", blurb: "How each author's words reached us, from papyrus to print, with the roads of the texts side by side." },
  { href: "/stoa/variants", title: "Textual variants", greek: "Γραφαί", blurb: "Where the copies disagree about the words, and how editors choose." },
  { href: "/stoa/lyre", title: "The lyre", greek: "Λύρα", blurb: "Play a Greek lyre, and play along with the melodies that survive in ancient notation." },
  { href: "/stoa/editions", title: "Editions & translations", greek: "Ἐκδόσεις", blurb: `The printed source behind each of the ${n(TEXTS)} texts, grouped by publisher.` },
];

export default function StoaPage() {
  return (
    <Page>
      <StoaIndex entries={ENTRIES.map(cardOf)} reference={REFERENCE} lead={<ExploreLead />} foot={<ExploreCredit />} />
    </Page>
  );
}

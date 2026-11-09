import type { Metadata } from "next";
import Page from "@/components/Page";
import Door, { DoorBlock } from "@/components/a/Door";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import StoaIndex, { type RefCard } from "@/components/stoa/StoaIndex";
import { cardOf } from "@/wiki/cards";
import { ENTRIES } from "@/wiki/index";
import ExploreLead, { ExploreCredit, MakeAndPlay } from "@/components/stoa/ExploreLead";
import { WhyStoics } from "@/components/stoa/StoaPlates";
import type { Catalog } from "@/lib/catalog";
import { areaTitle } from "@/config/areas";
import { PAGE_DESCRIPTIONS } from "@/lib/seo";
import Link from "next/link";
import { AREAS } from "@/config/areas";
import { CATEGORIES } from "@/wiki/types";
import styles from "@/components/stoa/Stoa.module.css";

export const metadata: Metadata = { title: areaTitle("wiki"), description: PAGE_DESCRIPTIONS.stoa };

// The map, the Census and Archaeology lead the page (ExploreLead), then the lyre and the potter (MakeAndPlay); the search
// and the index of entries follow, and the reference pages are the index's last part. Then the plates of works in stone and "Why Stoics are called Stoics" (from the
// home page; redesign SPEC.md 4.4), and the small print. Counts for the reference pages, taken from the catalogue when the
// site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const TEXTS = CATALOG.authors.flatMap((a) => a.works.flatMap((w) => w.texts)).length;
const n = (x: number) => x.toLocaleString("en-GB");
const REFERENCE: RefCard[] = [
  { href: "/stoa/authors", title: "Authors", greek: "Συγγραφεῖς", blurb: `${n(CATALOG.authors.length)} authors, by period and by kind of writing.` },
  { href: "/stoa/eras", title: "Eras of Greek", greek: "Χρόνοι", blurb: "Greek through the centuries: what the library holds from each period." },
  // παράδοσις "handing down, transmission"; γραφή "MS. reading" (LSJ, παράδοσις A, γραφή II.2.d)
  { href: "/stoa/manuscripts", title: "Manuscripts & transmission", greek: "Παράδοσις", blurb: "How each author's words reached us, from papyrus to print, with the roads of the texts side by side." },
  { href: "/stoa/variants", title: "Textual variants", greek: "Γραφαί", blurb: "Where the copies disagree about the words, and how editors choose." },
  { href: "/stoa/editions", title: "Editions & translations", greek: "Ἐκδόσεις", blurb: `The printed source behind each of the ${n(TEXTS)} texts, grouped by publisher.` },
];

export default function StoaPage() {
  return (
    <Page>
      {/* one search box, the colonnade's own, beside what it finds (review fix list, slice 9) */}
      {/* 2026-11-09, the owner: the wikis are the Stoa's main function, everything else secondary; a short introduction
          under the head and the page's contents at its top right. So: the entries first (the entry of the day, the search,
          the index), then the map, the Census and Archaeology, then the lyre, the potter and the board. */}
      <Door id="wiki" intro={<>Here are {ENTRIES.length} entries on how the Greeks lived, ruled, believed and fought, each built on the texts in the library, with the map, the Census of names and the library&apos;s reference pages beside them.</>}
        side={<StoaContents />}>
        <DoorBlock><StoaIndex entries={ENTRIES.map(cardOf)} reference={REFERENCE} /></DoorBlock>
        <DoorBlock><ExploreLead /></DoorBlock>
        <DoorBlock><MakeAndPlay /></DoorBlock>
        <DoorBlock id="stoics" label="Why Stoics are called Stoics"><WhyStoics /><ExploreCredit /></DoorBlock>
      </Door>
    </Page>
  );
}

/** The page's contents, at the right of its head on a computer and under it on a phone: the entries by subject, with how
 *  many each holds, then the rest of the Stoa. Each is a link to its part of the page or its own page. */
function StoaContents() {
  const count = (c: string) => ENTRIES.filter((e) => e.category === c).length;
  return (
    <nav className={styles.landContents} aria-labelledby="stoa-contents-h">
      <p id="stoa-contents-h" className="label">In the Stoa</p>
      <ol className={styles.landList}>
        {CATEGORIES.filter((c) => count(c.id)).map((c) => (
          <li key={c.id}><a href={`#${c.id}`}><span>{c.title}</span><b>{count(c.id)}</b></a></li>
        ))}
        <li><a href="#reference"><span>Reference</span><b>{REFERENCE.length}</b></a></li>
      </ol>
      <p className={styles.landMore}>
        <Link href={AREAS.map.href}>The map</Link> · <Link href={AREAS.census.href}>The Census</Link> · <Link href="/stoa/kerameikos">Archaeology</Link> · <Link href={AREAS.lyre.href}>The lyre</Link> · <Link href={AREAS.pot.href}>The potter</Link> · <Link href={AREAS.board.href}>The board</Link>
      </p>
    </nav>
  );
}

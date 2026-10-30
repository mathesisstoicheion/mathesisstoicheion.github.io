import Page from "@/components/Page";
import HomeStarts from "@/components/home/HomeStarts";
import HomeDesk from "@/components/home/HomeDesk";
import HomePassage from "@/components/home/HomePassage";
import FamousBooks, { type Book } from "@/components/library/FamousBooks";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { greekEditions, hasTranslation, type Catalog } from "@/lib/catalog";
import { MEDALLIONS } from "@/data/medallions";
import h from "@/components/home/Home.module.css";

/** The cross that closes the page either side of ΤΕΛΟΣ, as the sample sets it ("✠"): drawn, since none of the three typefaces
 *  has the sign, in the red of the words around it (Home.module.css .cross) */
const Cross = () => (
  <svg className={h.cross} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 50 38 4 50 16 62 4z M50 50 96 38 84 50 96 62z M50 50 62 96 50 84 38 96z M50 50 4 62 16 50 4 38z" />
  </svg>
);

// the catalogue, read when the site is built
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;

// a work's Greek title: the first of its Greek editions' names written in Greek (some are catalogued by a Latin name)
const greekTitle = (w: Catalog["authors"][number]["works"][number]) =>
  greekEditions(w).map((e) => e.label).find((l): l is string => !!l && /[Ͱ-Ͽἀ-῿]/.test(l)) ?? "";

/** the six famous books, in their two groups (data/medallions.ts), moved here from the library (the owner, 2026-10-25) */
const BOOKS: Book[] = MEDALLIONS.map(({ group, id, about }) => {
  const a = CATALOG.authors.find((x) => x.works.some((w) => w.id === id))!, w = a.works.find((x) => x.id === id)!;
  return { id, group, author: a.name, title: w.title, greek: greekTitle(w), about, english: hasTranslation(w) };
});

/**
 * The home page, as the printed page sets it (the owner's choice, 2026-10-22; redesign SPEC.md 4.1, decision 7), shorter
 * than before and in this order: the title page; "Where are you starting?" (or, for a visitor coming back, their desk);
 * the passage of the day; six famous books (moved here from the library, the owner, 2026-10-25); the end, with the
 * colophon. No photographs (the owner, 2026-10-25: they "take the focus away from the websites main focus: Reading").
 * "Why Stoics are called Stoics" is in Explore now. One way to each place (the owner, 2026-10-30: "Nothing should have
 * multiple buttons that lead to the same place"): the title page has no buttons of its own, as the three starts just under
 * it (or the desk) are the ways in; the rooms' Contents is gone, the rooms being in the header and along the foot of a
 * phone; the colophon names the typefaces only, the sources and the pictures' credits being in the foot of the page.
 */
export default function Home() {
  return (
    <Page screen="home">
      <div className="wrap">
        <div className={h.titlePage} data-head="">
          <div className="enter">
            {/* one run of words beside the red rule, so on a phone it wraps as one line does */}
            <div className={`${h.kicker} label`} data-head-path=""><span><span lang="grc">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · learning the letters</span></div>
            <h1 className={h.title} data-head-title="">Read the Greeks in <em>their own</em> words</h1>
            <p className={h.lede}>Learn to read Ancient Greek, and meet the world that wrote it.</p>
          </div>
        </div>
        <div className={h.drawn} aria-hidden="true" />

        {/* a first visit: where are you starting?; a returning visitor: their desk (lib/visitor.ts) */}
        <section className={h.part} aria-labelledby="start-title">
          <div className="sh rv">
            <h2 id="start-title"><span className="first-only">Where are you <em>starting?</em></span><span className="back-only">Your <em>desk</em></span></h2>
            <span className="fill" />
          </div>
          <div className="first-only"><HomeStarts /></div>
          <div className="back-only"><HomeDesk /></div>
        </section>

        <HomePassage />

        <section className={h.part} aria-labelledby="famous-title">
          <div className="sh rv"><h2 id="famous-title">Six famous <em>works</em></h2><span className="fill" /><span className="src">to begin with</span></div>
          <div className="rv"><FamousBooks books={BOOKS} /></div>
        </section>

        <p className={h.fin} aria-hidden="true"><Cross /> ΤΕΛΟΣ <Cross /></p>
        <p className={h.colophon}><b>Colophon.</b> Set in EB Garamond, GFS Didot and Gentium Book Plus.</p>
      </div>
    </Page>
  );
}

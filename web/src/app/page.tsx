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
const WORKS = CATALOG.authors.reduce((t, a) => t + a.works.length, 0);
const n = (x: number) => x.toLocaleString("en-GB");

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
        {/* 2026-11-09, the owner: the app needs a home (it is a main button now), and landing on a page should be
            "visually interesting, intuitive, informative and useful", on 16:9, 16:10 and phones; reading stays the main
            focus. So the gate holds the three things a reader comes for, all in view on landing: the title with a search
            of the library (find a text), where to start or your desk, and at its right the passage of the day, real
            Greek to read and look up at once. */}
        <div className={h.gate}>
          <div className={h.gateMain}>
            <div className={h.titlePage} data-head="">
              <div className="enter">
                {/* one run of words beside the red rule, so on a phone it wraps as one line does */}
                <div className={`${h.kicker} label`} data-head-path=""><span><span lang="grc">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · learning the letters</span></div>
                <h1 className={h.title} data-head-title="">Read the Greeks in <em>their own</em> words</h1>
                <p className={h.lede}>{n(WORKS)} Greek works, from Homer to the Byzantine scholars, with every word explained where it stands.</p>
                {/* finding a text: the library's own search, opened with the words written here */}
                <form className={h.find} action="/library" method="get" role="search">
                  <label className="label" htmlFor="home-find">Find a text</label>
                  <span className={h.findRow}>
                    <input id="home-find" name="q" type="search" enterKeyHint="search" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                      placeholder="Homer, Plato, the Iliad, Ἰλιάς…" />
                    <button type="submit" className="btn">Search</button>
                  </span>
                </form>
              </div>
            </div>

            {/* a first visit: where are you starting?; a returning visitor: their desk (lib/visitor.ts) */}
            <section className={h.startPart} aria-labelledby="start-title">
              <h2 id="start-title" className="label"><span className="first-only">Where are you starting?</span><span className="back-only">Your desk</span></h2>
              <div className="first-only"><HomeStarts /></div>
              <div className="back-only"><HomeDesk /></div>
            </section>
          </div>
          <div className={h.gateSide}><HomePassage /></div>
        </div>
        <div className={h.drawn} aria-hidden="true" />

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

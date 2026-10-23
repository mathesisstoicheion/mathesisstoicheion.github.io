import Link from "next/link";
import Page from "@/components/Page";
import Plate from "@/components/plate/Plate";
import HomeStarts from "@/components/home/HomeStarts";
import HomeDesk from "@/components/home/HomeDesk";
import HomePassage from "@/components/home/HomePassage";
import { AREAS, FORUM_OPEN, shown, type AreaId } from "@/config/areas";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { hasTranslation, type Catalog } from "@/lib/catalog";
import { maker, objectDate, photo } from "@/lib/photos";
import h from "@/components/home/Home.module.css";

/** The cross that closes the page either side of ΤΕΛΟΣ, as the sample sets it ("✠"): drawn, since none of the three typefaces
 *  has the sign, in the red of the words around it (Home.module.css .cross) */
const Cross = () => (
  <svg className={h.cross} viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 50 38 4 50 16 62 4z M50 50 96 38 84 50 96 62z M50 50 62 96 50 84 38 96z M50 50 4 62 16 50 4 38z" />
  </svg>
);

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);
const n = (x: number) => x.toLocaleString("en-GB");

/** the rooms of the site, as a book's contents; four while the forum is closed (FORUM_OPEN) */
const ALL_ROOMS: { id: AreaId; text: string }[] = [
  { id: "study", text: "Lessons from the first letters to reading real texts." },
  { id: "library", text: `The library: ${n(WORKS.length)} works in Greek, ${n(WORKS.filter(hasTranslation).length)} with English beside them.` },
  { id: "wiki", text: "People, places and objects of the ancient world." },
  { id: "forum", text: "The Agora: ask, answer, and read together." },
  { id: "treasury", text: "Your bookmarks, notes, highlights and words." },
];
const ROOMS = ALL_ROOMS.filter((r) => shown(r.id));
const NUM = ["α´", "β´", "γ´", "δ´", "ε´"];

/** a plate's credit for the colophon, from its record (lib/photos.ts) */
function credit(id: string) {
  const p = photo(id)!;
  const date = objectDate(p), by = maker(p);
  return `${p.title}${date ? `, ${date}` : ""}, ${p.place}${by ? `; ${by.replace(/^Photograph by/, "photograph by")}` : ""}; ${p.licence}`;
}

/**
 * The home page, as the printed page sets it (the owner's choice, 2026-10-22; redesign SPEC.md 4.1, decision 7), shorter
 * than before and in this order: the title page with the Socrates plate; "Where are you starting?" (or, for a visitor
 * coming back, their desk); the passage of the day; the Contents; the end, with the colophon and the plates' credits.
 * The plates of works in stone and "Why Stoics are called Stoics" are in Explore now.
 */
export default function Home() {
  return (
    <Page screen="home">
      <div className="wrap">
        <div className={h.titlePage}>
          <div className="enter">
            {/* one run of words beside the red rule, so on a phone it wraps as one line does */}
            <div className={`${h.kicker} label`}><span><span lang="grc">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · learning the letters</span></div>
            <h1 className={h.title}>Read the Greeks in <em>their own</em> words</h1>
            <p className={h.lede}>Learn to read Ancient Greek, and meet the world that wrote it.</p>
            <div className={h.btns}>
              <Link className="btn" href="/academy/alphabet" transitionTypes={["page-turn"]}>Start with the letters</Link>
              <Link className="btn ghost" href="/library" transitionTypes={["page-turn"]}>Open the library</Link>
            </div>
          </div>
          <Plate id="socrates-louvre" n={1} className={`${h.titlePlate} enter`} priority sizes="(max-width: 900px) min(92vw, 420px), 460px" />
        </div>
        <div className={h.drawn} aria-hidden="true" />

        {/* a first visit: where are you starting?; a returning visitor: their desk (lib/visitor.ts) */}
        <section className={h.part} aria-labelledby="start-title">
          <div className="sh rv">
            <span className="no" aria-hidden="true">α´</span>
            <h2 id="start-title"><span className="first-only">Where are you <em>starting?</em></span><span className="back-only">Your <em>desk</em></span></h2>
            <span className="fill" />
          </div>
          <div className="first-only"><HomeStarts /></div>
          <div className="back-only"><HomeDesk /></div>
        </section>

        <HomePassage />

        <section className={h.part} aria-labelledby="contents-title">
          <div className="sh rv"><span className="no" aria-hidden="true">γ´</span><h2 id="contents-title">Contents</h2><span className="fill" /><span className="src">{FORUM_OPEN ? "five rooms" : "four rooms"}</span></div>
          <ol className={`${h.toc} rv`}>
            {ROOMS.map((r, i) => {
              const a = AREAS[r.id];
              return (
                <li key={r.id}>
                  <Link href={a.href} transitionTypes={["page-turn"]}>
                    <span className={h.gn} aria-hidden="true">{NUM[i]}</span>
                    <span className={h.t}>{a.door} <span className="visually-hidden">: {a.name}.</span><i>{r.text}</i></span>
                    <span className={h.lead} aria-hidden="true" />
                    <span className={h.gr} lang="grc">{a.greek}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <p className={h.fin} aria-hidden="true"><Cross /> ΤΕΛΟΣ <Cross /></p>
        <div className={h.colophon}>
          <p><b>Colophon.</b> Set in EB Garamond, GFS Didot and Gentium Book Plus. The Greek texts and their English translations
            are read from the Perseus Digital Library and the First Thousand Years of Greek project; each passage names its editor
            and translator beside it.</p>
          <p><b>Plates.</b> I: {credit("socrates-louvre")}. II: the object beside the day&apos;s passage, credited under it. Every
            picture on the site is listed with its full credit on the <Link href="/credits">credits page</Link>.</p>
        </div>
      </div>
    </Page>
  );
}

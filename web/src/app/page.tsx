import { Fragment } from "react";
import Link from "next/link";
import Page from "@/components/Page";
import LetterTiles from "@/components/LetterTiles";
import PassageOfTheDay from "@/components/PassageOfTheDay";
import StartChoice from "@/components/home/StartChoice";
import Desk from "@/components/home/Desk";
import Settle from "@/components/art/Settle";
import PagePiece from "@/components/art/PagePiece";
import { ArtWindow } from "@/components/art/PageArt";
import WhereNext from "@/components/WhereNext";
import VisitorMark from "@/components/home/VisitorMark";
import start from "@/components/home/Start.module.css";
import GuideInvite from "@/components/guide/GuideInvite";
import { AREAS, SITE } from "@/config/areas";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { greekEditions, hasTranslation, type Catalog } from "@/lib/catalog";
import { STARTS } from "@/data/starts";
import { PIECE_CREDITS, pieceFor } from "@/data/pieces";
import HomeFinder, { type Start } from "@/components/HomeFinder";
import styles from "./home.module.css";

// The library's size, counted from the catalogue when the site is built.
const CATALOG = JSON.parse(readFileSync(join(process.cwd(), "public/data/catalog.json"), "utf8")) as Catalog;
const WORKS = CATALOG.authors.flatMap((a) => a.works);
const n = (x: number) => x.toLocaleString("en-GB");
const START_CARDS: Start[] = STARTS.map((id) => {
  const a = CATALOG.authors.find((x) => x.works.some((w) => w.id === id))!;
  const w = a.works.find((x) => x.id === id)!;
  return { id, title: w.title, author: a.name, grc: greekEditions(w)[0]?.label ?? null };
});

// The home page's engraving, for the window that says what it is.
const PIECE = pieceFor("/");
const CREDIT = PIECE ? PIECE_CREDITS[PIECE.piece] : undefined;

// The opening words, cut in letter by letter as the page opens (home.module.css, .c).
const TITLE: { text: string; em?: boolean }[][] = [[{ text: "Read the Greeks" }], [{ text: "in " }, { text: "their own", em: true }, { text: " words" }]];
function CutTitle() {
  let i = 0;
  const cut = (t: string) => [...t].map((ch, k) => ch === " " ? " " : <span key={k} className={styles.c} style={{ animationDelay: `${(0.3 + i++ * 0.045).toFixed(3)}s` }}>{ch}</span>);
  return (
    <h1 id="hero-title" className={styles.title} aria-label="Read the Greeks in their own words">
      <span aria-hidden="true">
        {TITLE.map((line, l) => <Fragment key={l}>{l > 0 && " "}<span className={styles.ln}>{line.map((p, k) => p.em ? <em key={k}>{cut(p.text)}</em> : <span key={k}>{cut(p.text)}</span>)}</span></Fragment>)}
      </span>
    </h1>
  );
}


/**
 * The home page in design A, Gold and lamplight (the owner's choices of 2026-10-18, GOLD-AND-LAMPLIGHT-PLAN.md): A's
 * opening (the headline, two ways in and "Where are you starting?" beside the page's engraving), then windows onto the
 * engraving as it grows behind the page, each with something real in it, between the passage of the day, the letters,
 * the library's search and the Painted Stoa. The carved-letter wall and the nine Muses are gone (the owner's choice).
 */
export default function Home() {
  return (
    <Page>
      <VisitorMark />

      {/* ---------------------------------------------------------------- the opening */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={`wrap ${styles.heroIn}`}>
          <PagePiece className={`piece-rise ${styles.heroPiece}`} steady />
          <div className={styles.heroText}>
            <p className={`label ${styles.kick}`}><span lang="grc">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · Learning the letters</p>
            <CutTitle />
            <p className={styles.heroLede}>{SITE.tagline}</p>
            {/* a first visit: two ways in, and where are you starting; a returning visitor: their desk */}
            <div className={start.firstOnly}>
              <div className={styles.btns}>
                <Link className="btn" href="/academy/alphabet" transitionTypes={["page-turn"]}>Start with the letters</Link>
                <Link className="btn ghost" href="/library" transitionTypes={["page-turn"]}>Open the library</Link>
              </div>
              <div className={styles.askIn}><StartChoice /></div>
            </div>
            <div className={`${start.backOnly} ${styles.deskCell}`}><Desk /></div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- a window: Hesiod's first line */}
      <div className="wrap">
        <ArtWindow label="Hesiod, Theogony 1" className={styles.band}>
          <p lang="grc">Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν</p>
          <p className={styles.plateEn}>“From the Heliconian Muses let us begin to sing.”</p>
          <small>Translated by H. G. Evelyn-White (1914)</small>
        </ArtWindow>
      </div>

      {/* ---------------------------------------------------------------- passage of the day, beside a window on the engraving */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="passage-title">
        <div className={styles.secH}><span className="label">{AREAS.reader.name} · {AREAS.reader.english}</span></div>
        <div className={styles.podGrid}>
          <div className="rv">
            <Settle as="h2" id="passage-title" className={styles.h2} text="Passage of the day" />
            <p className={styles.lede}>A different famous passage each day, read live from the original files. Every word can be looked up.</p>
            <PassageOfTheDay />
          </div>
          {CREDIT && (
            <ArtWindow label="The picture" tall className={styles.side}>
              <p className={styles.plateEn}><b>{CREDIT.title}</b>{CREDIT.date && <>, {CREDIT.date}</>}.</p>
              <p className={styles.plateNote}>Drawn here in gold lines from The Met’s photograph.</p>
              <small><a href={CREDIT.source} rel="noopener">The Metropolitan Museum of Art, Open Access</a></small>
            </ArtWindow>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------- start with the letters */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="learn-title">
        <div className={styles.secH}><span className="label">{AREAS.study.name} · {AREAS.study.door}</span></div>
        <div className={styles.learnGrid}>
          <div className="rv">
            <Settle as="h2" id="learn-title" className={styles.h2} text="Start with the letters" />
            <p className={styles.lede}>Twenty-four letters, seven of them vowels. Many will look familiar from maths and science; a few will surprise you. By the end of the first lesson you read a genuine line of Homer.</p>
            <Link className="btn" href="/academy/alphabet" transitionTypes={["page-turn"]}>Meet the alphabet <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <div className="rv">
            <LetterTiles />
            <p className={styles.cap}>Hover or tap a letter. Sounds follow the reconstructed pronunciation of Classical Athens; on <Link href="/academy/alphabet" transitionTypes={["page-turn"]}>the alphabet page</Link> you can switch to Erasmian or Modern Greek.</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- find something to read */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="find-title">
        <div className={styles.secH}><span className="label">{AREAS.library.name} · {AREAS.library.english}</span></div>
        <Settle as="h2" id="find-title" className={styles.h2} text="Find something to read" />
        <p className={`${styles.lede} rv`}>{n(WORKS.length)} works by {n(CATALOG.authors.length)} authors, {n(WORKS.filter(hasTranslation).length)} of them with an English translation beside the Greek. Search by title, author or Greek name, or begin with one of these.</p>
        <div className="rv"><HomeFinder starts={START_CARDS} total={WORKS.length} suggest={8} /></div>
      </section>

      {/* ---------------------------------------------------------------- the Painted Stoa, beside a window with the two sayings of Delphi */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="stoa-title">
        <div className={styles.secH}><Settle className="label" text="From the Painted Stoa" /></div>
        <div className={styles.stoaG}>
          <div>
            <Settle as="h2" id="stoa-title" className={`${styles.h2} rv`} text="Why Stoics are called Stoics" />
            <p className="rv">The Stoa Poikile, the “Painted Colonnade”, stood on the north side of the Athenian Agora, hung with famous paintings such as the Battle of Marathon. Around 300 BC Zeno of Citium began to teach there, walking up and down the colonnade.</p>
            <p className="rv">His followers were first called Zenonians, then Stoics, “the people of the Stoa” (Diogenes Laertius, Lives 7.5).</p>
            <p className={`${styles.stoaMore} rv`}>The site&apos;s own Painted Stoa holds history, daily life, the strange and the brutal, told from the sources. Every entry says how sure we can be.</p>
            <Link className="btn ghost rv" href="/stoa" transitionTypes={["page-turn"]}>Walk into the Painted Stoa <span className="arr" aria-hidden="true">→</span></Link>
          </div>
          <ArtWindow label="Written in Apollo’s temple at Delphi" tall className={styles.side}>
            <p lang="grc">γνῶθι σαυτόν · μηδὲν ἄγαν</p>
            <p className={styles.plateEn}>“Know yourself” and “Nothing in excess”, which Socrates says the seven wise men wrote there together.</p>
            <small>Plato, Protagoras 343b</small>
          </ArtWindow>
        </div>
      </section>

      <GuideInvite />

      <WhereNext links={[
        { href: "/academy", label: "The Academy", note: "the lessons" },
        { href: "/library", label: "The library", note: "every work" },
        { href: "/stoa", label: "The Painted Stoa", note: "the Greek world" },
      ]} />

      {/* ---------------------------------------------------------------- sources, put away until wanted */}
      <section className={`wrap ${styles.sec} ${styles.credits}`} aria-labelledby="sources-title">
        <details className={styles.more}>
          <summary><h2 id="sources-title" className="label">Sources for this page</h2></summary>
          <ul>
            <li><b>Hesiod,</b> Theogony 1, translated by H. G. Evelyn-White (1914), via the Perseus Digital Library.</li>
            <li><b>The two sayings of Delphi.</b> Plato, Protagoras 343b, Burnet’s text, translated by W. R. M. Lamb (1924), via the Perseus Digital Library.</li>
            <li><b>Why Stoics are called Stoics.</b> Diogenes Laertius, Lives of the Eminent Philosophers 7.5.</li>
            {CREDIT && <li><b>The engraving.</b> {CREDIT.title}{CREDIT.date && <>, {CREDIT.date}</>}. The Metropolitan Museum of Art, New York, Open Access (CC0), drawn in gold lines for this site.</li>}
          </ul>
        </details>
      </section>
    </Page>
  );
}

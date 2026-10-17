import { Fragment } from "react";
import Link from "next/link";
import Page from "@/components/Page";
import LetterTiles from "@/components/LetterTiles";
import PassageOfTheDay from "@/components/PassageOfTheDay";
import StartChoice from "@/components/home/StartChoice";
import Desk from "@/components/home/Desk";
import Wall from "@/components/home/Wall";
import NameEmblem from "@/components/home/NameEmblem";
import Muses from "@/components/home/Muses";
import Settle from "@/components/art/Settle";
import Carving from "@/components/art/Carving";
import ReliefWindow from "@/components/art/ReliefWindow";
import VisitorMark from "@/components/home/VisitorMark";
import start from "@/components/home/Start.module.css";
import GuideInvite from "@/components/guide/GuideInvite";
import { AREAS, SITE } from "@/config/areas";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { greekEditions, hasTranslation, type Catalog } from "@/lib/catalog";
import { STARTS } from "@/data/starts";
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
 * The home page has one job: to welcome a visitor and send them into the Greek, to learn it or to read it (the owner,
 * 2026-10-17: "more digestible and less cluttered"). Each part of it has one thing to show, with room round it, and
 * the big lit windows of sculpture carry it; everything else has a page of its own (the forum, reading offline, the
 * reading paths, now in the library, and the rooms, which the header and the bar already show).
 */
export default function Home() {
  return (
    <Page>
      <VisitorMark />

      {/* ---------------------------------------------------------------- the wall: the opening of the Apology, cut in the stone */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <Wall className={styles.wall} />
        <div className={`wrap ${styles.heroIn}`}>
          <div className={styles.heroText} data-quiet="">
            <p className={`label ${styles.kick}`}><span lang="grc">ΜΑΘΗΣΙΣ ΣΤΟΙΧΕΙΩΝ</span> · Learning the letters</p>
            <CutTitle />
            <p className={styles.heroLede}>{SITE.tagline}</p>
            {/* a first visit: two ways in, and the question of where to start one tap away; a returning visitor: their desk */}
            <div className={start.firstOnly}>
              <div className={styles.btns}>
                <Link className="btn" href="/academy/alphabet" transitionTypes={["page-turn"]}>Start with the letters</Link>
                <Link className="btn ghost" href="/library" transitionTypes={["page-turn"]}>Open the library</Link>
              </div>
              <details className={styles.ask}>
                <summary>New here? <span>Tell us where you are starting</span></summary>
                <div className={styles.askIn}><StartChoice /></div>
              </details>
            </div>
            <div className={`${start.backOnly} ${styles.deskCell}`}><Desk /></div>
          </div>
        </div>
        <p className={styles.wallCap} data-quiet="">Cut into the wall: the opening of Plato’s <i>Apology</i>, as Greek was written in Plato’s time: in capitals, with no spaces or accents. Carry the torch over it to read; on a phone, scroll it through the light.</p>
      </section>

      {/* ---------------------------------------------------------------- the name */}
      <section className={`wrap ${styles.sec} ${styles.name}`} aria-labelledby="name-title">
        <div className={styles.secH}><Settle className="label" text="The name" /></div>
        <div className={styles.nameG}>
          <div className={styles.emb}><NameEmblem /></div>
          <div className={styles.nameT}>
            <Settle as="h2" id="name-title" className={`${styles.h2} rv`} lang="grc" text="Μάθησις στοιχείων" />
            <p className={`${styles.nameSub} rv`}>Learning the elements</p>
            <p className="rv"><span lang="grc">Μάθησις</span> is learning. A <span lang="grc">στοιχεῖον</span> was three things, and all three are on this tablet.</p>
            <ol className={styles.nameL}>
              <li className="rv"><b>A letter,</b> “a simple sound of speech”. Greek children learned their letters on wax tablets like this one.</li>
              <li className="rv"><b>A shadow,</b> the shadow of a sundial’s pointer, whose length in feet told the time. Here the stylus is the pointer.</li>
              <li className="rv"><b>An element.</b> Euclid’s geometry is the <span lang="grc">Στοιχεῖα</span>, the <i>Elements</i>; its first proposition is drawn in the wax.</li>
            </ol>
            <details className={`${styles.more} rv`}>
              <summary>The Greek behind each meaning, and the sources</summary>
              <div className={styles.moreIn}>
                <p><span lang="grc">Μάθησις</span> is “the act of learning, getting of knowledge”. A <span lang="grc">στοιχεῖον</span> is strictly “a simple sound of speech, as the first component of the syllable”, and so a letter of the alphabet.</p>
                <p>In a sundial it is “the shadow of the gnomon, the length of which in feet indicated the time of day.” In Aristophanes’ <i>Assemblywomen</i>, Praxagora tells her husband that his only care will be to go to dinner <span lang="grc">ὅταν ᾖ δεκάπουν τὸ στοιχεῖον</span>, “when the shadow is ten feet long” (line 652).</p>
                <p>Euclid’s first proposition reads <span lang="grc">ἐπὶ τῆς δοθείσης εὐθείας πεπερασμένης τρίγωνον ἰσόπλευρον συστήσασθαι</span>, “On a given finite straight line to construct an equilateral triangle” (Elements 1.1). On the tablet, the given line is the stylus’s shadow.</p>
                <p className={styles.cap}>The definitions are quoted from Liddell, Scott and Jones, <i>A Greek-English Lexicon</i> (LSJ), under <span lang="grc">μάθησις</span> and <span lang="grc">στοιχεῖον</span>; the letter sense cites Plato, Cratylus 424d. Euclid’s Greek is Heiberg’s text (Teubner, 1883–88), translated by T. L. Heath; Aristophanes is Hall and Geldart’s text (Oxford, 1907); both via the Perseus Digital Library. The tablet, stylus and compass are drawn for this page. Move your torch over the tablet, or on a phone scroll it through the middle of the screen: the light casts its own shadows.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- passage of the day, beside a relief */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="passage-title">
        <div className={styles.secH}><span className="label">{AREAS.reader.name} · {AREAS.reader.english}</span></div>
        <div className={styles.podGrid}>
          <div className="rv">
            <Settle as="h2" id="passage-title" className={styles.h2} text="Passage of the day" />
            <p className={styles.lede}>A different famous passage each day, read live from the original files. Every word can be looked up.</p>
            <PassageOfTheDay />
          </div>
          <ReliefWindow pic="great-eleusinian-relief" className={`${styles.tall} rv`}
            alt="A marble relief: two tall women in long robes, Demeter and Persephone, stand on either side of a naked boy, Triptolemus."
            caption={<><b>Demeter, Triptolemus and Persephone.</b> Fragments of a Roman copy of the Great Eleusinian Relief, c. 27 BC–AD 14. The Metropolitan Museum of Art, New York (14.130.9). CC0.</>} />
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

      {/* ---------------------------------------------------------------- the Muses */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="muses-title">
        <div className={styles.secH}><Settle as="h2" id="muses-title" className="label" text="Begin with the Muses" /></div>
        <Carving text="Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν" kind="line" delay={0.1} />
        <p className={`${styles.muG} rv`} lang="grc">Μουσάων Ἑλικωνιάδων ἀρχώμεθ’ ἀείδειν</p>
        <p className={`${styles.muE} rv`}>“From the Heliconian Muses let us begin to sing.” <span>Hesiod, Theogony 1</span></p>
        <Muses />
        <p className={`${styles.cap} ${styles.musesCap} rv`}>Hesiod names nine Muses, “nine daughters begotten by great Zeus” (Theogony 76–79). Which art belongs to which Muse was settled later, and ancient writers do not always agree. Translation by H. G. Evelyn-White (1914), via the Perseus Digital Library. Pass the torch over a niche and her name catches the light.</p>
      </section>

      {/* ---------------------------------------------------------------- find something to read */}
      <section className={`wrap ${styles.sec}`} aria-labelledby="find-title">
        <div className={styles.secH}><span className="label">{AREAS.library.name} · {AREAS.library.english}</span></div>
        <Settle as="h2" id="find-title" className={styles.h2} text="Find something to read" />
        <p className={`${styles.lede} rv`}>{n(WORKS.length)} works by {n(CATALOG.authors.length)} authors, {n(WORKS.filter(hasTranslation).length)} of them with an English translation beside the Greek. Search by title, author or Greek name, or begin with one of these.</p>
        <div className="rv"><HomeFinder starts={START_CARDS} total={WORKS.length} suggest={8} /></div>
      </section>

      {/* ---------------------------------------------------------------- a band of frieze */}
      <div className={`wrap ${styles.sec}`}>
        <ReliefWindow pic="parthenon-frieze-cast" className={styles.band} frameClassName="frame rv"
          alt="A white plaster relief of two figures seated side by side on stools, their faces broken away."
          caption={<><b>Two seated figures from the Parthenon frieze.</b> Plaster cast in the Acropolis Museum of part of block IV of the Parthenon’s east frieze; the marble original is in the British Museum. Original 5th century BC; modern cast. Photograph by Deiadameian, CC BY-SA 4.0.</>} />
      </div>

      {/* ---------------------------------------------------------------- the Painted Stoa, beside a grave stele */}
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
          <ReliefWindow pic="stele-woman-and-servant" className={`${styles.stele} rv`}
            alt="A tall marble gravestone topped with a small pediment: a young woman in a long draped dress looks down at a servant girl, carved at half her size, who holds up an open box to her."
            caption={<><b>Grave stele of a young woman and servant,</b> from Attica, c. 400–390 BC. The Metropolitan Museum of Art, New York (36.11.1). CC0.</>} />
        </div>
      </section>

      <GuideInvite />

      {/* ---------------------------------------------------------------- sources, put away until wanted */}
      <section className={`wrap ${styles.sec} ${styles.credits}`} aria-labelledby="sources-title">
        <details className={styles.more}>
          <summary><h2 id="sources-title" className="label">Sources for this page</h2></summary>
          <ul>
            <li><b>The wall.</b> Plato, Apology, from its first words: Platonis Opera, ed. John Burnet, Oxford, via the Perseus Digital Library. Accents and spaces left out.</li>
            <li><b>The name.</b> Liddell, Scott and Jones, <i>A Greek-English Lexicon</i>, under <span lang="grc">μάθησις</span> and <span lang="grc">στοιχεῖον</span>. Euclid, Elements 1.1, Heiberg’s text, translated by T. L. Heath; Aristophanes, Assemblywomen 652, Hall and Geldart’s text; both via the Perseus Digital Library. The tablet, stylus and compass are drawn for this page.</li>
            <li><b>The Muses.</b> Hesiod, Theogony 1 and 76–79, translated by H. G. Evelyn-White (1914), via the Perseus Digital Library.</li>
            <li><b>Great Eleusinian Relief,</b> fragments of a Roman copy, c. 27 BC–AD 14. The Metropolitan Museum of Art, New York (14.130.9). CC0.</li>
            <li><b>Parthenon east frieze, block IV,</b> plaster cast, Acropolis Museum, Athens; original 5th century BC, British Museum. Photograph by Deiadameian, CC BY-SA 4.0.</li>
            <li><b>Grave stele of a young woman and servant,</b> Attica, c. 400–390 BC. The Metropolitan Museum of Art, New York (36.11.1). CC0.</li>
          </ul>
        </details>
      </section>
    </Page>
  );
}

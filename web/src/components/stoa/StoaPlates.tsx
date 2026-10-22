/**
 * Two parts the home page handed to Explore (redesign SPEC.md 4.1 and 4.4): the plates of works in stone, and "Why Stoics
 * are called Stoics", the story of the room's name, set as the sample printed-photos.html sets them. The page's head holds
 * Plate I; these are Plates II to V. Every plate prints its credit beneath it (components/plate/Plate.tsx).
 *
 * The story is Diogenes Laertius' (Lives 7.2–7.5, read in the library's own Greek and in Hicks' English): Zeno was a pupil
 * of Crates (7.2–3); he taught pacing up and down in the Painted Stoa, and his followers, first called Zenonians, were
 * called Stoics after it (7.5). The paintings, among them the Battle of Marathon, are described by Pausanias (1.15).
 */
import Link from "next/link";
import Plate from "@/components/plate/Plate";
import styles from "./Stoa.module.css";

/** the works in stone, as the sample set them: a grave stele, a god from his sanctuary, a machine for choosing by lot */
const STONE = ["stele-woman-and-servant", "asklepios-epidaurus", "kleroterion"];

export function StonePlates() {
  return (
    // the page sets each part in a section of its own, named (app/stoa/page.tsx, DoorBlock)
    <>
      <div className="sh rv"><h2 id="plates-h">Plates</h2><span className="fill" /><span className="src">works in stone</span></div>
      <div className={styles.plates}>
        {STONE.map((id, i) => <Plate key={id} id={id} n={i + 2} className="rv" sizes="(max-width: 900px) 46vw, 360px" />)}
      </div>
    </>
  );
}

export function WhyStoics() {
  return (
    <>
      <div className="sh rv"><h2 id="stoics-h">Why Stoics are called <em>Stoics</em></h2><span className="fill" /></div>
      <div className={styles.essay}>
        <div className="rv">
          <p>The Stoa Poikile, the “Painted Colonnade”, stood on the north side of the Athenian Agora, hung with famous paintings such as the Battle of Marathon. Around 300 BC Zeno of Citium began to teach there, walking up and down the colonnade.</p>
          <p>His followers were first called Zenonians, then Stoics, “the people of the Stoa”.</p>
          <p className={styles.essayGo}><Link href="/read?w=tlg0004.tlg001&at=7.1.5" transitionTypes={["page-turn"]}>Read it in Diogenes Laertius →</Link></p>
        </div>
        <aside className={`${styles.side} rv`}>
          Diogenes Laertius, <i>Lives of Eminent Philosophers</i> 7.5.
          <Plate id="crates-hipparchia" n={5} frame={false} why="Zeno was a pupil of the Cynic Crates (Diogenes Laertius 7.2–3)." sizes="260px" />
        </aside>
      </div>
    </>
  );
}

/**
 * A part the home page handed to Explore (redesign SPEC.md 4.1 and 4.4): "Why Stoics are called Stoics", the story of the
 * room's name, set as the sample printed-photos.html sets it, with the one picture that belongs to the story (Crates, Zeno's
 * teacher) and its credit (components/plate/Plate.tsx). The plates of works in stone that stood before it were only
 * ornament and are gone (the owner, 2026-10-25: photos only where they are relevant).
 *
 * The story is Diogenes Laertius' (Lives 7.2–7.5, read in the library's own Greek and in Hicks' English): Zeno was a pupil
 * of Crates (7.2–3); he taught pacing up and down in the Painted Stoa, and his followers, first called Zenonians, were
 * called Stoics after it (7.5). The paintings, among them the Battle of Marathon, are described by Pausanias (1.15).
 */
import Link from "next/link";
import Plate from "@/components/plate/Plate";
import styles from "./Stoa.module.css";

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
          <Plate id="crates-hipparchia" n={1} frame={false} why="Zeno was a pupil of the Cynic Crates (Diogenes Laertius 7.2–3)." sizes="(min-width: 1200px) 560px, 260px" />
        </aside>
      </div>
    </>
  );
}

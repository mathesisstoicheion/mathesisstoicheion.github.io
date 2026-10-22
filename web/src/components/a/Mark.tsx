import Link from "next/link";
import styles from "./Mark.module.css";

/**
 * The printer's device (the owner's choice, 2026-10-22, decision 1 of the printed-page redesign): a round seal like the
 * marks early printers set on their title pages, ΜΣ in the middle (Μ in ink, Σ in red) and, on the large seal,
 * ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ around the ring. Below 64 pixels the ring's words are dropped (SPEC.md 3.3).
 * In the header it stands beside the name, "Μάθησις Στοιχείων" over "MATHESIS STOICHEION" (`words`); the reader's bar and
 * the foot of the page use the seal alone.
 */
export function Seal({ size = 48, className }: { size?: number; className?: string }) {
  const ring = size >= 64;
  return (
    <svg className={`${styles.seal} ${className ?? ""}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {ring && (
        <>
          <defs><path id="seal-ring" d="M 12.25 50 a 37.75 37.75 0 1 1 75.5 0 a 37.75 37.75 0 1 1 -75.5 0" /></defs>
          <text className={styles.ringWords} fontSize="5.8" letterSpacing="1.2" dominantBaseline="middle">
            <textPath href="#seal-ring" textLength={Math.PI * 75.5 * 0.995} lengthAdjust="spacing">ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ · ΜΑΘΗΣΙΣ · ΣΤΟΙΧΕΙΩΝ ·</textPath>
          </text>
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </>
      )}
      {!ring && (
        <>
          <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </>
      )}
      <text x="50" y="51" textAnchor="middle" dominantBaseline="central" className={styles.initials} fontSize={ring ? 25 : 38} letterSpacing={ring ? -1 : -1.5}>
        Μ<tspan className={styles.red}>Σ</tspan>
      </text>
    </svg>
  );
}

export default function Mark({ size = "head", className, label = "Mathesis Stoicheion, home", words = false }:
  { size?: "head" | "bar" | "foot"; className?: string; label?: string; words?: boolean }) {
  return (
    <Link className={`${styles.mark} ${styles[size]} ${className ?? ""}`} href="/" transitionTypes={["page-turn"]} aria-label={label}>
      <Seal size={size === "foot" ? 72 : size === "bar" ? 36 : 46} />
      {words && (
        <span className={styles.words} aria-hidden="true">
          <b lang="grc">Μάθησις Στοιχείων</b>
          <i>Mathesis Stoicheion</i>
        </span>
      )}
    </Link>
  );
}

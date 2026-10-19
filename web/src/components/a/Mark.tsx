import Link from "next/link";
import styles from "./Mark.module.css";

/**
 * Design A's mark: ΣΤΟΙΧΕΙΑ, "the letters" (the site's name is Μάθησις Στοιχείων), set in a square of three rows of three,
 * as Greek was carved letter by letter in a grid, closed by a point. In the header, the reader's bar and the footer.
 */
const LETTERS = ["Σ", "Τ", "Ο", "Ι", "Χ", "Ε", "Ι", "Α", "·"];

export default function Mark({ size = "head", className, label = "Mathesis Stoicheion, home" }: { size?: "head" | "bar" | "foot"; className?: string; label?: string }) {
  return (
    <Link className={`${styles.mark} ${styles[size]} ${className ?? ""}`} href="/" transitionTypes={["page-turn"]} aria-label={label}>
      {LETTERS.map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}
    </Link>
  );
}

import { LOGO_DOTS, LOGO_GUIDES, LOGO_LETTERS, LOGO_TILE } from "@/lib/logo";
import styles from "./LogoMark.module.css";

/**
 * The site's mark (lib/logo.ts) in the theme's own colours: a tile of the ink colour with the letters cut in the page
 * colour, so it is black gloss on clay in the light theme and clay on black in the dark one. On each page load the
 * letters are cut one after another, then the dots are set.
 */
export default function LogoMark({ className }: { className?: string }) {
  const t = LOGO_TILE;
  return (
    <svg className={`${styles.mark} ${className ?? ""}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <rect x={t.x} y={t.y} width={t.size} height={t.size} rx={t.r} className={styles.tile} />
      <path d={LOGO_GUIDES} className={styles.guide} />
      {LOGO_LETTERS.map((d, i) => (
        <path key={i} d={d} pathLength={1} className={styles.letter} style={{ animationDelay: `${i * 0.09}s` }} />
      ))}
      {LOGO_DOTS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2.2} className={styles.dot} style={{ animationDelay: `${0.8 + i * 0.07}s` }} />
      ))}
    </svg>
  );
}

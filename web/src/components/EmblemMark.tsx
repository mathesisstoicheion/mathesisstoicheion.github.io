/**
 * The site's mark, from design A (the owner's choice, 2026-10-18): the word ΣΤΟΙΧΕΙΑ ("the elements", "the letters")
 * set three letters to a row in a square, like an inscription cut letter by letter (stoichedon), with a stop after the
 * last. Drawn inline in single gold lines so it takes the page's colour (`currentColor`) in both looks. The tab, phone
 * and install icons are drawn from public/logo/stoicheia.svg, the same drawing, by scripts/make-logo.mjs.
 */
const LETTERS =
  "M16.6 10.4H11.4L14.6 14L11.4 17.6H16.6M21.4 10.4H26.6M24 10.4V17.6M34 10.4A2.6 3.6 0 1 0 34 17.6A2.6 3.6 0 1 0 34 10.4Z" +
  "M14 20.4V27.6M21.4 20.4L26.6 27.6M26.6 20.4L21.4 27.6M36.6 20.4H31.4V27.6H36.6M31.4 24H35.6M14 30.4V37.6M21.1 37.6L24 30.4L26.9 37.6M22.3 35.2H25.7";

export default function EmblemMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" width={46} height={46} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.75" y="2.75" width="42.5" height="42.5" />
        <path d={LETTERS} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="34" cy="34" r="1.1" fill="currentColor" />
    </svg>
  );
}

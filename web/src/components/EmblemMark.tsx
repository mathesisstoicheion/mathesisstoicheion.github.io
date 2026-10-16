import { MARK, MARK_BOX, MARK_HEAD } from "@/lib/logo";

/**
 * The site's mark (lib/logo.ts): the small flat form of the name's emblem (DESIGN.md, Signature details 1), drawn in
 * the current colour. A wax tablet with its frame, Euclid's first proposition scratched in it (the two circles and the
 * equilateral triangle on the line ΑΒ), and the stylus standing upright in the wax like a sundial's pointer.
 */
export default function EmblemMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${MARK_BOX.w} ${MARK_BOX.h}`} aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
      {MARK.map(({ el: El, a, w, faint, join }, i) => <El key={i} {...a} strokeWidth={w} opacity={faint ? 0.55 : undefined} strokeLinejoin={join ? "round" : undefined} />)}
      <path d={MARK_HEAD} fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * The site's mark: the small form of the name's emblem (DESIGN.md, Signature details 1), cut into the stone and laid
 * with gold. A wax tablet in its frame, Euclid's first proposition scratched in the wax (the two circles and the
 * equilateral triangle on the line ΑΒ), and the stylus standing upright in it like a sundial's pointer. The picture is
 * drawn once, lit by the torch, by scripts/make-logo.mjs (as are the tab, phone and install icons); only the cut is in
 * it, so the header's own stone shows round it. The size comes from `className`.
 */
export default function EmblemMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- a fixed picture, already made at the sizes it needs
  return <img className={className} src="/logo/mark-2x.png" srcSet="/logo/mark-2x.png 2x, /logo/mark-3x.png 3x" width={46} height={38} alt="" decoding="async" draggable={false} />;
}

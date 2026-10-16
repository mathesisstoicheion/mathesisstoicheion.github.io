/**
 * The site's mark: the small flat form of the name's emblem (DESIGN.md, Signature details 1), drawn in the current
 * colour. A wax tablet with its frame, Euclid's first proposition scratched in it (the two circles and the
 * equilateral triangle on the line ΑΒ), and the stylus standing upright in the wax like a sundial's pointer.
 */
export default function EmblemMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 40" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
      <rect x="2.5" y="10.5" width="43" height="27" strokeWidth="1.6" />
      <rect x="6.5" y="14.5" width="35" height="19" strokeWidth=".7" opacity=".55" />
      <circle cx="20" cy="27" r="7" strokeWidth=".9" />
      <circle cx="27" cy="27" r="7" strokeWidth=".9" />
      <path d="M20 27 L27 27 L23.5 20.94 Z" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M20 27 L27 27" strokeWidth="2" />
      <path d="M20 27 V5.5" strokeWidth="1.3" />
      <path d="M18.4 1.5 h3.2 l-.7 4 h-1.8 z" fill="currentColor" stroke="none" />
    </svg>
  );
}

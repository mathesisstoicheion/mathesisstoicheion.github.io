/**
 * The site's mark: Athena's owl, as on the silver coins of Athens, the old sign of wisdom and learning, drawn in a few
 * gold lines (public/logo/owl.svg, under 1 KB) and cut into the stone by `--gilt-cut` (the owner's choice, 2026-10-18).
 * The tab, phone and install icons are drawn from the same file by scripts/make-logo.mjs. The size comes from `className`.
 */
export default function EmblemMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- a fixed drawing, sharp at every size
  return <img className={className} src="/logo/owl.svg" width={46} height={46} alt="" decoding="async" draggable={false} />;
}

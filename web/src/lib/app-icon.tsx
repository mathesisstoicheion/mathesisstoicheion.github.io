import { ICON_CLAY, ICON_INK, SIGMA } from "@/lib/logo";

/**
 * The site's icon, the small form of its mark (lib/logo.ts): the letter SIGMA cut in clay on black gloss, drawn for
 * next/og's ImageResponse (no image files): used by the install icons (app/icons/[size]) and the iPhone home-screen
 * icon (app/apple-touch-icon.png). The tab icon is the same drawing (app/icon.svg, app/favicon.ico/route.tsx).
 * `mark` is how much of the square the letter's drawing fills; `round` rounds the corners (iPhones round their own).
 */
export function AppIcon({ px, mark, round }: { px: number; mark: number; round: boolean }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: ICON_INK, borderRadius: round ? px * 0.18 : 0 }}>
      <svg width={px * mark} height={px * mark} viewBox="16 10 68 80">
        <path d={SIGMA} fill="none" stroke={ICON_CLAY} strokeWidth="11" strokeLinejoin="miter" strokeLinecap="square" />
      </svg>
    </div>
  );
}

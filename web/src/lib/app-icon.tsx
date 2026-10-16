import { ICON_LIGHT, ICON_STONE, MARK, MARK_BOX, MARK_HEAD_ICON } from "@/lib/logo";

/**
 * The site's icon, the small form of its mark (lib/logo.ts): the emblem in torchlight on the stone, with heavier lines,
 * drawn for next/og's ImageResponse (no image files): used by the install icons (app/icons/[size]) and the iPhone
 * home-screen icon (app/apple-touch-icon.png). The tab icon is the same drawing (app/icon.svg, app/favicon.ico/route.tsx).
 * `mark` is how much of the square's width the drawing fills; `round` rounds the corners (iPhones round their own).
 */
export function AppIcon({ px, mark, round }: { px: number; mark: number; round: boolean }) {
  const w = px * mark;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: ICON_STONE, borderRadius: round ? px * 0.18 : 0 }}>
      <svg width={w} height={(w * MARK_BOX.h) / MARK_BOX.w} viewBox={`0 0 ${MARK_BOX.w} ${MARK_BOX.h}`} fill="none" stroke={ICON_LIGHT}>
        {MARK.filter((p) => p.icon > 0).map(({ el: El, a, icon, join }, i) => <El key={i} {...a} strokeWidth={icon} strokeLinejoin={join ? "round" : "miter"} />)}
        <path d={MARK_HEAD_ICON} fill={ICON_LIGHT} stroke="none" />
      </svg>
    </div>
  );
}

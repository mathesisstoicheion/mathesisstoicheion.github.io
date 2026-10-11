import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/app-icon";

/**
 * The icon browsers ask for by themselves at /favicon.ico: the small form of the site's mark, drawn here (no image
 * files) as a PNG, which every current browser accepts under this name. app/icon.svg is the same drawing for browsers
 * that take an SVG tab icon.
 */
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<AppIcon px={48} mark={0.72} round />, { width: 48, height: 48 });
}

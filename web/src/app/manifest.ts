import type { MetadataRoute } from "next";
import { SITE } from "@/config/areas";
import { THEME_COLOUR } from "@/lib/settings";

export const dynamic = "force-static";

/** Lets the site be installed as an app, opening straight to the Propylaea, and working offline. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.latin} · ${SITE.greek}`,
    short_name: SITE.latin,
    description: SITE.tagline,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // the paper: what shows while the app opens, and its bar (a page then follows the device into Night, app/layout.tsx)
    background_color: THEME_COLOUR,
    theme_color: THEME_COLOUR,
    icons: [
      // the printer's device on the paper (made by scripts/make-logo.mjs)
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

import type { MetadataRoute } from "next";
import { SITE } from "@/config/areas";

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
    background_color: "#14100d",
    theme_color: "#14100d",
    icons: [
      // the site's mark on the stone (made by scripts/make-logo.mjs)
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

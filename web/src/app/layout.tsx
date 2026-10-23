import type { Metadata, Viewport } from "next";
import { EB_Garamond, GFS_Didot, Gentium_Book_Plus } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";
import OfflineSign from "@/components/OfflineSign";
import SettingsPanel, { SettingsApplier } from "@/components/SettingsPanel";
import Toast from "@/components/Toast";
import NavWait from "@/components/NavWait";
import Reveal from "@/components/Reveal";
import QuickSearch from "@/components/search/QuickSearch";
import FloatingReaderSlot from "@/components/reader/FloatingReaderSlot";
import { ResumeTracker } from "@/components/Resume";
import Tour from "@/components/tour/Tour";
import { Suspense } from "react";
import { SITE } from "@/config/areas";
import { BOOT_SCRIPT, THEME_COLOUR, THEME_COLOUR_NIGHT } from "@/lib/settings";
import { VISITOR_SCRIPT } from "@/lib/visitor";
import { SHARE_IMAGE, SITE_URL } from "@/lib/seo";
import "../styles/tokens.css";
import "./globals.css";

// next/font downloads these at build time and serves them from this site,
// so visitors' browsers never contact Google (no-trackers decision).
// The printed page's three typefaces, and no others (redesign SPEC.md 3.2): EB Garamond for English, GFS Didot for titles,
// Greek room names and the logo, Gentium Book Plus for Greek being read. Every alphabet range of each font is always
// available (the browser fetches one when a page uses its letters); `subsets` only names the files preloaded with every page.
const garamond = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond", display: "swap" });
const didot = GFS_Didot({ weight: "400", subsets: ["greek"], variable: "--font-didot", display: "swap" });
const gentium = Gentium_Book_Plus({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["greek-ext"], variable: "--font-gentium", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.latin} · ${SITE.greek}`, template: `%s · ${SITE.latin}` },
  description: SITE.tagline,
  // what a link to any page looks like when it is shared (a page with its own title and description overrides these)
  openGraph: { type: "website", siteName: SITE.latin, locale: "en_GB", images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE.url] },
  // added to an iPhone's home screen, it opens as an app of its own (the manifest says the same for other phones)
  appleWebApp: { capable: true, title: SITE.latin, statusBarStyle: "default" },
  // the tab icon and the iPhone's home-screen icon: the printer's device (made by scripts/make-logo.mjs)
  icons: { icon: [{ url: "/favicon.ico", sizes: "16x16 32x32 48x48" }], apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // the browser's bar is the paper, or the night page when the device is dark (the site follows the device)
  themeColor: [{ media: "(prefers-color-scheme: light)", color: THEME_COLOUR }, { media: "(prefers-color-scheme: dark)", color: THEME_COLOUR_NIGHT }],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${garamond.variable} ${didot.variable} ${gentium.variable}`} suppressHydrationWarning>
      <head>
        {/* the paper (or the night page) from the very first byte, before the stylesheet arrives, so no page ever flashes
            the wrong colour (:where gives way to every rule of the stylesheet's own) */}
        <style dangerouslySetInnerHTML={{ __html: `:where(html){background-color:${THEME_COLOUR}}@media (prefers-color-scheme:dark){:where(html:not([data-theme="paper"])){background-color:${THEME_COLOUR_NIGHT}}}:where(html[data-theme="night"]){background-color:${THEME_COLOUR_NIGHT}}` }} />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {/* first visit or returning, before the first paint: the home page shows the question or the desk (lib/visitor.ts) */}
        <script dangerouslySetInnerHTML={{ __html: VISITOR_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <SettingsApplier />
        <Header />
        {children}
        <Footer />
        <OfflineSign />
        <TabBar />
        <SettingsPanel />
        <Toast />
        <Reveal />
        <QuickSearch />
        <FloatingReaderSlot />
        <Suspense fallback={null}><ResumeTracker /></Suspense>
        <Suspense fallback={null}><Tour /></Suspense>
        <Suspense fallback={null}><NavWait /></Suspense>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { GFS_Didot, EB_Garamond, Noto_Serif_Display, Gentium_Book_Plus, Noto_Sans, Alegreya_Sans } from "next/font/google";
import Header from "@/components/Header";
import Torch from "@/components/Torch";
import Footer from "@/components/Footer";
import PagePiece from "@/components/art/PagePiece";
import TabBar from "@/components/TabBar";
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
import { BOOT_SCRIPT, THEME_COLOUR } from "@/lib/settings";
import { VISITOR_SCRIPT } from "@/lib/visitor";
import { SHARE_IMAGE, SITE_URL } from "@/lib/seo";
import "../styles/tokens.css";
import "./globals.css";

// next/font downloads these at build time and serves them from this site,
// so visitors' browsers never contact Google (no-trackers decision).
// Every alphabet range of each font is always available (the browser fetches one when a page uses
// its letters); `subsets` only names the files preloaded with every page, so it lists just what the
// first screen needs: Greek text and headings are GFS Didot, English and the wide-spaced capital labels are EB Garamond
// (DESIGN.md: Type). Letters carved on canvas (the home page's wall, the library's ΜΟΥΣΕΙΟΝ) are Noto Serif Display,
// loaded only by the pages that carve.
const didot = GFS_Didot({ weight: "400", subsets: ["greek", "greek-ext", "latin"], variable: "--font-didot", display: "swap" });
const garamond = EB_Garamond({ weight: ["400", "500", "600"], subsets: ["latin"], style: ["normal", "italic"], variable: "--font-garamond", display: "swap" });
const carved = Noto_Serif_Display({ weight: "500", subsets: ["greek", "latin"], variable: "--font-carved", display: "swap", preload: false });
// The typefaces a reader can choose in Settings (all with full polytonic Greek): never preloaded, so a browser
// downloads one only if it is chosen.
const gentium = Gentium_Book_Plus({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["greek-ext"], variable: "--font-gentium", display: "swap", preload: false });
const notoSans = Noto_Sans({ subsets: ["greek-ext"], variable: "--font-noto-sans", display: "swap", preload: false });
const alegreyaSans = Alegreya_Sans({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-alegreya-sans", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.latin} · ${SITE.greek}`, template: `%s · ${SITE.latin}` },
  description: SITE.tagline,
  // what a link to any page looks like when it is shared (a page with its own title and description overrides these)
  openGraph: { type: "website", siteName: SITE.latin, locale: "en_GB", images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE.url] },
  // added to an iPhone's home screen, it opens as an app of its own (the manifest says the same for other phones)
  appleWebApp: { capable: true, title: SITE.latin, statusBarStyle: "default" },
  // the tab icon and the iPhone's home-screen icon: the small form of the site's mark (made by scripts/make-logo.mjs)
  icons: { icon: [{ url: "/favicon.ico", sizes: "16x16 32x32 48x48" }], apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // the site is dark only: the browser's bar is the stone of the wall
  themeColor: THEME_COLOUR,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${didot.variable} ${garamond.variable} ${carved.variable} ${gentium.variable} ${notoSans.variable} ${alegreyaSans.variable}`} suppressHydrationWarning>
      <head>
        {/* the stone's colour from the very first byte, before the stylesheet arrives, so no page ever flashes white
            (:where gives way to every rule of the stylesheet's own) */}
        <style dangerouslySetInnerHTML={{ __html: `:where(html){background-color:${THEME_COLOUR}}` }} />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        {/* first visit or returning, before the first paint: the home page shows the question or the desk (lib/visitor.ts) */}
        <script dangerouslySetInnerHTML={{ __html: VISITOR_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <SettingsApplier />
        <Torch />
        <Header />
        {children}
        <PagePiece place="foot" />
        <Footer />
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

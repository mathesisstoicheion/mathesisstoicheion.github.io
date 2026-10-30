import type { Metadata, Viewport } from "next";
import { EB_Garamond, GFS_Didot, Gentium_Book_Plus } from "next/font/google";
import localFont from "next/font/local";
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
import { SITE_URL } from "@/lib/seo";
import { SHARE_PICTURE, marked } from "@/lib/icons";
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
// The two typefaces' own arrows and signs ("→", "⋯", "❦", "✓"…), which Google Fonts leaves out of the alphabets above:
// without them a phone or computer draws these signs in a font of its own (scripts/fetch-sign-fonts.mjs). They stand
// first in each typeface's list (styles/tokens.css), and each file is fetched only when a page uses one of its signs.
const garamondSigns = localFont({
  src: [
    { path: "../fonts/eb-garamond-signs-normal-400-800.woff2", weight: "400 800", style: "normal" },
    { path: "../fonts/eb-garamond-signs-italic-400-800.woff2", weight: "400 800", style: "italic" },
  ],
  variable: "--font-garamond-signs", display: "swap", preload: false, adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190, U+2192, U+2194, U+2197, U+22EF, U+2766, U+261E, U+25C6, U+02D8, U+2075-2076, U+3008-3009, U+2248" }],
});
const gentiumSigns = localFont({
  src: [
    { path: "../fonts/gentium-book-plus-signs-normal-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/gentium-book-plus-signs-normal-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/gentium-book-plus-signs-italic-400.woff2", weight: "400", style: "italic" },
    { path: "../fonts/gentium-book-plus-signs-italic-700.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-gentium-signs", display: "swap", preload: false, adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190, U+2192, U+2194, U+2197, U+02D8, U+2713, U+2261, U+266D, U+266F, U+27E6-27E7, U+2135, U+2075-2076, U+2248" }],
});
// Gentium Book Plus for the sounds written in the IPA ([ai̯]): its phonetic letters with the marks set under them, which
// must come from one font (the same script); used only where the IPA is written (--face-ipa), and fetched only there.
const gentiumIpa = localFont({
  src: "../fonts/gentium-book-plus-ipa-normal-400.woff2", weight: "400", style: "normal",
  variable: "--font-gentium-ipa", display: "swap", preload: false, adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.latin} · ${SITE.greek}`, template: `%s · ${SITE.latin}` },
  description: SITE.tagline,
  // what a link to any page looks like when it is shared (a page with its own title and description overrides these)
  openGraph: { type: "website", siteName: SITE.latin, locale: "en_GB", images: [SHARE_PICTURE] },
  twitter: { card: "summary_large_image", images: [SHARE_PICTURE.url] },
  // added to an iPhone's home screen, it opens as an app of its own (the manifest says the same for other phones)
  appleWebApp: { capable: true, title: SITE.latin, statusBarStyle: "default" },
  // the tab icon and the iPhone's home-screen icon: the printer's device (made by scripts/make-logo.mjs), each address marked
  // with its picture, so a browser that kept an older one fetches the new (lib/icons.ts)
  icons: { icon: [{ url: marked("/favicon.ico"), sizes: "16x16 32x32 48x48" }], apple: marked("/apple-touch-icon.png") },
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
    <html lang="en" className={`${garamond.variable} ${didot.variable} ${gentium.variable} ${garamondSigns.variable} ${gentiumSigns.variable} ${gentiumIpa.variable}`} suppressHydrationWarning>
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

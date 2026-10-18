import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

/** The reader's page: Night (the stone, as everywhere on the site) or Daylight ("light"), a light page against eye
 *  strain. The site itself is dark only (DESIGN.md); "auto" and "dark" both mean Night. */
export type ThemePref = "auto" | "light" | "dark";
/** The whole site: dark, in lamplight (design A, Gold and lamplight, the default), or warm paper (the owner, 2026-10-18:
 *  "We're just going with gold and lamplight, then doing a light mode for it, too"). */
export type Look = "dark" | "light";
export type MotionPref = "auto" | "reduce" | "full";
export type Columns = "both" | "greek" | "trans";
export type Pronunciation = "attic" | "erasmian" | "modern";
/** The typeface of Greek text, and of English reading text. Headings keep the site's own (GFS Didot). */
export type GreekFace = "didot" | "gentium" | "sans";
export type TextFace = "serif" | "sans";
/** Kinds of marker beside the reader's scroll bar. */
export type MarkerKind = "note" | "bookmark" | "highlight" | "favourite" | "xref" | "left" | "echo";
export const MARKER_KINDS: MarkerKind[] = ["note", "bookmark", "highlight", "favourite", "xref", "left", "echo"];

export interface Settings {
  look: Look;
  theme: ThemePref;
  motion: MotionPref;
  greekSize: number;   // rem
  leading: number;     // unitless line height for reading text
  columns: Columns;    // reader: Greek and translation, or one of them
  translit: boolean;   // reader aid: transliteration under the Greek
  cases: boolean;      // reader aid: colour words by case
  known: boolean;      // reader aid: mark the words the learner knows from the daily practice (Phase 11)
  metre: boolean;      // reader aid: show the scansion of verse
  tryFirst: boolean;   // reader aid: each translation stays hidden until tapped, so the Greek is read first
  fitLines: boolean;   // reader aid: verse lines shrink to fit the width instead of wrapping
  vibrate: boolean;    // phones: a short vibration on a save, a bookmark, a right answer (lib/haptics.ts)
  pron: Pronunciation; // pronunciation system shown in the Academy
  markers: MarkerKind[];   // reader: which kinds of marker to show beside the scroll bar
  greekFace: GreekFace;
  textFace: TextFace;
}

export const DEFAULTS: Settings = { look: "dark", theme: "auto", motion: "auto", greekSize: 1.25, leading: 1.75, columns: "both", translit: false, cases: false, known: false, metre: false, tryFirst: false, fitLines: false, vibrate: true, pron: "attic", markers: MARKER_KINDS, greekFace: "didot", textFace: "serif" };
export const LIMITS = {
  greekSize: { min: 1, max: 2, step: 0.0625 },
  leading: { min: 1.4, max: 2.2, step: 0.1 },
};
export const STORAGE_KEY = "mathesis:settings";

interface SettingsStore extends Settings {
  set: (patch: Partial<Settings>) => void;
  reset: () => void;
}

/** localStorage can be missing or throw (private windows, blocked site data); never let that break the page. */
const safeStorage: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

const clamp = (v: number, { min, max }: { min: number; max: number }) => Math.min(max, Math.max(min, v));

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      set: (patch) => set((s) => ({
        ...patch,
        greekSize: clamp(patch.greekSize ?? s.greekSize, LIMITS.greekSize),
        leading: clamp(patch.leading ?? s.leading, LIMITS.leading),
      })),
      reset: () => set(DEFAULTS),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ look, theme, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace, textFace }) => ({ look, theme, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace, textFace }),
      skipHydration: true,
    },
  ),
);

/** The colour of the browser's own bar on phones (and of an installed app's title bar): the stone of the wall. */
export const THEME_COLOUR = "#070504";
export const THEME_COLOUR_LIGHT = "#ece0c9";

/** True when the reader's page is Daylight. */
export const isDaylight = (theme: ThemePref) => theme === "light";
/** True while the whole site is light: its carvings, sculptures and reliefs are then lit by daylight. */
export const useLight = () => useSettings((s) => s.look === "light");

/** Writes the settings onto <html>. Kept in one place so the no-flash boot script matches it. */
export function applySettings(s: Settings) {
  const el = document.documentElement;
  // the whole site light (styles/tokens.css, html[data-look="light"]); the browser's own bar follows it
  if (s.look === "light") el.setAttribute("data-look", "light"); else el.removeAttribute("data-look");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", s.look === "light" ? THEME_COLOUR_LIGHT : THEME_COLOUR);
  // the reader's page (Night or Daylight); only the reader reads it (styles/tokens.css, [data-page="day"])
  if (isDaylight(s.theme)) el.setAttribute("data-reader-page", "day"); else el.removeAttribute("data-reader-page");
  if (s.motion === "auto") el.removeAttribute("data-motion"); else el.setAttribute("data-motion", s.motion);
  el.style.setProperty("--greek-size", `${s.greekSize}rem`);
  el.style.setProperty("--reading-leading", String(s.leading));
  if (s.greekFace === "didot") el.removeAttribute("data-greek-face"); else el.setAttribute("data-greek-face", s.greekFace);
  if (s.textFace === "serif") el.removeAttribute("data-text-face"); else el.setAttribute("data-text-face", s.textFace);
}

/** True when animation should be skipped: the user's setting wins, then the system setting. */
export function prefersReducedMotion(motion: MotionPref): boolean {
  if (motion === "reduce") return true;
  if (motion === "full") return false;
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** "smooth" unless animation is reduced (the site's setting, then the device's): for scrollTo, scrollBy and scrollIntoView. */
export const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion(useSettings.getState().motion) ? "auto" : "smooth");

/**
 * Runs before first paint (inlined in <head>) so the reader's saved page never flashes.
 * Must mirror applySettings().
 */
export const BOOT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}").state||{};var e=document.documentElement;
if(s.look==="light")e.setAttribute("data-look","light");
if(s.theme==="light")e.setAttribute("data-reader-page","day");
if(s.motion==="reduce"||s.motion==="full")e.setAttribute("data-motion",s.motion);
if(s.greekSize)e.style.setProperty("--greek-size",s.greekSize+"rem");
if(s.leading)e.style.setProperty("--reading-leading",String(s.leading));
if(s.greekFace==="gentium"||s.greekFace==="sans")e.setAttribute("data-greek-face",s.greekFace);
if(s.textFace==="sans")e.setAttribute("data-text-face","sans");}catch(_){}})();`;

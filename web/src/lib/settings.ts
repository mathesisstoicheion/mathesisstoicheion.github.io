import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

/** The reader's page: Night (the stone, as everywhere on the site) or Daylight ("light"), a light page against eye
 *  strain. The site itself is dark only (DESIGN.md); "auto" and "dark" both mean Night. */
export type ThemePref = "auto" | "light" | "dark";
export type MotionPref = "auto" | "reduce" | "full";
/** How much the art moves (the owner, 2026-10-19: "Just do 3 levels of animation. One with the full beauty and intricate
 *  design and animation. One with a few visual sacrifices for better performance, and a full performance mode, for older
 *  computers and older phones. Main focus is the beauty"). Performance also stills every other animation on the site. */
export type AnimLevel = "full" | "balanced" | "performance";
export type Columns = "both" | "greek" | "trans";
export type Pronunciation = "attic" | "erasmian" | "modern";
/** The typeface of Greek text, and of English reading text. Headings keep the site's own (GFS Didot). */
export type GreekFace = "didot" | "gentium" | "sans";
export type TextFace = "serif" | "sans";
/** Kinds of marker beside the reader's scroll bar. */
export type MarkerKind = "note" | "bookmark" | "highlight" | "favourite" | "xref" | "left" | "echo";
export const MARKER_KINDS: MarkerKind[] = ["note", "bookmark", "highlight", "favourite", "xref", "left", "echo"];

export interface Settings {
  theme: ThemePref;
  level: AnimLevel;
  motion: MotionPref;   // follows `level`: "reduce" for Performance, otherwise "auto" (the device's own setting decides)
  greekSize: number;   // rem
  leading: number;     // unitless line height for reading text
  columns: Columns;    // reader: Greek and translation, or one of them
  translit: boolean;   // reader aid: transliteration under the Greek
  cases: boolean;      // reader aid: colour words by case
  known: boolean;      // reader aid: mark the words the learner knows from the daily practice (Phase 11)
  metre: boolean;      // reader aid: show the scansion of verse
  tryFirst: boolean;   // reader aid: each translation stays hidden until tapped, so the Greek is read first
  fitLines: boolean;   // reader aid: verse lines shrink to fit the width instead of wrapping
  lamp: boolean;       // reader (design A): the passage being read is lit, the others stand a little in the dark
  vibrate: boolean;    // phones: a short vibration on a save, a bookmark, a right answer (lib/haptics.ts)
  pron: Pronunciation; // pronunciation system shown in the Academy
  markers: MarkerKind[];   // reader: which kinds of marker to show beside the scroll bar
  greekFace: GreekFace;
  textFace: TextFace;
}

export const DEFAULTS: Settings = { theme: "auto", level: "full", motion: "auto", greekSize: 1.25, leading: 1.75, columns: "both", translit: false, cases: false, known: false, metre: false, tryFirst: false, fitLines: false, lamp: true, vibrate: true, pron: "attic", markers: MARKER_KINDS, greekFace: "didot", textFace: "serif" };
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

/**
 * The level a first visit starts at, before anything is chosen in Settings (the owner, 2026-10-19: "Step down if weak"):
 * Full beauty, unless the device is clearly weak. A browser that says how much memory it has (Chrome, Android) and says
 * 1 GB or less starts on Performance; 2 GB, or only one or two processor cores, starts on Balanced. Keep the same test in
 * BOOT_SCRIPT below.
 */
export function deviceLevel(): AnimLevel {
  if (typeof navigator === "undefined") return "full";
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory, cores = navigator.hardwareConcurrency;
  if (mem && mem < 2) return "performance";
  if ((mem && mem <= 2) || (cores && cores <= 2)) return "balanced";
  return "full";
}
/** the defaults on this device: its level, and the motion that follows the level */
const firstSettings = (): Settings => { const level = deviceLevel(); return { ...DEFAULTS, level, motion: level === "performance" ? "reduce" : "auto" }; };

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...firstSettings(),
      set: (patch) => set((s) => ({
        ...patch,
        ...(patch.level ? { motion: patch.level === "performance" ? "reduce" as const : "auto" as const } : {}),
        greekSize: clamp(patch.greekSize ?? s.greekSize, LIMITS.greekSize),
        leading: clamp(patch.leading ?? s.leading, LIMITS.leading),
      })),
      reset: () => set(firstSettings()),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ theme, level, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, lamp, vibrate, pron, markers, greekFace, textFace }) => ({ theme, level, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, lamp, vibrate, pron, markers, greekFace, textFace }),
      // settings saved before the three levels: "reduce motion" becomes Performance
      merge: (saved, current) => {
        const p = (saved ?? {}) as Partial<Settings>;
        return { ...current, ...p, level: p.level ?? (p.motion === "reduce" ? "performance" : deviceLevel()) };
      },
      skipHydration: true,
    },
  ),
);

/** The colour of the browser's own bar on phones (and of an installed app's title bar): design A's black frame. */
export const THEME_COLOUR = "#070504";

/** True when the reader's page is Daylight. */
export const isDaylight = (theme: ThemePref) => theme === "light";

/** Writes the settings onto <html>. Kept in one place so the no-flash boot script matches it. */
export function applySettings(s: Settings) {
  const el = document.documentElement;
  // the reader's page (Night or Daylight); only the reader reads it (styles/tokens.css, [data-page="day"])
  if (isDaylight(s.theme)) el.setAttribute("data-reader-page", "day"); else el.removeAttribute("data-reader-page");
  if (s.motion === "auto") el.removeAttribute("data-motion"); else el.setAttribute("data-motion", s.motion);
  el.setAttribute("data-level", s.level);
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
var m=navigator.deviceMemory,c=navigator.hardwareConcurrency,d=m&&m<2?"performance":(m&&m<=2)||(c&&c<=2)?"balanced":"full";
if(!s.level&&!s.motion&&d==="performance")s.motion="reduce";
if(s.theme==="light")e.setAttribute("data-reader-page","day");
if(s.motion==="reduce"||s.motion==="full")e.setAttribute("data-motion",s.motion);
e.setAttribute("data-level",s.level==="full"||s.level==="balanced"||s.level==="performance"?s.level:(s.motion==="reduce"?"performance":d));
if(s.greekSize)e.style.setProperty("--greek-size",s.greekSize+"rem");
if(s.leading)e.style.setProperty("--reading-leading",String(s.leading));
if(s.greekFace==="gentium"||s.greekFace==="sans")e.setAttribute("data-greek-face",s.greekFace);
if(s.textFace==="sans")e.setAttribute("data-text-face","sans");}catch(_){}})();`;

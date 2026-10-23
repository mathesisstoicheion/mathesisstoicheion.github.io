import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

/** Paper or Night (decision 2 of the printed-page redesign, 2026-10-22): "auto" follows the phone's or computer's own light
 *  or dark mode; "paper" and "night" choose one for good, everywhere on the site, the reader included. */
export type ThemePref = "auto" | "paper" | "night";
/** Movement: there is one kind only, the ink-in (decision 3), and the device's reduced-motion setting turns it off.
 *  "reduce" turns it off here too, whatever the device says; "full" keeps it even when the device asks for less. */
export type MotionPref = "auto" | "reduce" | "full";
export type Columns = "both" | "greek" | "trans";
export type Pronunciation = "attic" | "erasmian" | "modern";
/** The typeface of Greek being read: Gentium Book Plus (the default) or GFS Didot. English is always EB Garamond: the
 *  printed page has three typefaces and no others (SPEC.md 3.2). */
export type GreekFace = "gentium" | "didot";
/** Kinds of marker beside the reader's scroll bar. */
export type MarkerKind = "note" | "bookmark" | "highlight" | "favourite" | "xref" | "left" | "echo";
export const MARKER_KINDS: MarkerKind[] = ["note", "bookmark", "highlight", "favourite", "xref", "left", "echo"];

export interface Settings {
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
}

export const DEFAULTS: Settings = { theme: "auto", motion: "auto", greekSize: 1.25, leading: 1.75, columns: "both", translit: false, cases: false, known: false, metre: false, tryFirst: false, fitLines: false, vibrate: true, pron: "attic", markers: MARKER_KINDS, greekFace: "gentium" };
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
      partialize: ({ theme, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace }) => ({ theme, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace }),
      // version 1: the settings of Gold and lamplight; version 2: the printed page's (migrate, below)
      version: 2,
      migrate: (saved, version) => (version < 2 ? upgrade(saved) : saved) as SettingsStore,
      skipHydration: true,
    },
  ),
);

/**
 * Settings saved before the printed page (version 1): the reader's Daylight page becomes Paper and its Lamplight the
 * device's own choice; the old Greek faces (Garamond, then called "didot", and Sans) give way to Gentium; the animation
 * levels, the bottom bar's setting and the English face are dropped (Performance still asks for no movement).
 */
export function upgrade(saved: unknown): Partial<Settings> {
  const p = { ...((saved ?? {}) as Record<string, unknown>) };
  const theme: ThemePref = p.theme === "light" ? "paper" : "auto";
  const motion: MotionPref = p.motion === "reduce" || p.level === "performance" ? "reduce" : p.motion === "full" ? "full" : "auto";
  delete p.level; delete p.bar; delete p.textFace;
  return { ...(p as Partial<Settings>), theme, greekFace: "gentium", motion };
}

/** The colour of the browser's own bar on phones (and of an installed app's title bar): the paper, and the night page. */
export const THEME_COLOUR = "#f3ece0";
export const THEME_COLOUR_NIGHT = "#1b1814";

/** Writes the settings onto <html>. Kept in one place so the no-flash boot script matches it. */
export function applySettings(s: Settings) {
  const el = document.documentElement;
  // Paper or Night, chosen for good; "auto" leaves it to the device (styles/tokens.css)
  if (s.theme === "paper" || s.theme === "night") el.setAttribute("data-theme", s.theme); else el.removeAttribute("data-theme");
  // the browser's bar too: app/layout.tsx gives it the device's look (one colour for a light device, one for a dark one);
  // a look chosen for good gives both its own colour
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.content = s.theme === "night" || (s.theme !== "paper" && m.media.includes("dark")) ? THEME_COLOUR_NIGHT : THEME_COLOUR;
  });
  if (s.motion === "auto") el.removeAttribute("data-motion"); else el.setAttribute("data-motion", s.motion);
  el.style.setProperty("--greek-size", `${s.greekSize}rem`);
  el.style.setProperty("--reading-leading", String(s.leading));
  if (s.greekFace === "didot") el.setAttribute("data-greek-face", "didot"); else el.removeAttribute("data-greek-face");
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
 * Runs before first paint (inlined in <head>) so a page chosen as Paper or Night never flashes the other.
 * Must mirror applySettings().
 */
export const BOOT_SCRIPT = `(function(){try{var j=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}")||{},s=j.state||{},o=!(j.version>=2),e=document.documentElement;
var t=o?(s.theme==="light"?"paper":""):s.theme;if(t==="paper"||t==="night"){e.setAttribute("data-theme",t);document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.content=t==="night"?"${THEME_COLOUR_NIGHT}":"${THEME_COLOUR}"})}
if(s.motion==="reduce"||(o&&s.level==="performance"))e.setAttribute("data-motion","reduce");else if(s.motion==="full")e.setAttribute("data-motion","full");
if(s.greekSize)e.style.setProperty("--greek-size",s.greekSize+"rem");
if(s.leading)e.style.setProperty("--reading-leading",String(s.leading));
if(!o&&s.greekFace==="didot")e.setAttribute("data-greek-face","didot");}catch(_){}})();`;

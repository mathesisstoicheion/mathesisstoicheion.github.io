/**
 * The learner's progress in the Academy: lessons completed, days active (for streaks) and lesson tests.
 * Kept in this browser (localStorage); syncing across devices comes with accounts (Phase 8).
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { afterTest, type Mastery } from "./mastery";

const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const safe: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

interface AcademyState {
  completed: Record<string, number>;
  days: string[];
  /** lesson tests: passed when, and when each lesson next comes back for a refresh (lib/mastery.ts) */
  mastery: Record<string, Mastery>;
  /** records a lesson test; passing it also completes the lesson. Returns the lesson's new record. */
  recordTest: (id: string, right: number, total: number) => Mastery;
  completeLesson: (id: string) => void;
  markActive: () => void;
}

export const useAcademy = create<AcademyState>()(
  persist(
    (set, get) => ({
      completed: {},
      days: [],
      mastery: {},
      recordTest: (id, right, total) => {
        const m = afterTest(get().mastery[id], right, total);
        set((s) => ({
          mastery: { ...s.mastery, [id]: m },
          completed: m.passed ? { ...s.completed, [id]: s.completed[id] ?? m.passed } : s.completed,
          days: markToday(s.days),
        }));
        return m;
      },
      completeLesson: (id) => set((s) => ({ completed: { ...s.completed, [id]: s.completed[id] ?? Date.now() }, days: markToday(s.days) })),
      markActive: () => set((s) => ({ days: markToday(s.days) })),
    }),
    {
      name: "mathesis:academy",
      storage: createJSONStorage(() => safe),
      skipHydration: true,
      // version 1: the review deck was removed; an old saved `deck` is dropped, everything else is kept
      version: 1,
      migrate: (saved) => {
        const { deck: _deck, ...rest } = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>;
        void _deck;
        return rest as unknown as AcademyState;
      },
    },
  ),
);

function markToday(days: string[]) {
  const t = today();
  return days.includes(t) ? days : [...days, t].slice(-400);
}

/** Days in a row, ending today or yesterday. */
export function streak(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(today(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(today(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

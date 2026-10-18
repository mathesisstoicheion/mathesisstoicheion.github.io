/**
 * How the Treasury (Mine) is laid out, which its owner can change (the owner of the site, 2026-10-18: "fully
 * customizable, but the default layout should be A"): the order of its parts, which are hidden, the visitor's own
 * shelves (each gathers the notes with one tag) and the engraving at its head. Kept in this browser only; "Reset"
 * brings back the default.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage } from "@/lib/settings";

export type BlockId = "latest" | "shelves" | "private" | "keep" | "offline";
export interface OwnShelf { id: string; name: string; tag: string }

export const BLOCKS: Record<BlockId, string> = {
  latest: "Latest notes and saved words",
  shelves: "Shelves",
  private: "Private collection",
  keep: "Keep it safe",
  offline: "Reading offline",
};
export const DEFAULT_ORDER: BlockId[] = ["latest", "shelves", "private", "keep", "offline"];

interface Layout {
  order: BlockId[];
  hidden: BlockId[];
  shelves: OwnShelf[];
  piece: string | null;
  move: (id: BlockId, by: -1 | 1) => void;
  toggle: (id: BlockId) => void;
  addShelf: (name: string, tag: string) => void;
  removeShelf: (id: string) => void;
  setPiece: (piece: string | null) => void;
  reset: () => void;
}

const DEFAULT = { order: DEFAULT_ORDER, hidden: [] as BlockId[], shelves: [] as OwnShelf[], piece: null as string | null };

export const useTreasuryLayout = create<Layout>()(
  persist(
    (set) => ({
      ...DEFAULT,
      move: (id, by) => set((s) => {
        const o = [...s.order], i = o.indexOf(id), j = i + by;
        if (i < 0 || j < 0 || j >= o.length) return s;
        [o[i], o[j]] = [o[j], o[i]];
        return { order: o };
      }),
      toggle: (id) => set((s) => ({ hidden: s.hidden.includes(id) ? s.hidden.filter((x) => x !== id) : [...s.hidden, id] })),
      addShelf: (name, tag) => set((s) => ({ shelves: [...s.shelves, { id: `${Date.now().toString(36)}`, name: name.trim(), tag: tag.trim().replace(/^#/, "") }] })),
      removeShelf: (id) => set((s) => ({ shelves: s.shelves.filter((x) => x.id !== id) })),
      setPiece: (piece) => set({ piece }),
      reset: () => set(DEFAULT),
    }),
    {
      name: "mathesis-treasury-layout",
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ order, hidden, shelves, piece }) => ({ order, hidden, shelves, piece }),
      skipHydration: true,
      // a part added in a later version of the site joins the end of a saved order
      merge: (saved, cur) => {
        const s = (saved ?? {}) as Partial<Layout>;
        const order = (s.order ?? []).filter((x) => x in BLOCKS);
        return { ...cur, ...s, order: [...order, ...DEFAULT_ORDER.filter((x) => !order.includes(x))] };
      },
    },
  ),
);

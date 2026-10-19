import { create } from "zustand";

export type Tr = "all" | "with" | "greek";

/**
 * The library's search and its English filter. Design A sets them at the top of the page, beside its title
 * (components/a/LibSearch.tsx), above the famous books and the catalogue they narrow (Library.tsx), so the two share them
 * here. Library.tsx fills them from the address when the page opens and writes them back to it.
 */
export const useLibQuery = create<{ q: string; tr: Tr; setQ: (q: string) => void; setTr: (tr: Tr) => void }>((set) => ({
  q: "",
  tr: "all",
  setQ: (q) => set({ q }),
  setTr: (tr) => set({ tr }),
}));

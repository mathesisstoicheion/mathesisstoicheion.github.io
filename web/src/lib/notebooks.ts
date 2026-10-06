"use client";
/**
 * Research notebooks: named collections of what a reader gathers while studying (passages, concordance lines,
 * differences between editions, a sentence) with their own notes and paragraphs, in their own order, to be
 * cited and exported (lib/cite.ts, components/treasury/NotebooksSection.tsx). Kept in this browser
 * (localStorage "mathesis:notebooks"); the Treasury's file and the account's sync carry them (treasury-apply.ts).
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { recordDeletion } from "./tombstones";

interface Base { id: string; added: number; note?: string }
/** A passage of a work, in an edition (urn), from one reference to another, with its Greek and translation. */
export type PassageItem = Base & { kind: "passage"; work: string; urn: string; from: string; to: string; grc: string; tr?: string };
/** A line of a concordance: the words before, the match, the words after. */
export type LineItem = Base & { kind: "line"; work: string; urn: string; from: string; lang: "grc" | "eng"; left: string; match: string; right: string; query?: string; grammar?: string };
/** A difference between two editions: the first edition's words ] the second's. */
export type VariantItem = Base & { kind: "variant"; work: string; urn: string; other: string; from: string; a: string; b: string };
/** A paragraph of the reader's own. */
export type TextItem = Base & { kind: "text"; text: string };
export type NbItem = PassageItem | LineItem | VariantItem | TextItem;
/** What may be added: an item without its id and time. */
export type NewItem = Omit<PassageItem, "id" | "added"> | Omit<LineItem, "id" | "added"> | Omit<VariantItem, "id" | "added"> | Omit<TextItem, "id" | "added">;

export interface Notebook { id: string; title: string; items: NbItem[]; created: number; updated: number }

interface State {
  books: Record<string, Notebook>;
  /** the notebook added to last, offered first */
  last: string | null;
  create: (title: string) => Notebook;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  add: (id: string, items: NewItem[]) => number;
  edit: (id: string, item: string, patch: Partial<Pick<TextItem, "text" | "note">>) => void;
  drop: (id: string, item: string) => void;
  move: (id: string, item: string, by: -1 | 1) => void;
  /** notebooks from elsewhere (a restored file, the account): the newer copy of each wins */
  merge: (incoming: Notebook[], dead: Record<string, number>) => { added: number; updated: number };
}

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const safe: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage full or blocked */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* blocked */ } },
};
/** The same passage or line is not added twice to one notebook. */
const sameAs = (a: NbItem, b: NewItem) => {
  if (a.kind !== b.kind || a.kind === "text") return false;
  const x = a as Exclude<NbItem, TextItem>, y = b as Exclude<NewItem, Omit<TextItem, "id" | "added">>;
  if (x.urn !== y.urn || x.from !== y.from) return false;
  if (x.kind === "passage") return x.to === (y as PassageItem).to;
  if (x.kind === "line") return x.match === (y as LineItem).match && x.left === (y as LineItem).left;
  return x.a === (y as VariantItem).a && x.b === (y as VariantItem).b;
};

export const useNotebooks = create<State>()(
  persist(
    (set, get) => ({
      books: {},
      last: null,
      create: (title) => {
        const nb: Notebook = { id: `nb-${uid()}`, title: title.trim() || "Untitled notebook", items: [], created: Date.now(), updated: Date.now() };
        set((s) => ({ books: { ...s.books, [nb.id]: nb }, last: nb.id }));
        return nb;
      },
      rename: (id, title) => set((s) => (s.books[id] ? { books: { ...s.books, [id]: { ...s.books[id], title: title.trim() || s.books[id].title, updated: Date.now() } } } : s)),
      remove: (id) => { recordDeletion(id); set((s) => { const books = { ...s.books }; delete books[id]; return { books, last: s.last === id ? null : s.last }; }); },
      add: (id, items) => {
        const nb = get().books[id];
        if (!nb) return 0;
        const fresh = items.filter((it) => !nb.items.some((x) => sameAs(x, it))).map((it) => ({ ...it, id: uid(), added: Date.now() }) as NbItem);
        set((s) => ({ books: { ...s.books, [id]: { ...nb, items: [...nb.items, ...fresh], updated: Date.now() } }, last: id }));
        return fresh.length;
      },
      edit: (id, item, patch) => set((s) => {
        const nb = s.books[id];
        if (!nb) return s;
        return { books: { ...s.books, [id]: { ...nb, items: nb.items.map((x) => (x.id === item ? ({ ...x, ...patch } as NbItem) : x)), updated: Date.now() } } };
      }),
      drop: (id, item) => set((s) => {
        const nb = s.books[id];
        return nb ? { books: { ...s.books, [id]: { ...nb, items: nb.items.filter((x) => x.id !== item), updated: Date.now() } } } : s;
      }),
      move: (id, item, by) => set((s) => {
        const nb = s.books[id];
        if (!nb) return s;
        const i = nb.items.findIndex((x) => x.id === item), j = i + by;
        if (i < 0 || j < 0 || j >= nb.items.length) return s;
        const items = [...nb.items];
        [items[i], items[j]] = [items[j], items[i]];
        return { books: { ...s.books, [id]: { ...nb, items, updated: Date.now() } } };
      }),
      merge: (incoming, dead) => {
        let added = 0, updated = 0;
        const books = { ...get().books };
        for (const nb of incoming) {
          if (!nb?.id || !Array.isArray(nb.items) || (nb.id in dead && nb.updated <= dead[nb.id])) continue;
          const mine = books[nb.id];
          if (!mine) { books[nb.id] = nb; added++; } else if (nb.updated > mine.updated) { books[nb.id] = nb; updated++; }
        }
        for (const id of Object.keys(books)) if (id in dead && books[id].updated <= dead[id]) delete books[id];
        set({ books });
        return { added, updated };
      },
    }),
    { name: "mathesis:notebooks", storage: createJSONStorage(() => safe), partialize: (s) => ({ books: s.books, last: s.last }) },
  ),
);

/** Notebooks, most recently changed first. */
export const notebookList = (books: Record<string, Notebook>) => Object.values(books).sort((a, b) => b.updated - a.updated);

import { describe, expect, it } from "vitest";
import { workKinds, authorKind, kindKey, KIND_ORDER, OTHER_KIND } from "./kinds";
import type { CatAuthor } from "@/lib/catalog";
import type { WorkMeta } from "@/lib/works-meta";

const work = (id: string) => ({ id, title: id, lang: "grc", texts: [] }) as unknown as CatAuthor["works"][number];
const author = (id: string, name: string, ids: string[]) => ({ id, name, works: ids.map(work) }) as unknown as CatAuthor;
const m = (genre: string | null): WorkMeta => ({ genre, dialect: null, from: null, to: null, tokens: null });

describe("the kinds of writing the library's catalogue is grouped by", () => {
  it("file a work under GLAUx's kind for it, and an unclassified one with its author's most usual kind", () => {
    const plato = author("p", "Plato", ["p1", "p2", "p3", "p4"]);
    const k = workKinds([plato], { p1: m("Philosophic Dialogue"), p2: m("Philosophy"), p3: m("Epistolography"), p4: m(null) }, {});
    expect(k.get("p1")).toBe("Philosophy");
    expect(k.get("p3")).toBe("Letters");
    expect(k.get("p4")).toBe("Philosophy");
    expect(authorKind(plato, k)).toBe("Philosophy");
  });

  it("go by what a collection is called, then by what Wikidata says its author was, and only then under Other writings", () => {
    const scholia = author("s", "Scholia on Pindar", ["s1"]);
    const letters = author("l", "Letters of Phalaris", ["l1"]);
    const libanius = author("b", "Libanius", ["b1", "b2"]);
    const nobody = author("n", "Anonymous", ["n1"]);
    const k = workKinds([scholia, letters, libanius, nobody], {}, { b: { q: "Q1", occ: ["rhetorician", "writer"] } });
    expect(k.get("s1")).toBe("Scholarship");
    expect(k.get("l1")).toBe("Letters");
    expect(k.get("b2")).toBe("Oratory and rhetoric");
    expect(k.get("n1")).toBe(OTHER_KIND);
  });

  it("break a tie by the catalogue's order, and keep Other writings last", () => {
    const a = author("a", "A", ["a1", "a2"]);
    const k = workKinds([a], { a1: m("Tragedy"), a2: m("Epic poetry") }, {});
    expect(authorKind(a, k)).toBe("Epic");
    expect(KIND_ORDER[0]).toBe("Epic");
    expect(KIND_ORDER.at(-1)).toBe(OTHER_KIND);
    expect(kindKey("Novels, myths and marvels")).toBe("novels-myths-and-marvels");
  });
});

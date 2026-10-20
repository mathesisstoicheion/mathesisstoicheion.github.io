import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { Catalog } from "./catalog";

const catalog = JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog;
const notOpen = readFileSync("../pipeline/not_open.tsv", "utf8")
  .split("\n")
  .filter((l) => l.startsWith("urn:"))
  .map((l) => l.split("\t")[0]);

describe("texts under a licence that is not open", () => {
  it("are listed", () => {
    expect(notOpen.length).toBeGreaterThan(0);
  });
  it("are not in the catalogue", () => {
    const urns = catalog.authors.flatMap((a) => a.works.flatMap((w) => w.texts.map((t) => t.urn)));
    expect(urns.filter((u) => notOpen.includes(u))).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { indexCatalog, type Catalog } from "./catalog";
import { abbrevOf, cite, ctsOf, rangeOf, type Abbrev } from "./cite";

const idx = indexCatalog(JSON.parse(readFileSync("public/data/catalog.json", "utf8")) as Catalog);
const abbrevs = JSON.parse(readFileSync("public/data/abbrev.json", "utf8")) as Abbrev;
const agam = { work: "tlg0085.tlg005", urn: "urn:cts:greekLit:tlg0085.tlg005.perseus-grc2", from: "87" };
const iliad = { work: "tlg0012.tlg001", urn: "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2", from: "1.1", to: "1.7" };
const when = new Date("2026-10-06T12:00:00Z");

describe("citations", () => {
  it("write a range the short way", () => {
    expect(rangeOf("1.1", "1.7")).toBe("1.1–7");
    expect(rangeOf("87", "106")).toBe("87–106");
    expect(rangeOf("1.33", "2.4")).toBe("1.33–2.4");
    expect(rangeOf("5")).toBe("5");
  });
  it("use LSJ's abbreviation for the classical style", () => {
    expect(abbrevOf(abbrevs, "tlg0085.tlg005")).toBe("A. Ag.");
    expect(cite(idx, agam, "classical", abbrevs, "x")).toBe("A. Ag. 87");
    expect(cite(idx, iliad, "classical", abbrevs, "x")).toBe("Il. 1.1–7");
    expect(cite(idx, iliad, "classical", null, "x")).toBe("Homer, *Iliad* 1.1–7");
  });
  it("name the edition as its own file describes it, with the passage's CTS URN and a link", () => {
    expect(ctsOf(iliad)).toBe("urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.7");
    const c = cite(idx, iliad, "chicago", abbrevs, "https://mathesisstoicheion.com/read?w=tlg0012.tlg001&at=1.1", when);
    const desc = (idx.text.get(iliad.urn) as { desc?: string }).desc!;
    expect(c.startsWith("Homer, *Iliad* 1.1–7.")).toBe(true);
    expect(c).toContain(desc.slice(0, 20));
    expect(c).toContain("Perseus Digital Library");
    expect(c).toContain("urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.7");
    expect(c).toContain("(accessed 6 October 2026).");
    expect(cite(idx, iliad, "mla", abbrevs, "L", when)).toMatch(/^Homer\. \*Iliad\*, 1\.1–7\. .* L\. Accessed 6 October 2026\.$/);
  });
});

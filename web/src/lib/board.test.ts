import { describe, expect, it } from "vitest";
import { draftProblem, safeLink, safePicture, type BoardDraft } from "./board";

// The page's own copy of the board's rules (the database checks them again: supabase/tests/stoa_board_test.sql).
const d = (o: Partial<BoardDraft>): BoardDraft => ({ kind: "thought", title: "On logos", body: "Words.", link: null, picture: null, ...o });
const PIC = "data:image/webp;base64,UklGRg==";

describe("what may be put on the board", () => {
  it("takes a thought, a pot and a tune of the right shape", () => {
    expect(draftProblem(d({}))).toBeNull();
    expect(draftProblem(d({ link: "/stoa/melos" }))).toBeNull();
    expect(draftProblem(d({ link: "/read?w=tlg0012.tlg001&at=1.1" }))).toBeNull();
    expect(draftProblem(d({ kind: "pot", body: "", picture: PIC, link: "/stoa/pot#v=AbC-_9" }))).toBeNull();
    expect(draftProblem(d({ kind: "pot", body: "", picture: PIC }))).toBeNull();
    expect(draftProblem(d({ kind: "tune", body: "", link: "/stoa/lyre#tune=AbC-_9" }))).toBeNull();
  });
  it("asks for a title and, for a thought, the words", () => {
    expect(draftProblem(d({ title: " a " }))).toMatch(/title/);
    expect(draftProblem(d({ title: "x".repeat(121) }))).toMatch(/title/);
    expect(draftProblem(d({ body: "  " }))).toMatch(/thought/);
  });
  it("refuses links off the site, markup, and a pot or tune without what makes it one", () => {
    expect(draftProblem(d({ link: "https://example.org" }))).not.toBeNull();
    expect(draftProblem(d({ link: '/stoa/a"><script>' }))).not.toBeNull();
    expect(draftProblem(d({ kind: "pot", picture: null }))).toMatch(/picture/);
    expect(draftProblem(d({ kind: "pot", picture: "javascript:alert(1)" }))).toMatch(/picture/);
    expect(draftProblem(d({ kind: "tune", link: "/stoa/lyre" }))).toMatch(/tune/);
    expect(draftProblem(d({ kind: "tune", link: "/stoa/lyre#tune=AA", picture: PIC }))).not.toBeNull();
  });
  it("shows only the site's own links and real pictures", () => {
    expect(safeLink("/stoa/pot#v=AA")).toBe("/stoa/pot#v=AA");
    expect(safeLink("javascript:alert(1)")).toBeNull();
    expect(safeLink("//evil.example/stoa/x")).toBeNull();
    expect(safePicture(PIC)).toBe(PIC);
    expect(safePicture("data:text/html;base64,PHNjcmlwdD4=")).toBeNull();
  });
});

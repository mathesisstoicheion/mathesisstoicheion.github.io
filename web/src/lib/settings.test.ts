import { describe, expect, it } from "vitest";
import { useSettings, DEFAULTS, LIMITS, upgrade, greekAlone, gentiumOnly, BOOT_SCRIPT } from "./settings";

describe("settings", () => {
  it("starts from the defaults: the page follows the device, Greek in Gentium", () => {
    const { theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace } = useSettings.getState();
    expect({ theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace }).toEqual(DEFAULTS);
    expect(DEFAULTS.theme).toBe("auto");
    expect(DEFAULTS.greekFace).toBe("gentium");
  });

  it("has no lamp on the passage, no animation levels and no bottom-bar setting any more", () => {
    for (const gone of ["lamp", "level", "bar", "textFace"]) {
      expect(gone in useSettings.getState()).toBe(false);
      expect(gone in DEFAULTS).toBe(false);
    }
  });

  it("keeps text size and line spacing inside their limits", () => {
    useSettings.getState().set({ greekSize: 99, leading: 0 });
    expect(useSettings.getState().greekSize).toBe(LIMITS.greekSize.max);
    expect(useSettings.getState().leading).toBe(LIMITS.leading.min);
    useSettings.getState().reset();
    expect(useSettings.getState().greekSize).toBe(DEFAULTS.greekSize);
  });
});

describe("settings saved before the printed page", () => {
  it("turn the reader's Daylight into Paper and its Lamplight into following the device", () => {
    expect(upgrade({ theme: "light" }).theme).toBe("paper");
    expect(upgrade({ theme: "dark" }).theme).toBe("auto");
    expect(upgrade({ theme: "auto" }).theme).toBe("auto");
  });
  it("keep asking for no movement where Performance was chosen, and drop the old levels, the bar's setting and the English face", () => {
    const m = upgrade({ level: "performance", bar: "always", textFace: "sans", greekSize: 1.5 }) as Record<string, unknown>;
    expect(m.motion).toBe("reduce");
    expect("level" in m || "bar" in m || "textFace" in m).toBe(false);
    expect(m.greekSize).toBe(1.5);
    expect(upgrade({ level: "full" }).motion).toBe("auto");
  });
  it("give the old Greek faces (Garamond, saved as \"didot\", and Sans) the new default, Gentium", () => {
    expect(upgrade({ greekFace: "sans" }).greekFace).toBe("gentium");
    expect(upgrade({ greekFace: "didot" }).greekFace).toBe("gentium");
  });
});

// the quiet desk, ticket 07: Greek alone is the default, and a saved "both" (the old default) changes to it once
describe("settings saved before the quiet desk", () => {
  const migrate = (saved: unknown, version: number) => useSettings.persist.getOptions().migrate!(saved, version) as Record<string, unknown>;
  it("start with the Greek alone", () => {
    expect(DEFAULTS.columns).toBe("greek");
    expect(useSettings.persist.getOptions().version).toBe(4);
  });
  it("turn a saved \"both\" into \"greek\", once", () => {
    expect(migrate({ columns: "both", greekSize: 1.5 }, 2)).toMatchObject({ columns: "greek", greekSize: 1.5 });
    expect(greekAlone({ columns: "both" }).columns).toBe("greek");
  });
  it("leave a saved \"trans\" as it is", () => {
    expect(migrate({ columns: "trans" }, 2).columns).toBe("trans");
    expect(migrate({ columns: "greek" }, 2).columns).toBe("greek");
  });
  it("still upgrade the theme of version 1 saves, and give them Greek alone as well", () => {
    expect(migrate({ theme: "light", columns: "both" }, 1)).toMatchObject({ theme: "paper", greekFace: "gentium", columns: "greek" });
  });
  it("keep a \"both\" chosen after the upgrade (version 3)", () => {
    expect(migrate({ columns: "both" }, 3).columns).toBe("both");
    expect(migrate({ columns: "both" }, 4).columns).toBe("both");
  });
  it("leave the no-flash script reading the theme upgrade for version 1 only", () => {
    // it asks whether the save is older than version 2 (the theme), so a version 3 save must not count as old
    expect(BOOT_SCRIPT).toContain("j.version>=2");
    const boot = (version: number, theme: string) => {
      const attrs: Record<string, string> = {};
      const store = { getItem: () => JSON.stringify({ state: { theme }, version }) };
      const el = { setAttribute: (k: string, v: string) => { attrs[k] = v; }, style: { setProperty() {} } };
      new Function("localStorage", "document", BOOT_SCRIPT)(store, { documentElement: el, querySelectorAll: () => [] });
      return attrs["data-theme"];
    };
    expect(boot(3, "night")).toBe("night");   // version 3: the saved theme is used as it is
    expect(boot(1, "light")).toBe("paper");   // version 1: Daylight becomes Paper
    expect(boot(3, "light")).toBeUndefined(); // version 3 never holds "light"
  });
});

// the quiet desk, ticket 09: GFS Didot leaves the reading choices (Aa and Settings), so a saved Didot becomes Gentium, once
describe("settings saved before the typeface left the reading choices", () => {
  const migrate = (saved: unknown, version: number) => useSettings.persist.getOptions().migrate!(saved, version) as Record<string, unknown>;
  it("turn a saved Didot into Gentium", () => {
    expect(migrate({ greekFace: "didot", greekSize: 1.5 }, 3)).toMatchObject({ greekFace: "gentium", greekSize: 1.5 });
    expect(gentiumOnly({ greekFace: "didot" }).greekFace).toBe("gentium");
  });
  it("leave Gentium, and every other setting, as it is", () => {
    expect(migrate({ greekFace: "gentium", theme: "night", leading: 2 }, 3)).toEqual({ greekFace: "gentium", theme: "night", leading: 2 });
    expect(gentiumOnly(undefined)).toEqual({});
  });
  it("carry a Didot from the printed page's settings (version 2) and the first ones (version 1) through every step to Gentium", () => {
    expect(migrate({ greekFace: "didot", columns: "both" }, 2)).toMatchObject({ greekFace: "gentium", columns: "greek" });
    expect(migrate({ greekFace: "didot", theme: "light" }, 1)).toMatchObject({ greekFace: "gentium", theme: "paper" });
  });
  it("leave a Didot saved from version 4 on alone (it can still be set from the search box, which is not a reading choice in Aa)", () => {
    expect(migrate({ greekFace: "didot" }, 4).greekFace).toBe("didot");
  });
  it("keep the no-flash script from putting a version 3 save's Didot on the page", () => {
    const boot = (version: number, greekFace: string) => {
      const attrs: Record<string, string> = {};
      const store = { getItem: () => JSON.stringify({ state: { greekFace }, version }) };
      const el = { setAttribute: (k: string, v: string) => { attrs[k] = v; }, style: { setProperty() {} } };
      new Function("localStorage", "document", BOOT_SCRIPT)(store, { documentElement: el, querySelectorAll: () => [] });
      return attrs["data-greek-face"];
    };
    expect(boot(3, "didot")).toBeUndefined();   // it is Gentium once the settings load
    expect(boot(4, "didot")).toBe("didot");
    expect(boot(4, "gentium")).toBeUndefined();
  });
});

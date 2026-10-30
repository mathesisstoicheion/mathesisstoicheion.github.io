import { describe, expect, it } from "vitest";
import { useSettings, DEFAULTS, LIMITS, upgrade, greekAlone, gentiumOnly, autoSize, applySettings, BOOT_SCRIPT, type Settings } from "./settings";

describe("settings", () => {
  it("starts from the defaults: the page follows the device, Greek in Gentium", () => {
    const { theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, vibrate, pron, markers, greekFace } = useSettings.getState();
    expect({ theme, motion, greekSize, leading, columns, translit, cases, metre, tryFirst, vibrate, pron, markers, greekFace }).toEqual(DEFAULTS);
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

  it("keeps \"auto\" as it is, and a number inside its limits (the quiet desk, ticket 10)", () => {
    useSettings.getState().set({ greekSize: 1.5 });
    expect(useSettings.getState().greekSize).toBe(1.5);
    useSettings.getState().set({ greekSize: "auto" });
    expect(useSettings.getState().greekSize).toBe("auto");
    useSettings.getState().set({ leading: 2 });   // another setting changed: the size is not touched
    expect(useSettings.getState().greekSize).toBe("auto");
    useSettings.getState().set({ greekSize: 0.2 });
    expect(useSettings.getState().greekSize).toBe(LIMITS.greekSize.min);
    useSettings.getState().reset();
    expect(useSettings.getState().greekSize).toBe("auto");
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
    expect(useSettings.persist.getOptions().version).toBe(5);
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

// the quiet desk, ticket 10: the Greek's size suits the device ("auto") unless the reader has chosen one, and "Fit lines" is gone (the verse fit,
// lib/verseFit.ts, replaces it for every page set in verse)
describe("settings saved before the Greek's size suited the device", () => {
  const migrate = (saved: unknown, version: number) => useSettings.persist.getOptions().migrate!(saved, version) as Record<string, unknown>;

  /** a stand-in for the page's <html>: the style properties and attributes it holds, as the settings and the no-flash script write them */
  function page() {
    const style = new Map<string, string>(), attrs = new Map<string, string>();
    const el = {
      style: { setProperty: (k: string, v: string) => { style.set(k, v); }, removeProperty: (k: string) => { style.delete(k); } },
      setAttribute: (k: string, v: string) => { attrs.set(k, v); }, removeAttribute: (k: string) => { attrs.delete(k); },
    };
    return { style, attrs, document: { documentElement: el, querySelectorAll: () => [] } };
  }
  /** what the no-flash script puts on the page for a save of this version holding this size */
  const boot = (version: number | undefined, greekSize: unknown) => {
    const p = page();
    const saved = version === undefined ? "{}" : JSON.stringify({ state: greekSize === undefined ? {} : { greekSize }, version });
    new Function("localStorage", "document", BOOT_SCRIPT)({ getItem: () => saved }, p.document);
    return p.style;
  };
  /** what applySettings puts on the page for the settings the store holds after a save of this version has been upgraded */
  const applied = (version: number, greekSize: unknown) => {
    const p = page(), before = (globalThis as { document?: unknown }).document;
    const state = { ...DEFAULTS, ...(migrate(greekSize === undefined ? {} : { greekSize }, version) as Partial<Settings>) };
    (globalThis as { document?: unknown }).document = p.document;
    try { applySettings(state); } finally { (globalThis as { document?: unknown }).document = before; }
    return p.style;
  };

  it("start with the size that suits the device, and no Fit lines", () => {
    expect(DEFAULTS.greekSize).toBe("auto");
    expect("fitLines" in DEFAULTS).toBe(false);
    expect("fitLines" in useSettings.getState()).toBe(false);
    expect(useSettings.persist.getOptions().version).toBe(5);
  });
  it("turn the old default size (1.25 rem, 20 px, never changed) into auto, once", () => {
    expect(migrate({ greekSize: 1.25 }, 4).greekSize).toBe("auto");
    expect(migrate({ greekSize: 1.25 }, 3).greekSize).toBe("auto");
    expect(autoSize({ greekSize: 1.25 }).greekSize).toBe("auto");
  });
  it("keep any other size as the reader's own choice", () => {
    expect(migrate({ greekSize: 1.5 }, 4).greekSize).toBe(1.5);
    expect(migrate({ greekSize: 1 }, 3).greekSize).toBe(1);
    expect(migrate({ greekSize: 1.3125 }, 2).greekSize).toBe(1.3125);
    expect(autoSize({ greekSize: 1.1875 }).greekSize).toBe(1.1875);
  });
  it("drop Fit lines, whatever it was, and leave every other setting as it is", () => {
    expect(migrate({ fitLines: true, greekSize: 1.5, theme: "night" }, 4)).toEqual({ greekSize: 1.5, theme: "night" });
    expect(migrate({ fitLines: false, columns: "both" }, 2)).toEqual({ columns: "greek" });   // (and the older steps still run)
    expect("fitLines" in migrate({ fitLines: false }, 4)).toBe(false);
    expect(autoSize(undefined)).toEqual({});
  });
  it("give a save that holds no size the default, auto, and carry the oldest saves through every step", () => {
    expect({ ...DEFAULTS, ...migrate({ columns: "trans" }, 3) }.greekSize).toBe("auto");
    expect(migrate({ theme: "light", greekFace: "didot", greekSize: 1.25, fitLines: true, columns: "both" }, 1))
      .toEqual({ theme: "paper", greekFace: "gentium", motion: "auto", greekSize: "auto", columns: "greek" });
  });
  it("leave a size chosen after the upgrade (version 5) alone, even 1.25", () => {
    expect(migrate({ greekSize: 1.25 }, 5).greekSize).toBe(1.25);
    expect(migrate({ greekSize: "auto" }, 5).greekSize).toBe("auto");
  });

  it("have applySettings set --greek-chosen (in rem) for a number only, and take it away for auto", () => {
    expect(applied(5, 1.5).get("--greek-chosen")).toBe("1.5rem");
    expect(applied(5, "auto").has("--greek-chosen")).toBe(false);
    const p = page(), before = (globalThis as { document?: unknown }).document;
    (globalThis as { document?: unknown }).document = p.document;
    try {
      applySettings({ ...DEFAULTS, greekSize: 1.75 });
      expect(p.style.get("--greek-chosen")).toBe("1.75rem");
      applySettings({ ...DEFAULTS, greekSize: "auto" });   // a number chosen, then auto again: the property goes
      expect(p.style.has("--greek-chosen")).toBe(false);
    } finally { (globalThis as { document?: unknown }).document = before; }
  });
  it("have the no-flash script set --greek-chosen only for a number, as applySettings does", () => {
    expect(boot(5, 1.5).get("--greek-chosen")).toBe("1.5rem");
    expect(boot(5, "auto").has("--greek-chosen")).toBe(false);
    expect(boot(undefined, undefined).has("--greek-chosen")).toBe(false);
    expect(boot(5, undefined).has("--greek-chosen")).toBe(false);
    expect(boot(5, 1.25).get("--greek-chosen")).toBe("1.25rem");   // chosen after the upgrade
    expect(boot(4, 1.25).has("--greek-chosen")).toBe(false);       // the old default: it is auto once the settings load, so it is not 20 px for a moment first
    expect(boot(4, 1.5).get("--greek-chosen")).toBe("1.5rem");
    expect(boot(1, 1.25).has("--greek-chosen")).toBe(false);
  });
  it("keep the no-flash script and applySettings in step, whatever the saved version and size", () => {
    for (const version of [1, 2, 3, 4, 5]) {
      for (const size of [undefined, "auto", 1, 1.25, 1.5, 2]) {
        if (version < 5 && size === "auto") continue;   // an older save never holds it
        expect(boot(version, size).get("--greek-chosen"), `version ${version}, size ${String(size)}`).toBe(applied(version, size).get("--greek-chosen"));
      }
    }
  });
  it("no longer set --greek-size on the page itself (the reader and the rest of the site derive it from --greek-chosen)", () => {
    expect(boot(5, 1.5).has("--greek-size")).toBe(false);
    expect(applied(5, 1.5).has("--greek-size")).toBe(false);
  });
});

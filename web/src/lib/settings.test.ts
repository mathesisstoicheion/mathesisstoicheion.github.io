import { describe, expect, it } from "vitest";
import { useSettings, DEFAULTS, LIMITS, upgrade } from "./settings";

describe("settings", () => {
  it("starts from the defaults: the page follows the device, Greek in Gentium", () => {
    const { theme, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace } = useSettings.getState();
    expect({ theme, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, vibrate, pron, markers, greekFace }).toEqual(DEFAULTS);
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

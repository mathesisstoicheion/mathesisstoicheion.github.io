import { afterEach, describe, expect, it, vi } from "vitest";
import { useSettings, DEFAULTS, LIMITS, deviceLevel } from "./settings";

describe("settings", () => {
  it("starts from the defaults, at this device's level", () => {
    const { theme, level, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, bar, vibrate, pron, markers, greekFace, textFace } = useSettings.getState();
    const first = deviceLevel();
    expect({ theme, level, motion, greekSize, leading, columns, translit, cases, known, metre, tryFirst, fitLines, bar, vibrate, pron, markers, greekFace, textFace })
      .toEqual({ ...DEFAULTS, level: first, motion: first === "performance" ? "reduce" : "auto" });
  });

  it("has no lamp on the passage any more (the owner, 2026-10-22: distracting, never asked for)", () => {
    expect("lamp" in useSettings.getState()).toBe(false);
    expect("lamp" in DEFAULTS).toBe(false);
  });

  it("keeps text size and line spacing inside their limits", () => {
    useSettings.getState().set({ greekSize: 99, leading: 0 });
    expect(useSettings.getState().greekSize).toBe(LIMITS.greekSize.max);
    expect(useSettings.getState().leading).toBe(LIMITS.leading.min);
    useSettings.getState().reset();
    expect(useSettings.getState().greekSize).toBe(DEFAULTS.greekSize);
  });
});

describe("the level a first visit starts at", () => {
  afterEach(() => vi.unstubAllGlobals());
  const device = (deviceMemory: number | undefined, hardwareConcurrency: number) => vi.stubGlobal("navigator", { deviceMemory, hardwareConcurrency });

  it("is Full beauty on an ordinary phone or computer", () => {
    device(8, 8); expect(deviceLevel()).toBe("full");
    device(4, 8); expect(deviceLevel()).toBe("full");
    device(undefined, 4); expect(deviceLevel()).toBe("full");   // Safari says nothing of its memory
  });
  it("steps down on clearly weak devices", () => {
    device(2, 8); expect(deviceLevel()).toBe("balanced");
    device(undefined, 2); expect(deviceLevel()).toBe("balanced");
    device(1, 4); expect(deviceLevel()).toBe("performance");
    device(0.5, 2); expect(deviceLevel()).toBe("performance");
  });
});

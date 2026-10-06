import { describe, expect, it } from "vitest";
import { wheelReader } from "./wheel";

const ev = (o: Partial<WheelEvent>) => ({ ctrlKey: false, deltaMode: 0, deltaX: 0, deltaY: 0, timeStamp: 0, ...o }) as WheelEvent;
describe("wheelReader", () => {
  it("tells a pinch, a trackpad scroll and a mouse wheel apart", () => {
    const read = wheelReader();
    expect(read(ev({ ctrlKey: true, deltaY: 3.2, timeStamp: 0 }))).toBe("pinch");
    expect(read(ev({ deltaY: 100, timeStamp: 1000 }))).toBe("wheel");
    expect(read(ev({ deltaY: 120, timeStamp: 2000 }))).toBe("wheel");
    expect(read(ev({ deltaY: 3, deltaMode: 1, timeStamp: 3000 }))).toBe("wheel");   // Firefox: lines
    expect(read(ev({ deltaY: 4.5, timeStamp: 4000 }))).toBe("pan");
    expect(read(ev({ deltaX: 12, timeStamp: 5000 }))).toBe("pan");
  });
  it("keeps a flicked trackpad scroll a scroll, even when one step is large", () => {
    const read = wheelReader();
    expect(read(ev({ deltaY: 8.5, timeStamp: 0 }))).toBe("pan");
    expect(read(ev({ deltaY: 140, timeStamp: 16 }))).toBe("pan");
    expect(read(ev({ deltaY: 100, timeStamp: 900 }))).toBe("wheel");   // a new gesture, later
  });
});

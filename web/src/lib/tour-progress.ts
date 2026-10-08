/**
 * Which of the Guide's "Show me" tours this browser has finished: a convenience for the ticks on /guide, kept in
 * this browser only (if storage is blocked, the Guide simply shows no ticks).
 */
import { useEffect, useState } from "react";

const KEY = "mathesis:tours-done";
const EVENT = "mathesis:tours";

export function toursDone(): string[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; }
  catch { return []; }
}
export function markTourDone(id: string) {
  try {
    const all = toursDone();
    if (!all.includes(id)) localStorage.setItem(KEY, JSON.stringify([...all, id]));
    dispatchEvent(new Event(EVENT));
  } catch { /* storage blocked: no tick */ }
}
/** the finished tours, kept up to date */
export function useToursDone(): string[] {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    const read = () => setDone(toursDone());
    read();
    addEventListener(EVENT, read);
    addEventListener("storage", read);
    return () => { removeEventListener(EVENT, read); removeEventListener("storage", read); };
  }, []);
  return done;
}

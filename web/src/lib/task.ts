"use client";
/**
 * One thing a button asks of the database (approve, delete, put up, show more), as a single named state rather than a
 * `busy` flag and an `error` text kept side by side. The two flags allowed states that mean nothing (busy and failed at
 * once) and had to be reset by hand in each place; here every step is one change of `state`.
 *
 *   idle ──run──▶ busy ──ok──▶ done
 *                   └──throws──▶ error (message) ──run again──▶ busy
 *
 * `done` stays until the next run: a button whose work takes it away (a delete) stays disabled rather than waking for a
 * moment before the page changes.
 */
import { useCallback, useState } from "react";
import { problem } from "@/lib/community/account";

export type Task =
  | { state: "idle" }
  | { state: "busy" }
  | { state: "done" }
  | { state: "error"; message: string };

export const IDLE: Task = { state: "idle" };

/** A run that threw: the state it leaves, with the database's problem in plain words. */
export const failed = (e: unknown): Task => ({ state: "error", message: problem(e) });

/** The message to show, if the last run failed (or a check before it did). */
export const taskError = (t: Task): string | null => (t.state === "error" ? t.message : null);

/** A task, and the way to run it. `run` resolves to whether it worked; it never throws. */
export function useTask() {
  const [task, setTask] = useState<Task>(IDLE);
  const run = useCallback(async (work: () => Promise<unknown>): Promise<boolean> => {
    setTask({ state: "busy" });
    try { await work(); setTask({ state: "done" }); return true; }
    catch (e) { setTask(failed(e)); return false; }
  }, []);
  /** A check before running found something to say (a title too short): shown as the task's error. */
  const fail = useCallback((message: string) => setTask({ state: "error", message }), []);
  const reset = useCallback(() => setTask(IDLE), []);
  return { task, busy: task.state === "busy", error: taskError(task), run, fail, reset };
}

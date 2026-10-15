/**
 * The reader comes first. While it is opening a text, a Scroll Case download running in the background
 * (six files at a time, each fetched, checked and saved) waits between files, so on a phone it no longer
 * competes with the text being opened for the connection and the processor.
 */
let busy = 0;

/** Say the reader is opening a text; call the returned function when it is done (calling it twice is harmless). */
export function readerBusy(): () => void {
  busy++;
  let released = false;
  return () => { if (!released) { released = true; busy--; } };
}

/** For downloads: wait while the reader is opening a text. */
export async function afterReader(signal: AbortSignal) {
  while (busy > 0 && !signal.aborted) await new Promise((r) => setTimeout(r, 250));
}

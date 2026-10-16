/// <reference lib="webworker" />
/** Renders the lyre's strings off the main thread (string.ts), so getting a song ready never stutters the page; and
 *  makes the sound box and the hall for a sample rate; and writes recordings as WAV files (wav.ts). */
import { bodyResponse, renderPluck, roomResponse } from "./string";
import { encodeWav } from "./wav";

export interface RenderJob { key: string; hz: number; strength: number; sr: number; seed: number }
type Message = { jobs: RenderJob[] } | { wav: { id: number; L: Float32Array; R: Float32Array; sr: number } } | { hall: number };

const post = (m: unknown, t: Transferable[]) => (self as unknown as Worker).postMessage(m, t);

self.onmessage = (e: MessageEvent<Message>) => {
  const d = e.data;
  if ("hall" in d) {
    const body = bodyResponse(d.hall), [L, R] = roomResponse(d.hall);
    post({ hall: d.hall, body, L, R }, [body.buffer, L.buffer, R.buffer]);
    return;
  }
  if ("wav" in d) {
    const data = encodeWav(d.wav.L, d.wav.R, d.wav.sr);
    post({ wav: d.wav.id, data }, [data]);
    return;
  }
  for (const j of d.jobs) {
    const y = renderPluck(j);
    post({ key: j.key, y }, [y.buffer]);
  }
};

/**
 * A MIDI keyboard plugged into the computer (the browser's Web MIDI, in Chrome, Edge, Opera and Firefox; Safari has none).
 * Each key sends its note and its velocity, how hard it was struck (1 to 127), which the lyre turns into how hard the
 * string is plucked. The sustain pedal (controller 64) keeps strings ringing after their keys are let go.
 */

export interface MidiHandlers {
  on: (note: number, velocity: number) => void;
  off: (note: number) => void;
  pedal?: (down: boolean) => void;
  devices?: (names: string[]) => void;
}

export const midiSupported = () => typeof navigator !== "undefined" && "requestMIDIAccess" in navigator;

/** Ask the browser for MIDI keyboards and listen to every one, including any plugged in later. Returns the stop function. */
export async function listenMidi(h: MidiHandlers): Promise<() => void> {
  const access = await navigator.requestMIDIAccess({ sysex: false });
  const onMsg = (e: MIDIMessageEvent) => {
    const d = e.data;
    if (!d || d.length < 2) return;
    const kind = d[0] & 0xf0, a = d[1], b = d.length > 2 ? d[2] : 0;
    if (kind === 0x90 && b > 0) h.on(a, b);
    else if (kind === 0x80 || (kind === 0x90 && b === 0)) h.off(a);
    else if (kind === 0xb0 && a === 64) h.pedal?.(b >= 64);
  };
  const wire = () => {
    const names: string[] = [];
    access.inputs.forEach((inp) => { inp.onmidimessage = onMsg; names.push(inp.name || "MIDI keyboard"); });
    h.devices?.(names);
  };
  wire();
  access.onstatechange = wire;
  return () => {
    access.onstatechange = null;
    access.inputs.forEach((inp) => { inp.onmidimessage = null; });
  };
}

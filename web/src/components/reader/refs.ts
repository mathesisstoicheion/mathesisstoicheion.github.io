/** A passage's reference, or a run of passages' ("1.33" or "1.33–1.40"). */
export const rangeLabel = (a: string, b: string) => (a === b ? a : `${a}–${b}`);

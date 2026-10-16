/**
 * Two channels as a CD-quality WAV file: 16-bit PCM, levelled so the loudest moment peaks just under full scale, with
 * the silence at the end trimmed to a short fade and a whisper of dither (TPDF) so the quietest tail does not crackle.
 * It uses nothing of the page, so it also runs in the worker.
 */
export function encodeWav(L: Float32Array, R: Float32Array, sr = 44100, peakDb = -1): ArrayBuffer {
  let peak = 0;
  for (let i = 0; i < L.length; i++) { const a = Math.abs(L[i]), b = Math.abs(R[i]); if (a > peak) peak = a; if (b > peak) peak = b; }
  const gain = peak ? 10 ** (peakDb / 20) / peak : 1;
  // trim silence at the end (below -80 dB), keeping a short fade
  let n = L.length;
  while (n > sr && Math.abs(L[n - 1]) * gain < 1e-4 && Math.abs(R[n - 1]) * gain < 1e-4) n--;
  const fade = Math.min(n, Math.floor(sr * 0.25));
  const buf = new ArrayBuffer(44 + n * 4), data = new DataView(buf);
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); data.setUint32(4, 36 + n * 4, true); str(8, "WAVE");
  str(12, "fmt "); data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, 2, true);
  data.setUint32(24, sr, true); data.setUint32(28, sr * 4, true); data.setUint16(32, 4, true); data.setUint16(34, 16, true);
  str(36, "data"); data.setUint32(40, n * 4, true);
  const pcm = new Int16Array(buf, 44, n * 2);          // WAV is little-endian, as every device the site runs on
  let seed = 22222;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const q = gain * 32767;
  for (let i = 0; i < n; i++) {
    const f = i > n - fade ? ((n - i) / fade) * q : q;
    const l = Math.round(L[i] * f + rnd() - rnd()), r = Math.round(R[i] * f + rnd() - rnd());
    pcm[2 * i] = l < -32768 ? -32768 : l > 32767 ? 32767 : l;
    pcm[2 * i + 1] = r < -32768 ? -32768 : r > 32767 ? 32767 : r;
  }
  return buf;
}

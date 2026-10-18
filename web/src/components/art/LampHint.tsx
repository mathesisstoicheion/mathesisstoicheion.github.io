/**
 * The quiet note in the corner of a lit sculpture's window saying it can be lit. It stays in its place by the piece
 * rather than following the pointer as the browser's own tooltip did (the owner, 2026-10-18: it "tends to stick where the
 * mouse is, and is distracting when you just move your mouse around to light it"). "Click" on a computer, "Tap" on a
 * touch screen (globals.css, .lamp-hint).
 */
export default function LampHint({ lit }: { lit: boolean }) {
  return (
    <span className="lamp-hint" aria-hidden="true">
      <span className="lamp-click">Click</span><span className="lamp-tap">Tap</span>{lit ? " to give it back to your torch" : " to light it"}
    </span>
  );
}

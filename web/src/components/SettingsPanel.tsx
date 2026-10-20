"use client";

import { useEffect, useRef } from "react";
import { useSettings, applySettings, type AnimLevel } from "@/lib/settings";
import { useUI } from "@/lib/ui";
import { useAcademy } from "@/lib/academy";
import { useDragToClose } from "@/lib/use-drag-close";
import OfflineActions from "./OfflineActions";
import Link from "next/link";
import styles from "./SettingsPanel.module.css";
import { useScrollLock } from "@/lib/overlay";
import ReadingControls, { Segmented } from "./ReadingControls";

// the three levels of animation (lib/settings.ts, AnimLevel)
const LEVELS: [AnimLevel, string][] = [["full", "Full beauty"], ["balanced", "Balanced"], ["performance", "Performance"]];
const LEVEL_HINT: Record<AnimLevel, string> = {
  full: "Every picture and letter moves as designed.",
  balanced: "The same art, drawn a little less sharply and less often while nothing moves. Kinder to a busy phone or laptop.",
  performance: "The art is drawn once and holds still, and pages open without animation. For older computers and phones.",
};
const ON_OFF: ["on" | "off", string][] = [["on", "On"], ["off", "Off"]];

/**
 * Loads saved settings after hydration (so server and client first render match) and applies
 * every later change to the page. The boot script in <head> has already applied the saved
 * values before first paint, so nothing flashes.
 */
export function SettingsApplier() {
  useEffect(() => {
    const unsubscribe = useSettings.subscribe((s) => applySettings(s));
    useSettings.persist.rehydrate();
    useAcademy.persist.rehydrate();
    return unsubscribe;
  }, []);
  return null;
}

export default function SettingsPanel() {
  const open = useUI((s) => s.settingsOpen);
  const close = useUI((s) => s.closeSettings);
  const s = useSettings();
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useScrollLock(open);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // the keyboard goes back to whatever opened the settings once they close (scripts/check-overlays.mjs)
    if (open && !d.open) { opener.current = document.activeElement as HTMLElement | null; reset(); d.showModal(); }
    if (!open && d.open) d.close();
    if (!open && opener.current) {
      const o = opener.current;
      opener.current = null;
      // opened from the menu, which has closed meanwhile: the menu's own button
      if (o !== document.body && o.isConnected && o.getClientRects().length) o.focus();
      else document.querySelector<HTMLElement>('header button[aria-label="Menu"]')?.focus();
    }
    // reset is the same function every time in effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Phones: the sheet follows a finger dragging its top edge down, and goes away if let go far enough down.
  const { handlers: dragProps, reset } = useDragToClose({
    el: () => ref.current, onClose: close, direction: "down", draggingClass: styles.dragging,
    when: () => matchMedia("(max-width: 760px)").matches,
  });

  return (
    <dialog
      ref={ref}
      className={styles.sheet}
      data-overlay=""
      aria-labelledby="settings-title"
      onClose={close}
      onClick={(e) => { if (e.target === ref.current) close(); }}
    >
      <div className={styles.handle} aria-hidden="true" {...dragProps} />
      <div className={styles.inner}>
        <div className={styles.head} {...dragProps}>
          <h2 id="settings-title">Settings</h2>
          <button type="button" className={styles.x} onClick={close} aria-label="Close settings">×</button>
        </div>

        <section className={styles.group}>
          <h3 className="label">Reading</h3>
          <ReadingControls />
        </section>

        <section className={styles.group}>
          <h3 className="label">Animation</h3>
          <Segmented label="Animation" value={s.level} options={LEVELS} onChange={(level) => s.set({ level })} />
          <p className={styles.hint}>{LEVEL_HINT[s.level]}</p>
        </section>

        <section className={styles.group}>
          <h3 className="label">Short vibrations</h3>
          <Segmented label="Short vibrations" value={s.vibrate ? "on" : "off"} options={ON_OFF} onChange={(v) => s.set({ vibrate: v === "on" })} />
          <p className={styles.hint}>A short buzz when you save a word, bookmark a passage or answer right, on phones that allow it (most Android phones; iPhones do not let websites vibrate).</p>
        </section>

        <section className={styles.group}>
          <h3 className="label">Offline reading</h3>
          <p className={styles.hint}>Keep a copy of the text collections on this computer and read without a connection.</p>
          {/* only while open: it works out download sizes from the whole catalogue (1.3 MB), which no page should pay for unasked */}
          {open && <OfflineActions compact />}
        </section>

        <button type="button" className={styles.reset} onClick={s.reset}>
          Restore default settings
        </button>
        <p className={styles.guideLink}><Link href="/guide" onClick={close}>How to use the site →</Link></p>
      </div>
    </dialog>
  );
}

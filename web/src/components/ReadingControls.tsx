"use client";
/**
 * How the Greek is read, in one place (review fixes, slice 5: "use one component for both"): the page (Paper or Night), the size of
 * the Greek and the line spacing. Settings shows it under Reading, with a sample of the Greek (`sample`), and the reader's Aa shows
 * the same controls, with the columns after them (`children`), so a change in either is the same change, made the same way. The Greek
 * typeface is not a choice here any more (the quiet desk, ticket 09, the owner, 2026-10-30): the Greek is Gentium, and GFS Didot is the
 * face of titles only. Each choice is named in the site's small label style, with its sign. The size of the Greek is a number of px the reader chose or, until
 * then, the size that suits the device (the quiet desk, ticket 10, the owner, 2026-10-30): the stepper names the size on the screen, "26 px" on a computer and
 * "18 px" on a phone (a page of verse that is set smaller to stand whole says its own size, down to 16 px), and its first step saves a number from there
 * (lib/greekSize.ts); the sample in Settings is set by the reader's own rule, so it shows what the reader will show.
 */
import { useRef, type ReactNode, type Ref } from "react";
import Icon, { type IconName } from "@/components/Icon";
import { useSettings, LIMITS, type ThemePref } from "@/lib/settings";
import { snapRem, useShownGreekSize } from "@/lib/greekSize";
import styles from "./SettingsPanel.module.css";

// the page follows the device's light or dark mode, unless Paper or Night is chosen for good (redesign decision 2)
export const PAGES: [ThemePref, string][] = [["auto", "Follow device"], ["paper", "Paper"], ["night", "Night"]];

/** The name of a choice, in the small spaced capitals the site's other labels are set in, with its sign. */
export function Choice({ icon, children }: { icon: IconName; children: ReactNode }) {
  return <span className={`label ${styles.choice}`}><Icon name={icon} />{children}</span>;
}

/** A row of choices, one of them chosen; a choice that cannot be made now is greyed (`unavailable`). */
export function Segmented<T extends string>({ label, value, options, onChange, unavailable }:
  { label: string; value: T; options: [T, string][]; onChange: (v: T) => void; unavailable?: (v: T) => boolean }) {
  return (
    <div className={styles.seg} role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} disabled={unavailable?.(v)} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  );
}

export function Stepper({ label, value, display, onChange, step, min, max, innerRef }:
  { label: string; value: number; display: string; onChange: (v: number) => void; step: number; min: number; max: number; innerRef?: Ref<HTMLDivElement> }) {
  return (
    <div className={styles.stepper} ref={innerRef}>
      <button type="button" onClick={() => onChange(value - step)} disabled={value <= min} aria-label={`Decrease ${label}`}>−</button>
      <output aria-live="polite">{display}</output>
      <button type="button" onClick={() => onChange(value + step)} disabled={value >= max} aria-label={`Increase ${label}`}>+</button>
    </div>
  );
}

export default function ReadingControls({ sample = false, children }: {
  /** Settings: a few lines of Greek between the page and the sizes, as it will read */
  sample?: boolean;
  /** the reader's Aa: what comes after (the columns) */
  children?: ReactNode;
}) {
  const s = useSettings();
  // the size on the screen now, read from the page by the reader this control is in (or the page's own rule, in Settings)
  const sizeRef = useRef<HTMLDivElement>(null);
  const shown = useShownGreekSize(sizeRef, s.greekSize);
  const rem = typeof s.greekSize === "number" ? s.greekSize : snapRem(shown.rem);
  return (
    <>
      <Choice icon="contrast">Page</Choice>
      <Segmented label="Page" value={s.theme} options={PAGES} onChange={(theme) => s.set({ theme })} />
      {sample && (
        <p className={styles.sample} lang="grc" style={{ fontSize: "var(--greek-chosen, var(--greek-auto))", lineHeight: s.leading }}>
          <span>μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος</span><span>οὐλομένην, ἣ μυρίʼ Ἀχαιοῖς ἄλγεʼ ἔθηκε</span>
        </p>
      )}
      <div className={styles.row}>
        <Choice icon="text-size">Greek size</Choice>
        <Stepper innerRef={sizeRef} label="Greek text size" value={rem} display={shown.px ? `${Math.round(shown.px)} px` : "— px"}
          onChange={(greekSize) => s.set({ greekSize })} {...LIMITS.greekSize} />
      </div>
      <div className={styles.row}>
        <Choice icon="line-height">Line spacing</Choice>
        <Stepper label="line spacing" value={s.leading} display={s.leading.toFixed(1)}
          onChange={(leading) => s.set({ leading: Math.round(leading * 10) / 10 })} {...LIMITS.leading} />
      </div>
      {children}
    </>
  );
}

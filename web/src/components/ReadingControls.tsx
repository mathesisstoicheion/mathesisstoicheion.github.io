"use client";
/**
 * How the Greek is read, in one place (review fixes, slice 5: "use one component for both"): the page (Paper or Night), the
 * Greek typeface, the size of the Greek and the line spacing. Settings shows it under Reading and the
 * reader's Aa panel shows the same controls, so a change in either is the same change, made the same way.
 */
import { useSettings, LIMITS, type ThemePref, type GreekFace } from "@/lib/settings";
import styles from "./SettingsPanel.module.css";

// the page follows the device's light or dark mode, unless Paper or Night is chosen for good (redesign decision 2)
export const PAGES: [ThemePref, string][] = [["auto", "Follow device"], ["paper", "Paper"], ["night", "Night"]];
/** Each choice shown in its own typeface (the font variables come from layout.tsx). */
const GREEK_FACES: { v: GreekFace; name: string; about: string; font: string }[] = [
  { v: "gentium", name: "Gentium", about: "A book face made for scholarly Greek", font: "var(--font-gentium)" },
  { v: "didot", name: "Didot", about: "The Greek of the old Didot editions", font: "var(--font-didot)" },
];

export function FacePicker<T extends string>({ label, value, options, sample, lang, onChange }:
  { label: string; value: T; options: { v: T; name: string; about?: string; font: string }[]; sample: string; lang?: string; onChange: (v: T) => void }) {
  return (
    <div className={styles.faces} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} onClick={() => onChange(o.v)} className={styles.face}>
          <span className={styles.faceSample} lang={lang} style={{ fontFamily: o.font }}>{sample}</span>
          <span className={styles.faceName}>{o.name}</span>
          {o.about && <span className={styles.faceAbout}>{o.about}</span>}
        </button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({ label, value, options, onChange }:
  { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className={styles.seg} role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}>{text}</button>
      ))}
    </div>
  );
}

export function Stepper({ label, value, display, onChange, step, min, max }:
  { label: string; value: number; display: string; onChange: (v: number) => void; step: number; min: number; max: number }) {
  return (
    <div className={styles.stepper}>
      <button type="button" onClick={() => onChange(value - step)} disabled={value <= min} aria-label={`Decrease ${label}`}>−</button>
      <output aria-live="polite">{display}</output>
      <button type="button" onClick={() => onChange(value + step)} disabled={value >= max} aria-label={`Increase ${label}`}>+</button>
    </div>
  );
}

export default function ReadingControls() {
  const s = useSettings();
  return (
    <>
      <span className={styles.subLabel}>The page</span>
      <Segmented label="The page" value={s.theme} options={PAGES} onChange={(theme) => s.set({ theme })} />
      <p className={styles.sample} lang="grc" style={{ fontSize: `${s.greekSize}rem`, lineHeight: s.leading }}>
        μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος<br />οὐλομένην, ἣ μυρίʼ Ἀχαιοῖς ἄλγεʼ ἔθηκε
      </p>
      <span className={styles.subLabel}>Greek typeface</span>
      <FacePicker label="Greek typeface" value={s.greekFace} options={GREEK_FACES} sample="Ἀχιλλεύς" lang="grc" onChange={(greekFace) => s.set({ greekFace })} />
      <div className={styles.row}>
        <span>Greek text size</span>
        <Stepper label="Greek text size" value={s.greekSize} display={`${Math.round(s.greekSize * 16)} px`}
          onChange={(greekSize) => s.set({ greekSize })} {...LIMITS.greekSize} />
      </div>
      <div className={styles.row}>
        <span>Line spacing</span>
        <Stepper label="line spacing" value={s.leading} display={s.leading.toFixed(1)}
          onChange={(leading) => s.set({ leading: Math.round(leading * 10) / 10 })} {...LIMITS.leading} />
      </div>
    </>
  );
}

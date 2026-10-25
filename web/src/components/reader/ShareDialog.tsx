"use client";

import { useEffect, useState } from "react";
import { renderPassageImage } from "@/lib/share-image";
import { useUI } from "@/lib/ui";
import styles from "./Reader.module.css";
import { ModalDialog } from "./Panel";

export interface ShareData {
  words: string[];            // Greek words of the passage, in order
  greekText: string;          // the Greek as printed
  translation: string | null; // translation of the rows touched
  cite: string;               // "Homer, Iliad 1.1–1.5"
  link: string;               // absolute link to the passage
}

type Step = "menu" | "pick" | "preview";

/** Share: copy a link, copy the text, or make an image (highlight words first, or skip). */
export default function ShareDialog({ data, onClose }: { data: ShareData; onClose: () => void }) {
  const toast = useUI((s) => s.showToast);
  const [step, setStep] = useState<Step>("menu");
  const [hl, setHl] = useState<Set<number>>(new Set());
  const [dark, setDark] = useState(false);
  const [withTr, setWithTr] = useState(!!data.translation);
  const [png, setPng] = useState<{ url: string; blob: Blob } | null>(null);

  // draw the preview whenever its choices change
  useEffect(() => {
    if (step !== "preview") return;
    let live = true, url = "";
    renderPassageImage({ words: data.words.map((t, i) => ({ t, hl: hl.has(i) })), translation: withTr ? data.translation : null, cite: data.cite, dark })
      .then((c) => new Promise<Blob | null>((r) => c.toBlob(r, "image/png")))
      .then((blob) => { if (live && blob) { url = URL.createObjectURL(blob); setPng({ url, blob }); } });
    return () => { live = false; if (url) URL.revokeObjectURL(url); };
  }, [step, hl, dark, withTr, data]);

  const copy = (text: string, done: string) => navigator.clipboard.writeText(text).then(() => { toast(done); onClose(); }, () => toast("Copying was blocked by the browser."));
  const text = `${data.greekText}\n\n${data.translation ? data.translation + "\n\n" : ""}${data.cite}\n${data.link}`;

  async function copyImage() {
    if (!png) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": png.blob })]);
      toast("The image is on your clipboard.");
      onClose();
    } catch {
      const a = document.createElement("a");
      a.href = png.url; a.download = `${data.cite.replace(/[^\w.-]+/g, "_")}.png`; a.click();
      toast("This browser can't copy images, so the image was downloaded instead.");
      onClose();
    }
  }

  return (
    <ModalDialog titleId="share-title" title={`Share ${data.cite}`} onClose={onClose}>

        {step === "menu" && (
          <div className={styles.shareMenu}>
            <button type="button" className="btn ghost" onClick={() => copy(data.link, "Link copied.")}>Copy link</button>
            <button type="button" className="btn ghost" onClick={() => copy(text, "Text copied.")}>Copy text</button>
            <button type="button" className="btn" onClick={() => setStep("pick")}>Copy as image</button>
          </div>
        )}

        {step === "pick" && (
          <>
            <p className="muted">Click the words you want highlighted in the image, or skip this step.</p>
            <p className={styles.pickWords} lang="grc">
              {data.words.map((w, i) => (
                <button key={i} type="button" aria-pressed={hl.has(i)} className={hl.has(i) ? styles.picked : ""}
                  onClick={() => setHl((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })}>{w}</button>
              ))}
            </p>
            <div className={styles.shareMenu}>
              <button type="button" className="btn ghost" onClick={() => { setHl(new Set()); setStep("preview"); }}>Skip</button>
              <button type="button" className="btn" onClick={() => setStep("preview")}>Next</button>
            </div>
          </>
        )}

        {step === "preview" && (
          <>
            <div className={styles.shareOpts}>
              <div className={styles.seg} role="radiogroup" aria-label="Image theme">
                <button type="button" role="radio" aria-checked={!dark} onClick={() => setDark(false)}>Light</button>
                <button type="button" role="radio" aria-checked={dark} onClick={() => setDark(true)}>Dark</button>
              </div>
              {data.translation && <label><input type="checkbox" checked={withTr} onChange={() => setWithTr(!withTr)} /> Include the translation</label>}
            </div>
            <div className={styles.previewBox}>{/* a freshly drawn blob, which next/image cannot optimise */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {png ? <img src={png.url} alt={`Image of ${data.cite}`} /> : <p className="muted">Drawing…</p>}</div>
            <div className={styles.shareMenu}>
              <button type="button" className="btn ghost" onClick={() => setStep("pick")}>Back</button>
              <button type="button" className="btn" disabled={!png} onClick={copyImage}>Copy image</button>
            </div>
          </>
        )}
    </ModalDialog>
  );
}

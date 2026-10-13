"use client";
/** Small pieces shared by the private translations' shelf and reader (components/admin/PrivateTranslations.tsx). */
import { useState } from "react";
import { canonical, isIsoDate, STATUS_LABEL, STATUSES, type Status } from "@/lib/private-translations";
import { getTranslation, trouble } from "@/lib/private-translations-db";
import styles from "./PrivateTranslations.module.css";

export const HERE = "/admin/translations";

/** "13 October 2026", from the database's time. */
export const savedDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
export const savedTime = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
/** A translation's own date: "13 October 2026" when written year-month-day, else as it is written. */
export const docDate = (s: string) => (isIsoDate(s)
  ? new Date(`${s}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  : s);

/** The reminder on both views: what is here is seen by the moderator alone. */
export function Seal() {
  return (
    <span className={styles.seal}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></svg>
      Private · only you can see this
    </span>
  );
}

export function StatusTag({ status }: { status: string | null | undefined }) {
  if (!status || !(STATUSES as readonly string[]).includes(status)) return null;
  return <span className={styles.statusTag} data-status={status}>{STATUS_LABEL[status as Status]}</span>;
}

/** Save a text as a file on this computer (only when the moderator presses Download). */
function saveFile(name: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/**
 * Download: the stored translation as a .json file, every field it holds, in the format's order, so it can be
 * kept safe and uploaded again. With `doc` (already open in the reader) nothing is fetched.
 */
export function DownloadButton({ id, doc, className }: { id: string; doc?: unknown; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async () => {
    setBusy(true); setError(null);
    try {
      const d = doc ?? (await getTranslation(id))?.doc;
      if (d === undefined || d === null) { setError("It is no longer in the database."); return; }
      saveFile(`${id}.json`, `${JSON.stringify(canonical(d), null, 2)}\n`);
    } catch (e) { setError(trouble(e)); } finally { setBusy(false); }
  };
  return (
    <>
      <button type="button" className={className ?? styles.act} onClick={run} disabled={busy} title={`Save ${id}.json on this computer, to keep it safe`}>
        {busy ? "Fetching…" : "Download"}
      </button>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </>
  );
}

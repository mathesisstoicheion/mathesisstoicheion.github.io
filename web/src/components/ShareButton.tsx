"use client";
/**
 * Share (lib/share.ts): the share sign and the word, as a second button (a hairline frame) unless told otherwise. What it
 * shares is asked for when it is pressed, so a pot or a tune is packed into its link as it stands then.
 */
import { useState } from "react";
import Icon from "@/components/Icon";
import { share, type Shared } from "@/lib/share";

export default function ShareButton({ what, label = "Share", className = "btn ghost small", title }: {
  what: () => Shared | null | Promise<Shared | null>;
  label?: string;
  className?: string;
  title?: string;
}) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try { const s = await what(); if (s) await share(s); } finally { setBusy(false); }
  };
  return (
    <button type="button" className={className} onClick={go} disabled={busy} aria-busy={busy || undefined} title={title}>
      <Icon name="share" />{label}
    </button>
  );
}

"use client";
/**
 * "Put it on the board": the potter's, the lyre's and an entry's way to the board (/stoa/board). What it puts up is asked
 * for when it is pressed (a pot's picture and link, a tune's link, the entry a thought is about), handed to the form through
 * this tab (lib/board.ts), and the form opens. Shown only where the site has accounts.
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";
import { ACCOUNTS_ON } from "@/config/supabase";
import { handOver, NEW_ITEM, type BoardDraft, type BoardKind } from "@/lib/board";

export default function PutOnBoard({ what, label = "Put it on the board", className = "btn ghost small" }: {
  what: () => (Partial<BoardDraft> & { kind: BoardKind }) | null | Promise<(Partial<BoardDraft> & { kind: BoardKind }) | null>;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (!ACCOUNTS_ON) return null;
  const go = async () => {
    setBusy(true);
    try {
      const d = await what();
      if (!d) return;
      handOver(d);
      router.push(NEW_ITEM);
    } finally { setBusy(false); }
  };
  return (
    <button type="button" className={className} onClick={go} disabled={busy} aria-busy={busy || undefined}>
      <Icon name="board" />{label}
    </button>
  );
}

"use client";
/**
 * Share an entry of the Painted Stoa: its title and its address, nothing of the reader's own (lib/share.ts); or write a
 * thought about it on the board (components/board/PutOnBoard.tsx), which links back to the entry.
 */
import ShareButton from "@/components/ShareButton";
import PutOnBoard from "@/components/board/PutOnBoard";

export default function ShareEntry({ slug, title }: { slug: string; title: string }) {
  return (
    <>
      <ShareButton label="Share this entry" what={() => ({ title, url: `${location.origin}/stoa/${slug}` })} />
      <PutOnBoard label="Write about it on the board" what={() => ({ kind: "thought", link: `/stoa/${slug}`, aboutTitle: title })} />
    </>
  );
}

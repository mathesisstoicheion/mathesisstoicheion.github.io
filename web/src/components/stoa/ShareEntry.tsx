"use client";
/** Share an entry of the Painted Stoa: its title and its address, nothing of the reader's own (lib/share.ts). */
import ShareButton from "@/components/ShareButton";

export default function ShareEntry({ slug, title }: { slug: string; title: string }) {
  return <ShareButton label="Share this entry" what={() => ({ title, url: `${location.origin}/stoa/${slug}` })} />;
}

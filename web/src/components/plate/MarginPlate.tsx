"use client";
/**
 * A plate in the margin that changes with what is pointed at (redesign decision 11: "pointing at a work shows its picture as
 * a plate in the margin"; the sample's catalogue). The new photograph inks in over the one before, which stays beneath it
 * until the new one has settled, so the frame is never empty; the caption and the credit change at once. The frame keeps
 * one shape (3 by 4) and shows each photograph whole inside it, so nothing of a museum's object is cut off.
 */
import { useState } from "react";
import { photo } from "@/lib/photos";
import { PlateCaption, PlateImg } from "./Plate";

export default function MarginPlate({ id, n, why, className, sizes = "(max-width: 1100px) 220px, 260px" }: {
  id: string; n?: number; why?: string; className?: string; sizes?: string;
}) {
  // the picture before this one, kept under it while it inks in (a picture changed during render, React's way to follow a prop)
  const [cur, setCur] = useState(id);
  const [under, setUnder] = useState<string | null>(null);
  if (id !== cur) { setUnder(cur); setCur(id); }
  const p = photo(id), q = under ? photo(under) : undefined;
  if (!p) return null;
  return (
    <figure className={`plate plate-frame plate-margin${className ? ` ${className}` : ""}`}>
      <div className="plate-ph">
        {q && under && <PlateImg key={under} p={q} id={under} sizes={sizes} className="under" />}
        <span key={id} className="plate-on" onAnimationEnd={() => setUnder(null)}><PlateImg p={p} id={id} sizes={sizes} /></span>
      </div>
      <PlateCaption id={id} p={p} n={n} why={why} />
    </figure>
  );
}

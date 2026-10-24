/**
 * A plate (redesign SPEC.md 3.7): a real photograph set in the page as a book sets its plates, numbered ("PLATE I"), in a
 * fine double frame when it stands on its own, with its caption and its full credit printed beneath it (decision 6: every
 * photo shows its credit). The photograph inks in as it arrives (globals.css), then never moves.
 *
 * Every photograph carries `data-photo` with its name, and its credit `data-credit` with the same name, so a check can see
 * that no picture on a page goes without its credit (scripts/check-credits.mjs).
 */
import type { ReactNode } from "react";
import { maker, objectDate, photo, plateRatio, roman, srcSet, type Photo } from "@/lib/photos";

/** Whether a photograph may be cut to a 3 by 4 frame (the plate beside a page's title on a computer, globals.css): one
 *  near that shape loses only a strip of the museum's backdrop; a wide tablet or a tall herm would lose part of the
 *  piece, so it is shown whole on its mount instead. */
const fitsThreeByFour = (p: Photo) => { const r = p.height / p.width; return r >= 0.95 && r <= 1.55; };

/** The photograph itself: a copy no larger than the screen needs, fetched only when it comes near (unless `priority`). */
export function PlateImg({ p, id, sizes, priority = false, className }: { p: Photo; id: string; sizes: string; priority?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.width > 640 ? `/images/w640/${p.file}` : `/images/${p.file}`} srcSet={srcSet(p)} sizes={sizes} alt={p.alt} width={p.width} height={p.height}
      loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} className={className} data-photo={id} />
  );
}

/** A photograph's credit, as its record gives it: where it is, who made or photographed it, and its licence and source. */
export function Credit({ id, p }: { id: string; p: Photo }) {
  const by = maker(p);
  return (
    <span className="plate-credit" data-credit={id}>
      {p.place && <>{p.place}. </>}{by && <>{by}. </>}
      <a href={p.licenceUrl || p.source} rel="noopener">{p.licence}</a>{p.sourceName && <>, via <a href={p.source} rel="noopener">{p.sourceName}</a></>}.
    </span>
  );
}

/** What a plate says under it: its number, what it shows and when, why it is here, and its credit. */
export function PlateCaption({ id, p, n, why, credit = true, caption }: { id: string; p: Photo; n?: number; why?: string; credit?: boolean; caption?: ReactNode }) {
  const date = objectDate(p);
  return (
    <figcaption>
      {n !== undefined && <b className="plate-no">Plate {roman(n)}</b>}
      <span>
        {caption ?? <>{p.title}{date && <>, {date}</>}.</>}
        {why && <> <i>{why}</i></>}
        {credit && <> <Credit id={id} p={p} /></>}
      </span>
    </figcaption>
  );
}

export default function Plate({ id, n, why, frame = true, sizes = "(max-width: 760px) 92vw, 380px", className, priority = false, credit = true, caption }: {
  id: string;
  /** its number on the page, as a roman numeral after "PLATE"; none for a small picture in a list */
  n?: number;
  /** a few words on why it belongs here, printed in italic after its name (only what the record or a named source says) */
  why?: string;
  frame?: boolean;
  sizes?: string;
  className?: string;
  /** the first picture of the page: fetched at once rather than when it comes near */
  priority?: boolean;
  /** false for a picture whose credit is printed elsewhere on the page (a colophon of plates) */
  credit?: boolean;
  /** words to print in place of the record's title */
  caption?: ReactNode;
}) {
  const p = photo(id);
  if (!p) return null;
  return (
    <figure className={`plate${frame ? " plate-frame" : ""}${className ? ` ${className}` : ""}`} style={{ "--plate-ratio": plateRatio(p) } as React.CSSProperties}
      data-fit={fitsThreeByFour(p) ? "cut" : "whole"}>
      <div className="plate-ph"><PlateImg p={p} id={id} sizes={sizes} priority={priority} /></div>
      <PlateCaption id={id} p={p} n={n} why={why} credit={credit} caption={caption} />
    </figure>
  );
}

/**
 * A page's list of plates, as a book prints one at its end (the sample's colophon): each plate's number, what it shows and
 * its credit. It credits the small pictures in a page's rows, which have no room for a caption of their own.
 */
export function PlateList({ ids, className, label = "Plates" }: { ids: string[]; className?: string; label?: string }) {
  return (
    <section className={`plate-list${className ? ` ${className}` : ""}`} aria-label={label}>
      <p><b>{label}.</b>{" "}
        {ids.map((id, i) => {
          const p = photo(id);
          if (!p) return null;
          const date = objectDate(p);
          return <span key={id}><span className="plate-list-no">{roman(i + 1)}.</span> {p.title}{date && <>, {date}</>}. <Credit id={id} p={p} />{" "}</span>;
        })}
      </p>
    </section>
  );
}

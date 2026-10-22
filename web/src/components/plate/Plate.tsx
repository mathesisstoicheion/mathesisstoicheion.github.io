/**
 * A plate (redesign SPEC.md 3.7): a real photograph set in the page as a book sets its plates, numbered ("PLATE I"), in a
 * fine double frame when it stands on its own, with its caption and its full credit printed beneath it (decision 6: every
 * photo shows its credit). The photograph inks in as it arrives (globals.css, .rv), then never moves.
 */
import { maker, objectDate, photo, plateRatio, roman, srcSet } from "@/lib/photos";

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
  /** false for a small picture whose credit is printed elsewhere on the page (the library's rows, the colophon) */
  credit?: boolean;
  /** words to print in place of the record's title */
  caption?: React.ReactNode;
}) {
  const p = photo(id);
  if (!p) return null;
  const date = objectDate(p), by = maker(p);
  return (
    <figure className={`plate${frame ? " plate-frame" : ""}${className ? ` ${className}` : ""}`} style={{ "--plate-ratio": plateRatio(p) } as React.CSSProperties}>
      <div className="plate-ph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.width > 640 ? `/images/w640/${p.file}` : `/images/${p.file}`} srcSet={srcSet(p)} sizes={sizes} alt={p.alt} width={p.width} height={p.height}
          loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} />
      </div>
      <figcaption>
        {n !== undefined && <b className="plate-no">Plate {roman(n)}</b>}
        <span>
          {caption ?? <>{p.title}{date && <>, {date}</>}.</>}
          {why && <> <i>{why}</i></>}
          {credit && <span className="plate-credit"> {p.place && <>{p.place}. </>}{by && <>{by}. </>}
            <a href={p.licenceUrl || p.source} rel="noopener">{p.licence}</a>{p.sourceName && <>, via <a href={p.source} rel="noopener">{p.sourceName}</a></>}.</span>}
        </span>
      </figcaption>
    </figure>
  );
}

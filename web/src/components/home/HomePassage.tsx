"use client";
/**
 * The home page's passage of the day, set as a two-language spread (the sample's .spread): the Greek on the left leaf, the
 * English on the right, a soft fold between them (one above the other on a phone), and a way on into the reader. The
 * passage's own title comes first, and each leaf opens with a large red initial, as a printed text does (the owner,
 * 2026-10-25). The passage is read live from the library's own files (data/passages.ts, a different famous passage each
 * day); any word can be touched to look it up (the reader's own look-up, WordPanel).
 */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { describe, versionOf } from "@/lib/catalog";
import { loadPassage, type LoadedPassage } from "@/lib/passage";
import { norm } from "@/lib/lookup/words";
import { PASSAGES, todaysIndex, type DailyPassage } from "@/data/passages";
import { Blocks } from "@/components/reader/Blocks";
import WordPanel, { type WordContext } from "@/components/reader/WordPanel";
import { AREAS } from "@/config/areas";
import readerStyles from "@/components/reader/Reader.module.css";
import h from "./Home.module.css";

interface Loaded extends LoadedPassage { p: DailyPassage }
const noSubscribe = () => () => {};

/** Load today's passage; if it can't be read (offline and not downloaded), try the next ones. */
async function loadToday(): Promise<Loaded> {
  let lastError: Error | null = null;
  for (let k = 0; k < PASSAGES.length; k++) {
    const p = PASSAGES[(todaysIndex() + k) % PASSAGES.length];
    try { return { p, ...(await loadPassage(p.work, p.from, p.to)) }; }
    catch (e) { lastError = e as Error; }
  }
  throw lastError ?? new Error("No passage could be loaded.");
}

export default function HomePassage() {
  const [data, setData] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null } | null>(null);
  useEffect(() => { loadToday().then(setData, (e: Error) => setError(e.message)); }, []);
  // the Greek's first word carries the large red initial (Home.module.css): marked here, since a verse line and a paragraph
  // of prose are built differently and only the very first word of either should have it
  const greekRef = useRef<HTMLDivElement>(null);
  useEffect(() => { greekRef.current?.querySelector("[data-w]")?.setAttribute("data-initial", ""); }, [data]);
  const translation = useMemo(() => data?.rows.flatMap((r) => r.trans) ?? [], [data]);
  // most passages are longer than one sentence: a longer one is set a step smaller
  const long = useMemo(() => (JSON.stringify(data?.rows.flatMap((r) => r.greek) ?? []).match(/[Ͱ-Ͽἀ-῿]/g)?.length ?? 0) > 160, [data]);
  // until the passage is known, the one for today's date; the built page shows the first, as the Painted Stoa's entry of
  // the day does, since a page built on one day is read on every day after it, and a passage picked for the day of the
  // build would disagree with the browser's from the second day on (React would then draw the whole page again)
  const day = useSyncExternalStore(noSubscribe, todaysIndex, () => 0);
  const today = data?.p ?? PASSAGES[day];

  const onClick = (e: React.MouseEvent) => {
    const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    if (!w || !data) return;
    document.querySelectorAll(`.${readerStyles.sel}`).forEach((x) => x.classList.remove(readerStyles.sel));
    w.classList.add(readerStyles.sel);
    const unit = w.closest<HTMLElement>("[data-u]");
    const same = unit ? [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!)) : [];
    setWord({ w: w.dataset.w!, ctx: unit ? { work: data.p.work, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: data.keys, depth: data.depth } : null });
  };
  const readHref = data ? `/read?w=${data.p.work}&ed=${versionOf(data.grc.urn)}&tr=${data.tr ? versionOf(data.tr.urn) : "none"}&at=${data.p.from}` : "/library";
  return (
    <section className={h.part} aria-labelledby="pod-title">
      {/* the passage's own title first; what it is, the passage of the day, in small capitals at the end of the rule */}
      <div className="sh rv"><h2 id="pod-title">{today.title}</h2><span className="fill" /><span className="src">Passage of the day</span></div>
      <p className={`${h.podWhere} rv`}>{today.label}</p>
      {error ? (
        <p className={h.waiting}>Today&apos;s passage could not be loaded ({error}). If you are offline, download the library in <Link href={AREAS.downloads.href}>{AREAS.downloads.name}</Link>.</p>
      ) : !data ? (
        <p className={h.waiting} aria-busy="true">Unrolling today&apos;s passage…</p>
      ) : (
        <div className={`${h.spread} ${data.tr ? "" : h.one} rv`}>
          <div className={`${h.leaf} ${h.leafV}`}>
            <span className={h.folio}>Greek</span>
            <div ref={greekRef} className={`${h.gk} ${long ? h.long : ""}`} lang="grc" onClick={onClick}>
              {data.rows.flatMap((r) => r.greek).map((u) => (
                <div key={u.ref.join(".")} data-u={u.ref.join(".")}><Blocks blocks={u.blocks} greek keyPrefix={`pd${u.ref.join(".")}`} /></div>
              ))}
            </div>
            <p className={h.hint}>Touch any Greek word to look it up.</p>
          </div>
          {data.tr && (
            <div className={`${h.leaf} ${h.leafR}`}>
              <span className={h.folio}>English</span>
              <div className={`${h.en} ${long ? h.long : ""}`}><Blocks blocks={translation} greek={false} keyPrefix="pdt" /></div>
              <p className={h.sig}>Greek: {describe(data.grc)}. English: {describe(data.tr)}.</p>
            </div>
          )}
        </div>
      )}
      <div className={h.podFoot}>
        <div className={h.about}>
          <p>{today.about}</p>
          <p style={{ marginTop: 18 }}><Link className="btn ghost" href={readHref} transitionTypes={["page-turn"]}>Read on in the reader →</Link></p>
        </div>
      </div>
      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onClose={() => { setWord(null); document.querySelectorAll(`.${readerStyles.sel}`).forEach((x) => x.classList.remove(readerStyles.sel)); }} />
    </section>
  );
}

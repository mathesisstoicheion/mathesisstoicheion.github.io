"use client";
/**
 * The home page's passage of the day, laid out as design A's: the Greek large, the English beside it on a computer (as the
 * reader sets them) and beneath it on a phone, a way on into the reader, and a window beside them with an object that
 * belongs to the text. The passage is read live from the library's
 * own files (data/passages.ts, a different famous passage each day); any word can be tapped to look it up.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { describe, versionOf } from "@/lib/catalog";
import { loadPassage, type LoadedPassage } from "@/lib/passage";
import { norm } from "@/lib/lookup/words";
import { PASSAGES, todaysIndex, type DailyPassage } from "@/data/passages";
import { Blocks } from "@/components/reader/Blocks";
import WordPanel, { type WordContext } from "@/components/reader/WordPanel";
import { AREAS } from "@/config/areas";
import readerStyles from "@/components/reader/Reader.module.css";
import SettleText from "./SettleText";
import Win from "./Win";
import { passagePicture } from "./pictures";
import s from "./a.module.css";
import h from "./Home.module.css";

interface Loaded extends LoadedPassage { p: DailyPassage }

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

/** "Homer, Iliad 1.1–7" as design A writes it: "Homer · Iliad 1.1–7" */
const dot = (label: string) => label.replace(/^([^,]+), /, "$1 · ");

export default function HomePassage() {
  const [data, setData] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [word, setWord] = useState<{ w: string; ctx: WordContext | null } | null>(null);
  useEffect(() => { loadToday().then(setData, (e: Error) => setError(e.message)); }, []);
  const translation = useMemo(() => data?.rows.flatMap((r) => r.trans) ?? [], [data]);
  // design A set one sentence of about 130 letters; a longer passage (most are) is set a step smaller
  const long = useMemo(() => (JSON.stringify(data?.rows.flatMap((r) => r.greek) ?? []).match(/[\u0370-\u03ff\u1f00-\u1fff]/g)?.length ?? 0) > 160, [data]);
  // the window shows today's picture; until the passage is known, the one for today's date
  const pic = passagePicture(data?.p.work ?? PASSAGES[todaysIndex()].work);

  const onClick = (e: React.MouseEvent) => {
    const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    if (!w || !data) return;
    document.querySelectorAll(`.${readerStyles.sel}`).forEach((x) => x.classList.remove(readerStyles.sel));
    w.classList.add(readerStyles.sel);
    const unit = w.closest<HTMLElement>("[data-u]");
    const same = unit ? [...unit.querySelectorAll<HTMLElement>("[data-w]")].filter((x) => norm(x.dataset.w!) === norm(w.dataset.w!)) : [];
    setWord({ w: w.dataset.w!, ctx: unit ? { work: data.p.work, unitKey: unit.dataset.u!, occurrence: same.indexOf(w), keys: data.keys, depth: data.depth } : null });
  };

  return (
    <section className={`${s.wrap} ${s.pod} ${h.pod}`} aria-label="Passage of the day">
      <div className={s["sec-h"]}>
        <SettleText className={s.mono} text="Passage of the day" />
        <span className={s.mono}>{data ? dot(data.p.label) : " "}</span>
      </div>
      <div className={`${s.blk} ${data?.tr ? h.podCols : ""}`}>
        {error ? (
          <p className={s["pod-e"]}>Today&apos;s passage could not be loaded ({error}). If you are offline, download the library in <Link href={AREAS.downloads.href}>{AREAS.downloads.name}</Link>.</p>
        ) : !data ? (
          <p className={s["pod-e"]} aria-busy="true">Unrolling today&apos;s passage…</p>
        ) : (
          <>
            <div className={`${s["pod-g"]} ${s.podText} ${long ? s.podLong : ""}`} lang="grc" onClick={onClick}>
              {data.rows.flatMap((r) => r.greek).map((u) => (
                <div key={u.ref.join(".")} data-u={u.ref.join(".")}><Blocks blocks={u.blocks} greek keyPrefix={`pd${u.ref.join(".")}`} /></div>
              ))}
            </div>
            {data.tr && <div className={`${s["pod-e"]} ${s.podText}`}><Blocks blocks={translation} greek={false} keyPrefix="pdt" /></div>}
            <Link className={`${s.btn} ${s.ghost}`} href={`/read?w=${data.p.work}&ed=${versionOf(data.grc.urn)}&tr=${data.tr ? versionOf(data.tr.urn) : "none"}&at=${data.p.from}`} transitionTypes={["page-turn"]}>Read on in the reader →</Link>
            <p className={`${s.cap} ${h.podCap}`}>{data.p.about} Greek: {describe(data.grc)}{data.tr ? `. English: ${describe(data.tr)}` : ""}. Tap any word to look it up.</p>
          </>
        )}
      </div>
      <Win className={`${s.win} ${s.sq}`} src={pic.src} label={pic.label} caption={pic.cap} credit={`${pic.credit.charAt(0).toUpperCase()}${pic.credit.slice(1)}.`} capClass={s.wcap} />
      <WordPanel word={word?.w ?? null} ctx={word?.ctx ?? null} onClose={() => { setWord(null); document.querySelectorAll(`.${readerStyles.sel}`).forEach((x) => x.classList.remove(readerStyles.sel)); }} />
    </section>
  );
}

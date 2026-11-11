"use client";
import { useCallback, useState, type MouseEvent, type ReactNode } from "react";
import WordPanel from "@/components/reader/WordPanel";
import readerStyles from "@/components/reader/Reader.module.css";

const clearSel = () => document.querySelectorAll(`.${readerStyles.sel}`).forEach((x) => x.classList.remove(readerStyles.sel));

/**
 * The word look-up for any page: `onClick` goes on a box around the Greek (it answers a touch on any [data-w] inside it that is
 * not inside a link or a button), `panel` goes anywhere in the page. A word met outside a passage has no sentence to be read in,
 * so the look-up shows the word on its own (dictionary, forms), with "More about it" as in the reader.
 */
export function useWordTap(): { onClick: (e: MouseEvent) => void; panel: ReactNode } {
  const [word, setWord] = useState<string | null>(null);
  const onClick = useCallback((e: MouseEvent) => {
    const w = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    if (!w || w.closest("a, button, input, textarea")) return;
    clearSel();
    w.classList.add(readerStyles.sel);
    setWord(w.dataset.w!);
  }, []);
  const panel = <WordPanel word={word} ctx={null} onClose={() => { setWord(null); clearSel(); }} />;
  return { onClick, panel };
}

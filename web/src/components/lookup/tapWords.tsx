import { Fragment, type ReactNode } from "react";
import { GREEK_WORD, isGreekWord } from "@/lib/greek";
import styles from "./Tap.module.css";

/**
 * Greek in running text, with every word touchable (data-w; the page's TapZone or useWordTap answers the touch with the reader's
 * look-up, WordPanel). English and punctuation stay as they are. Not for Greek inside a link or a button: those keep their job.
 */
export function tapWords(text: string, key: string | number = 0): ReactNode {
  return (
    <Fragment key={key}>
      {text.split(GREEK_WORD).map((part, i) => (part && isGreekWord(part)
        ? <span key={i} className={styles.tw} data-w={part}>{part}</span>
        : part))}
    </Fragment>
  );
}

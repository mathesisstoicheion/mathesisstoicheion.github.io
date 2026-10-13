import { Fragment } from "react";
import styles from "./Academy.module.css";

/** «Greek», **bold** and *italic* inside lesson text. */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(«[^»]+»|\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, i) => {
        if (part.startsWith("«")) return <span key={i} lang="grc" className={styles.inlineGr}>{part.slice(1, -1)}</span>;
        if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
        if (part.startsWith("*") && part.length > 1) return <i key={i}>{part.slice(1, -1)}</i>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

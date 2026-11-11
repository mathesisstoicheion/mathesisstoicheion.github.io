"use client";
import type { ReactNode } from "react";
import { useWordTap } from "./useWordTap";

/** Wraps server-drawn Greek so its [data-w] words open the look-up (the box itself adds no layout). */
export default function TapZone({ children }: { children: ReactNode }) {
  const { onClick, panel } = useWordTap();
  return <div style={{ display: "contents" }} onClick={onClick}>{children}{panel}</div>;
}

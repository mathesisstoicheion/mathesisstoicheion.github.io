"use client";
/**
 * Phones: a plain sign along the foot of the screen while the connection is gone (on a computer the header's light says
 * it). Design A has no bar along the bottom of a phone (the owner, 2026-10-19: "As in A"), so the sign stands on its own.
 */
import { status, useConnection } from "@/lib/connection";
import styles from "./OfflineSign.module.css";

export default function OfflineSign() {
  const offline = status(useConnection()) === "offline";
  return offline ? <p className={styles.sign} role="status">Offline · your downloaded texts, library and study still work</p> : null;
}

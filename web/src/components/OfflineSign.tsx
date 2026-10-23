"use client";
/**
 * Phones: a plain sign along the foot of the screen while the connection is gone (on a computer the header's light says
 * it). While the bar of rooms shows at the foot (TabBar.tsx), the sign stands just above it (OfflineSign.module.css).
 */
import { status, useConnection } from "@/lib/connection";
import styles from "./OfflineSign.module.css";

export default function OfflineSign() {
  const offline = status(useConnection()) === "offline";
  return offline ? <p className={styles.sign} role="status">Offline · your downloaded texts, library and study still work</p> : null;
}

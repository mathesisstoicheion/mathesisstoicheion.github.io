"use client";
/** Refreshes <html data-visitor> when the home page opens after moving around the site without a reload (lib/visitor.ts). */
import { useEffect } from "react";
import { markVisitor } from "@/lib/visitor";

export default function VisitorMark() {
  useEffect(() => { markVisitor(); }, []);
  return null;
}

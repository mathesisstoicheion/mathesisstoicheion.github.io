"use client";
/**
 * The home page's floating letters (design A): faint Greek letters behind the page at three depths, few and slow; they
 * move at three speeds as you scroll, and step aside from the pointer, catching a little of its light.
 */
import { useEffect, useRef } from "react";
import { addLetters } from "@/lib/a/lamplight";

export default function FlyLetters({ className }: { className: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { const cv = ref.current; if (!cv) return; return addLetters(cv); }, []);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

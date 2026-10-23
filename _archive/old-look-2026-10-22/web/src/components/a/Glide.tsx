"use client";
/**
 * Design A's wheel, on the home page and in the library: it scrolls slowly and smoothly. A phone keeps its own scrolling.
 * The page stops exactly where you stop: A also glided it the last bit into place at the nearest section, which the owner
 * turned down on 2026-10-19 ("No settling"), as on 2026-10-16 ("no snapping. it's annoying"). The reader and the other
 * pages scroll as the browser does.
 */
import { useEffect } from "react";
import { glide } from "@/lib/a/lamplight";

export default function Glide() {
  useEffect(() => {
    glide(true);
    return () => glide(false);
  }, []);
  return null;
}

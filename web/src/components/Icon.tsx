// The site's one set of icons (owner, 2026-10-30: "give each an icon", one meaning each). Every icon is named for what it
// means, not for its shape, so a button that does the same thing anywhere on the site wears the same sign. Drawn as on the
// printed page: a fine line in the colour of the words beside it (24 by 24, stroke 1.6, round ends, no fill), 1.2em by
// default, hidden from screen readers unless given a label (the button's own words say what it does).
//   <Icon name="search" />               beside words: the words name the action
//   <Icon name="close" label="Close" />  alone: the label names it
// Every svg carries data-icon, so a check can find which buttons have one.
//
// The drawings are Lucide's (https://lucide.dev), except the lyre, which is this site's own. Lucide's licence:
// ISC License. Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other
// copyright (c) for Lucide are held by Lucide Contributors 2022.
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
// granted, provided that the above copyright notice and this permission notice appear in all copies.
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
// THIS SOFTWARE.
// (Written by a script from Lucide 0.460.0's drawings; to add an icon, add a line below with what it means.)
import { createElement, type CSSProperties, type SVGProps } from "react";

type Drawing = [string, Record<string, string>][];
const ICONS = {
  // go back, or back to the page this one belongs to (Lucide "arrow-left")
  "back": [["path", {d: "m12 19-7-7 7-7"}], ["path", {d: "M19 12H5"}]],
  // go on: to the next step, or to the page a link names (Lucide "arrow-right")
  "next": [["path", {d: "M5 12h14"}], ["path", {d: "m12 5 7 7-7 7"}]],
  // opens another site (Lucide "arrow-up-right")
  "external": [["path", {d: "M7 7h10v10"}], ["path", {d: "M7 17 17 7"}]],
  // opens what is folded under it (Lucide "chevron-down")
  "chevron-down": [["path", {d: "m6 9 6 6 6-6"}]],
  // folds it away again (Lucide "chevron-up")
  "chevron-up": [["path", {d: "m18 15-6-6-6 6"}]],
  // the one before (Lucide "chevron-left")
  "chevron-left": [["path", {d: "m15 18-6-6 6-6"}]],
  // the one after (Lucide "chevron-right")
  "chevron-right": [["path", {d: "m9 18 6-6-6-6"}]],
  // closes this panel or window (Lucide "x")
  "close": [["path", {d: "M18 6 6 18"}], ["path", {d: "m6 6 12 12"}]],
  // the site's menu (Lucide "menu")
  "menu": [["line", {x1: "4", x2: "20", y1: "12", y2: "12"}], ["line", {x1: "4", x2: "20", y1: "6", y2: "6"}], ["line", {x1: "4", x2: "20", y1: "18", y2: "18"}]],
  // more choices (Lucide "ellipsis")
  "more": [["circle", {cx: "12", cy: "12", r: "1"}], ["circle", {cx: "19", cy: "12", r: "1"}], ["circle", {cx: "5", cy: "12", r: "1"}]],
  // the home page (Lucide "house")
  "home": [["path", {d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}], ["path", {d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]],
  // where you are in a text; go to another part of it (Lucide "table-of-contents")
  "goto": [["path", {d: "M16 12H3"}], ["path", {d: "M16 18H3"}], ["path", {d: "M16 6H3"}], ["path", {d: "M21 12h.01"}], ["path", {d: "M21 18h.01"}], ["path", {d: "M21 6h.01"}]],
  // places named in the text (Lucide "map-pin")
  "places": [["path", {d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"}], ["circle", {cx: "12", cy: "10", r: "3"}]],
  // a map (Lucide "map")
  "map": [["path", {d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"}], ["path", {d: "M15 5.764v15"}], ["path", {d: "M9 3.236v15"}]],
  // a short tour of a page (Lucide "signpost")
  "tour": [["path", {d: "M12 13v8"}], ["path", {d: "M12 3v3"}], ["path", {d: "M18 6a2 2 0 0 1 1.387.56l2.307 2.22a1 1 0 0 1 0 1.44l-2.307 2.22A2 2 0 0 1 18 13H6a2 2 0 0 1-1.387-.56l-2.306-2.22a1 1 0 0 1 0-1.44l2.306-2.22A2 2 0 0 1 6 6z"}]],
  // the guide: how something works (Lucide "circle-help")
  "help": [["circle", {cx: "12", cy: "12", r: "10"}], ["path", {d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}], ["path", {d: "M12 17h.01"}]],
  // about this (Lucide "info")
  "info": [["circle", {cx: "12", cy: "12", r: "10"}], ["path", {d: "M12 16v-4"}], ["path", {d: "M12 8h.01"}]],
  // read a text (Lucide "book-open")
  "read": [["path", {d: "M12 7v14"}], ["path", {d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]],
  // the Library: every work (Lucide "library-big")
  "library": [["rect", {width: "8", height: "18", x: "3", y: "3", rx: "1"}], ["path", {d: "M7 3v18"}], ["path", {d: "M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"}]],
  // open a second book beside this one (Lucide "book-plus")
  "book-plus": [["path", {d: "M12 7v6"}], ["path", {d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"}], ["path", {d: "M9 10h6"}]],
  // the dictionary (LSJ) (Lucide "book-a")
  "dictionary": [["path", {d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"}], ["path", {d: "m8 13 4-7 4 7"}], ["path", {d: "M9.1 11h5.7"}]],
  // editions of a text (Lucide "book-copy")
  "editions": [["path", {d: "M2 16V4a2 2 0 0 1 2-2h11"}], ["path", {d: "M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12"}], ["path", {d: "M5 14H4a2 2 0 1 0 0 4h1"}]],
  // a translation, or the edition and translation shown (Lucide "languages")
  "translation": [["path", {d: "m5 8 6 6"}], ["path", {d: "m4 14 6-6 2-3"}], ["path", {d: "M2 5h12"}], ["path", {d: "M7 2h1"}], ["path", {d: "m22 22-5-10-5 10"}], ["path", {d: "M14 18h6"}]],
  // Greek in Latin letters (transliteration) (Lucide "case-lower")
  "latin": [["circle", {cx: "7", cy: "12", r: "3"}], ["path", {d: "M10 9v6"}], ["circle", {cx: "17", cy: "12", r: "3"}], ["path", {d: "M14 7v8"}]],
  // Greek, both, or English: how the page is laid out (Lucide "columns-2")
  "columns": [["rect", {width: "18", height: "18", x: "3", y: "3", rx: "2"}], ["path", {d: "M12 3v18"}]],
  // compare two texts or translations (Lucide "git-compare")
  "compare": [["circle", {cx: "18", cy: "18", r: "3"}], ["circle", {cx: "6", cy: "6", r: "3"}], ["path", {d: "M13 6h3a2 2 0 0 1 2 2v7"}], ["path", {d: "M11 18H8a2 2 0 0 1-2-2V9"}]],
  // the text in a small window (Lucide "picture-in-picture-2")
  "float": [["path", {d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4"}], ["rect", {width: "10", height: "7", x: "12", y: "13", rx: "2"}]],
  // the manuscript (Lucide "scroll-text")
  "manuscript": [["path", {d: "M15 12h-5"}], ["path", {d: "M15 8h-5"}], ["path", {d: "M19 17V5a2 2 0 0 0-2-2H4"}], ["path", {d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"}]],
  // how the sentence is built (Lucide "list-tree")
  "sentence": [["path", {d: "M21 12h-8"}], ["path", {d: "M21 6H8"}], ["path", {d: "M21 18h-8"}], ["path", {d: "M3 6v4c0 1.1.9 2 2 2h3"}], ["path", {d: "M3 10v6c0 1.1.9 2 2 2h3"}]],
  // a word: its forms, meanings and where it is used (Lucide "text-search")
  "word": [["path", {d: "M21 6H3"}], ["path", {d: "M10 12H3"}], ["path", {d: "M10 18H3"}], ["circle", {cx: "17", cy: "15", r: "3"}], ["path", {d: "m21 19-1.9-1.9"}]],
  // the metre: long and short syllables (Lucide "audio-waveform")
  "metre": [["path", {d: "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"}]],
  // echoes: where other texts repeat these words (Lucide "quote")
  "echoes": [["path", {d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}], ["path", {d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"}]],
  // the signs along the scroll bar (Lucide "panel-right-dashed")
  "signs": [["rect", {width: "18", height: "18", x: "3", y: "3", rx: "2"}], ["path", {d: "M15 14v1"}], ["path", {d: "M15 19v2"}], ["path", {d: "M15 3v2"}], ["path", {d: "M15 9v1"}]],
  // the reader's tools for study (Lucide "pencil-ruler")
  "study": [["path", {d: "M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"}], ["path", {d: "m8 6 2-2"}], ["path", {d: "m18 16 2-2"}], ["path", {d: "m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"}], ["path", {d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}], ["path", {d: "m15 5 4 4"}]],
  // how the text looks: letters, size, spacing (Lucide "type")
  "type": [["polyline", {points: "4 7 4 4 20 4 20 7"}], ["line", {x1: "9", x2: "15", y1: "20", y2: "20"}], ["line", {x1: "12", x2: "12", y1: "4", y2: "20"}]],
  // the size of the letters (Lucide "a-large-small")
  "text-size": [["path", {d: "M21 14h-5"}], ["path", {d: "M16 16v-3.5a2.5 2.5 0 0 1 5 0V16"}], ["path", {d: "M4.5 13h6"}], ["path", {d: "m3 16 4.5-9 4.5 9"}]],
  // the space between lines (Lucide "unfold-vertical")
  "line-height": [["path", {d: "M12 22v-6"}], ["path", {d: "M12 8V2"}], ["path", {d: "M4 12H2"}], ["path", {d: "M10 12H8"}], ["path", {d: "M16 12h-2"}], ["path", {d: "M22 12h-2"}], ["path", {d: "m15 19-3 3-3-3"}], ["path", {d: "m15 5-3-3-3 3"}]],
  // fit the lines to the page's width (Lucide "move-horizontal")
  "fit-width": [["path", {d: "m18 8 4 4-4 4"}], ["path", {d: "M2 12h20"}], ["path", {d: "m6 8-4 4 4 4"}]],
  // colour by case or by part of speech (Lucide "palette")
  "palette": [["circle", {cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor"}], ["circle", {cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor"}], ["circle", {cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor"}], ["circle", {cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor"}], ["path", {d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"}]],
  // paper or night (Lucide "sun-moon")
  "contrast": [["path", {d: "M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"}], ["path", {d: "M12 2v2"}], ["path", {d: "M12 20v2"}], ["path", {d: "m4.9 4.9 1.4 1.4"}], ["path", {d: "m17.7 17.7 1.4 1.4"}], ["path", {d: "M2 12h2"}], ["path", {d: "M20 12h2"}], ["path", {d: "m6.3 17.7-1.4 1.4"}], ["path", {d: "m19.1 4.9-1.4 1.4"}]],
  // paper: dark letters on light (Lucide "sun")
  "day": [["circle", {cx: "12", cy: "12", r: "4"}], ["path", {d: "M12 2v2"}], ["path", {d: "M12 20v2"}], ["path", {d: "m4.93 4.93 1.41 1.41"}], ["path", {d: "m17.66 17.66 1.41 1.41"}], ["path", {d: "M2 12h2"}], ["path", {d: "M20 12h2"}], ["path", {d: "m6.34 17.66-1.41 1.41"}], ["path", {d: "m19.07 4.93-1.41 1.41"}]],
  // night: light letters on dark (Lucide "moon")
  "night": [["path", {d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"}]],
  // listen (Lucide "volume-2")
  "listen": [["path", {d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"}], ["path", {d: "M16 9a5 5 0 0 1 0 6"}], ["path", {d: "M19.364 18.364a9 9 0 0 0 0-12.728"}]],
  // play (Lucide "play")
  "play": [["polygon", {points: "6 3 20 12 6 21 6 3"}]],
  // pause (Lucide "pause")
  "pause": [["rect", {x: "14", y: "4", width: "4", height: "16", rx: "1"}], ["rect", {x: "6", y: "4", width: "4", height: "16", rx: "1"}]],
  // stop (Lucide "square")
  "stop": [["rect", {width: "18", height: "18", x: "3", y: "3", rx: "2"}]],
  // the Academy, a lesson (Lucide "graduation-cap")
  "learn": [["path", {d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"}], ["path", {d: "M22 10v6"}], ["path", {d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5"}]],
  // practise: questions to answer (Lucide "pencil-line")
  "practice": [["path", {d: "M12 20h9"}], ["path", {d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"}], ["path", {d: "m15 5 3 3"}]],
  // a test or checkpoint (Lucide "clipboard-check")
  "test": [["rect", {width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1"}], ["path", {d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"}], ["path", {d: "m9 14 2 2 4-4"}]],
  // today's session (Lucide "calendar-check")
  "today": [["path", {d: "M8 2v4"}], ["path", {d: "M16 2v4"}], ["rect", {width: "18", height: "18", x: "3", y: "4", rx: "2"}], ["path", {d: "M3 10h18"}], ["path", {d: "m9 16 2 2 4-4"}]],
  // of the day: the passage or entry for today (Lucide "calendar-days")
  "calendar": [["path", {d: "M8 2v4"}], ["path", {d: "M16 2v4"}], ["rect", {width: "18", height: "18", x: "3", y: "4", rx: "2"}], ["path", {d: "M3 10h18"}], ["path", {d: "M8 14h.01"}], ["path", {d: "M12 14h.01"}], ["path", {d: "M16 14h.01"}], ["path", {d: "M8 18h.01"}], ["path", {d: "M12 18h.01"}], ["path", {d: "M16 18h.01"}]],
  // the Greek letters (Lucide "omega")
  "letters": [["path", {d: "M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21"}]],
  // tables of forms (Lucide "table-2")
  "tables": [["path", {d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"}]],
  // vocabulary: the words you have met (Lucide "list-checks")
  "vocabulary": [["path", {d: "m3 17 2 2 4-4"}], ["path", {d: "m3 7 2 2 4-4"}], ["path", {d: "M13 6h8"}], ["path", {d: "M13 12h8"}], ["path", {d: "M13 18h8"}]],
  // a hint (Lucide "lightbulb")
  "hint": [["path", {d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"}], ["path", {d: "M9 18h6"}], ["path", {d: "M10 22h4"}]],
  // skip this (Lucide "skip-forward")
  "skip": [["polygon", {points: "5 4 15 12 5 20 5 4"}], ["line", {x1: "19", x2: "19", y1: "5", y2: "19"}]],
  // try again, or start again (Lucide "rotate-ccw")
  "again": [["path", {d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}], ["path", {d: "M3 3v5h5"}]],
  // in a new order (Lucide "shuffle")
  "shuffle": [["path", {d: "M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"}], ["path", {d: "m18 2 4 4-4 4"}], ["path", {d: "M2 6h1.9c1.5 0 2.9.9 3.6 2.2"}], ["path", {d: "M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"}], ["path", {d: "m18 14 4 4-4 4"}]],
  // right, done, or chosen (Lucide "check")
  "check": [["path", {d: "M20 6 9 17l-5-5"}]],
  // Mine: what you have kept (Lucide "archive")
  "mine": [["rect", {width: "20", height: "5", x: "2", y: "3", rx: "1"}], ["path", {d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"}], ["path", {d: "M10 12h4"}]],
  // keep your place (Lucide "bookmark")
  "bookmark": [["path", {d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"}]],
  // your place is kept (Lucide "bookmark-check")
  "bookmarked": [["path", {d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"}], ["path", {d: "m9 10 2 2 4-4"}]],
  // a note of your own (Lucide "notebook-pen")
  "note": [["path", {d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"}], ["path", {d: "M2 6h4"}], ["path", {d: "M2 10h4"}], ["path", {d: "M2 14h4"}], ["path", {d: "M2 18h4"}], ["path", {d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"}]],
  // change it (Lucide "pencil")
  "edit": [["path", {d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}], ["path", {d: "m15 5 4 4"}]],
  // remove it (Lucide "trash-2")
  "delete": [["path", {d: "M3 6h18"}], ["path", {d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}], ["path", {d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}], ["line", {x1: "10", x2: "10", y1: "11", y2: "17"}], ["line", {x1: "14", x2: "14", y1: "11", y2: "17"}]],
  // share it with someone (Lucide "share-2")
  "share": [["circle", {cx: "18", cy: "5", r: "3"}], ["circle", {cx: "6", cy: "12", r: "3"}], ["circle", {cx: "18", cy: "19", r: "3"}], ["line", {x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49"}], ["line", {x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49"}]],
  // copy its link (Lucide "link")
  "link": [["path", {d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}], ["path", {d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]],
  // copy it (Lucide "copy")
  "copy": [["rect", {width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2"}], ["path", {d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]],
  // save it to this device (Lucide "download")
  "download": [["path", {d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}], ["polyline", {points: "7 10 12 15 17 10"}], ["line", {x1: "12", x2: "12", y1: "15", y2: "3"}]],
  // add a file (Lucide "upload")
  "upload": [["path", {d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}], ["polyline", {points: "17 8 12 3 7 8"}], ["line", {x1: "12", x2: "12", y1: "3", y2: "15"}]],
  // texts already in a folder on this computer (Lucide "folder-open")
  "folder": [["path", {d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]],
  // keep it for reading offline (Lucide "cloud-download")
  "save-offline": [["path", {d: "M12 13v8l-4-4"}], ["path", {d: "m12 21 4-4"}], ["path", {d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"}]],
  // private: only you can open it (Lucide "lock")
  "lock": [["rect", {width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2"}], ["path", {d: "M7 11V7a5 5 0 0 1 10 0v4"}]],
  // a key to the signs and colours (Lucide "key-round")
  "key": [["path", {d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"}], ["circle", {cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor"}]],
  // search (Lucide "search")
  "search": [["circle", {cx: "11", cy: "11", r: "8"}], ["path", {d: "m21 21-4.3-4.3"}]],
  // the Greek keyboard (Lucide "keyboard")
  "keyboard": [["path", {d: "M10 8h.01"}], ["path", {d: "M12 12h.01"}], ["path", {d: "M14 8h.01"}], ["path", {d: "M16 12h.01"}], ["path", {d: "M18 8h.01"}], ["path", {d: "M6 8h.01"}], ["path", {d: "M7 16h10"}], ["path", {d: "M8 12h.01"}], ["rect", {width: "20", height: "16", x: "2", y: "4", rx: "2"}]],
  // the Painted Stoa (Lucide "landmark")
  "stoa": [["line", {x1: "3", x2: "21", y1: "22", y2: "22"}], ["line", {x1: "6", x2: "6", y1: "18", y2: "11"}], ["line", {x1: "10", x2: "10", y1: "18", y2: "11"}], ["line", {x1: "14", x2: "14", y1: "18", y2: "11"}], ["line", {x1: "18", x2: "18", y1: "18", y2: "11"}], ["polygon", {points: "12 2 20 7 4 7"}]],
  // authors (Lucide "feather")
  "authors": [["path", {d: "M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"}], ["path", {d: "M16 8 2 22"}], ["path", {d: "M17.5 15H9"}]],
  // eras: when things were written (Lucide "hourglass")
  "eras": [["path", {d: "M5 22h14"}], ["path", {d: "M5 2h14"}], ["path", {d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"}], ["path", {d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"}]],
  // where the manuscripts differ (Lucide "split")
  "variants": [["path", {d: "M16 3h5v5"}], ["path", {d: "M8 3H3v5"}], ["path", {d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"}], ["path", {d: "m15 9 6-6"}]],
  // counts and numbers (Lucide "chart-column")
  "census": [["path", {d: "M3 3v16a2 2 0 0 0 2 2h16"}], ["path", {d: "M18 17V9"}], ["path", {d: "M13 17V5"}], ["path", {d: "M8 17v-3"}]],
  // pots: make and paint one (Lucide "amphora")
  "pots": [["path", {d: "M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8"}], ["path", {d: "M10 5H8a2 2 0 0 0 0 4h.68"}], ["path", {d: "M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8"}], ["path", {d: "M14 5h2a2 2 0 0 1 0 4h-.68"}], ["path", {d: "M18 22H6"}], ["path", {d: "M9 2h6"}]],
  // paint (Lucide "paintbrush")
  "paint": [["path", {d: "m14.622 17.897-10.68-2.913"}], ["path", {d: "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"}], ["path", {d: "M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"}]],
  // rub it out (Lucide "eraser")
  "erase": [["path", {d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"}], ["path", {d: "M22 21H7"}], ["path", {d: "m5 11 9 9"}]],
  // undo (Lucide "undo-2")
  "undo": [["path", {d: "M9 14 4 9l5-5"}], ["path", {d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]],
  // redo (Lucide "redo-2")
  "redo": [["path", {d: "m15 14 5-5-5-5"}], ["path", {d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]],
  // record what you do (Lucide "circle-dot")
  "record": [["circle", {cx: "12", cy: "12", r: "10"}], ["circle", {cx: "12", cy: "12", r: "1"}]],
  // scratch lines through to the clay, with a point (Lucide "pen-tool")
  "scratch": [["path", {d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"}], ["path", {d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"}], ["path", {d: "m2.3 2.3 7.286 7.286"}], ["circle", {cx: "11", cy: "11", r: "2"}]],
  // strike a blow (Lucide "hammer")
  "strike": [["path", {d: "m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"}], ["path", {d: "m18 15 4-4"}], ["path", {d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"}]],
  // turn a thing round to see it from every side (Lucide "rotate-3d")
  "turn": [["path", {d: "M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2"}], ["path", {d: "m15.194 13.707 3.814 1.86-1.86 3.814"}], ["path", {d: "M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4"}]],
  // turn it to the left (Lucide "rotate-ccw")
  "turn-left": [["path", {d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}], ["path", {d: "M3 3v5h5"}]],
  // turn it to the right (Lucide "rotate-cw")
  "turn-right": [["path", {d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"}], ["path", {d: "M21 3v5h-5"}]],
  // music: tunes to play (Lucide "music")
  "music": [["path", {d: "M9 18V5l12-2v13"}], ["circle", {cx: "6", cy: "18", r: "3"}], ["circle", {cx: "18", cy: "16", r: "3"}]],
  // talk with others (Lucide "messages-square")
  "talk": [["path", {d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"}], ["path", {d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"}]],
  // settings (Lucide "settings")
  "settings": [["path", {d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}], ["circle", {cx: "12", cy: "12", r: "3"}]],
  // your account (Lucide "circle-user")
  "account": [["circle", {cx: "12", cy: "12", r: "10"}], ["circle", {cx: "12", cy: "10", r: "3"}], ["path", {d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"}]],
  // sign in (Lucide "log-in")
  "sign-in": [["path", {d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"}], ["polyline", {points: "10 17 15 12 10 7"}], ["line", {x1: "15", x2: "3", y1: "12", y2: "12"}]],
  // sign out (Lucide "log-out")
  "sign-out": [["path", {d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}], ["polyline", {points: "16 17 21 12 16 7"}], ["line", {x1: "21", x2: "9", y1: "12", y2: "12"}]],
  // connected (Lucide "wifi")
  "online": [["path", {d: "M12 20h.01"}], ["path", {d: "M2 8.82a15 15 0 0 1 20 0"}], ["path", {d: "M5 12.859a10 10 0 0 1 14 0"}], ["path", {d: "M8.5 16.429a5 5 0 0 1 7 0"}]],
  // not connected: reading what is kept on this device (Lucide "wifi-off")
  "offline": [["path", {d: "M12 20h.01"}], ["path", {d: "M8.5 16.429a5 5 0 0 1 7 0"}], ["path", {d: "M5 12.859a10 10 0 0 1 5.17-2.69"}], ["path", {d: "M19 12.859a10 10 0 0 0-2.007-1.523"}], ["path", {d: "M2 8.82a15 15 0 0 1 4.177-2.643"}], ["path", {d: "M22 8.82a15 15 0 0 0-11.288-3.764"}], ["path", {d: "m2 2 20 20"}]],
  // the phone app (Lucide "smartphone")
  "phone": [["rect", {width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2"}], ["path", {d: "M12 18h.01"}]],
  // sources and licences (Lucide "file-text")
  "credits": [["path", {d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}], ["path", {d: "M14 2v4a2 2 0 0 0 2 2h4"}], ["path", {d: "M10 9H8"}], ["path", {d: "M16 13H8"}], ["path", {d: "M16 17H8"}]],
  // tell us something is wrong (Lucide "bug")
  "bug": [["path", {d: "m8 2 1.88 1.88"}], ["path", {d: "M14.12 3.88 16 2"}], ["path", {d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"}], ["path", {d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"}], ["path", {d: "M12 20v-9"}], ["path", {d: "M6.53 9C4.6 8.8 3 7.1 3 5"}], ["path", {d: "M6 13H2"}], ["path", {d: "M3 21c0-2.1 1.7-3.9 3.8-4"}], ["path", {d: "M20.97 5c0 2.1-1.6 3.8-3.5 4"}], ["path", {d: "M22 13h-4"}], ["path", {d: "M17.2 17c2.1.1 3.8 1.9 3.8 4"}]],
  // write to us (Lucide "mail")
  "mail": [["rect", {width: "20", height: "16", x: "2", y: "4", rx: "2"}], ["path", {d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"}]],
  // a picture (Lucide "image")
  "image": [["rect", {width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2"}], ["circle", {cx: "9", cy: "9", r: "2"}], ["path", {d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"}]],
  // closer (Lucide "zoom-in")
  "zoom-in": [["circle", {cx: "11", cy: "11", r: "8"}], ["line", {x1: "21", x2: "16.65", y1: "21", y2: "16.65"}], ["line", {x1: "11", x2: "11", y1: "8", y2: "14"}], ["line", {x1: "8", x2: "14", y1: "11", y2: "11"}]],
  // further (Lucide "zoom-out")
  "zoom-out": [["circle", {cx: "11", cy: "11", r: "8"}], ["line", {x1: "21", x2: "16.65", y1: "21", y2: "16.65"}], ["line", {x1: "8", x2: "14", y1: "11", y2: "11"}]],
  // fill the screen (Lucide "maximize-2")
  "expand": [["polyline", {points: "15 3 21 3 21 9"}], ["polyline", {points: "9 21 3 21 3 15"}], ["line", {x1: "21", x2: "14", y1: "3", y2: "10"}], ["line", {x1: "3", x2: "10", y1: "21", y2: "14"}]],
  // back to the page (Lucide "minimize-2")
  "shrink": [["polyline", {points: "4 14 10 14 10 20"}], ["polyline", {points: "20 10 14 10 14 4"}], ["line", {x1: "14", x2: "21", y1: "10", y2: "3"}], ["line", {x1: "3", x2: "10", y1: "21", y2: "14"}]],
  // shown as a grid (Lucide "layout-grid")
  "grid": [["rect", {width: "7", height: "7", x: "3", y: "3", rx: "1"}], ["rect", {width: "7", height: "7", x: "14", y: "3", rx: "1"}], ["rect", {width: "7", height: "7", x: "14", y: "14", rx: "1"}], ["rect", {width: "7", height: "7", x: "3", y: "14", rx: "1"}]],
  // shown as a list (Lucide "list")
  "list": [["path", {d: "M3 12h.01"}], ["path", {d: "M3 18h.01"}], ["path", {d: "M3 6h.01"}], ["path", {d: "M8 12h13"}], ["path", {d: "M8 18h13"}], ["path", {d: "M8 6h13"}]],
  // the order (Lucide "arrow-up-down")
  "sort": [["path", {d: "m21 16-4 4-4-4"}], ["path", {d: "M17 20V4"}], ["path", {d: "m3 8 4-4 4 4"}], ["path", {d: "M7 4v16"}]],
  // A to Z (Lucide "arrow-down-a-z")
  "a-z": [["path", {d: "m3 16 4 4 4-4"}], ["path", {d: "M7 20V4"}], ["path", {d: "M20 8h-5"}], ["path", {d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10"}], ["path", {d: "M15 14h5l-5 6h5"}]],
  // narrow the list (Lucide "list-filter")
  "filter": [["path", {d: "M3 6h18"}], ["path", {d: "M7 12h10"}], ["path", {d: "M10 18h4"}]],
  // add (Lucide "plus")
  "plus": [["path", {d: "M5 12h14"}], ["path", {d: "M12 5v14"}]],
  // less (Lucide "minus")
  "minus": [["path", {d: "M5 12h14"}]],
  // show it, or try it first (Lucide "eye")
  "eye": [["path", {d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}], ["circle", {cx: "12", cy: "12", r: "3"}]],
  // hide it (Lucide "eye-off")
  "eye-off": [["path", {d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}], ["path", {d: "M14.084 14.158a3 3 0 0 1-4.242-4.242"}], ["path", {d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}], ["path", {d: "m2 2 20 20"}]],
  // what you did before (Lucide "history")
  "history": [["path", {d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}], ["path", {d: "M3 3v5h5"}], ["path", {d: "M12 7v5l4 2"}]],
  // take care (Lucide "triangle-alert")
  "warning": [["path", {d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}], ["path", {d: "M12 9v4"}], ["path", {d: "M12 17h.01"}]],
  // report it (Lucide "flag")
  "flag": [["path", {d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"}], ["line", {x1: "4", x2: "4", y1: "22", y2: "15"}]],
  // send (Lucide "send")
  "send": [["path", {d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"}], ["path", {d: "m21.854 2.147-10.94 10.939"}]],
  // the lyre: play it (the site's own drawing)
  "lyre": [["path", {d: "M8 19C3.6 16.4 2.4 9.6 5 4.5c.4-.8 1.2-1.3 2-1.2"}], ["path", {d: "M16 19c4.4-2.6 5.6-9.4 3-14.5-.4-.8-1.2-1.3-2-1.2"}], ["path", {d: "M4.4 7h15.2"}], ["path", {d: "M6.5 19h11c-1.2 2.4-9.8 2.4-11 0"}], ["path", {d: "M9 7v12"}], ["path", {d: "M12 7v12"}], ["path", {d: "M15 7v12"}]],
} satisfies Record<string, Drawing>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

const SIT: CSSProperties = { flex: "none", verticalAlign: "-0.22em" };   // on the line of the words beside it

export default function Icon({ name, label, style, ...rest }: { name: IconName; label?: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" focusable="false" data-icon={name}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })} style={style ? { ...SIT, ...style } : SIT} {...rest}>
      {(ICONS[name] as Drawing).map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

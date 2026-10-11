/**
 * When a passed lesson comes back for a refresh. Passing a lesson's test (8 of 10) earns it; each later
 * refresh passed sends the next one further off (3 days, a week, a month, three months, six months), and a
 * refresh failed brings the lesson back the next day. Kept apart from workout.ts so that pages showing
 * progress do not load the lessons themselves.
 */
export const PASS_SHARE = 0.8;
export const passMark = (n: number) => Math.ceil(n * PASS_SHARE);

const DAY = 86_400_000;
/** Days until the next refresh, after passing the test at each level (the first pass is level 0). */
export const REFRESH_DAYS = [3, 7, 30, 90, 180];

export interface Mastery { passed: number; level: number; due: number; best: number; tries: number }

/** The lesson's record after a test: passing moves the next refresh further off, failing brings it back tomorrow. */
export function afterTest(m: Mastery | undefined, right: number, total: number, now = Date.now()): Mastery {
  const pass = right >= passMark(total);
  const score = total ? right / total : 0;
  if (!m) return pass
    ? { passed: now, level: 0, due: now + REFRESH_DAYS[0] * DAY, best: score, tries: 1 }
    : { passed: 0, level: -1, due: 0, best: score, tries: 1 };
  if (!m.passed) return pass
    ? { passed: now, level: 0, due: now + REFRESH_DAYS[0] * DAY, best: Math.max(m.best, score), tries: m.tries + 1 }
    : { ...m, best: Math.max(m.best, score), tries: m.tries + 1 };
  // a test taken again before its refresh is due changes nothing in the schedule
  if (now < m.due) return { ...m, best: Math.max(m.best, score), tries: m.tries + 1 };
  const level = pass ? Math.min(m.level + 1, REFRESH_DAYS.length - 1) : Math.max(0, m.level - 1);
  return { ...m, level, due: now + (pass ? REFRESH_DAYS[level] : 1) * DAY, best: Math.max(m.best, score), tries: m.tries + 1 };
}

export const refreshDue = (m: Mastery | undefined, now = Date.now()) => !!m?.passed && m.due <= now;

/** Pure domain rules. No React, no store — everything here is unit-tested. */
import type { CalEvent, Focus, Note, SimpleDate, Todo, TodoBucket } from './types';

/* ---------- time ---------- */

export function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function fmtRange(a: string, b: string): string {
  return a + '–' + b;
}

export function durationLabel(ev: CalEvent): string {
  const mins = toMin(ev.end) - toMin(ev.time);
  return mins >= 60 ? mins / 60 + 'h' : mins + 'm';
}

export function clockLabel(min: number): string {
  return Math.floor(min / 60) + ':' + String(min % 60).padStart(2, '0');
}

/** "12am"-style label used on the calendar gutters. */
export function hourLabel(h: number): string {
  return (h % 12 === 0 ? 12 : h % 12) + (h < 12 ? 'am' : 'pm');
}

export function freeUntilNext(events: CalEvent[], nowMin: number): string {
  const next = events.map(e => toMin(e.time)).filter(m => m > nowMin).sort((a, b) => a - b)[0];
  if (next === undefined) return 'Nothing left on the calendar today';
  const mins = next - nowMin;
  return (mins >= 60 ? Math.floor(mins / 60) + 'h ' : '') + (mins % 60) + 'm free until your next block';
}

export function busyMinutes(events: CalEvent[]): number {
  return events.reduce((a, ev) => a + (toMin(ev.end) - toMin(ev.time)), 0);
}

/* ---------- scores ---------- */

/** Non-punishing ring colour: lavender when strong, coral mid, amber low — never red. */
export function ringColorFor(score: number): string {
  if (score >= 70) return 'var(--accent2)';
  if (score >= 40) return 'var(--accent1)';
  return 'var(--amber)';
}

/** SVG stroke-dasharray for a ring of radius r filled to `pct`. */
export function ringDash(pct: number, r: number): string {
  const circ = 2 * Math.PI * r;
  return (Math.max(0, Math.min(100, pct)) / 100) * circ + ' ' + circ;
}

export function trendLabel(f: Pick<Focus, 'scored' | 'trend'>): string {
  if (f.trend === 'up') return 'Trending up';
  if (f.trend === 'down') return 'Needs a nudge';
  return f.scored ? 'Holding steady' : 'Not scored';
}

/** Average momentum across active scored Focuses. */
export function focusMomentum(focuses: Focus[]): number {
  const scored = focuses.filter(f => f.scored && !f.archived && f.score !== undefined);
  if (!scored.length) return 0;
  return Math.round(scored.reduce((a, f) => a + (f.score ?? 0), 0) / scored.length);
}

/* ---------- todos ---------- */

export function todoBucket(t: Todo): TodoBucket {
  if (t.bucket) return t.bucket;
  if (t.type !== 'deadline') return 'nodate';
  if (t.due === 'Today') return 'today';
  if (t.due === 'Yesterday') return 'overdue';
  return 'week';
}

export function dueLabel(t: Todo): string {
  return t.type === 'deadline' ? 'Due ' + (t.due || '') : 'Anytime';
}

/**
 * Today's plan vs. actual: today's todos plus today's calendar blocks.
 * A block counts as done once it has ended.
 */
export function dayPlan(todos: Todo[], events: CalEvent[], nowMin: number) {
  const todays = todos.filter(t => todoBucket(t) === 'today');
  const planned = todays.length + events.length;
  const done = todays.filter(t => t.done).length + events.filter(ev => toMin(ev.end) <= nowMin).length;
  return { planned, done, adherence: Math.round((done / Math.max(1, planned)) * 100) };
}

/* ---------- logging ---------- */

/** Key for one trackable of a Focus. The first item keeps the bare focus id. */
export function logKey(focusId: string, index: number): string {
  return index === 0 ? focusId : focusId + ':' + index;
}

export function logCaption(logged: number, total: number): string {
  return total > 1 ? 'Today · ' + logged + ' of ' + total + ' logged' : 'Today';
}

/* ---------- notes ---------- */

export interface NoteEntry {
  key: string;
  note: Note;
  labels: string[];
  dupNote: string | null;
}

/**
 * The notes feed: one entry per note, newest first. With container filters
 * active, a multi-topic note appears once under each matching topic and says
 * where else it is filed.
 */
export function noteFeed(notes: Note[], topicsOf: (n: Note) => string[], filters: string[], query: string): NoteEntry[] {
  const q = query.trim().toLowerCase();
  const hit = (s: string) => !q || s.toLowerCase().includes(q);
  const out: NoteEntry[] = [];
  for (const note of notes) {
    const topics = topicsOf(note);
    if (!hit(note.text) && !topics.some(hit)) continue;
    if (!filters.length) {
      out.push({ key: note.id, note, labels: topics, dupNote: null });
      continue;
    }
    for (const t of topics.filter(x => filters.includes(x))) {
      const others = topics.filter(x => x !== t);
      out.push({ key: note.id + ':' + t, note, labels: [t], dupNote: others.length ? 'Also filed under ' + others.join(', ') : null });
    }
  }
  return out;
}

/* ---------- calendar ---------- */

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toDate = (d: SimpleDate) => new Date(d.y, d.m, d.d);

/** Monday-based weekday index (Mon = 0 … Sun = 6). */
export function mondayIndex(d: SimpleDate): number {
  return (toDate(d).getDay() + 6) % 7;
}

export function mondayOf(d: SimpleDate): Date {
  const date = toDate(d);
  date.setDate(date.getDate() - mondayIndex(d));
  return date;
}

/** Whole weeks between the weeks containing `from` and `to`. */
export function weekOffsetBetween(from: SimpleDate, to: SimpleDate): number {
  const ms = mondayOf(to).getTime() - mondayOf(from).getTime();
  return Math.round(ms / (7 * 24 * 3600 * 1000));
}

/** Day-of-month numbers for the 7 days of the week `offset` weeks from `today`. */
export function weekDates(today: SimpleDate, offset: number): number[] {
  const start = mondayOf(today);
  start.setDate(start.getDate() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.getDate();
  });
}

export function headerDayLabel(d: SimpleDate): string {
  return WEEKDAY_NAMES[toDate(d).getDay()] + ', ' + MONTH_NAMES[d.m].slice(0, 3) + ' ' + d.d;
}

export interface MonthCell {
  label: number;
  dim: boolean;
  date?: SimpleDate;
}

/** 6×7 Monday-first grid for the month `offset` months from `base`. */
export function monthGrid(base: SimpleDate, offset: number): { label: string; cells: MonthCell[] } {
  const first = new Date(base.y, base.m + offset, 1);
  const y = first.getFullYear(), m = first.getMonth();
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const cells: MonthCell[] = [];
  for (let i = 0; i < lead; i++) cells.push({ label: prevDays - lead + 1 + i, dim: true });
  for (let d = 1; d <= days; d++) cells.push({ label: d, dim: false, date: { y, m, d } });
  for (let n = 1; cells.length < 42; n++) cells.push({ label: n, dim: true });
  return { label: MONTH_NAMES[m] + ' ' + y, cells };
}

export function sameDay(a: SimpleDate, b: SimpleDate): boolean {
  return a.y === b.y && a.m === b.m && a.d === b.d;
}

export function weekLabel(offset: number): string {
  if (offset === 0) return 'This week';
  const n = Math.abs(offset);
  return n + ' week' + (n > 1 ? 's' : '') + (offset > 0 ? ' ahead' : ' ago');
}

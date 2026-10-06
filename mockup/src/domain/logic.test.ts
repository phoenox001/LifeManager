import { describe, expect, it } from 'vitest';
import * as seed from '../data/seed';
import {
  dayPlan, focusMomentum, freeUntilNext, headerDayLabel, logCaption, logKey, mondayIndex, monthGrid, noteFeed,
  ringColorFor, ringDash, todoBucket, weekDates, weekLabel, weekOffsetBetween,
} from './logic';
import { focusLogItems, projectActivity } from './selectors';
import type { Todo } from './types';

describe('scores', () => {
  it('never colours a ring red — low scores are amber', () => {
    expect(ringColorFor(82)).toBe('var(--accent2)');
    expect(ringColorFor(70)).toBe('var(--accent2)');
    expect(ringColorFor(41)).toBe('var(--accent1)');
    expect(ringColorFor(28)).toBe('var(--amber)');
  });

  it('builds a proportional dash array and clamps out-of-range values', () => {
    const circ = 2 * Math.PI * 10;
    expect(ringDash(50, 10)).toBe(circ / 2 + ' ' + circ);
    expect(ringDash(140, 10)).toBe(circ + ' ' + circ);
  });

  it('averages momentum over active scored focuses only', () => {
    // h1 82, h2 64, h3 41, h4 73 — s3 is archived and excluded.
    expect(focusMomentum(seed.focuses)).toBe(65);
  });
});

describe('today plan', () => {
  it('counts todays todos plus calendar blocks, a block being done once it ended', () => {
    // 3 todos for today (1 done) + 4 blocks (2 ended by 13:45) = 3 of 7.
    expect(dayPlan(seed.todos, seed.schedule, seed.NOW_MIN)).toEqual({ planned: 7, done: 3, adherence: 43 });
  });

  it('reports free time until the next block', () => {
    expect(freeUntilNext(seed.schedule, seed.NOW_MIN)).toBe('1h 15m free until your next block');
    expect(freeUntilNext(seed.schedule, 20 * 60)).toBe('Nothing left on the calendar today');
  });
});

describe('todo buckets', () => {
  const base: Todo = { id: 'x', title: 'x', owner: 'General', done: false, project: null, type: 'general' };
  it('uses an explicit bucket when present', () => {
    expect(todoBucket({ ...base, bucket: 'later' })).toBe('later');
  });
  it('derives a bucket from the due label', () => {
    expect(todoBucket(base)).toBe('nodate');
    expect(todoBucket({ ...base, type: 'deadline', due: 'Today' })).toBe('today');
    expect(todoBucket({ ...base, type: 'deadline', due: 'Yesterday' })).toBe('overdue');
    expect(todoBucket({ ...base, type: 'deadline', due: 'Fri' })).toBe('week');
  });
});

describe('logging', () => {
  it('keys the first trackable by the bare focus id', () => {
    expect(logKey('h1', 0)).toBe('h1');
    expect(logKey('h1', 1)).toBe('h1:1');
  });

  it('lists one row per trackable and nothing for paused focuses', () => {
    const run = seed.focuses.find(f => f.id === 'h1')!;
    const meditate = seed.focuses.find(f => f.id === 'h4')!;
    expect(focusLogItems(run, { h1: 'done' }).map(i => [i.label, i.mark])).toEqual([['Morning run', 'done'], ['Post-run stretch', undefined]]);
    expect(focusLogItems(meditate, {})).toEqual([]);
  });

  it('captions multi-item logs with a count', () => {
    expect(logCaption(1, 2)).toBe('Today · 1 of 2 logged');
    expect(logCaption(0, 1)).toBe('Today');
  });
});

describe('notes feed', () => {
  const topics = (n: { topics: string[] }) => n.topics;

  it('shows each note once without filters', () => {
    const feed = noteFeed(seed.notes, topics, [], '');
    expect(feed).toHaveLength(seed.notes.length);
    expect(feed[1].labels).toEqual(['Morning run', 'Nutrition']);
  });

  it('duplicates a multi-topic note under each active filter and says where else it lives', () => {
    const feed = noteFeed(seed.notes, topics, ['Morning run', 'Nutrition'], '');
    const n2 = feed.filter(e => e.note.id === 'n2');
    expect(n2.map(e => e.key)).toEqual(['n2:Morning run', 'n2:Nutrition']);
    expect(n2[0].dupNote).toBe('Also filed under Nutrition');
  });

  it('searches text and topics', () => {
    expect(noteFeed(seed.notes, topics, [], 'van').map(e => e.note.id)).toEqual(['n6']);
    expect(noteFeed(seed.notes, topics, [], 'certification').map(e => e.note.id)).toEqual(['n3']);
  });
});

describe('calendar', () => {
  it('knows the mock today is a Thursday', () => {
    expect(mondayIndex(seed.TODAY)).toBe(3);
    expect(headerDayLabel(seed.TODAY)).toBe('Thursday, Aug 13');
  });

  it('lists the dates of this and neighbouring weeks', () => {
    expect(weekDates(seed.TODAY, 0)).toEqual([10, 11, 12, 13, 14, 15, 16]);
    expect(weekDates(seed.TODAY, 3)).toEqual([31, 1, 2, 3, 4, 5, 6]);
  });

  it('computes week offsets across month boundaries', () => {
    expect(weekOffsetBetween(seed.TODAY, { y: 2026, m: 7, d: 16 })).toBe(0);
    expect(weekOffsetBetween(seed.TODAY, { y: 2026, m: 8, d: 2 })).toBe(3);
    expect(weekOffsetBetween(seed.TODAY, { y: 2026, m: 7, d: 9 })).toBe(-1);
  });

  it('builds a Monday-first 6-week month grid', () => {
    const g = monthGrid(seed.TODAY, 0);
    expect(g.label).toBe('August 2026');
    expect(g.cells).toHaveLength(42);
    // Aug 1 2026 is a Saturday: five leading days from July.
    expect(g.cells.slice(0, 6).map(c => [c.label, c.dim])).toEqual([[27, true], [28, true], [29, true], [30, true], [31, true], [1, false]]);
  });

  it('labels week offsets', () => {
    expect(weekLabel(0)).toBe('This week');
    expect(weekLabel(1)).toBe('1 week ahead');
    expect(weekLabel(-2)).toBe('2 weeks ago');
  });
});

describe('projects', () => {
  it('summarises active, unarchived projects only', () => {
    expect(projectActivity(seed.projects, seed.todos)).toEqual({ active: 3, touchedThisWeek: 3, openTodos: 6, avg: 61 });
  });
});

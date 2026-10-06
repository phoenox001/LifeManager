import { beforeEach, describe, expect, it } from 'vitest';
import { useApp } from './appStore';

const initial = useApp.getState();
const s = () => useApp.getState();

beforeEach(() => useApp.setState(initial, true));

describe('navigation', () => {
  it('switching tabs closes tier-2 and tier-3 overlays', () => {
    s().openSeeAll('projects');
    s().openDetail('project', 'p1');
    s().setTab('focuses');
    expect(s().seeAll).toBeNull();
    expect(s().detail).toBeNull();
    expect(s().tab).toBe('focuses');
  });

  it('opening a detail keeps the list underneath so Back returns to it', () => {
    s().openSeeAll('projects');
    s().openDetail('project', 'p1');
    s().closeDetail();
    expect(s().seeAll).toBe('projects');
  });

  it('picking a day in the calendar opens that day in My Week', () => {
    s().openCalendar();
    s().selectDay({ y: 2026, m: 8, d: 2 });
    expect(s().calendar.open).toBe(false);
    expect(s().myWeek).toEqual({ open: true, mode: 'day', offset: 3, dayIndex: 2 });
  });
});

describe('logging is shared across tiers', () => {
  it('a tier-1 log toggle and the tier-3 Done button write the same key', () => {
    s().toggleLog('h2', 'Read');
    expect(s().logToday.h2).toBe('done');
    s().setLog('h2', 'done');
    expect(s().logToday.h2).toBeUndefined();
    s().setLog('h2', 'skip');
    expect(s().logToday.h2).toBe('skip');
  });
});

describe('lifecycle', () => {
  it('archives and restores a project', () => {
    s().archiveContainer('project', 'p1');
    expect(s().projects.find(p => p.id === 'p1')).toMatchObject({ archived: true, pinned: false });
    s().restoreArchived('p1');
    expect(s().projects.find(p => p.id === 'p1')?.archived).toBe(false);
  });

  it('archiving a note keeps its payload so it can be restored', () => {
    s().archiveNote('n1');
    expect(s().notes.some(n => n.id === 'n1')).toBe(false);
    s().restoreArchived('n1');
    expect(s().notes[0].id).toBe('n1');
  });

  it('completing a project sets progress to 100', () => {
    s().setProjectStatus('p2', 'completed');
    expect(s().projects.find(p => p.id === 'p2')).toMatchObject({ status: 'completed', progress: 100 });
  });
});

describe('tier 3 editing', () => {
  it('renames on Done and reorders modules', () => {
    s().openDetail('project', 'p1');
    s().toggleDetailEdit();
    s().setRenameDraft('  Site v2 ');
    s().moveModule('p1', 'todos', -1);
    s().toggleDetailEdit();
    expect(s().nameOverrides['project:p1']).toBe('Site v2');
    expect(s().moduleOrder.p1.slice(0, 2)).toEqual(['todos', 'milestones']);
  });

  it('changing a due date re-buckets the todo', () => {
    s().setTodoDue('t8', 'Today');
    expect(s().todos.find(t => t.id === 't8')).toMatchObject({ due: 'Today', type: 'deadline', bucket: 'today' });
    s().setTodoDue('t8', 'None');
    expect(s().todos.find(t => t.id === 't8')).toMatchObject({ due: null, type: 'general', bucket: 'nodate' });
  });
});

describe('quick add', () => {
  it('saves a todo to the chosen owner', () => {
    s().openQuickAdd();
    s().pickQuickType('todo');
    s().setQuick({ title: 'Call the bank', owner: 'Website Redesign', deadline: true });
    s().saveQuickTodo();
    expect(s().todos.at(-1)).toMatchObject({ title: 'Call the bank', project: 'p1', bucket: 'today' });
    expect(s().quick.mode).toBeNull();
  });

  it('sends a loose note to the inbox', () => {
    s().pickQuickType('note');
    s().setQuick({ noteText: 'Sort later' });
    s().sendNoteToInbox();
    expect(s().inbox.at(-1)?.text).toBe('Sort later');
  });
});

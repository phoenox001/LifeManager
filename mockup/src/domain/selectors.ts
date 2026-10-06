/** Derived views over store data, shared by several screens. Pure functions. */
import type { Focus, LogMark, Project, Todo } from './types';
import { logKey } from './logic';

export interface LogItem {
  key: string;
  label: string;
  mark: LogMark | undefined;
}

/** Today's trackables for a Focus. Paused or archived Focuses log nothing. */
export function focusLogItems(f: Focus, logToday: Record<string, LogMark | undefined>): LogItem[] {
  if (f.card.kind !== 'log' || f.paused || f.archived) return [];
  return f.card.items.map((label, i) => {
    const key = logKey(f.id, i);
    return { key, label, mark: logToday[key] };
  });
}

export function openTodosOf(projectId: string, todos: Todo[]): Todo[] {
  return todos.filter(t => t.project === projectId && !t.done);
}

export function isActiveProject(p: Project): boolean {
  return p.status === 'active' && !p.archived;
}

export function projectActivity(projects: Project[], todos: Todo[]) {
  const active = projects.filter(isActiveProject);
  return {
    active: active.length,
    touchedThisWeek: active.filter(p => p.weekBars.some(Boolean)).length,
    openTodos: active.reduce((a, p) => a + openTodosOf(p.id, todos).length, 0),
    avg: Math.round(active.reduce((a, p) => a + p.progress, 0) / Math.max(1, active.length)),
  };
}

export function focusStatus(f: Focus): 'active' | 'paused' | 'archived' {
  if (f.archived) return 'archived';
  return f.paused ? 'paused' : 'active';
}

/** Projects names, used to colour topic chips (blue for Projects, green for Focuses). */
export function isProjectName(name: string, projects: Project[]): boolean {
  return projects.some(p => p.name === name);
}

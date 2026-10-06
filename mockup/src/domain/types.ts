export type Theme = 'dark' | 'light';
export type Tab = 'dashboard' | 'projects' | 'focuses' | 'account';

export type ProjectStatus = 'active' | 'paused' | 'completed';

export interface Project {
  id: string;
  name: string;
  /** Completion percentage shown on tier-2 cards. */
  progress: number;
  status: ProjectStatus;
  archived: boolean;
  archivedOn?: string;
  pinned: boolean;
  goal: string | null;
  /** Mon..Sun — whether the project was worked on that day. */
  weekBars: number[];
  last: string;
  lastWhen: string;
  /** Relative "last moved" label for tier-2 status lines. */
  touched: string;
}

export type Trend = 'up' | 'flat' | 'down';

export type FocusCard =
  | { kind: 'log'; items: string[]; caption?: string }
  | { kind: 'note' | 'text'; caption: string; text: string };

export interface Focus {
  id: string;
  name: string;
  scored: boolean;
  score?: number;
  trend?: Trend;
  pinned: boolean;
  paused: boolean;
  archived: boolean;
  archivedOn?: string;
  /** Tier-1 pinned card shows a note + AI line under the log rows. */
  summary?: { note: string; ai: string };
  card: FocusCard;
  lastLog: string;
  /** Built-in container that cannot be archived or deleted. */
  builtIn?: boolean;
}

export type TodoType = 'general' | 'deadline';
export type TodoBucket = 'overdue' | 'today' | 'week' | 'later' | 'nodate';

export interface Todo {
  id: string;
  title: string;
  /** Display name of the owning container (Project or Focus name). */
  owner: string;
  done: boolean;
  /** Set when the owner is a Project. */
  project: string | null;
  type: TodoType;
  due?: string | null;
  bucket?: TodoBucket;
}

export type CalendarKind = 'work' | 'private';

export interface CalEvent {
  time: string;
  end: string;
  title: string;
  cal: CalendarKind;
  linked?: string;
}

export interface Note {
  id: string;
  text: string;
  when: string;
  topics: string[];
}

export interface StoredDoc {
  id: string;
  title: string;
  kind: string;
  meta: string;
}

export interface Automation {
  id: string;
  title: string;
  when: string;
  prompt: string;
  confirm: boolean;
}

export interface ArchiveStaticItem {
  id: string;
  name: string;
  meta: string;
}

export interface Milestone {
  title: string;
  when: string;
  done: boolean;
}

export interface Subitem {
  title: string;
  done: boolean;
}

export interface Resource {
  title: string;
  meta: string;
}

export type ModuleId = 'todos' | 'milestones' | 'log' | 'notes' | 'events' | 'subitems' | 'resources';

export interface SpotlightCard {
  id: string;
  kind: 'dynamic' | 'pinned';
  label: string;
  target: string;
  /** Detail page the title opens. */
  open: DetailRef;
  body: string;
}

export interface InboxItem {
  id: string;
  text: string;
  guess: string;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  widgetLabels?: string[];
  hasConfirm?: boolean;
  confirmMsg?: string;
}

export type DetailKind = 'project' | 'focus' | 'note' | 'doc';
export interface DetailRef {
  kind: DetailKind;
  id: string;
}

export type CrudLetter = 'C' | 'R' | 'U' | 'D';
export type PermissionBucket = 'Projects' | 'Focuses';
export type Permissions = Record<PermissionBucket, Record<CrudLetter, boolean>>;

export type LogMark = 'done' | 'skip';

export type RowSheetKind = 'project' | 'focus' | 'note' | 'doc' | 'archived';
export interface RowSheetTarget {
  kind: RowSheetKind;
  id: string;
  name: string;
}

export interface SimpleDate {
  y: number;
  /** 0-based month. */
  m: number;
  d: number;
}

import { create } from 'zustand';
import * as seed from '../data/seed';
import { mondayIndex, weekOffsetBetween } from '../domain/logic';
import type {
  AiMessage, ArchiveStaticItem, CrudLetter, DetailKind, DetailRef, Focus, InboxItem, LogMark, ModuleId, Note,
  PermissionBucket, Permissions, Project, ProjectStatus, RowSheetTarget, SimpleDate, SpotlightCard, StoredDoc,
  Subitem, Tab, Theme, Todo,
} from '../domain/types';

export type QuickAddMode = 'menu' | 'todo' | 'note' | 'focus' | 'generic';
export type QuickAddType = 'project' | 'event' | 'journal';
export type FocusStart = 'now' | 'staggered' | 'someday';
export type AccountSub = 'ai' | 'docs' | 'auto' | 'info' | 'archive' | 'notes';
export type RowSheetStep = 'actions' | 'complete' | 'confirmDelete';
export type AiTone = 'warm' | 'balanced' | 'direct';

/** Archived things that are not Projects or Focuses keep their payload so they can be restored. */
export interface ArchivedEntry extends ArchiveStaticItem {
  note?: Note;
  doc?: StoredDoc;
}

interface DataState {
  projects: Project[];
  focuses: Focus[];
  todos: Todo[];
  notes: Note[];
  docs: StoredDoc[];
  inbox: InboxItem[];
  spotlight: SpotlightCard[];
  subitems: Record<string, Subitem[]>;
  archivedResources: ArchivedEntry[];
  archivedNotes: ArchivedEntry[];
  /** Today's log, keyed per trackable (see logKey). Shared by tiers 1, 2 and 3. */
  logToday: Record<string, LogMark | undefined>;
  nameOverrides: Record<string, string>;
  moduleOrder: Record<string, ModuleId[]>;
  moduleOff: Record<string, boolean>;
  noteLinks: Record<string, string[]>;
  docDrafts: Record<string, string>;
  aiExcluded: Record<string, boolean>;
  permissions: Permissions;
  confirmWrites: boolean;
  aiTone: AiTone;
}

interface UiState {
  theme: Theme;
  tab: Tab;
  navCollapsed: boolean;
  toast: string | null;

  selectedDate: SimpleDate;
  myWeek: { open: boolean; offset: number; mode: 'week' | 'day'; dayIndex: number };
  calendar: { open: boolean; monthOffset: number };

  allTodos: { open: boolean; owner: string; type: 'all' | 'general' | 'deadline'; showCompleted: boolean };
  inboxOpen: boolean;
  seeAll: 'projects' | 'focuses' | null;
  showArchived: boolean;
  accountSub: AccountSub | null;
  archiveClosed: Record<string, boolean>;
  noteFilters: string[];
  search: { open: boolean; query: string };

  detail: DetailRef | null;
  detailEdit: boolean;
  detailMore: boolean;
  addModuleOpen: boolean;
  renameDraft: string | null;
  peek: string | null;

  ai: { open: boolean; showRecent: boolean; input: string; quickInput: string; turn: number; messages: AiMessage[] };

  quick: {
    mode: QuickAddMode | null; type: QuickAddType | null;
    title: string; noteText: string; aiSuggestion: string | null;
    owner: string; deadline: boolean; focusStart: FocusStart;
  };

  rowSheet: RowSheetTarget | null;
  rowSheetStep: RowSheetStep;
}

interface Actions {
  showToast(msg: string): void;
  setTheme(t: Theme): void;
  setTab(t: Tab): void;
  setNavCollapsed(v: boolean): void;

  toggleTodo(id: string): void;
  setTodoTitle(id: string, title: string): void;
  setTodoDue(id: string, label: string): void;
  moveTodo(id: string, owner: string, projectId: string | null): void;
  deleteTodo(id: string): void;
  toggleLog(key: string, label: string): void;
  setLog(key: string, mark: LogMark): void;
  toggleSubitem(containerId: string, index: number): void;

  openMyWeek(): void;
  closeMyWeek(): void;
  setWeekMode(m: 'week' | 'day'): void;
  setWeekDay(i: number): void;
  stepWeek(delta: number): void;
  stepDay(delta: number): void;
  openCalendar(): void;
  closeCalendar(): void;
  stepMonth(delta: number): void;
  selectDay(d: SimpleDate): void;
  viewWeekFromCalendar(): void;

  openAllTodos(owner?: string): void;
  closeAllTodos(): void;
  setTodoFilter(patch: Partial<Pick<UiState['allTodos'], 'owner' | 'type'>>): void;
  toggleCompletedTodos(): void;
  openInbox(): void;
  closeInbox(): void;
  resolveInbox(id: string, manual: boolean): void;

  openSeeAll(kind: 'projects' | 'focuses'): void;
  closeSeeAll(): void;
  toggleArchived(): void;
  openAccountSub(sub: AccountSub): void;
  closeAccountSub(): void;
  openFullArchive(): void;
  toggleArchiveGroup(id: string): void;
  toggleNoteFilter(topic: string): void;
  clearNoteFilters(): void;
  toggleSearch(): void;
  setQuery(q: string): void;

  openDetail(kind: DetailKind, id: string): void;
  closeDetail(): void;
  toggleDetailEdit(): void;
  toggleDetailMore(): void;
  setRenameDraft(v: string): void;
  toggleAddModule(): void;
  addModule(containerId: string, mid: ModuleId): void;
  toggleModule(containerId: string, mid: ModuleId): void;
  moveModule(containerId: string, mid: ModuleId, dir: 1 | -1): void;
  toggleAiExclude(key: string): void;
  addNoteLink(noteId: string, topic: string): void;
  removeNoteLink(noteId: string, topic: string): void;
  setDocDraft(docId: string, text: string): void;
  openPeek(todoId: string): void;
  closePeek(): void;

  archiveContainer(kind: 'project' | 'focus', id: string): void;
  restoreContainer(kind: 'project' | 'focus', id: string): void;
  archiveNote(id: string): void;
  archiveDoc(id: string): void;
  restoreArchived(id: string): void;
  deleteItem(target: RowSheetTarget): void;
  setProjectStatus(id: string, status: ProjectStatus): void;
  setFocusPaused(id: string, paused: boolean): void;
  togglePin(kind: 'project' | 'focus', id: string): void;

  openRowSheet(t: RowSheetTarget): void;
  closeRowSheet(): void;
  setRowSheetStep(s: RowSheetStep): void;

  openAiChat(prefill?: string): void;
  openAiChatWithInsight(): void;
  closeAiChat(): void;
  toggleRecentChats(): void;
  setAiInput(v: string): void;
  setAiQuickInput(v: string): void;
  sendQuickAi(): void;
  sendAiMessage(): void;
  resolveAiConfirm(messageId: string, accept: boolean): void;
  openAiSettings(): void;
  openDocsFromChat(): void;

  openQuickAdd(): void;
  closeQuickAdd(): void;
  pickQuickType(type: 'todo' | 'note' | 'focus' | QuickAddType | 'ai'): void;
  setQuick(patch: Partial<UiState['quick']>): void;
  saveQuickTodo(): void;
  saveQuickFocus(): void;
  saveQuickGeneric(): void;
  askAiSort(): void;
  fileNote(topic: string): void;
  sendNoteToInbox(): void;

  togglePermission(bucket: PermissionBucket, letter: CrudLetter): void;
  toggleConfirmWrites(): void;
  setAiTone(t: AiTone): void;
}

export type AppState = DataState & UiState & Actions;

const emptyQuick: UiState['quick'] = {
  mode: null, type: null, title: '', noteText: '', aiSuggestion: null, owner: 'General', deadline: false, focusStart: 'now',
};

/** Overlays that a tab switch dismisses. */
const closedOverlays: Partial<UiState> = {
  detail: null, detailEdit: false, peek: null, seeAll: null, accountSub: null,
  allTodos: { open: false, owner: 'all', type: 'all', showCompleted: false },
  inboxOpen: false, showArchived: false, search: { open: false, query: '' }, rowSheet: null,
};

let toastTimer: ReturnType<typeof setTimeout> | undefined;
let idSeq = 0;
const newId = (prefix: string) => prefix + Date.now().toString(36) + (idSeq++).toString(36);

const noteTitle = (text: string) => text.split(/[.—]/)[0].slice(0, 34).trim();

export const useApp = create<AppState>()((set, get) => {
  const toast = (msg: string) => get().showToast(msg);
  const nameOf = (kind: 'project' | 'focus', id: string) =>
    (kind === 'project' ? get().projects : get().focuses).find(x => x.id === id)?.name ?? 'Item';

  return {
    /* ---------- data ---------- */
    projects: seed.projects,
    focuses: seed.focuses,
    todos: seed.todos,
    notes: seed.notes,
    docs: seed.storedDocs,
    inbox: seed.initialInbox,
    spotlight: seed.initialSpotlight,
    subitems: seed.subitemsMap,
    archivedResources: seed.archivedResources,
    archivedNotes: seed.archivedNotes,
    logToday: { h1: 'done' },
    nameOverrides: {}, moduleOrder: {}, moduleOff: {}, noteLinks: {}, docDrafts: {}, aiExcluded: {},
    permissions: seed.initialPermissions,
    confirmWrites: true,
    aiTone: 'balanced',

    /* ---------- ui ---------- */
    theme: 'dark',
    tab: 'dashboard',
    navCollapsed: false,
    toast: null,
    selectedDate: seed.TODAY,
    myWeek: { open: false, offset: 0, mode: 'week', dayIndex: mondayIndex(seed.TODAY) },
    calendar: { open: false, monthOffset: 0 },
    allTodos: { open: false, owner: 'all', type: 'all', showCompleted: false },
    inboxOpen: false,
    seeAll: null,
    showArchived: false,
    accountSub: null,
    archiveClosed: {},
    noteFilters: [],
    search: { open: false, query: '' },
    detail: null, detailEdit: false, detailMore: false, addModuleOpen: false, renameDraft: null, peek: null,
    ai: { open: false, showRecent: false, input: '', quickInput: '', turn: 0, messages: seed.initialAiMessages },
    quick: emptyQuick,
    rowSheet: null,
    rowSheetStep: 'actions',

    /* ---------- general ---------- */
    showToast(msg) {
      set({ toast: msg });
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => set({ toast: null }), 2200);
    },
    setTheme: theme => set({ theme }),
    setTab: tab => set({ tab, ...closedOverlays }),
    setNavCollapsed: navCollapsed => set({ navCollapsed }),

    /* ---------- todos & logging ---------- */
    toggleTodo: id => set(s => ({ todos: s.todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)) })),
    setTodoTitle: (id, title) => set(s => ({ todos: s.todos.map(t => (t.id === id ? { ...t, title } : t)) })),
    setTodoDue: (id, label) => set(s => ({
      todos: s.todos.map(t => {
        if (t.id !== id) return t;
        if (label === 'None') return { ...t, due: null, type: 'general', bucket: 'nodate' };
        const bucket = label === 'Today' ? 'today' : label === 'Next week' ? 'later' : 'week';
        return { ...t, due: label, type: 'deadline', bucket };
      }),
    })),
    moveTodo(id, owner, project) {
      set(s => ({ todos: s.todos.map(t => (t.id === id ? { ...t, owner, project } : t)), peek: null }));
      toast('Moved to ' + owner);
    },
    deleteTodo(id) {
      set(s => ({ todos: s.todos.filter(t => t.id !== id), peek: null }));
      toast('Todo deleted');
    },
    toggleLog(key, label) {
      const wasDone = get().logToday[key] === 'done';
      set(s => ({ logToday: { ...s.logToday, [key]: wasDone ? undefined : 'done' } }));
      toast(wasDone ? label + ' — unlogged' : label + ' logged for today');
    },
    setLog: (key, mark) => set(s => ({ logToday: { ...s.logToday, [key]: s.logToday[key] === mark ? undefined : mark } })),
    toggleSubitem: (cid, i) => set(s => ({
      subitems: { ...s.subitems, [cid]: (s.subitems[cid] || []).map((x, j) => (j === i ? { ...x, done: !x.done } : x)) },
    })),

    /* ---------- calendar ---------- */
    openMyWeek: () => set(s => ({ myWeek: { ...s.myWeek, open: true, offset: 0, mode: 'week' } })),
    closeMyWeek: () => set(s => ({ myWeek: { ...s.myWeek, open: false } })),
    setWeekMode: mode => set(s => ({ myWeek: { ...s.myWeek, mode } })),
    setWeekDay: dayIndex => set(s => ({ myWeek: { ...s.myWeek, mode: 'day', dayIndex } })),
    stepWeek: d => set(s => ({ myWeek: { ...s.myWeek, offset: s.myWeek.offset + d } })),
    stepDay: d => set(s => {
      const next = s.myWeek.dayIndex + d;
      if (next < 0) return { myWeek: { ...s.myWeek, dayIndex: 6, offset: s.myWeek.offset - 1 } };
      if (next > 6) return { myWeek: { ...s.myWeek, dayIndex: 0, offset: s.myWeek.offset + 1 } };
      return { myWeek: { ...s.myWeek, dayIndex: next } };
    }),
    openCalendar: () => set({ calendar: { open: true, monthOffset: 0 } }),
    closeCalendar: () => set(s => ({ calendar: { ...s.calendar, open: false } })),
    stepMonth: d => set(s => ({ calendar: { ...s.calendar, monthOffset: s.calendar.monthOffset + d } })),
    selectDay: date => set(s => ({
      selectedDate: date,
      calendar: { ...s.calendar, open: false },
      myWeek: { open: true, mode: 'day', offset: weekOffsetBetween(seed.TODAY, date), dayIndex: mondayIndex(date) },
    })),
    viewWeekFromCalendar: () => set(s => ({
      calendar: { ...s.calendar, open: false },
      myWeek: { ...s.myWeek, open: true, mode: 'week', offset: weekOffsetBetween(seed.TODAY, s.selectedDate) },
    })),

    /* ---------- tier 2 ---------- */
    openAllTodos: owner => set({
      allTodos: { open: true, owner: owner || 'all', type: 'all', showCompleted: false },
      search: { open: false, query: '' },
    }),
    closeAllTodos: () => set(s => ({ allTodos: { ...s.allTodos, open: false } })),
    setTodoFilter: patch => set(s => ({ allTodos: { ...s.allTodos, ...patch } })),
    toggleCompletedTodos: () => set(s => ({ allTodos: { ...s.allTodos, showCompleted: !s.allTodos.showCompleted } })),
    openInbox: () => set({ inboxOpen: true }),
    closeInbox: () => set({ inboxOpen: false }),
    resolveInbox(id, manual) {
      const item = get().inbox.find(i => i.id === id);
      set(s => ({ inbox: s.inbox.filter(i => i.id !== id) }));
      if (item) toast(manual ? 'Filed manually' : 'Filed — ' + item.guess);
    },
    openSeeAll: seeAll => set({ seeAll, showArchived: false, search: { open: false, query: '' } }),
    closeSeeAll: () => set({ seeAll: null }),
    toggleArchived: () => set(s => ({ showArchived: !s.showArchived })),
    openAccountSub: accountSub => set({ accountSub, search: { open: false, query: '' }, noteFilters: [] }),
    closeAccountSub: () => set({ accountSub: null }),
    openFullArchive: () => set({ seeAll: null, tab: 'account', accountSub: 'archive', search: { open: false, query: '' } }),
    toggleArchiveGroup: id => set(s => ({ archiveClosed: { ...s.archiveClosed, [id]: !s.archiveClosed[id] } })),
    toggleNoteFilter: t => set(s => ({
      noteFilters: s.noteFilters.includes(t) ? s.noteFilters.filter(x => x !== t) : [...s.noteFilters, t],
    })),
    clearNoteFilters: () => set({ noteFilters: [] }),
    toggleSearch: () => set(s => ({ search: { open: !s.search.open, query: s.search.open ? '' : s.search.query } })),
    setQuery: query => set(s => ({ search: { ...s.search, query } })),

    /* ---------- tier 3 ---------- */
    openDetail: (kind, id) => set(s => ({
      detail: { kind, id }, detailEdit: false, detailMore: false, addModuleOpen: false, renameDraft: null, peek: null,
      rowSheet: null, ai: { ...s.ai, open: false },
    })),
    closeDetail: () => set({ detail: null, detailEdit: false, addModuleOpen: false, renameDraft: null, peek: null }),
    toggleDetailEdit() {
      const { detailEdit, detail, renameDraft } = get();
      if (!detailEdit) { set({ detailEdit: true, renameDraft: null }); return; }
      set(s => ({
        detailEdit: false, addModuleOpen: false, renameDraft: null,
        nameOverrides: detail && renameDraft?.trim()
          ? { ...s.nameOverrides, [detail.kind + ':' + detail.id]: renameDraft.trim() }
          : s.nameOverrides,
      }));
      toast('Changes saved');
    },
    toggleDetailMore: () => set(s => ({ detailMore: !s.detailMore })),
    setRenameDraft: renameDraft => set({ renameDraft }),
    toggleAddModule: () => set(s => ({ addModuleOpen: !s.addModuleOpen })),
    addModule: (cid, mid) => set(s => {
      const cur = moduleList(s, cid);
      if (!cur.includes(mid)) cur.push(mid);
      const off = { ...s.moduleOff };
      delete off[cid + ':' + mid];
      return { moduleOrder: { ...s.moduleOrder, [cid]: cur }, moduleOff: off, addModuleOpen: false };
    }),
    toggleModule: (cid, mid) => set(s => ({ moduleOff: { ...s.moduleOff, [cid + ':' + mid]: !s.moduleOff[cid + ':' + mid] } })),
    moveModule: (cid, mid, dir) => set(s => {
      const cur = moduleList(s, cid);
      const i = cur.indexOf(mid), j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return {};
      [cur[i], cur[j]] = [cur[j], cur[i]];
      return { moduleOrder: { ...s.moduleOrder, [cid]: cur } };
    }),
    toggleAiExclude: key => set(s => ({ aiExcluded: { ...s.aiExcluded, [key]: !s.aiExcluded[key] } })),
    addNoteLink(noteId, topic) {
      set(s => ({ noteLinks: { ...s.noteLinks, [noteId]: [...topicsOf(s, noteId), topic] } }));
      toast('Also linked to ' + topic);
    },
    removeNoteLink: (noteId, topic) => set(s => ({
      noteLinks: { ...s.noteLinks, [noteId]: topicsOf(s, noteId).filter(t => t !== topic) },
    })),
    setDocDraft: (docId, text) => set(s => ({ docDrafts: { ...s.docDrafts, [docId]: text } })),
    openPeek: peek => set({ peek }),
    closePeek: () => set({ peek: null }),

    /* ---------- lifecycle: archive / restore / delete ---------- */
    archiveContainer(kind, id) {
      const name = nameOf(kind, id);
      if (kind === 'project') set(s => ({ projects: s.projects.map(p => (p.id === id ? { ...p, archived: true, archivedOn: 'today', pinned: false } : p)) }));
      else set(s => ({ focuses: s.focuses.map(f => (f.id === id ? { ...f, archived: true, archivedOn: 'today', pinned: false } : f)) }));
      toast(name + ' moved to Archive');
    },
    restoreContainer(kind, id) {
      const name = nameOf(kind, id);
      if (kind === 'project') set(s => ({ projects: s.projects.map(p => (p.id === id ? { ...p, archived: false } : p)) }));
      else set(s => ({ focuses: s.focuses.map(f => (f.id === id ? { ...f, archived: false } : f)) }));
      toast(name + ' restored');
    },
    archiveNote(id) {
      const note = get().notes.find(n => n.id === id);
      if (!note) return;
      set(s => ({
        notes: s.notes.filter(n => n.id !== id),
        archivedNotes: [{ id: note.id, name: noteTitle(note.text), meta: 'Archived today', note }, ...s.archivedNotes],
      }));
      toast('Note moved to Archive');
    },
    archiveDoc(id) {
      const doc = get().docs.find(d => d.id === id);
      if (!doc) return;
      set(s => ({
        docs: s.docs.filter(d => d.id !== id),
        archivedResources: [{ id: doc.id, name: doc.title, meta: 'AI document · archived today', doc }, ...s.archivedResources],
      }));
      toast(doc.title + ' moved to Archive');
    },
    restoreArchived(id) {
      const s = get();
      const project = s.projects.find(p => p.id === id && p.archived);
      if (project) return s.restoreContainer('project', id);
      const focus = s.focuses.find(f => f.id === id && f.archived);
      if (focus) return s.restoreContainer('focus', id);
      const entry = [...s.archivedNotes, ...s.archivedResources].find(e => e.id === id);
      if (!entry) return;
      set(st => ({
        archivedNotes: st.archivedNotes.filter(e => e.id !== id),
        archivedResources: st.archivedResources.filter(e => e.id !== id),
        notes: entry.note ? [entry.note, ...st.notes] : st.notes,
        docs: entry.doc ? [entry.doc, ...st.docs] : st.docs,
      }));
      toast(entry.name + ' restored');
    },
    deleteItem({ kind, id, name }) {
      set(s => ({
        projects: kind === 'project' ? s.projects.filter(p => p.id !== id) : s.projects,
        focuses: kind === 'focus' ? s.focuses.filter(f => f.id !== id) : s.focuses,
        notes: kind === 'note' ? s.notes.filter(n => n.id !== id) : s.notes,
        docs: kind === 'doc' ? s.docs.filter(d => d.id !== id) : s.docs,
        detail: s.detail?.id === id ? null : s.detail,
      }));
      toast(name + ' deleted permanently');
    },
    setProjectStatus(id, status) {
      set(s => ({ projects: s.projects.map(p => (p.id === id ? { ...p, status, progress: status === 'completed' ? 100 : p.progress } : p)) }));
    },
    setFocusPaused(id, paused) {
      set(s => ({ focuses: s.focuses.map(f => (f.id === id ? { ...f, paused } : f)) }));
    },
    togglePin(kind, id) {
      if (kind === 'project') set(s => ({ projects: s.projects.map(p => (p.id === id ? { ...p, pinned: !p.pinned } : p)) }));
      else set(s => ({ focuses: s.focuses.map(f => (f.id === id ? { ...f, pinned: !f.pinned } : f)) }));
    },

    openRowSheet: rowSheet => set({ rowSheet, rowSheetStep: 'actions' }),
    closeRowSheet: () => set({ rowSheet: null, rowSheetStep: 'actions' }),
    setRowSheetStep: rowSheetStep => set({ rowSheetStep }),

    /* ---------- AI chat ---------- */
    openAiChat: prefill => set(s => ({ ai: { ...s.ai, open: true, input: prefill ?? s.ai.input } })),
    openAiChatWithInsight: () => set(s => ({
      ai: {
        ...s.ai, open: true,
        messages: [{ id: 'insight', role: 'ai', text: seed.DASHBOARD_INSIGHT_CHAT }, ...s.ai.messages.filter(m => m.id !== 'insight')],
      },
    })),
    closeAiChat: () => set(s => ({ ai: { ...s.ai, open: false } })),
    toggleRecentChats: () => set(s => ({ ai: { ...s.ai, showRecent: !s.ai.showRecent } })),
    setAiInput: input => set(s => ({ ai: { ...s.ai, input } })),
    setAiQuickInput: quickInput => set(s => ({ ai: { ...s.ai, quickInput } })),
    sendQuickAi() {
      const text = get().ai.quickInput.trim();
      set(s => ({ ai: { ...s.ai, quickInput: '', open: true, input: text || s.ai.input } }));
      if (text) get().sendAiMessage();
    },
    sendAiMessage() {
      const { ai } = get();
      const text = ai.input.trim();
      if (!text) return;
      const reply = seed.aiScript[ai.turn % seed.aiScript.length];
      set(s => ({ ai: { ...s.ai, input: '', turn: s.ai.turn + 1, messages: [...s.ai.messages, { id: newId('u'), role: 'user', text }] } }));
      setTimeout(() => {
        const ask = reply.hasConfirm && get().confirmWrites;
        set(s => ({
          ai: { ...s.ai, messages: [...s.ai.messages, { id: newId('a'), role: 'ai', text: reply.text, hasConfirm: ask, confirmMsg: reply.confirmMsg }] },
        }));
        if (reply.hasConfirm && !ask && reply.confirmMsg) {
          const msg = reply.confirmMsg;
          setTimeout(() => set(s => ({ ai: { ...s.ai, messages: [...s.ai.messages, { id: newId('a'), role: 'ai', text: msg }] } })), 450);
        }
      }, 500);
    },
    resolveAiConfirm: (messageId, accept) => set(s => {
      const msg = s.ai.messages.find(m => m.id === messageId);
      const messages = s.ai.messages.map(m => (m.id === messageId ? { ...m, hasConfirm: false } : m));
      if (accept && msg?.confirmMsg) messages.push({ id: newId('a'), role: 'ai', text: msg.confirmMsg });
      return { ai: { ...s.ai, messages } };
    }),
    openAiSettings: () => set(s => ({ ai: { ...s.ai, open: false }, tab: 'account', accountSub: 'ai', detail: null })),
    openDocsFromChat: () => set(s => ({ ai: { ...s.ai, open: false }, tab: 'account', accountSub: 'docs', detail: null })),

    /* ---------- quick add ---------- */
    openQuickAdd: () => set(s => ({ quick: { ...s.quick, mode: 'menu' } })),
    closeQuickAdd: () => set({ quick: emptyQuick }),
    pickQuickType(type) {
      if (type === 'ai') { set({ quick: emptyQuick }); get().openAiChat(); return; }
      if (type === 'todo' || type === 'note') set(s => ({ quick: { ...s.quick, mode: type } }));
      else if (type === 'focus') set(s => ({ quick: { ...s.quick, mode: 'focus', focusStart: 'now' } }));
      else set(s => ({ quick: { ...s.quick, mode: 'generic', type } }));
    },
    setQuick: patch => set(s => ({ quick: { ...s.quick, ...patch } })),
    saveQuickTodo() {
      const { title, owner, deadline } = get().quick;
      if (title.trim()) {
        const project = get().projects.find(p => p.name === owner)?.id ?? null;
        const todo: Todo = deadline
          ? { id: newId('t'), title: title.trim(), owner, project, done: false, type: 'deadline', due: 'Today', bucket: 'today' }
          : { id: newId('t'), title: title.trim(), owner, project, done: false, type: 'general', bucket: 'nodate' };
        set(s => ({ todos: [...s.todos, todo] }));
      }
      set({ quick: emptyQuick });
      toast('Todo added');
    },
    saveQuickFocus() {
      const { title, focusStart } = get().quick;
      if (title.trim()) {
        const focus: Focus = {
          id: newId('f'), name: title.trim(), scored: false, pinned: false, paused: focusStart === 'someday', archived: false,
          card: { kind: 'text', caption: 'About', text: focusStart === 'staggered' ? 'Easing in — one small step at a time.' : 'Just started.' },
          lastLog: 'no entries yet',
        };
        set(s => ({ focuses: [...s.focuses, focus] }));
      }
      const labels: Record<FocusStart, string> = { now: 'starting now', staggered: 'easing in gradually', someday: 'queued for later' };
      set({ quick: emptyQuick });
      toast('Focus added — ' + labels[focusStart]);
    },
    saveQuickGeneric() {
      const { type, title } = get().quick;
      if (type === 'project' && title.trim()) {
        const project: Project = {
          id: newId('p'), name: title.trim(), progress: 0, status: 'active', archived: false, pinned: false, goal: null,
          weekBars: [0, 0, 0, 0, 0, 0, 0], last: 'Created', lastWhen: 'just now', touched: 'just now',
        };
        set(s => ({ projects: [...s.projects, project] }));
      }
      const labels: Record<QuickAddType, string> = { project: 'Project', event: 'Calendar event', journal: 'Journal entry' };
      set({ quick: emptyQuick });
      toast((type ? labels[type] : 'Item') + ' added');
    },
    askAiSort: () => set(s => ({ quick: { ...s.quick, aiSuggestion: 'Project → Website Redesign' } })),
    fileNote(topic) {
      const text = get().quick.noteText.trim();
      if (text) set(s => ({ notes: [{ id: newId('n'), text, when: 'Just now', topics: [topic] }, ...s.notes] }));
      set({ quick: emptyQuick });
      toast('Filed to ' + topic);
    },
    sendNoteToInbox() {
      const text = get().quick.noteText.trim();
      if (text) set(s => ({ inbox: [...s.inbox, { id: newId('i'), text, guess: 'Unsorted' }] }));
      set({ quick: emptyQuick });
      toast('Saved to Inbox');
    },

    /* ---------- settings ---------- */
    togglePermission: (bucket, letter) => set(s => ({
      permissions: { ...s.permissions, [bucket]: { ...s.permissions[bucket], [letter]: !s.permissions[bucket][letter] } },
    })),
    toggleConfirmWrites: () => set(s => ({ confirmWrites: !s.confirmWrites })),
    setAiTone: aiTone => set({ aiTone }),
  };
});

/* ---------- shared selectors ---------- */

export function moduleList(s: Pick<DataState, 'moduleOrder'>, containerId: string): ModuleId[] {
  return (s.moduleOrder[containerId] || seed.defaultModules[containerId] || ['todos', 'notes']).slice();
}

export function topicsOf(s: Pick<DataState, 'noteLinks' | 'notes'>, noteId: string): string[] {
  return s.noteLinks[noteId] || s.notes.find(n => n.id === noteId)?.topics || [];
}

export function displayName(s: Pick<DataState, 'nameOverrides'>, kind: DetailKind, id: string, fallback: string): string {
  return s.nameOverrides[kind + ':' + id] || fallback;
}

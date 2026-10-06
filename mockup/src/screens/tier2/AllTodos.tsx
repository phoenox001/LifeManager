import { useApp } from '../../store/appStore';
import { dueLabel, todoBucket } from '../../domain/logic';
import type { Todo, TodoBucket } from '../../domain/types';
import {
  BackLink, Caps, Card, CheckCircle, CollapseHeader, Empty, FilterChips, GroupHeader, Overlay, SearchField, SearchTitleRow, z,
} from '../../components/ui';
import t2 from './tier2.module.css';

const GROUPS: { id: TodoBucket; label: string; color: string }[] = [
  { id: 'overdue', label: 'Overdue', color: 'var(--amber)' },
  { id: 'today', label: 'Today', color: 'var(--text)' },
  { id: 'week', label: 'This week', color: 'var(--text-ter)' },
  { id: 'later', label: 'Later', color: 'var(--text-ter)' },
  { id: 'nodate', label: 'No date', color: 'var(--text-ter)' },
];

export function AllTodos() {
  const st = useApp();
  const { open, owner, type, showCompleted } = st.allTodos;
  if (!open) return null;

  const q = st.search.query.trim().toLowerCase();
  const hit = (s: string) => !q || s.toLowerCase().includes(q);
  const owners = Array.from(new Set(st.todos.map(t => t.owner)));
  const pool = st.todos.filter(t =>
    (owner === 'all' || t.owner === owner) && (type === 'all' || t.type === type) && (hit(t.title) || hit(t.owner)));
  const groups = GROUPS.map(g => ({ ...g, rows: pool.filter(t => !t.done && todoBucket(t) === g.id) })).filter(g => g.rows.length > 0);
  const done = pool.filter(t => t.done);

  return (
    <Overlay zIndex={z.allTodos}>
      <BackLink label="Back" onClick={st.closeAllTodos} />
      <SearchTitleRow title="All todos" />
      <div className={t2.intro} style={{ lineHeight: 'normal' }}>Every todo in the app, wherever it lives.</div>
      <SearchField placeholder="Search todos" marginBottom={14} />

      <Caps style={{ letterSpacing: 0.5, marginBottom: 7 }}>Belongs to</Caps>
      <FilterChips
        style={{ marginBottom: 12 }}
        options={[{ value: 'all', label: 'All' }, ...owners.map(o => ({ value: o, label: o }))]}
        isActive={v => owner === v}
        onPick={v => st.setTodoFilter({ owner: v })}
      />
      <Caps style={{ letterSpacing: 0.5, marginBottom: 7 }}>Type</Caps>
      <FilterChips
        style={{ marginBottom: 6, flexWrap: 'nowrap' }}
        options={[{ value: 'all', label: 'All' }, { value: 'general', label: 'General' }, { value: 'deadline', label: 'Deadline' }] as const}
        isActive={v => type === v}
        onPick={v => st.setTodoFilter({ type: v })}
      />

      {groups.map(g => (
        <div key={g.id}>
          <GroupHeader label={g.label} count={g.rows.length} color={g.color} />
          <Card>{g.rows.map(t => <TodoRow key={t.id} todo={t} />)}</Card>
        </div>
      ))}

      {groups.length === 0 && <Empty>Nothing open here. That is allowed to feel good.</Empty>}

      {done.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <CollapseHeader label="Completed" count={done.length} open={showCompleted} onToggle={st.toggleCompletedTodos} />
          {showCompleted && <Card style={{ marginTop: 8 }}>{done.map(t => <TodoRow key={t.id} todo={t} />)}</Card>}
        </div>
      )}
    </Overlay>
  );
}

function TodoRow({ todo: t }: { todo: Todo }) {
  const toggleTodo = useApp(s => s.toggleTodo);
  return (
    <div className={t2.todoRow} onClick={() => toggleTodo(t.id)}>
      <CheckCircle done={t.done} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, color: t.done ? 'var(--text-ter)' : 'var(--text)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
        <div className="ellipsis" style={{ fontSize: 12, color: 'var(--text-ter)', marginTop: 2 }}>{t.owner + ' · ' + dueLabel(t)}</div>
      </div>
    </div>
  );
}

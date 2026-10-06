/** Tier 3 never goes deeper: a todo tapped inside a container peeks in this sheet. */
import { useApp } from '../../store/appStore';
import { SmallPlus } from '../../components/icons';
import { Caps, CheckCircle, Grabber, Sheet, z } from '../../components/ui';
import s from './detail.module.css';

const DUE_OPTIONS = ['Today', 'Fri', 'Next week', 'None'];

export function TodoPeek() {
  const st = useApp();
  const todo = st.todos.find(t => t.id === st.peek);
  if (!todo || !st.detail) return null;

  const accent = st.detail.kind === 'project' ? 'var(--proj)' : 'var(--focus)';
  const chipFill = todo.project ? 'var(--proj)' : 'var(--focus-fill)';
  const chipInk = todo.project ? 'var(--proj-fill-ink)' : 'var(--focus-fill-ink)';
  const dueNow = todo.due || 'None';
  const moveTargets = [
    ...st.projects.filter(p => !p.archived && p.status === 'active' && p.name !== todo.owner).slice(0, 2).map(p => ({ label: p.name, project: p.id as string | null })),
    ...(todo.owner === 'General' ? [] : [{ label: 'General', project: null }]),
  ];
  const notes = st.notes.filter(n => n.topics.includes(todo.owner)).slice(0, 2);
  const caps = { marginBottom: 9 };

  return (
    <Sheet zIndex={z.peek} onDismiss={st.closePeek} background="var(--bg)" padding="10px 20px 26px">
      <Grabber width={38} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13, marginBottom: 18 }}>
        <div style={{ marginTop: 3 }}><CheckCircle done={todo.done} color={accent} size={24} checkSize={12} onClick={() => st.toggleTodo(todo.id)} /></div>
        <input
          value={todo.title}
          onChange={e => st.setTodoTitle(todo.id, e.target.value)}
          style={{ flex: 1, minWidth: 0, fontSize: 19, fontWeight: 600, color: 'var(--text)', background: 'transparent', border: 'none', outline: 'none', padding: '2px 0' }}
        />
      </div>

      <Caps style={caps}>Due</Caps>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {DUE_OPTIONS.map(l => {
          const on = dueNow === l;
          return (
            <div key={l} className={s.dueChip} style={{ background: on ? chipFill : 'var(--surface)', color: on ? chipInk : 'var(--text)', border: `1px solid ${on ? chipFill : 'var(--border)'}` }} onClick={() => st.setTodoDue(todo.id, l)}>
              {l}
            </div>
          );
        })}
      </div>

      <Caps style={caps}>Lives in</Caps>
      <div className={s.ownerBox}>
        <div style={{ width: 7, height: 7, borderRadius: 4, background: todo.project ? 'var(--proj)' : 'var(--focus)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, fontSize: 14.5 }}>{todo.owner}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {moveTargets.map(m => (
          <div key={m.label} className={s.moveChip} onClick={() => st.moveTodo(todo.id, m.label, m.project)}>Move to {m.label}</div>
        ))}
      </div>

      <Caps style={caps}>Notes on this todo</Caps>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        {notes.map(n => (
          <div key={n.id} style={{ padding: '13px 15px', borderBottom: '1px solid var(--border)', fontSize: 13.5, lineHeight: 1.45, color: 'var(--text-sec)' }}>{n.text}</div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 15px', cursor: 'pointer' }} onClick={() => st.showToast('Note added to this todo')}>
          <SmallPlus size={11} />
          <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>Add a note</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div className={s.peekButton} onClick={st.closePeek}>Done</div>
        <div className={s.peekButton} style={{ color: 'var(--text-sec)' }} onClick={() => st.deleteTodo(todo.id)}>Delete</div>
      </div>
    </Sheet>
  );
}

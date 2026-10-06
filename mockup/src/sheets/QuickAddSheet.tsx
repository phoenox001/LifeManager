/** The plus button: one sheet for adding anything, with an AI-sort path for loose notes. */
import { useApp, type FocusStart, type QuickAddType } from '../store/appStore';
import { Grabber, PrimaryButton, Sheet, Toggle, z } from '../components/ui';

type MenuKey = 'todo' | 'note' | 'focus' | QuickAddType | 'ai';

const MENU: { key: MenuKey; label: string; icon: string; color: string }[] = [
  { key: 'todo', label: 'Todo', icon: '✓', color: 'var(--accent1)' },
  { key: 'project', label: 'Project', icon: '▤', color: 'var(--proj)' },
  { key: 'focus', label: 'Focus', icon: '◎', color: 'var(--focus)' },
  { key: 'event', label: 'Calendar event', icon: '▢', color: 'var(--accent2)' },
  { key: 'journal', label: 'Journal entry', icon: '✎', color: 'var(--accent1)' },
  { key: 'note', label: 'Freeform note', icon: '≡', color: 'var(--accent2)' },
  { key: 'ai', label: 'Ask AI', icon: 'AI', color: 'var(--accent2)' },
];

const GENERIC_TITLE: Record<QuickAddType, string> = { project: 'New project', event: 'New calendar event', journal: 'New journal entry' };
const OWNERS = ['Website Redesign', 'General'];
const STARTS: { key: FocusStart; label: string }[] = [{ key: 'now', label: 'Start now' }, { key: 'staggered', label: 'Ease in' }, { key: 'someday', label: 'Someday' }];

const title = { fontSize: 18, fontWeight: 700, marginBottom: 16 } as const;
const label = { fontSize: 12.5, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 8 } as const;
const field: React.CSSProperties = {
  width: '100%', padding: 14, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface2)',
  color: 'var(--text)', fontSize: 15, marginBottom: 14, outline: 'none',
};
const half = (bg: string, fg: string, big = false): React.CSSProperties => ({
  flex: 1, textAlign: 'center', padding: big ? 15 : 10, borderRadius: big ? 16 : 12, background: bg, color: fg,
  fontSize: big ? 15 : 13.5, fontWeight: 700, cursor: 'pointer',
});

export function QuickAddSheet() {
  const st = useApp();
  const q = st.quick;
  if (!q.mode) return null;

  const ownerChips = (marginBottom: number) => (
    <div style={{ display: 'flex', gap: 8, marginBottom }}>
      {OWNERS.map(o => {
        const on = q.owner === o;
        return (
          <div key={o} style={{ padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: on ? 'var(--accent1)' : 'var(--surface2)', color: on ? '#fff' : 'var(--text)' }} onClick={() => st.setQuick({ owner: o })}>
            {o}
          </div>
        );
      })}
    </div>
  );

  return (
    <Sheet zIndex={z.quickAdd} onDismiss={st.closeQuickAdd} padding="20px 20px 30px" maxHeight="78%">
      <Grabber marginBottom={18} />

      {q.mode === 'menu' && (
        <>
          <div style={title}>Add something</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {MENU.map(m => (
              <div key={m.key} style={{ background: 'var(--surface2)', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer' }} onClick={() => st.pickQuickType(m.key)}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 15, fontWeight: 700 }}>{m.icon}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {q.mode === 'todo' && (
        <>
          <div style={title}>New todo</div>
          <input style={field} value={q.title} placeholder="What needs doing?" autoFocus onChange={e => st.setQuick({ title: e.target.value })} />
          <div style={label}>Belongs to</div>
          {ownerChips(14)}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px', marginBottom: 18, cursor: 'pointer' }} onClick={() => st.setQuick({ deadline: !q.deadline })}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Has a deadline</div>
            <Toggle on={q.deadline} onColor="var(--accent1)" />
          </div>
          <PrimaryButton onClick={st.saveQuickTodo}>Save todo</PrimaryButton>
        </>
      )}

      {q.mode === 'note' && (
        <>
          <div style={title}>Freeform note</div>
          <textarea style={{ ...field, height: 96, marginBottom: 16, resize: 'none' }} value={q.noteText} placeholder="Dump a thought — sort it later, or now." autoFocus onChange={e => st.setQuick({ noteText: e.target.value })} />
          {q.aiSuggestion ? (
            <div style={{ padding: 14, borderRadius: 14, background: 'var(--accent2-soft)', marginBottom: 16 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent2)', marginBottom: 4 }}>AI suggests</div>
              <div style={{ fontSize: 14, marginBottom: 12 }}>{q.aiSuggestion}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={half('var(--accent2)', '#fff')} onClick={() => st.fileNote('Website Redesign')}>Confirm</div>
                <div style={half('var(--surface2)', 'var(--text)')} onClick={st.closeQuickAdd}>Choose myself</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <div style={half('var(--accent2)', '#fff', true)} onClick={st.askAiSort}>Ask AI to sort</div>
                <div style={half('var(--surface2)', 'var(--text)', true)} onClick={() => st.fileNote('General')}>File myself</div>
              </div>
              <div style={{ textAlign: 'center', padding: 12, fontSize: 13.5, fontWeight: 600, color: 'var(--text-sec)', cursor: 'pointer' }} onClick={st.sendNoteToInbox}>Not now — send to Inbox</div>
            </>
          )}
        </>
      )}

      {q.mode === 'focus' && (
        <>
          <div style={title}>New focus</div>
          <input style={field} value={q.title} placeholder="Habit or standing category" autoFocus onChange={e => st.setQuick({ title: e.target.value })} />
          <div style={label}>Start</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {STARTS.map(o => {
              const on = q.focusStart === o.key;
              return (
                <div key={o.key} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', borderRadius: 14, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: on ? 'var(--accent1)' : 'var(--surface2)', color: on ? '#fff' : 'var(--text)' }} onClick={() => st.setQuick({ focusStart: o.key })}>
                  {o.label}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-ter)', marginBottom: 20 }}>Install new habits gradually — no need to start everything at once.</div>
          <PrimaryButton onClick={st.saveQuickFocus}>Create focus</PrimaryButton>
        </>
      )}

      {q.mode === 'generic' && q.type && (
        <>
          <div style={title}>{GENERIC_TITLE[q.type]}</div>
          <input style={field} value={q.title} placeholder="Name it" autoFocus onChange={e => st.setQuick({ title: e.target.value })} />
          <div style={label}>Belongs to</div>
          {ownerChips(20)}
          <PrimaryButton onClick={st.saveQuickGeneric}>Save</PrimaryButton>
        </>
      )}
    </Sheet>
  );
}

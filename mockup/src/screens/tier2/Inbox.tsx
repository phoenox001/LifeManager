import { useApp } from '../../store/appStore';
import { BackLink, Overlay, PageTitle, z } from '../../components/ui';

export function Inbox() {
  const st = useApp();
  if (!st.inboxOpen) return null;
  return (
    <Overlay zIndex={z.inbox}>
      <BackLink label="Account" onClick={st.closeInbox} />
      <PageTitle style={{ marginBottom: 6 }}>Inbox</PageTitle>
      <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginBottom: 20 }}>Unsorted quick-adds — review and file when ready.</div>

      {st.inbox.map(item => (
        <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 14, marginBottom: 12 }}>{item.text}</div>
          <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--accent2-soft)', marginBottom: 12 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent2)', marginBottom: 2 }}>AI guesses</div>
            <div style={{ fontSize: 13 }}>{item.guess}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={btn('var(--accent2)', '#fff')} onClick={() => st.resolveInbox(item.id, false)}>Confirm</div>
            <div style={btn('var(--surface2)', 'var(--text)')} onClick={() => st.resolveInbox(item.id, true)}>Choose myself</div>
          </div>
        </div>
      ))}
      {st.inbox.length === 0 && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-ter)', fontSize: 14 }}>Inbox is clear.</div>}
    </Overlay>
  );
}

const btn = (bg: string, fg: string): React.CSSProperties => ({
  flex: 1, textAlign: 'center', padding: 10, borderRadius: 12, background: bg, color: fg, fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
});

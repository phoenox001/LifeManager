/** Integrated AI chat with scripted replies. Writes respect "Confirm before AI writes". */
import { useApp } from '../../store/appStore';
import { recentChats } from '../../data/seed';
import { ChevronLeft, ClockIcon, DocIcon, GearIcon, SendArrow } from '../../components/icons';
import { CircleButton, z } from '../../components/ui';

export function AiChat() {
  const st = useApp();
  const { ai } = st;
  if (!ai.open) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: z.aiChat, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 58, flexShrink: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-sec)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={st.closeAiChat}>
          <ChevronLeft /> Close
        </div>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Ask AI</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CircleButton size={32} onClick={st.toggleRecentChats}><ClockIcon size={15} /></CircleButton>
          <CircleButton size={32} onClick={st.openDocsFromChat}><DocIcon size={15} /></CircleButton>
          <CircleButton size={32} onClick={st.openAiSettings}><GearIcon /></CircleButton>
        </div>
      </div>

      {ai.showRecent && (
        <div style={{ margin: '0 20px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '10px 14px', fontSize: 11.5, fontWeight: 700, color: 'var(--text-ter)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Recent chats</div>
          {recentChats.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderTop: '1px solid var(--border)', cursor: 'pointer' }} onClick={st.toggleRecentChats}>
              <div style={{ fontSize: 13.5 }}>{r.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-ter)' }}>{r.when}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
        {ai.messages.map(m => {
          const mine = m.role === 'user';
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
              <div style={{ maxWidth: '82%' }}>
                <div style={{ padding: '12px 14px', borderRadius: 16, background: mine ? 'var(--accent1)' : 'var(--surface)', color: mine ? '#fff' : 'var(--text)', fontSize: 14, lineHeight: 1.4 }}>{m.text}</div>
                {m.widgetLabels && (
                  <div style={{ marginTop: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                    {m.widgetLabels.map(l => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent1)', flexShrink: 0 }} />
                        <div style={{ fontSize: 13, flex: 1 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
                {m.hasConfirm && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <div style={choice('var(--accent2)', '#fff')} onClick={() => st.resolveAiConfirm(m.id, true)}>Confirm</div>
                    <div style={choice('var(--surface2)', 'var(--text)')} onClick={() => st.resolveAiConfirm(m.id, false)}>Not now</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flexShrink: 0, display: 'flex', gap: 10, padding: '14px 20px 26px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <input
          value={ai.input}
          onChange={e => st.setAiInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') st.sendAiMessage(); }}
          placeholder="Ask about your day, projects, habits…"
          autoFocus
          style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 14, outline: 'none' }}
        />
        <div style={{ width: 42, height: 42, borderRadius: 14, background: 'var(--accent1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} onClick={st.sendAiMessage} aria-label="Send">
          <SendArrow />
        </div>
      </div>
    </div>
  );
}

const choice = (bg: string, fg: string): React.CSSProperties => ({
  flex: 1, textAlign: 'center', padding: 10, borderRadius: 12, background: bg, color: fg, fontSize: 13, fontWeight: 700, cursor: 'pointer',
});

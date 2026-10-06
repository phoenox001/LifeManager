import { useApp } from '../../store/appStore';
import { logCaption, ringColorFor, trendLabel } from '../../domain/logic';
import { focusLogItems } from '../../domain/selectors';
import { Check, ChevronRight, ListIcon } from '../../components/icons';
import { CircleButton, Ring } from '../../components/ui';
import s from './tier1.module.css';

export function Focuses() {
  const st = useApp();
  const active = st.focuses.filter(f => !f.archived);
  const topScored = active.filter(f => f.scored).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 3);
  const pinned = active.filter(f => f.pinned);
  const nameOf = (id: string, name: string) => st.nameOverrides['focus:' + id] || name;

  return (
    <div className={s.page}>
      <div className={s.titleBar}>
        <div className={s.bigTitle}>Focuses</div>
        <CircleButton onClick={() => st.openSeeAll('focuses')}><ListIcon /></CircleButton>
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Top momentum</div>
      <div style={{ fontSize: 12, color: 'var(--text-ter)', marginBottom: 10 }}>Scored Focuses only · trend, not a grade — dips recover.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {topScored.map(f => (
          <div key={f.id} className={s.momentumRow}>
            <Ring pct={f.score ?? 0} color={ringColorFor(f.score ?? 0)} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }} onClick={() => st.openDetail('focus', f.id)}>{nameOf(f.id, f.name)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-sec)' }}>{trendLabel(f)}</div>
            </div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{f.score}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Pinned</div>
      <div className={s.stack12} style={{ marginBottom: 20 }}>
        {pinned.map(f => {
          const items = focusLogItems(f, st.logToday);
          const logged = items.filter(i => i.mark === 'done').length;
          return (
            <div key={f.id} className={s.bigCard}>
              <div className={s.cardHead}>
                <div className={s.cardTitle} onClick={() => st.openDetail('focus', f.id)}>{nameOf(f.id, f.name)}</div>
                {f.scored && <div style={{ fontSize: 15, fontWeight: 700, color: ringColorFor(f.score ?? 0) }}>{f.score}</div>}
              </div>
              {items.length > 0 && (
                <>
                  <div style={{ fontSize: 12.5, color: 'var(--text-sec)', marginBottom: 12 }}>{trendLabel(f)}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-ter)', marginBottom: 8 }}>
                    {logCaption(logged, items.length)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map(li => {
                      const done = li.mark === 'done';
                      const ink = done ? 'var(--focus-fill-ink)' : 'var(--text)';
                      return (
                        <div key={li.key} className={s.logRow} onClick={() => st.toggleLog(li.key, li.label)}>
                          <div className="ellipsis" style={{ fontSize: 13.5, minWidth: 0 }}>{li.label}</div>
                          <div className={s.logChip} style={{ border: `1.5px solid ${done ? 'var(--focus-fill)' : 'var(--border)'}`, background: done ? 'var(--focus-fill)' : 'transparent', color: ink }}>
                            <Check color={ink} />
                            {done ? 'Logged' : 'Log'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {f.summary && (
                <>
                  <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginBottom: 10, marginTop: items.length ? 16 : 0 }}>{f.summary.note}</div>
                  <div className={s.aiBox}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent2)', flexShrink: 0 }}>AI</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{f.summary.ai}</div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={s.seeAll} onClick={() => st.openSeeAll('focuses')}>
        <div>See all Focuses</div>
        <ChevronRight />
      </div>
    </div>
  );
}

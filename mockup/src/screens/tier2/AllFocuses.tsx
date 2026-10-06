import { useApp } from '../../store/appStore';
import { ringColorFor, trendLabel } from '../../domain/logic';
import { focusLogItems, focusStatus } from '../../domain/selectors';
import type { Focus } from '../../domain/types';
import { Check, ChevronRight } from '../../components/icons';
import {
  BackLink, Card, CollapseHeader, Empty, GroupHeader, MetaRowCard, Overlay, RowCardHead, RowSection, SearchField,
  SearchTitleRow, Stack, z,
} from '../../components/ui';
import t2 from './tier2.module.css';

export function AllFocuses() {
  const st = useApp();
  if (st.seeAll !== 'focuses') return null;

  const q = st.search.query.trim().toLowerCase();
  const hit = (s: string) => !q || s.toLowerCase().includes(q);
  const name = (f: Focus) => st.nameOverrides['focus:' + f.id] || f.name;
  const pool = st.focuses.filter(f => hit(name(f)));
  const blocks = (['active', 'paused'] as const)
    .map(status => ({ status, rows: pool.filter(f => focusStatus(f) === status) }))
    .filter(b => b.rows.length > 0);
  const archived = pool.filter(f => f.archived);

  return (
    <Overlay zIndex={z.seeAll}>
      <BackLink label="Focuses" onClick={st.closeSeeAll} style={{ marginBottom: 14 }} />
      <SearchTitleRow title="All Focuses" />
      <div className={t2.intro}>Grouped by status. Tap a title to open it, log straight from the card, “…” to manage.</div>
      <SearchField placeholder="Search focuses" />

      {blocks.map(b => (
        <div key={b.status}>
          <GroupHeader label={b.status === 'active' ? 'Active' : 'Paused'} count={b.rows.length} color={b.status === 'active' ? 'var(--text)' : 'var(--text-ter)'} margin="14px 0 8px" />
          <Stack>{b.rows.map(f => <FocusCard key={f.id} focus={f} name={name(f)} />)}</Stack>
        </div>
      ))}

      {blocks.length === 0 && archived.length === 0 && <Empty>Nothing matches that search.</Empty>}

      {archived.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <CollapseHeader label="Archived" count={archived.length} open={st.showArchived} onToggle={st.toggleArchived} />
          {st.showArchived && (
            <Stack style={{ marginTop: 8 }}>
              {archived.map(f => (
                <MetaRowCard
                  key={f.id}
                  name={name(f)}
                  meta={'Paused · archived ' + (f.archivedOn ?? '')}
                  dotColor="var(--text-ter)"
                  onOpen={() => st.openDetail('focus', f.id)}
                  onMore={() => st.openRowSheet({ kind: 'archived', id: f.id, name: name(f) })}
                />
              ))}
              <div className={t2.fullArchive} onClick={st.openFullArchive}>
                <div>Open the full Archive</div>
                <ChevronRight size={11} />
              </div>
            </Stack>
          )}
        </div>
      )}
    </Overlay>
  );
}

/** Header · score and status · what is relevant now (log items, a recent note, or an evergreen line). */
function FocusCard({ focus: f, name }: { focus: Focus; name: string }) {
  const st = useApp();
  const active = focusStatus(f) === 'active';
  const items = focusLogItems(f, st.logToday);
  const text = f.card.kind !== 'log' ? f.card : null;
  const statusLine = f.scored ? trendLabel(f) + ' · ' + f.lastLog : 'Not scored · ' + (f.lastLog || 'no entries yet');

  return (
    <Card style={{ opacity: active ? 1 : 0.8 }}>
      <RowCardHead name={name} dotColor="var(--focus)" onOpen={() => st.openDetail('focus', f.id)} onMore={() => st.openRowSheet({ kind: 'focus', id: f.id, name })} />
      <RowSection style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {f.scored && <div className={t2.score} style={{ color: ringColorFor(f.score ?? 0) }}>{f.score}</div>}
        <div className={t2.status}>{statusLine}</div>
      </RowSection>
      {items.length > 0 && (
        <RowSection style={{ padding: '9px 14px 10px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map(li => {
            const done = li.mark === 'done';
            const ink = done ? 'var(--focus-fill-ink)' : 'var(--text)';
            return (
              <div key={li.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="ellipsis" style={{ flex: 1, minWidth: 0, fontSize: 13 }}>{li.label}</div>
                <div
                  className={t2.logChip}
                  style={{ border: `1.5px solid ${done ? 'var(--focus-fill)' : 'var(--border)'}`, background: done ? 'var(--focus-fill)' : 'transparent', color: ink }}
                  onClick={() => st.toggleLog(li.key, li.label)}
                >
                  <Check color={ink} strokeWidth={2.2} />
                  {done ? 'Logged' : 'Log'}
                </div>
              </div>
            );
          })}
        </RowSection>
      )}
      {items.length === 0 && text && (
        <RowSection style={{ padding: '11px 16px 13px' }}>
          <div className={t2.contentCaption}>{text.caption}</div>
          <div className={t2.contentText}>{text.text}</div>
        </RowSection>
      )}
    </Card>
  );
}

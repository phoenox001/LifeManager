/**
 * The tier-3 module stack. Each module is its own card under a plain label,
 * shows at most three rows, and links to its full list with "All N ›".
 */
import { topicsOf, useApp } from '../../store/appStore';
import { habitHistory, milestonesMap, moduleCatalog, resourcesMap, weekEvents } from '../../data/seed';
import { DAY_SHORT, logCaption, logKey } from '../../domain/logic';
import type { Focus, ModuleId, Project } from '../../domain/types';
import { DocIcon, SmallPlus } from '../../components/icons';
import { Card, CheckCircle } from '../../components/ui';
import s from './detail.module.css';

interface StackProps {
  kind: 'project' | 'focus';
  item: Project | Focus;
  name: string;
  modules: ModuleId[];
  accent: string;
  accentSoft: string;
}

const MAX_ROWS = 3;
const labelOf = (mid: ModuleId) => moduleCatalog.find(m => m.id === mid)?.label ?? mid;

export function ModuleStack(props: StackProps) {
  return <>{props.modules.map(mid => <Module key={mid} mid={mid} {...props} />)}</>;
}

function Module({ mid, kind, item, name, accent, accentSoft }: StackProps & { mid: ModuleId }) {
  const st = useApp();
  const isProject = kind === 'project';

  const header = (total: number, allLabel?: string, onAll?: () => void) => (
    <div className={s.moduleHead}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{labelOf(mid)}</div>
      {(allLabel || total > MAX_ROWS) && (
        <div className={s.moduleAll} onClick={onAll ?? (() => st.showToast('Opens the filtered ' + labelOf(mid).toLowerCase() + ' list'))}>
          {allLabel ?? 'All ' + total + ' ›'}
        </div>
      )}
    </div>
  );
  const empty = (text: string) => (
    <div className={s.module}>
      {header(0)}
      <div className={s.emptyCard} onClick={() => st.showToast('Opens the create sheet for this module')}>
        <div className={s.emptyPlus}><SmallPlus /></div>
        <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.4 }}>{text}</div>
      </div>
    </div>
  );

  switch (mid) {
    case 'todos': {
      const todos = st.todos.filter(t => (isProject ? t.project === item.id : t.owner === item.name));
      if (!todos.length) return empty('No todos here yet — add the first one.');
      return (
        <div className={s.module}>
          {header(todos.length, undefined, () => st.openAllTodos(item.name))}
          <Card>
            {todos.slice(0, MAX_ROWS).map(t => (
              <div key={t.id} className={s.listRow}>
                <CheckCircle done={t.done} color={accent} onClick={() => st.toggleTodo(t.id)} />
                <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => st.openPeek(t.id)}>
                  <div style={{ fontSize: 14.5, color: t.done ? 'var(--text-ter)' : 'var(--text)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                </div>
                <div style={{ fontSize: 11.5, color: t.due === 'Yesterday' ? 'var(--urgent)' : 'var(--text-ter)', flexShrink: 0, cursor: 'pointer' }} onClick={() => st.openPeek(t.id)}>{t.due || ''}</div>
              </div>
            ))}
          </Card>
        </div>
      );
    }

    case 'milestones': {
      const ms = milestonesMap[item.id] ?? [];
      if (!ms.length) return empty('No milestones yet — the header bar falls back to todos until there are.');
      const nextIdx = ms.findIndex(m => !m.done);
      const shown = ms.slice(0, MAX_ROWS);
      return (
        <div className={s.module}>
          {header(ms.length)}
          <Card style={{ padding: '10px 16px 4px' }}>
            {shown.map((m, i) => (
              <div key={m.title} style={{ display: 'flex', gap: 13 }}>
                <div style={{ width: 14, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 1.5, height: 8, background: i === 0 ? 'transparent' : 'var(--border)' }} />
                  <div style={{ width: 13, height: 13, borderRadius: 7, flexShrink: 0, background: m.done ? accent : i === nextIdx ? 'var(--surface)' : 'var(--surface2)', border: `2px solid ${m.done || i === nextIdx ? accent : 'var(--border)'}` }} />
                  <div style={{ flex: 1, width: 1.5, background: i === shown.length - 1 ? 'transparent' : 'var(--border)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, padding: '3px 0 14px' }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.3, fontWeight: i === nextIdx ? 700 : 500, color: m.done ? 'var(--text-ter)' : 'var(--text)', textDecoration: m.done ? 'line-through' : 'none' }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-ter)', marginTop: 2 }}>{m.when}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      );
    }

    case 'log': {
      const focus = item as Focus;
      const labels = focus.card?.kind === 'log' && focus.card.items.length ? focus.card.items : [name];
      const rows = labels.map((label, i) => ({ label, key: logKey(item.id, i), mark: st.logToday[logKey(item.id, i)] }));
      const logged = rows.filter(r => r.mark === 'done').length;
      return (
        <div className={s.module}>
          {header(0, 'History ›', () => st.showToast('Opens the full log for ' + name))}
          {focus.scored && (
            <Card style={{ padding: '14px 16px', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 40 }}>
                {habitHistory.map((v, i) => (
                  <div key={i} style={{ flex: 1, height: Math.max(6, 6 + (v / 100) * 32), borderRadius: 4, background: v >= 70 ? accent : accentSoft }} />
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 8 }}>Last 14 days · a lapse dips the score, never resets it</div>
            </Card>
          )}
          <Card style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-ter)', marginBottom: 10 }}>{logCaption(logged, rows.length)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map(r => {
                const done = r.mark === 'done', skip = r.mark === 'skip';
                return (
                  <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="ellipsis" style={{ flex: 1, minWidth: 0, fontSize: 13.5 }}>{r.label}</div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <div className={s.logButton} style={{ background: done ? 'var(--focus-fill)' : 'var(--bg)', color: done ? 'var(--focus-fill-ink)' : 'var(--text)', border: `1px solid ${done ? 'var(--focus-fill)' : 'var(--border)'}` }} onClick={() => st.setLog(r.key, 'done')}>
                        {done ? 'Logged' : 'Done'}
                      </div>
                      <div className={s.logButton} style={{ background: skip ? 'var(--surface2)' : 'var(--bg)', color: skip ? 'var(--text)' : 'var(--text-sec)', border: `1px solid ${skip ? 'var(--text-ter)' : 'var(--border)'}` }} onClick={() => st.setLog(r.key, 'skip')}>
                        Skipped
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      );
    }

    case 'notes': {
      const notes = st.notes.filter(n => topicsOf(st, n.id).includes(item.name));
      if (!notes.length) return empty('No notes linked here yet.');
      return (
        <div className={s.module}>
          {header(notes.length)}
          <Card>
            {notes.slice(0, MAX_ROWS).map(n => (
              <div key={n.id} style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => st.openDetail('note', n.id)}>
                <div style={{ fontSize: 13.5, lineHeight: 1.45, textWrap: 'pretty' }}>{n.text}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 5 }}>{n.when}</div>
              </div>
            ))}
          </Card>
        </div>
      );
    }

    case 'events': {
      const events = weekEvents.flatMap((day, di) => day.filter(e => e.linked === item.name).map(e => ({ ...e, day: DAY_SHORT[di] })));
      if (!events.length) return empty('Nothing on your calendar is linked to this yet.');
      return (
        <div className={s.module}>
          {header(events.length)}
          <Card>
            {events.slice(0, MAX_ROWS).map(e => (
              <div key={e.day + e.time} className={s.listRow}>
                <div style={{ width: 54, flexShrink: 0, fontSize: 12.5, color: 'var(--text-sec)', fontWeight: 600 }}>{e.time}</div>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: accent, flexShrink: 0 }} />
                <div className="ellipsis" style={{ flex: 1, minWidth: 0, fontSize: 14.5 }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)', flexShrink: 0 }}>{e.day}</div>
              </div>
            ))}
          </Card>
        </div>
      );
    }

    case 'subitems': {
      const subs = st.subitems[item.id] ?? [];
      if (!subs.length) return empty('An empty checklist — add the first line.');
      return (
        <div className={s.module}>
          {header(subs.length)}
          <Card>
            {subs.slice(0, MAX_ROWS).map((x, i) => (
              <div key={x.title} className={s.listRow} style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => st.toggleSubitem(item.id, i)}>
                <CheckCircle done={x.done} color={accent} size={20} radius={6} checkSize={10} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 14, color: x.done ? 'var(--text-ter)' : 'var(--text)', textDecoration: x.done ? 'line-through' : 'none' }}>{x.title}</div>
              </div>
            ))}
          </Card>
        </div>
      );
    }

    case 'resources': {
      const res = resourcesMap[item.id] ?? [];
      if (!res.length) return empty('No reference material attached yet.');
      return (
        <div className={s.module}>
          {header(res.length)}
          <Card>
            {res.slice(0, MAX_ROWS).map(r => (
              <div key={r.title} className={s.listRow}>
                <div className={s.fileIcon}><DocIcon color="var(--text-sec)" size={14} lines={false} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ellipsis" style={{ fontSize: 14 }}>{r.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 1 }}>{r.meta}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      );
    }
  }
}

import { useApp } from '../../store/appStore';
import { isActiveProject, openTodosOf, projectActivity } from '../../domain/selectors';
import { ChevronRight, ListIcon } from '../../components/icons';
import { CircleButton, ProgressBar } from '../../components/ui';
import s from './tier1.module.css';

export function Projects() {
  const st = useApp();
  const activity = projectActivity(st.projects, st.todos);
  const pinned = st.projects.filter(p => isActiveProject(p) && p.pinned);
  const stats = [
    { value: activity.active, label: 'active' },
    { value: activity.touchedThisWeek, label: 'moved this week' },
    { value: activity.openTodos, label: 'open todos' },
  ];

  return (
    <div className={s.page}>
      <div className={s.titleBar}>
        <div className={s.bigTitle}>Projects</div>
        <CircleButton onClick={() => st.openSeeAll('projects')}><ListIcon /></CircleButton>
      </div>

      <div className={s.bigCard} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 12 }}>Overall activity</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {stats.map(x => (
            <div key={x.label} style={{ flex: 1, minWidth: 0 }}>
              <div className={s.statNumber}>{x.value}</div>
              <div className={s.statLabel}>{x.label}</div>
            </div>
          ))}
        </div>
        <ProgressBar pct={activity.avg} color="var(--proj)" />
        <div className={s.subTer} style={{ marginTop: 8 }}>Average completion {activity.avg}% across active projects</div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Pinned</div>
      <div className={s.stack12} style={{ marginBottom: 20 }}>
        {pinned.map(p => {
          const next = openTodosOf(p.id, st.todos).slice(0, 3);
          return (
            <div key={p.id} className={s.bigCard}>
              <div className={s.cardHead}>
                <div className={s.cardTitle} onClick={() => st.openDetail('project', p.id)}>{st.nameOverrides['project:' + p.id] || p.name}</div>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--proj)', marginTop: 6, flexShrink: 0 }} />
              </div>
              <div className={s.lastBox}>
                <div className={s.caption} style={{ marginBottom: 3 }}>Last interaction</div>
                <div style={{ fontSize: 13, lineHeight: 1.4 }}>{p.last}</div>
                <div className={s.subTer} style={{ marginTop: 3 }}>{p.lastWhen}</div>
              </div>
              {next.length > 0 && (
                <>
                  <div className={s.caption} style={{ marginBottom: 6 }}>Next up</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {next.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 15, height: 15, borderRadius: 8, border: '1.5px solid var(--border)', flexShrink: 0 }} />
                        <div style={{ fontSize: 13.5 }}>{t.title}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={s.seeAll} onClick={() => st.openSeeAll('projects')}>
        <div>See all Projects</div>
        <ChevronRight />
      </div>
    </div>
  );
}

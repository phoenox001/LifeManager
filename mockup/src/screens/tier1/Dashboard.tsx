import { useApp } from '../../store/appStore';
import { DASHBOARD_INSIGHT, NOW_MIN, PROJECTS_MOMENTUM, USER, schedule } from '../../data/seed';
import { dayPlan, durationLabel, fmtRange, focusMomentum, freeUntilNext, headerDayLabel, ringColorFor, todoBucket, toMin } from '../../domain/logic';
import { Caret, Magnifier, Sparkle } from '../../components/icons';
import { Card, CheckCircle, Ring, SectionHeader } from '../../components/ui';
import s from './tier1.module.css';

export function Dashboard() {
  const st = useApp();
  const plan = dayPlan(st.todos, schedule, NOW_MIN);
  const focusScore = focusMomentum(st.focuses);
  const glance = [
    { key: 'today', label: 'Today', score: plan.adherence, color: ringColorFor(plan.adherence), sub: plan.done + ' of ' + plan.planned + ' done' },
    { key: 'proj', label: 'Projects', score: PROJECTS_MOMENTUM, color: 'var(--proj)', sub: 'momentum' },
    { key: 'focus', label: 'Focuses', score: focusScore, color: 'var(--focus)', sub: 'momentum' },
  ];
  // Only today's plan and anything overdue live on the dashboard.
  const dashTodos = st.todos.filter(t => ['today', 'overdue'].includes(todoBucket(t)));

  return (
    <div className={s.page}>
      <div className={s.dashHeader}>
        <div>
          <div className={s.dateDrop} onClick={st.openCalendar}>
            <div className={s.dateLabel}>{headerDayLabel(st.selectedDate)}</div>
            <Caret />
          </div>
          <div className={s.bigTitle}>Today</div>
        </div>
        <div className={s.avatar} onClick={() => st.setTab('account')}>{USER.initial}</div>
      </div>

      {/* Glance: three separate rings (never blended) over the AI insight. */}
      <Card style={{ marginBottom: 22 }}>
        <div className={s.glanceRow}>
          {glance.map(g => (
            <div key={g.key} className={s.glanceCell}>
              <Ring pct={g.score} color={g.color} size={52} track="var(--surface)" label={g.score} />
              <div style={{ textAlign: 'center' }}>
                <div className={s.glanceLabel}>{g.label}</div>
                <div className={s.glanceSub}>{g.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={s.insight}>
          <div className={s.insightBadge}><Sparkle color="#fff" size={13} /></div>
          <div className={s.insightText}>{DASHBOARD_INSIGHT}</div>
          <div className={s.insightOpen} onClick={st.openAiChatWithInsight} aria-label="Open in AI chat"><Magnifier /></div>
        </div>
      </Card>

      <SectionHeader title="Schedule" link="My Week ›" onLink={st.openMyWeek} />
      <Card style={{ marginBottom: 22 }}>
        {schedule.map(ev => (
          <div
            key={ev.title}
            className={s.scheduleRow}
            style={{ opacity: toMin(ev.end) <= NOW_MIN ? 0.55 : 1 }}
            onClick={() => st.showToast(ev.title + ' · ' + fmtRange(ev.time, ev.end))}
          >
            <div className={s.scheduleTime}>{ev.time}</div>
            <div className={s.dot6} style={{ background: ev.cal === 'work' ? 'var(--accent1)' : 'var(--accent2)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5 }}>{ev.title}</div>
              {ev.linked && <div className={s.subTer} style={{ marginTop: 1 }}>{ev.linked}</div>}
            </div>
            <div className={s.subTer} style={{ flexShrink: 0 }}>{durationLabel(ev)}</div>
          </div>
        ))}
        <div className={s.scheduleFoot}>
          <div style={{ fontSize: 11.5, color: 'var(--text-sec)', minWidth: 0 }}>{freeUntilNext(schedule, NOW_MIN)}</div>
          <div className={s.smallPill} onClick={() => st.showToast('Add a block to today')}>+ Block</div>
        </div>
      </Card>

      <SectionHeader title="Today's todos" link="All todos ›" onLink={() => st.openAllTodos()} />
      <Card style={{ marginBottom: 22 }}>
        {dashTodos.map(td => (
          <div key={td.id} className={s.todoRow} onClick={() => st.toggleTodo(td.id)}>
            <CheckCircle done={td.done} size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, color: td.done ? 'var(--text-ter)' : 'var(--text)', textDecoration: td.done ? 'line-through' : 'none' }}>{td.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-ter)', marginTop: 1 }}>{td.owner}</div>
            </div>
          </div>
        ))}
      </Card>

      <SectionHeader title="Spotlight" link="Edit cards" onLink={() => st.showToast('Choose up to 5 spotlight cards')} />
      <div className={s.stack12}>
        {st.spotlight.map(sp => {
          const proj = sp.kind === 'dynamic';
          return (
            <div key={sp.id} className={s.bigCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div className={s.tag} style={{ background: proj ? 'var(--proj-soft)' : 'var(--focus-soft)', color: proj ? 'var(--proj)' : 'var(--focus)' }}>{sp.label}</div>
              </div>
              <div className={s.cardTitle} style={{ marginBottom: 4 }} onClick={() => st.openDetail(sp.open.kind, sp.open.id)}>{sp.target}</div>
              <div style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.45 }}>{sp.body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

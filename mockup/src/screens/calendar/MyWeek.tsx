/** My Week: a real calendar with a Week grid and a Day timeline. */
import { useApp } from '../../store/appStore';
import { NOW_MIN, TODAY, weekEvents } from '../../data/seed';
import { DAY_SHORT, busyMinutes, clockLabel, fmtRange, hourLabel, mondayIndex, toMin, weekDates, weekLabel } from '../../domain/logic';
import type { CalEvent } from '../../domain/types';
import { CalendarIcon, ChevronLeft, ChevronRight } from '../../components/icons';
import { BackLink, Card, CircleButton, Overlay, PageTitle, Segmented, z } from '../../components/ui';
import s from './calendar.module.css';

const START_H = 7, END_H = 21;
const WEEK_HP = 44, DAY_HP = 54;
const HOURS = Array.from({ length: END_H - START_H + 1 }, (_, i) => START_H + i);

/** Sample events for any week: the real week for offset 0, a sparse pattern otherwise. */
function eventsFor(offset: number, dayIndex: number): CalEvent[] {
  if (offset === 0) return weekEvents[dayIndex];
  return dayIndex % 2 === 0 ? weekEvents[(dayIndex + Math.abs(offset)) % 7] : [];
}

function layout(ev: CalEvent, hp: number, minH: number) {
  const s0 = toMin(ev.time), e0 = toMin(ev.end);
  const height = Math.max(minH, ((e0 - s0) / 60) * hp - 3);
  return { top: ((s0 - START_H * 60) / 60) * hp, height };
}

const calColors = (ev: CalEvent) => ev.cal === 'work'
  ? { accent: 'var(--accent1)', bg: 'var(--accent1-soft)' }
  : { accent: 'var(--accent2)', bg: 'var(--accent2-soft)' };

export function MyWeek() {
  const st = useApp();
  const { open, offset, mode, dayIndex } = st.myWeek;
  if (!open) return null;

  const dates = weekDates(TODAY, offset);
  const todayIdx = offset === 0 ? mondayIndex(TODAY) : -1;
  const toast = (ev: CalEvent) => st.showToast(ev.title + ' · ' + fmtRange(ev.time, ev.end));

  return (
    <Overlay zIndex={z.myWeek}>
      <BackLink label="Today" onClick={st.closeMyWeek} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <PageTitle>My Week</PageTitle>
        <CircleButton size={34} onClick={st.openCalendar}><CalendarIcon /></CircleButton>
      </div>
      <Segmented value={mode} onChange={st.setWeekMode} options={[{ value: 'week', label: 'Week' }, { value: 'day', label: 'Day' }]} style={{ marginBottom: 14 }} />

      {mode === 'week' ? (
        <>
          <Stepper label={<div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-sec)' }}>{weekLabel(offset)}</div>} onPrev={() => st.stepWeek(-1)} onNext={() => st.stepWeek(1)} />
          <Card style={{ padding: '10px 12px 12px' }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 8, paddingLeft: 30 }}>
              {DAY_SHORT.map((d, i) => {
                const isToday = i === todayIdx;
                return (
                  <div key={d} className={s.dayHead} style={{ background: isToday ? 'var(--text)' : 'transparent' }} onClick={() => st.setWeekDay(i)}>
                    <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.2, color: isToday ? 'var(--bg)' : 'var(--text-sec)' }}>{d}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 1, color: isToday ? 'var(--bg)' : 'var(--text)' }}>{dates[i]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'relative', height: (END_H - START_H) * WEEK_HP }}>
              <HourLines hp={WEEK_HP} labelWidth={26} gap={4} fontSize={9} />
              <div style={{ position: 'absolute', left: 30, right: 0, top: 0, bottom: 0, display: 'flex', gap: 2 }}>
                {DAY_SHORT.map((d, i) => (
                  <div key={d} style={{ flex: 1, minWidth: 0, position: 'relative', borderRadius: 8, background: i === todayIdx ? 'var(--surface)' : 'transparent' }}>
                    {eventsFor(offset, i).map(ev => {
                      const { top, height } = layout(ev, WEEK_HP, 14);
                      const c = calColors(ev);
                      return (
                        <div key={ev.time + ev.title} className={s.weekBlock} style={{ top, height, background: c.bg, borderLeft: `2.5px solid ${c.accent}` }} onClick={() => toast(ev)}>
                          {/* Sub-hour blocks show only the colour bar; titles live in Day view. */}
                          {height >= 30 && <div className={'ellipsis ' + s.weekTitle}>{ev.title}</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {offset === 0 && <div style={{ position: 'absolute', left: 28, right: 0, top: ((NOW_MIN - START_H * 60) / 60) * WEEK_HP, height: 1.5, background: 'var(--urgent)', pointerEvents: 'none' }} />}
            </div>
            <div className={s.summary}>
              {(DAY_SHORT.reduce((a, _, i) => a + busyMinutes(eventsFor(offset, i)), 0) / 60).toFixed(0)}h committed across the week
            </div>
          </Card>
        </>
      ) : (
        <DayView offset={offset} dayIndex={dayIndex} dates={dates} isToday={dayIndex === todayIdx} onEvent={toast} />
      )}
    </Overlay>
  );
}

function DayView({ offset, dayIndex, dates, isToday, onEvent }: { offset: number; dayIndex: number; dates: number[]; isToday: boolean; onEvent: (ev: CalEvent) => void }) {
  const st = useApp();
  const events = eventsFor(offset, dayIndex);
  const busy = busyMinutes(events);
  const summary = events.length === 0 ? 'Nothing scheduled' : events.length + ' blocks · ' + (busy / 60).toFixed(1).replace('.0', '') + 'h committed';
  return (
    <>
      <Stepper
        label={
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{DAY_SHORT[dayIndex] + ' ' + dates[dayIndex]}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 1 }}>{summary}</div>
          </div>
        }
        onPrev={() => st.stepDay(-1)}
        onNext={() => st.stepDay(1)}
      />
      <Card style={{ padding: '14px 14px 12px' }}>
        <div style={{ position: 'relative', height: (END_H - START_H) * DAY_HP }}>
          <HourLines hp={DAY_HP} labelWidth={34} gap={8} fontSize={10} />
          <div style={{ position: 'absolute', left: 42, right: 0, top: 0, bottom: 0 }}>
            {events.map(ev => {
              const { top, height } = layout(ev, DAY_HP, 30);
              const c = calColors(ev);
              return (
                <div key={ev.time + ev.title} className={s.dayBlock} style={{ top, height, background: c.bg, borderLeft: `3px solid ${c.accent}` }} onClick={() => onEvent(ev)}>
                  <div className="ellipsis" style={{ fontSize: 13, fontWeight: 600 }}>{ev.title}</div>
                  {height >= 46 && <div style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 2 }}>{fmtRange(ev.time, ev.end)}</div>}
                  {ev.linked && <div className="ellipsis" style={{ fontSize: 10, fontWeight: 700, color: c.accent, marginTop: 2 }}>{ev.linked}</div>}
                </div>
              );
            })}
          </div>
          {isToday && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: ((NOW_MIN - START_H * 60) / 60) * DAY_HP, display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
              <div style={{ width: 34, flexShrink: 0, fontSize: 10, fontWeight: 700, color: 'var(--urgent)', textAlign: 'right', lineHeight: 1 }}>{clockLabel(NOW_MIN)}</div>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--urgent)', flexShrink: 0, marginLeft: -3 }} />
              <div style={{ flex: 1, height: 1.5, background: 'var(--urgent)' }} />
            </div>
          )}
        </div>
        <div className={s.addBlock} onClick={() => st.showToast('New calendar block')}>+ Add block</div>
      </Card>
    </>
  );
}

function HourLines({ hp, labelWidth, gap, fontSize }: { hp: number; labelWidth: number; gap: number; fontSize: number }) {
  return (
    <>
      {HOURS.map(h => (
        <div key={h} style={{ position: 'absolute', left: 0, right: 0, top: (h - START_H) * hp, display: 'flex', alignItems: 'center', gap }}>
          <div style={{ width: labelWidth, flexShrink: 0, fontSize, fontWeight: 600, color: 'var(--text-ter)', textAlign: 'right', lineHeight: 1 }}>
            {h % 2 === 1 ? hourLabel(h) : ''}
          </div>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
      ))}
    </>
  );
}

function Stepper({ label, onPrev, onNext }: { label: React.ReactNode; onPrev: () => void; onNext: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <CircleButton size={32} onClick={onPrev}><ChevronLeft color="var(--text)" size={12} /></CircleButton>
      {label}
      <CircleButton size={32} onClick={onNext}><ChevronRight color="var(--text)" /></CircleButton>
    </div>
  );
}

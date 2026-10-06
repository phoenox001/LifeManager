/** Full-page month calendar, opened from the dashboard date and from My Week. */
import { useApp } from '../../store/appStore';
import { TODAY } from '../../data/seed';
import { monthGrid, sameDay } from '../../domain/logic';
import { ChevronLeft, ChevronRight } from '../../components/icons';
import { BackLink, CircleButton, Overlay, PageTitle, z } from '../../components/ui';
import s from './calendar.module.css';

const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function CalendarOverlay() {
  const st = useApp();
  if (!st.calendar.open) return null;
  const grid = monthGrid(TODAY, st.calendar.monthOffset);

  return (
    <Overlay zIndex={z.calendar}>
      <BackLink label="Close" onClick={st.closeCalendar} />
      <PageTitle style={{ marginBottom: 16 }}>Calendar</PageTitle>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <CircleButton size={34} onClick={() => st.stepMonth(-1)}><ChevronLeft color="var(--text)" size={12} /></CircleButton>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{grid.label}</div>
        <CircleButton size={34} onClick={() => st.stepMonth(1)}><ChevronRight color="var(--text)" /></CircleButton>
      </div>
      <div className={s.monthGrid} style={{ marginBottom: 6 }}>
        {DOW.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: 'var(--text-ter)' }}>{d}</div>)}
      </div>
      <div className={s.monthGrid} style={{ marginBottom: 24 }}>
        {grid.cells.map((cell, i) => {
          const isToday = !!cell.date && sameDay(cell.date, TODAY);
          const isSelected = !!cell.date && sameDay(cell.date, st.selectedDate);
          return (
            <div
              key={i}
              className={s.dayCell}
              style={{
                background: isSelected ? 'var(--accent1)' : isToday ? 'var(--accent1-soft)' : 'transparent',
                color: cell.dim ? 'var(--text-ter)' : isSelected ? '#fff' : 'var(--text)',
                fontWeight: isToday || isSelected ? 700 : 500,
                cursor: cell.date ? 'pointer' : 'default',
              }}
              onClick={() => cell.date && st.selectDay(cell.date)}
            >
              {cell.label}
            </div>
          );
        })}
      </div>
      <div className={s.viewWeek} onClick={st.viewWeekFromCalendar}>View week ›</div>
    </Overlay>
  );
}

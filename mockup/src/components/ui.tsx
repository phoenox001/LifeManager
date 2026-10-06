/** Shared building blocks used across every tier. */
import type { CSSProperties, ReactNode } from 'react';
import { useApp } from '../store/appStore';
import { ringDash } from '../domain/logic';
import { Check, ChevronDown, ChevronLeft, MoreDots, Search } from './icons';
import s from './ui.module.css';

export const z = {
  myWeek: 30, allTodos: 30, inbox: 30, seeAll: 32, accountSub: 34, calendar: 35, detail: 36,
  aiChat: 40, statusBar: 45, quickAdd: 70, rowSheet: 75, peek: 76, toast: 90,
} as const;

export function Card({ children, style, radius = 18, onClick }: { children: ReactNode; style?: CSSProperties; radius?: number; onClick?: () => void }) {
  return (
    <div className={s.card} style={{ borderRadius: radius, cursor: onClick ? 'pointer' : undefined, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, link, onLink, style }: { title: string; link?: string; onLink?: () => void; style?: CSSProperties }) {
  return (
    <div className={s.sectionHeader} style={style}>
      <div className={s.sectionTitle}>{title}</div>
      {link && <div className={s.sectionLink} onClick={onLink}>{link}</div>}
    </div>
  );
}

export function Caps({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className={s.caps} style={style}>{children}</div>;
}

/** Full-screen layer above the tab content, with the status-bar spacer and standard padding. */
export function Overlay({ zIndex, children, background }: { zIndex: number; children: ReactNode; background?: string }) {
  return (
    <div className={s.overlay} style={{ zIndex, background }}>
      <div className={s.topSpacer} />
      <div className={s.page}>{children}</div>
    </div>
  );
}

export function BackLink({ label, onClick, style }: { label: string; onClick: () => void; style?: CSSProperties }) {
  return (
    <div className={s.back} onClick={onClick} style={style}>
      <ChevronLeft /> {label}
    </div>
  );
}

export function PageTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className={s.pageTitle} style={style}>{children}</div>;
}

export function CircleButton({ children, onClick, size = 40 }: { children: ReactNode; onClick: () => void; size?: number }) {
  return (
    <div className={s.circleButton} style={{ width: size, height: size, borderRadius: size / 2 }} onClick={onClick}>
      {children}
    </div>
  );
}

/** Title row with the search icon on the right, used by every tier-2 list. */
export function SearchTitleRow({ title }: { title: string }) {
  const toggleSearch = useApp(st => st.toggleSearch);
  return (
    <div className={s.titleRow}>
      <PageTitle>{title}</PageTitle>
      <CircleButton onClick={toggleSearch}><Search /></CircleButton>
    </div>
  );
}

export function SearchButton() {
  const toggleSearch = useApp(st => st.toggleSearch);
  return <CircleButton onClick={toggleSearch}><Search /></CircleButton>;
}

/** The search field revealed by the search icon. Renders nothing while closed. */
export function SearchField({ placeholder, marginBottom = 16 }: { placeholder: string; marginBottom?: number }) {
  const search = useApp(st => st.search);
  const setQuery = useApp(st => st.setQuery);
  if (!search.open) return null;
  return (
    <div className={s.searchField} style={{ marginBottom }}>
      <Search size={15} strokeWidth={2} color="var(--text-ter)" style={{ flexShrink: 0 }} />
      <input className={s.searchInput} value={search.query} placeholder={placeholder} autoFocus onChange={e => setQuery(e.target.value)} />
      {search.query && <div className={s.textAction} onClick={() => setQuery('')}>Clear</div>}
    </div>
  );
}

export function Toggle({ on, onColor = 'var(--accent2)', onClick }: { on: boolean; onColor?: string; onClick?: () => void }) {
  return (
    <div className={s.toggleTrack} style={{ background: on ? onColor : 'var(--surface2)' }} onClick={onClick} role="switch" aria-checked={on}>
      <div className={s.toggleKnob} style={{ left: on ? 20 : 2 }} />
    </div>
  );
}

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

/** Filter chips: the selected chip is inverted (ink on paper). */
export function FilterChips<T extends string>({ options, isActive, onPick, style }: {
  options: ChipOption<T>[]; isActive: (v: T) => boolean; onPick: (v: T) => void; style?: CSSProperties;
}) {
  return (
    <div className={s.chipRow} style={style}>
      {options.map(o => {
        const on = isActive(o.value);
        return (
          <div key={o.value} className={s.chip} style={{ background: on ? 'var(--text)' : 'var(--surface2)', color: on ? 'var(--bg)' : 'var(--text-sec)' }} onClick={() => onPick(o.value)}>
            {o.label}
          </div>
        );
      })}
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange, style, segmentStyle }: {
  options: ChipOption<T>[]; value: T; onChange: (v: T) => void; style?: CSSProperties; segmentStyle?: CSSProperties;
}) {
  return (
    <div className={s.segmented} style={style}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <div key={o.value} className={s.segment} style={{ background: on ? 'var(--text)' : 'transparent', color: on ? 'var(--bg)' : 'var(--text-sec)', ...segmentStyle }} onClick={() => onChange(o.value)}>
            {o.label}
          </div>
        );
      })}
    </div>
  );
}

/** Round (or square, via radius) completion checkbox. */
export function CheckCircle({ done, color = 'var(--accent2)', size = 22, radius, onClick, checkSize = 11 }: {
  done: boolean; color?: string; size?: number; radius?: number; onClick?: () => void; checkSize?: number;
}) {
  return (
    <div
      className={s.check}
      style={{ width: size, height: size, borderRadius: radius ?? size / 2, border: `1.5px solid ${done ? color : 'var(--border)'}`, background: done ? color : 'transparent', cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick}
    >
      {done && <Check size={checkSize} />}
    </div>
  );
}

/** Non-punishing score ring. `r`/`stroke` are in viewBox units. */
export function Ring({ pct, color, size, viewBox = 40, r = 15.5, stroke = 5, track = 'var(--surface2)', label, labelSize = 14 }: {
  pct: number; color: string; size: number; viewBox?: number; r?: number; stroke?: number; track?: string; label?: ReactNode; labelSize?: number;
}) {
  const c = viewBox / 2;
  return (
    <div className={s.ringWrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${viewBox} ${viewBox}`} style={{ display: 'block' }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={ringDash(pct, r)} transform={`rotate(-90 ${c} ${c})`} />
      </svg>
      {label !== undefined && <div className={s.ringLabel} style={{ fontSize: labelSize }}>{label}</div>}
    </div>
  );
}

export function ProgressBar({ pct, color, height = 6, track = 'var(--surface2)', style }: { pct: number; color: string; height?: number; track?: string; style?: CSSProperties }) {
  return (
    <div style={{ height, borderRadius: height / 2, background: track, overflow: 'hidden', ...style }}>
      <div style={{ height: '100%', borderRadius: height / 2, background: color, width: pct + '%' }} />
    </div>
  );
}

/** Bottom sheet over a scrim. Tapping the scrim dismisses. */
export function Sheet({ zIndex, onDismiss, children, background = 'var(--surface)', padding = '18px 20px 30px', maxHeight = '82%' }: {
  zIndex: number; onDismiss: () => void; children: ReactNode; background?: string; padding?: string; maxHeight?: string;
}) {
  return (
    <div className={s.sheetScrim} style={{ zIndex }}>
      <div className={s.sheetDismiss} onClick={onDismiss} />
      <div className={s.sheet} style={{ background, padding, maxHeight }}>{children}</div>
    </div>
  );
}

export function Grabber({ marginBottom = 16, width = 36 }: { marginBottom?: number; width?: number }) {
  return <div className={s.grabber} style={{ marginBottom, width }} />;
}

export function PrimaryButton({ children, onClick, color = 'var(--accent1)', style }: { children: ReactNode; onClick: () => void; color?: string; style?: CSSProperties }) {
  return <div className={s.primaryButton} style={{ background: color, ...style }} onClick={onClick}>{children}</div>;
}

export function OutlineButton({ children, onClick, color = 'var(--text)', style }: { children: ReactNode; onClick: () => void; color?: string; style?: CSSProperties }) {
  return <div className={s.outlineButton} style={{ color, ...style }} onClick={onClick}>{children}</div>;
}

export function GhostButton({ children, onClick, style }: { children: ReactNode; onClick: () => void; style?: CSSProperties }) {
  return <div className={s.ghostButton} style={style} onClick={onClick}>{children}</div>;
}

/* ---------- tier-2 card anatomy ---------- */

/** Header section of a tier-2 card: kind dot, underlined title (opens), "…" (manage). */
export function RowCardHead({ name, dotColor, onOpen, onMore, titleSize = 15.5 }: {
  name: string; dotColor?: string; onOpen: () => void; onMore: () => void; titleSize?: number;
}) {
  return (
    <div className={s.rowHead}>
      <div className={s.rowTitleHit} onClick={onOpen}>
        {dotColor && <div className={s.kindDot} style={{ background: dotColor }} />}
        <div className={s.rowTitle} style={{ fontSize: titleSize }}>{name}</div>
      </div>
      <MoreButton onClick={onMore} />
    </div>
  );
}

export function MoreButton({ onClick }: { onClick: () => void }) {
  return <div className={s.moreButton} onClick={onClick} aria-label="More"><MoreDots /></div>;
}

export function RowMeta({ children }: { children: ReactNode }) {
  return <div className={s.rowMeta}>{children}</div>;
}

export function RowSection({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className={s.rowSection} style={style}>{children}</div>;
}

/** Simple archived-style card: header + one meta line. */
export function MetaRowCard({ name, meta, dotColor, onOpen, onMore, opacity = 0.72, titleSize = 15 }: {
  name: string; meta: string; dotColor?: string; onOpen: () => void; onMore: () => void; opacity?: number; titleSize?: number;
}) {
  return (
    <Card style={{ opacity }}>
      <RowCardHead name={name} dotColor={dotColor} onOpen={onOpen} onMore={onMore} titleSize={titleSize} />
      <RowMeta>{meta}</RowMeta>
    </Card>
  );
}

export function GroupHeader({ label, count, color = 'var(--text-ter)', margin }: { label: string; count: number; color?: string; margin?: string }) {
  return (
    <div className={s.groupHeader} style={margin ? { margin } : undefined}>
      <div className={s.caps} style={{ color }}>{label}</div>
      <div style={{ fontSize: 11.5, color: 'var(--text-ter)' }}>{count}</div>
    </div>
  );
}

export function Stack({ children, gap = 8, style }: { children: ReactNode; gap?: number; style?: CSSProperties }) {
  return <div className={s.stack8} style={{ gap, ...style }}>{children}</div>;
}

/** Card-styled header that collapses a group (Archived, Completed). */
export function CollapseHeader({ label, count, open, onToggle }: { label: string; count: number; open: boolean; onToggle: () => void }) {
  return (
    <div className={s.collapseHeader} onClick={onToggle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-ter)' }}>{count}</div>
      </div>
      <ChevronDown up={open} />
    </div>
  );
}

export function Empty({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className={s.empty} style={style}>{children}</div>;
}

export function Toast() {
  const toast = useApp(st => st.toast);
  if (!toast) return null;
  return <div className={s.toast}>{toast}</div>;
}

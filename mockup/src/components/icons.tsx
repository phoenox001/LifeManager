/** Inline SVG icons from the design. Colours are passed as CSS values (usually token vars). */
import type { CSSProperties } from 'react';

interface IconProps {
  color?: string;
  size?: number;
  style?: CSSProperties;
}

const ink = 'var(--text)';

export function ChevronLeft({ color = 'var(--text-sec)', size = 14, style }: IconProps) {
  return (
    <svg width={(size * 8) / 14} height={size} viewBox="0 0 8 14" style={{ flexShrink: 0, ...style }}>
      <path d="M7 1L1 7l6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ color = 'var(--text-sec)', size = 12, style }: IconProps) {
  return (
    <svg width={(size * 7) / 12} height={size} viewBox="0 0 8 14" style={{ flexShrink: 0, ...style }}>
      <path d="M1 1l6 6-6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDown({ color = 'var(--text-sec)', up = false }: IconProps & { up?: boolean }) {
  return (
    <svg width="12" height="7" viewBox="0 0 12 7">
      <path d={up ? 'M1 6l5-5 5 5' : 'M1 1l5 5 5-5'} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Caret({ color = 'var(--text-sec)' }: IconProps) {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ color = '#fff', size = 11, strokeWidth = 2 }: IconProps & { strokeWidth?: number }) {
  return (
    <svg width={size} height={(size * 9) / 11} viewBox="0 0 12 10">
      <path d="M1 5l3.5 3.5L11 1" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Plus({ color = '#fff', size = 22, strokeWidth = 2.4 }: IconProps & { strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 4v16M4 12h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function SmallPlus({ color = 'var(--text-sec)', size = 12, strokeWidth = 2.6 }: IconProps & { strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function Sparkle({ color = 'var(--accent2)', size = 16, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 2l2.2 6.8H21l-5.6 4.1L17.6 20 12 15.9 6.4 20l2.2-7.1L3 8.8h6.8z" fill={color} />
    </svg>
  );
}

export function Search({ color = ink, size = 17, strokeWidth = 1.9, style }: IconProps & { strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
      <path d="M15.5 15.5L21 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/** The magnifier on the dashboard insight strip — slightly different geometry. */
export function Magnifier({ color = 'var(--accent2)', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke={color} strokeWidth="2.2" />
      <path d="M20 20l-5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ListIcon({ color = ink }: IconProps) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h11" stroke={color} strokeWidth="1.9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function MoreDots({ color = 'var(--text-ter)' }: IconProps) {
  return (
    <svg width="14" height="4" viewBox="0 0 14 4">
      <circle cx="2" cy="2" r="1.6" fill={color} />
      <circle cx="7" cy="2" r="1.6" fill={color} />
      <circle cx="12" cy="2" r="1.6" fill={color} />
    </svg>
  );
}

export function DashboardIcon({ color = ink, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="3" y="3" width="8" height="8" rx="2" fill={color} />
      <rect x="13" y="3" width="8" height="8" rx="2" fill={color} />
      <rect x="3" y="13" width="8" height="8" rx="2" fill={color} />
      <rect x="13" y="13" width="8" height="8" rx="2" fill={color} />
    </svg>
  );
}

export function FolderIcon({ color = ink, size = 22, strokeWidth = 1.8 }: IconProps & { strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" fill="none" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

export function TargetIcon({ color = ink, size = 22, strokeWidth = 1.8 }: IconProps & { strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r={size > 30 ? 1.5 : 1.4} fill={color} />
    </svg>
  );
}

export function PersonIcon({ color = ink, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DocIcon({ color = ink, size = 20, strokeWidth = 1.8, lines = true }: IconProps & { strokeWidth?: number; lines?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M6 3h8l4 4v14H6z" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      {lines && <path d="M9 12h6M9 16h4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />}
    </svg>
  );
}

export function ClockIcon({ color = ink, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinesIcon({ color = ink }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M4 5h16M4 10h16M4 15h11M4 20h7" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function InboxIcon({ color = ink }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M3 13l2.5-8h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M3 13h5l1 2h6l1-2h5" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function SunIcon({ color = ink }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GearIcon({ color = ink }: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.5" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ArchiveBoxIcon({ color = 'var(--accent1)' }: IconProps) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24">
      <path d="M3 7h18v3H3zM5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9M9.5 14h5" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArchivedBannerIcon({ color = 'var(--text-sec)' }: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M4 7h16v13H4zM2 4h20v3H2z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon({ color = ink }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SendArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M4 12h16M13 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DragHandle() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12">
      <path d="M1 2h12M1 6h12M1 10h12" stroke="var(--text-ter)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Cross({ color }: IconProps) {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10">
      <path d="M1 1l8 8M9 1l-8 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Four-point star used as the stored-document hero glyph. */
export function DocStar({ color, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3l1.9 5.6H20l-4.9 3.6L17 18l-5-3.6L7 18l1.9-5.8L4 8.6h6.1z" fill={color} />
    </svg>
  );
}

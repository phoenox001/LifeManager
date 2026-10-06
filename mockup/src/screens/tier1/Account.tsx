import type { ReactNode } from 'react';
import { useApp, type AccountSub } from '../../store/appStore';
import { USER } from '../../data/seed';
import { ArchiveBoxIcon, ChevronRight, ClockIcon, DocIcon, InboxIcon, LinesIcon, PersonIcon, Sparkle, SunIcon } from '../../components/icons';
import { Segmented } from '../../components/ui';
import s from './tier1.module.css';

export function Account() {
  const st = useApp();
  const archivedCount = st.projects.filter(p => p.archived).length + st.focuses.filter(f => f.archived).length
    + st.archivedResources.length + st.archivedNotes.length;

  const tiles: { sub: AccountSub; icon: ReactNode; title: string; caption: string }[] = [
    { sub: 'info', icon: <PersonIcon size={20} />, title: 'Account info', caption: 'Profile, email, storage' },
    { sub: 'ai', icon: <Sparkle size={20} />, title: 'AI settings', caption: 'Permissions, tone' },
    { sub: 'auto', icon: <ClockIcon />, title: 'Automations', caption: 'Scheduled triggers' },
    { sub: 'docs', icon: <DocIcon />, title: 'AI documents', caption: 'Plans it maintains' },
    { sub: 'notes', icon: <LinesIcon />, title: 'Notes', caption: 'Everything you dumped' },
  ];

  return (
    <div className={s.page}>
      <div className={s.bigTitle} style={{ marginBottom: 18 }}>Account</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--accent1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 19 }}>{USER.initial}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{USER.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-sec)' }}>{USER.email}</div>
        </div>
      </div>

      <div className={s.bigCard} style={{ borderRadius: 22, padding: 18, marginBottom: 18, cursor: 'pointer' }} onClick={() => st.openAccountSub('archive')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 13, background: 'var(--accent1-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ArchiveBoxIcon />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Archive</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-sec)' }}>{archivedCount} items kept, nothing lost</div>
          </div>
          <ChevronRight />
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-ter)', lineHeight: 1.45 }}>Completed Projects, paused Focuses and AI reference material — restorable any time.</div>
      </div>

      <div className={s.accountGrid}>
        {tiles.map(t => (
          <div key={t.sub} className={s.tile} style={{ cursor: 'pointer' }} onClick={() => st.openAccountSub(t.sub)}>
            <div style={{ marginBottom: 10, display: 'flex' }}>{t.icon}</div>
            <div className={s.tileTitle}>{t.title}</div>
            <div className={s.tileSub}>{t.caption}</div>
          </div>
        ))}
        <div className={s.tile} style={{ cursor: 'pointer' }} onClick={st.openInbox}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <InboxIcon />
            {st.inbox.length > 0 && (
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--accent2)', borderRadius: 9, padding: '2px 7px' }}>{st.inbox.length}</div>
            )}
          </div>
          <div className={s.tileTitle}>Inbox</div>
          <div className={s.tileSub}>Unsorted quick-adds</div>
        </div>
        <div className={s.tile}>
          <div style={{ marginBottom: 10, display: 'flex' }}><SunIcon /></div>
          <div className={s.tileTitle} style={{ marginBottom: 8 }}>Appearance</div>
          <Segmented
            value={st.theme}
            onChange={st.setTheme}
            options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
            style={{ borderRadius: 10, padding: 3 }}
            segmentStyle={{ padding: '6px 0', borderRadius: 8, fontSize: 11.5 }}
          />
        </div>
      </div>

      <div
        style={{ textAlign: 'center', padding: 14, fontSize: 14.5, fontWeight: 600, color: 'var(--text-sec)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, cursor: 'pointer' }}
        onClick={() => st.showToast('Signed out')}
      >
        Sign out
      </div>
    </div>
  );
}

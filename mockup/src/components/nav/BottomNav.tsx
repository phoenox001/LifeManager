/**
 * Bottom navigation. Expanded: AI pill notched around the plus button + four tabs.
 * Collapsed (after scrolling down): page icon, AI button and plus only.
 */
import type { ReactNode } from 'react';
import { useApp } from '../../store/appStore';
import type { Tab } from '../../domain/types';
import { DashboardIcon, FolderIcon, PersonIcon, Plus, Sparkle, TargetIcon } from '../icons';
import s from './BottomNav.module.css';

const TABS: { tab: Tab; label: string; activeColor: string; Icon: typeof DashboardIcon }[] = [
  { tab: 'dashboard', label: 'Today', activeColor: 'var(--text)', Icon: DashboardIcon },
  { tab: 'projects', label: 'Projects', activeColor: 'var(--proj)', Icon: FolderIcon },
  { tab: 'focuses', label: 'Focuses', activeColor: 'var(--focus)', Icon: TargetIcon },
  { tab: 'account', label: 'Account', activeColor: 'var(--text)', Icon: PersonIcon },
];

export function BottomNav() {
  const tab = useApp(st => st.tab);
  const collapsed = useApp(st => st.navCollapsed);
  const setTab = useApp(st => st.setTab);
  const setNavCollapsed = useApp(st => st.setNavCollapsed);
  const quickInput = useApp(st => st.ai.quickInput);
  const setAiQuickInput = useApp(st => st.setAiQuickInput);
  const sendQuickAi = useApp(st => st.sendQuickAi);
  const openAiChat = useApp(st => st.openAiChat);
  const openQuickAdd = useApp(st => st.openQuickAdd);

  if (collapsed) {
    const { Icon } = TABS.find(t => t.tab === tab)!;
    return (
      <div className={s.nav}>
        <MiniBar lead={<Icon color="var(--text)" />} onLead={() => setNavCollapsed(false)} onAi={() => openAiChat()} onPlus={openQuickAdd} />
      </div>
    );
  }

  const tabButton = ({ tab: t, label, activeColor, Icon }: (typeof TABS)[number]) => {
    const color = tab === t ? activeColor : 'var(--text-ter)';
    return (
      <div key={t} className={s.tab} onClick={() => setTab(t)}>
        <Icon color={color} />
        <div className={s.tabLabel} style={{ color }}>{label}</div>
      </div>
    );
  };

  return (
    <div className={s.nav}>
      <div className={s.pillRow}>
        <div className={s.aiPill}>
          <Sparkle style={{ flexShrink: 0 }} />
          <input
            className={s.aiInput}
            value={quickInput}
            placeholder="Ask AI…"
            onChange={e => setAiQuickInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendQuickAi(); }}
            onFocus={() => openAiChat()}
          />
        </div>
      </div>
      <div className={s.tabRow}>
        {tabButton(TABS[0])}
        {tabButton(TABS[1])}
        <div className={s.tab} />
        {tabButton(TABS[2])}
        {tabButton(TABS[3])}
      </div>
      <div className={s.plus} onClick={openQuickAdd} aria-label="Add">
        <Plus />
      </div>
    </div>
  );
}

/** The minimal bar: leading icon, AI button, plus. Also used under tier-3 pages. */
export function MiniBar({ lead, onLead, onAi, onPlus }: { lead: ReactNode; onLead: () => void; onAi: () => void; onPlus: () => void }) {
  return (
    <div className={s.mini}>
      <div className={s.miniLead} onClick={onLead}>{lead}</div>
      <div className={s.miniAi} onClick={onAi} aria-label="Ask AI"><Sparkle color="#fff" /></div>
      <div className={s.miniPlus} onClick={onPlus} aria-label="Add"><Plus size={20} /></div>
    </div>
  );
}

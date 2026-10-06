import { useRef } from 'react';
import { useApp } from './store/appStore';
import { IOSDevice } from './components/device/IOSDevice';
import { BottomNav } from './components/nav/BottomNav';
import { Toast } from './components/ui';
import { Dashboard } from './screens/tier1/Dashboard';
import { Projects } from './screens/tier1/Projects';
import { Focuses } from './screens/tier1/Focuses';
import { Account } from './screens/tier1/Account';
import { AllProjects } from './screens/tier2/AllProjects';
import { AllFocuses } from './screens/tier2/AllFocuses';
import { AllTodos } from './screens/tier2/AllTodos';
import { Inbox } from './screens/tier2/Inbox';
import { AccountSubScreen } from './screens/tier2/AccountSub';
import { Detail } from './screens/tier3/Detail';
import { TodoPeek } from './screens/tier3/TodoPeek';
import { MyWeek } from './screens/calendar/MyWeek';
import { CalendarOverlay } from './screens/calendar/CalendarOverlay';
import { AiChat } from './screens/ai/AiChat';
import { QuickAddSheet } from './sheets/QuickAddSheet';
import { RowActionSheet } from './sheets/RowActionSheet';

const SCREENS = { dashboard: Dashboard, projects: Projects, focuses: Focuses, account: Account };

export function App() {
  const theme = useApp(s => s.theme);
  const tab = useApp(s => s.tab);
  const navCollapsed = useApp(s => s.navCollapsed);
  const setNavCollapsed = useApp(s => s.setNavCollapsed);
  const lastTop = useRef(0);
  const Screen = SCREENS[tab];

  // Scrolling down collapses the nav to the mini bar; scrolling up restores it.
  // Collapsing the nav makes the scroll area taller; at the bottom of a page the
  // browser then clamps scrollTop upwards by itself. That clamp is not the user
  // scrolling up, so it must not re-expand the nav (which would loop forever).
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const top = el.scrollTop;
    const delta = top - lastTop.current;
    lastTop.current = top;
    const pinnedToBottom = top + el.clientHeight >= el.scrollHeight - 1;
    const collapse = delta > 2 && top > 30 && !navCollapsed;
    const expand = delta < -2 && navCollapsed && !pinnedToBottom;
    if (collapse || expand) setNavCollapsed(collapse);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <IOSDevice dark={theme === 'dark'}>
        <div
          className={'theme-' + theme}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', -apple-system, sans-serif" }}
        >
          <div style={{ flex: 1, overflowY: 'auto', position: 'relative', overflowAnchor: 'none' }} onScroll={onScroll}>
            <div style={{ height: 58 }} />
            <Screen key={tab} />
          </div>
          <BottomNav />

          {/* Layers in stacking order (see z in components/ui). */}
          <MyWeek />
          <AllTodos />
          <Inbox />
          <AllProjects />
          <AllFocuses />
          <AccountSubScreen />
          <CalendarOverlay />
          <Detail />
          <AiChat />
          <QuickAddSheet />
          <RowActionSheet />
          <TodoPeek />
          <Toast />
        </div>
      </IOSDevice>
    </div>
  );
}

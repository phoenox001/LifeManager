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
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    const delta = top - lastTop.current;
    lastTop.current = top;
    if (delta > 2 && top > 30 && !navCollapsed) setNavCollapsed(true);
    else if (delta < -2 && navCollapsed) setNavCollapsed(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <IOSDevice dark={theme === 'dark'}>
        <div
          className={'theme-' + theme}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', -apple-system, sans-serif" }}
        >
          <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }} onScroll={onScroll}>
            <div style={{ height: 58 }} />
            <Screen key={tab} />
          </div>
          <BottomNav />

          <Detail />
          <TodoPeek />
          <MyWeek />
          <CalendarOverlay />
          <AllProjects />
          <AllFocuses />
          <AllTodos />
          <Inbox />
          <AccountSubScreen />
          <AiChat />
          <QuickAddSheet />
          <RowActionSheet />
          <Toast />
        </div>
      </IOSDevice>
    </div>
  );
}

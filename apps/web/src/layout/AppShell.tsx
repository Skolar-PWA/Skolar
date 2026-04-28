import type { ReactNode } from 'react';
import { AccountDrawer } from './AccountDrawer';
import { CommandPalette } from './CommandPalette';
import Sidebar from './Sidebar';
import { MobileNav } from './MobileNav';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <AccountDrawer />
        <CommandPalette />
        <Topbar />
        <main className="page-content">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}

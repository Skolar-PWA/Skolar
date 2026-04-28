import { Menu, Search, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { useMatchMedia } from '../hooks/useMatchMedia';

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const setCommandMenuOpen = useUIStore((s) => s.setCommandMenuOpen);
  const accountDrawerOpen = useUIStore((s) => s.accountDrawerOpen);
  const setAccountDrawerOpen = useUIStore((s) => s.setAccountDrawerOpen);
  const isMobile = useMatchMedia('(max-width: 768px)');

  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const label = useMemo(
    () => (user?.branchId ? 'Main Campus' : 'EduPortal'),
    [user?.branchId],
  );

  const openMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {isMobile && (
          <button
            type="button"
            className="topbar-menu-btn"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        )}
        <button
          type="button"
          className="topbar-menu-btn"
          onClick={() => setCommandMenuOpen(true)}
          aria-label="Search pages (Ctrl+K)"
        >
          <Search size={18} strokeWidth={2} />
        </button>
        <div className="topbar-branch" title={label}>
          {label}
        </div>
      </div>

      {user && (
        <div className="topbar-right">
          {!isMobile && (
            <div
              className="online-pill"
              data-offline={!online}
              title={online ? 'Online' : 'Offline — changes will sync when back'}
            >
              <span className="online-dot" />
              {online ? <Wifi size={14} /> : <WifiOff size={14} />}
              {online ? 'Online' : 'Offline'}
            </div>
          )}

          <div className="topbar-account">
            <button
              type="button"
              className="topbar-account-trigger"
              onClick={() => setAccountDrawerOpen(!accountDrawerOpen)}
              aria-expanded={accountDrawerOpen}
              aria-haspopup="dialog"
              aria-label="Account menu"
            >
              <span className="avatar">{initials(user.displayName)}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

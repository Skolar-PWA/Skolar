import { Avatar, Button } from '@eduportal/ui';
import { LogOut, Menu, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
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

  return (
    <header
      style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          {user?.branchId ? 'Main Campus' : 'EduPortal'}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          title={online ? 'Online' : 'Offline — changes will sync when back'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 999,
            background: online ? 'var(--color-success-light)' : 'var(--color-warning-light)',
            color: online ? 'var(--color-success)' : 'var(--color-warning)',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {online ? <Wifi size={14} /> : <WifiOff size={14} />}
          {online ? 'Online' : 'Offline'}
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={user.displayName} src={user.photoUrl} size={34} />
            <div style={{ display: 'none' }} className="topbar-user-meta">
              <div style={{ fontWeight: 600, fontSize: 13 }}>{user.displayName}</div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                }}
              >
                {user.role.replace('_', ' ')}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} leftIcon={<LogOut size={14} />}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

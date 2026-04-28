import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { useMatchMedia } from '../hooks/useMatchMedia';

const AVATAR = '/assets/avators/student.webp';
const PRO_ROCKET_ILLU = '/assets/illustrations/upgrade.png';

const DRAWER_NAV: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/fees', label: 'Fees', icon: Wallet },
  { to: '/settings', label: 'Account settings', icon: Settings },
];

const easePanel = [0.25, 0.1, 0.25, 1] as const;

export function AccountDrawer() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const open = useUIStore((s) => s.accountDrawerOpen);
  const setOpen = useUIStore((s) => s.setAccountDrawerOpen);
  const isMobile = useMatchMedia('(max-width: 768px)');
  const location = useLocation();
  const navigate = useNavigate();

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

  const close = useCallback(() => setOpen(false), [setOpen]);
  const locationKeyRef = useRef<string | null>(null);

  // Close on any in-app navigation (covers NavLink edge cases and same-route retaps).
  useLayoutEffect(() => {
    const key = `${location.pathname}${location.search}`;
    if (locationKeyRef.current === null) {
      locationKeyRef.current = key;
      return;
    }
    if (locationKeyRef.current === key) return;
    locationKeyRef.current = key;
    setOpen(false);
  }, [location.pathname, location.search, setOpen]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  const handleLogout = () => {
    close();
    logout();
  };

  if (!user) return null;

  const node = (
    <AnimatePresence>
      {open && (
        <div className="account-drawer-root" role="presentation">
          <motion.div
            key="account-drawer-backdrop"
            className="account-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            key="account-drawer"
            className="account-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: easePanel }}
            role="dialog"
            aria-modal="true"
            aria-label="Account and profile"
          >
            <div className="account-drawer-inner">
              <div className="account-drawer-top">
                <button
                  type="button"
                  className="account-drawer-close"
                  onClick={close}
                  aria-label="Close"
                >
                  <X size={20} strokeWidth={2} />
                </button>
                <div className="account-drawer-profile">
                  <div className="account-drawer-avatar-wrap">
                    <img
                      src={AVATAR}
                      alt=""
                      width={88}
                      height={88}
                      className="account-drawer-avatar"
                    />
                  </div>
                  <div className="account-drawer-name">{user.displayName}</div>
                  <div className="account-drawer-email">
                    {user.email && user.email.length > 0 ? user.email : 'add your email'}
                  </div>
                  <div className="account-drawer-role">{user.role.replaceAll('_', ' ')}</div>
                  {isMobile && (
                    <div
                      className="account-drawer-online online-pill"
                      data-offline={!online}
                    >
                      <span className="online-dot" />
                      {online ? <Wifi size={14} /> : <WifiOff size={14} />}
                      {online ? 'Online' : 'Offline'}
                    </div>
                  )}
                </div>
              </div>

              <div className="account-drawer-section-divider" />

              <nav className="account-drawer-nav" aria-label="Account">
                {DRAWER_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `account-drawer-link${isActive ? ' account-drawer-link--active' : ''}`
                      }
                      onClick={() => close()}
                    >
                      <Icon className="account-drawer-link-icon" strokeWidth={2} aria-hidden />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="account-drawer-section-divider" />

              <div className="account-drawer-promo">
                <div className="account-drawer-promo-card">
                  <div className="account-drawer-promo-row">
                    <div className="account-drawer-promo-copy">
                      <span className="account-drawer-promo-badge">35% off</span>
                      <span className="account-drawer-promo-headline">Power up productivity!</span>
                      <button
                        type="button"
                        className="account-drawer-promo-btn"
                        onClick={() => {
                          close();
                          navigate('/settings');
                        }}
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                    <div className="account-drawer-promo-art" aria-hidden>
                      <img
                        className="account-drawer-promo-rocket"
                        src={PRO_ROCKET_ILLU}
                        alt=""
                        width={120}
                        height={120}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="account-drawer-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} strokeWidth={2} aria-hidden />
                Logout
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}

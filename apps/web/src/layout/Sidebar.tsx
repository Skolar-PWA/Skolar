import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  BookOpenCheck,
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Settings,
  UserCog,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { useUIStore } from '../store/ui';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: GraduationCap },
  { to: '/staff', label: 'Staff', icon: UserCog },
  { to: '/classes', label: 'Classes', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
  { to: '/results', label: 'Results', icon: BookOpenCheck },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/fees', label: 'Fees', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function useIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile, setSidebarOpen]);

  const content = (
    <aside
      style={{
        width: 240,
        background: 'var(--color-sidebar)',
        color: 'var(--color-sidebar-text)',
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 16px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            EP
          </div>
          EduPortal
        </div>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-sidebar-text)',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={{ textDecoration: 'none' }}
        >
          {({ isActive }) => (
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                background: isActive ? 'rgba(29, 78, 216, 0.18)' : 'transparent',
                color: isActive ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)',
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                fontFamily: 'var(--font-body)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: 'absolute',
                    left: -12,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    background: 'var(--color-sidebar-active)',
                    borderRadius: 4,
                  }}
                />
              )}
              <item.icon size={18} />
              {item.label}
            </motion.div>
          )}
        </NavLink>
      ))}
    </aside>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.5)',
              zIndex: 50,
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{ position: 'relative', height: '100%' }}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div
      style={{
        display: sidebarOpen ? 'block' : 'none',
      }}
      className="sidebar-desktop"
    >
      {content}
    </div>
  );
}

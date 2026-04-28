import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { MAIN_NAV } from '../navigation/mainNav';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { useMatchMedia } from '../hooks/useMatchMedia';

const AVATAR_DEFAULT = '/assets/avators/student.webp';

const easeSmooth = [0.32, 0.72, 0, 1] as const;

export function Sidebar() {
  const location = useLocation();
  const isMobile = useMatchMedia('(max-width: 768px)');
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const navLabelsVisible = useUIStore((s) => s.navLabelsVisible);
  const toggleNavCollapse = useUIStore((s) => s.toggleNavCollapse);

  const user = useAuthStore((s) => s.user);
  const labelsOff = !navLabelsVisible;
  const desktopAsideClass = [
    'sidebar',
    'sidebar--desktop',
    sidebarCollapsed && 'sidebar--collapsed',
    labelsOff && 'sidebar--labels-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile, setSidebarOpen]);

  const nav = (
    <nav className="sidebar-nav" aria-label="Main">
      {MAIN_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            title={item.label}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon aria-hidden className="nav-item-icon" strokeWidth={2} />
            <span className="nav-item-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  const header = (
    <div className="sidebar-header">
      <div className="sidebar-header-row">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">EP</div>
          <span className="sidebar-logo-text">EduPortal</span>
          {isMobile && (
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={2} />
            </button>
          )}
        </div>
        {!isMobile && (
          <div className="sidebar-rail sidebar-rail--edge">
            <button
              type="button"
              className="sidebar-rail-btn"
              onClick={toggleNavCollapse}
              aria-expanded={!sidebarCollapsed}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={16} strokeWidth={2.25} /> : <ChevronLeft size={16} strokeWidth={2.25} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const inner = (
    <>
      {header}
      <div className="sidebar-body">
        <div className="sidebar-nav-wrap">
          {nav}
        </div>
        <div className="sidebar-lower">
          <div className="sidebar-footer">
            <div className="sidebar-upgrade">
            <div className="sidebar-upgrade-profile">
              <div className="sidebar-upgrade-avatar-wrap">
                <img
                  className="sidebar-upgrade-avatar"
                  src={AVATAR_DEFAULT}
                  alt=""
                  width={56}
                  height={56}
                />
                <span className="sidebar-upgrade-badge">Free</span>
              </div>
              <div className="sidebar-upgrade-name">
                {user?.displayName ?? 'EduPortal'}
              </div>
              <div className="sidebar-upgrade-email">
                {user?.email && user.email.length > 0 ? user.email : 'add your email'}
              </div>
            </div>
            <button type="button" className="sidebar-upgrade-cta">
              <span className="sidebar-upgrade-cta-text">Upgrade to Pro</span>
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence mode="sync">
        {sidebarOpen && (
          <>
            <motion.div
              key="sidebar-backdrop"
              className="sidebar-backdrop"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38, ease: easeSmooth }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="sidebar-panel"
              className="sidebar sidebar--mobile-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: 'transform' }}
            >
              {inner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return <aside className={desktopAsideClass}>{inner}</aside>;
}

export default Sidebar;

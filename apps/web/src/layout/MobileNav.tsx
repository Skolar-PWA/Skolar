import { NavLink } from 'react-router-dom';
import {
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  MoreHorizontal,
  BookOpenCheck,
} from 'lucide-react';

const ITEMS = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: GraduationCap },
  { to: '/attendance', label: 'Attend.', icon: CalendarCheck },
  { to: '/results', label: 'Results', icon: BookOpenCheck },
  { to: '/settings', label: 'More', icon: MoreHorizontal },
];

export function MobileNav() {
  return (
    <nav className="mobile-nav">
      {ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className="mobile-nav-item">
          {({ isActive }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: 6,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                minWidth: 56,
              }}
            >
              <item.icon size={22} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</span>
            </div>
          )}
        </NavLink>
      ))}
      <style>{`
        .mobile-nav {
          display: none;
        }
        .mobile-nav-item {
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 767px) {
          .mobile-nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--color-surface);
            border-top: 1px solid var(--color-border);
            height: 64px;
            z-index: 40;
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </nav>
  );
}

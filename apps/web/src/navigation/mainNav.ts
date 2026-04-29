import type { LucideIcon } from 'lucide-react';
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
} from 'lucide-react';

export interface MainNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const MAIN_NAV: MainNavItem[] = [
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

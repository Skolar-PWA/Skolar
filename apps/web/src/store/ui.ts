import { create } from 'zustand';

const COLLAPSED_KEY = 'ep.sidebarCollapsed';

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

let navCollapseTimer: ReturnType<typeof setTimeout> | null = null;

function persistCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    /* ignore */
  }
}

interface UIState {
  /** Mobile drawer visibility */
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  /** Desktop rail width */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** false while text is hidden (during collapse) or not yet shown after expand */
  navLabelsVisible: boolean;
  setNavLabelsVisible: (visible: boolean) => void;
  /** Stagger: collapse hides text first (smooth), then width; expand restores both at once. */
  toggleNavCollapse: () => void;
  /** Global route search (command palette) */
  commandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  /** Right-side account / profile drawer */
  accountDrawerOpen: boolean;
  setAccountDrawerOpen: (open: boolean) => void;
}

const initialCollapsed = typeof window !== 'undefined' ? readCollapsed() : false;

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  sidebarCollapsed: initialCollapsed,
  navLabelsVisible: !initialCollapsed,
  setNavLabelsVisible: (navLabelsVisible) => set({ navLabelsVisible }),
  setSidebarCollapsed: (sidebarCollapsed) => {
    persistCollapsed(sidebarCollapsed);
    set({ sidebarCollapsed, navLabelsVisible: !sidebarCollapsed });
  },
  commandMenuOpen: false,
  setCommandMenuOpen: (commandMenuOpen) => set({ commandMenuOpen }),

  accountDrawerOpen: false,
  setAccountDrawerOpen: (accountDrawerOpen) => set({ accountDrawerOpen }),

  toggleNavCollapse: () => {
    if (navCollapseTimer) {
      clearTimeout(navCollapseTimer);
      navCollapseTimer = null;
    }
    const s = get();
    /* Mid-collapse: text already hidden, width not yet — restore labels */
    if (!s.navLabelsVisible && !s.sidebarCollapsed) {
      set({ navLabelsVisible: true });
      return;
    }
    if (s.sidebarCollapsed) {
      persistCollapsed(false);
      set({ sidebarCollapsed: false, navLabelsVisible: true });
    } else {
      set({ navLabelsVisible: false });
      navCollapseTimer = setTimeout(() => {
        persistCollapsed(true);
        set({ sidebarCollapsed: true });
        navCollapseTimer = null;
      }, 110);
    }
  },
}));

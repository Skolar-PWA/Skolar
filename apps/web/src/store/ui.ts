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
  setSidebarCollapsed: (sidebarCollapsed) => {
    persistCollapsed(sidebarCollapsed);
    set({ sidebarCollapsed });
  },
  commandMenuOpen: false,
  setCommandMenuOpen: (commandMenuOpen) => set({ commandMenuOpen }),

  accountDrawerOpen: false,
  setAccountDrawerOpen: (accountDrawerOpen) => set({ accountDrawerOpen }),

  toggleNavCollapse: () => {
    const next = !get().sidebarCollapsed;
    persistCollapsed(next);
    set({ sidebarCollapsed: next });
  },
}));

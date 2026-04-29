import { Search } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MAIN_NAV } from '../navigation/mainNav';
import { useUIStore } from '../store/ui';

export function CommandPalette() {
  const open = useUIStore((s) => s.commandMenuOpen);
  const setOpen = useUIStore((s) => s.setCommandMenuOpen);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const { commandMenuOpen, setCommandMenuOpen } = useUIStore.getState();
        setCommandMenuOpen(!commandMenuOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MAIN_NAV;
    return MAIN_NAV.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.to.toLowerCase().includes(q),
    );
  }, [query]);

  useLayoutEffect(() => {
    setHighlight(0);
  }, [items.length, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onEsc, true);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener('keydown', onEsc, true);
    };
  }, [open, setOpen]);

  const go = useCallback(
    (to: string) => {
      navigate(to);
      setOpen(false);
    },
    [navigate, setOpen],
  );

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (items.length ? (h + 1) % items.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) =>
        items.length ? (h - 1 + items.length) % items.length : 0,
      );
    } else if (e.key === 'Enter' && items[highlight]) {
      e.preventDefault();
      go(items[highlight].to);
    }
  };

  if (!open) return null;

  const node = (
    <div
      className="command-palette-backdrop"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search pages"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="command-palette-input-wrap">
          <Search size={18} strokeWidth={2} className="command-palette-input-icon" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            className="command-palette-input"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-controls="command-palette-list"
          />
          <span className="command-palette-esc" title="Close">
            Esc
          </span>
        </div>
        <ul id="command-palette-list" className="command-palette-list" role="listbox">
          {items.length === 0 ? (
            <li className="command-palette-empty">No pages match.</li>
          ) : (
            items.map((item, i) => (
              <li key={item.to} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={i === highlight}
                  className={`command-palette-item${i === highlight ? ' command-palette-item--active' : ''}`}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => go(item.to)}
                >
                  <span className="command-palette-item-title">{item.label}</span>
                  <span className="command-palette-item-path">{item.to}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

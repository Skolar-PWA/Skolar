import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@eduportal/ui';

export type SelectMenuOption = { value: string; label: string };

type SelectMenuProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectMenuOption[];
  'aria-label': string;
  className?: string;
};

/**
 * Custom select: styled trigger + popover list (replaces native &lt;select&gt; for consistent UI).
 */
export function SelectMenu({ value, onChange, options, 'aria-label': ariaLabel, className }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();
  const selected = options.find((o) => o.value === value);
  const si = options.findIndex((o) => o.value === value);
  const selectedIndex = si < 0 ? 0 : si;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    setHighlight(selectedIndex);
    const id = requestAnimationFrame(() => listRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const pick = (i: number) => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    close();
  };

  const onTriggerKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setHighlight(options.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(highlight);
    }
  };

  return (
    <div ref={rootRef} className={cn('ep-select', className)}>
      <button
        type="button"
        className="ep-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="ep-select-value">{selected?.label ?? '—'}</span>
        <ChevronDown
          size={18}
          className="ep-select-chevron"
          aria-hidden
          style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s ease' }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            className="ep-select-menu"
            role="listbox"
            tabIndex={-1}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            onKeyDown={onListKeyDown}
            style={{ originY: 0 }}
          >
            {options.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={cn('ep-select-option', i === highlight && 'ep-select-option--highlight', opt.value === value && 'ep-select-option--selected')}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => pick(i)}
              >
                <span className="ep-select-option-label">{opt.label}</span>
                {opt.value === value && <Check size={16} className="ep-select-check" strokeWidth={2.5} aria-hidden />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

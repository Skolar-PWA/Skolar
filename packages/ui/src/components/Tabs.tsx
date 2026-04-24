import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface Tab {
  key: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  right?: ReactNode;
}

export function Tabs({ tabs, active, onChange, right }: TabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        gap: 4,
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              style={{
                position: 'relative',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
              }}
            >
              {t.label}
              {isActive && (
                <motion.div
                  layoutId="ep-tabs-underline"
                  style={{
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    bottom: -1,
                    height: 2,
                    background: 'var(--color-primary)',
                    borderRadius: 2,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

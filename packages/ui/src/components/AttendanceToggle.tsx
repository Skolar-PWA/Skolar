import { motion } from 'framer-motion';
import type { AttendanceStatus } from '@eduportal/shared';

export interface AttendanceToggleProps {
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
  disabled?: boolean;
}

const OPTIONS: { key: AttendanceStatus; label: string; bg: string; fg: string }[] = [
  { key: 'present', label: 'P', bg: 'var(--color-success)', fg: '#fff' },
  { key: 'absent', label: 'A', bg: 'var(--color-danger)', fg: '#fff' },
  { key: 'late', label: 'L', bg: 'var(--color-warning)', fg: '#fff' },
  { key: 'excused', label: 'E', bg: 'var(--color-primary)', fg: '#fff' },
];

export function AttendanceToggle({ value, onChange, disabled }: AttendanceToggleProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--color-surface-2)',
        padding: 4,
        borderRadius: 12,
        gap: 4,
      }}
    >
      {OPTIONS.map((opt) => {
        const active = opt.key === value;
        return (
          <motion.button
            key={opt.key}
            whileTap={disabled ? undefined : { scale: 0.92 }}
            onClick={() => !disabled && onChange(opt.key)}
            disabled={disabled}
            aria-pressed={active}
            aria-label={opt.key}
            style={{
              minWidth: 48,
              height: 40,
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              fontFamily: 'var(--font-heading)',
              background: active ? opt.bg : 'transparent',
              color: active ? opt.fg : 'var(--color-text-secondary)',
              transition: 'background 150ms ease, color 150ms ease',
            }}
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}

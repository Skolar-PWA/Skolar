import type { ReactNode, CSSProperties } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
}

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  success: { background: 'var(--color-success-light)', color: 'var(--color-success)' },
  warning: { background: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  danger: { background: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  info: { background: '#dbeafe', color: '#1e40af' },
  primary: { background: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  neutral: { background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' },
};

export function Badge({ children, variant = 'neutral', style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

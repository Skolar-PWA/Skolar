import type { ReactNode, CSSProperties } from 'react';
import { cn } from '../utils/cn';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  success: 'badge badge-green',
  warning: 'badge badge-amber',
  danger: 'badge badge-red',
  info: 'badge badge-blue',
  primary: 'badge badge-blue',
  neutral: 'badge badge-gray',
};

const variantStyles: Record<BadgeVariant, CSSProperties> = {
  success: {},
  warning: {},
  danger: {},
  info: {},
  primary: {},
  neutral: {},
};

export function Badge({ children, variant = 'neutral', style, className }: BadgeProps) {
  return (
    <span className={cn(variantClass[variant], className)} style={{ ...variantStyles[variant], ...style }}>
      {children}
    </span>
  );
}

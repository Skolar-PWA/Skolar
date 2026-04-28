import { motion, type HTMLMotionProps } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

/** Matches apps/landing Navbar "Start Free Trial" CTA */
const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 15px rgba(0, 173, 239, 0.3)',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-xs)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
    border: '1px solid var(--red-border)',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: {
    minHeight: 36,
    padding: '8px 16px',
    fontSize: 14,
    borderRadius: 10,
    fontWeight: 600,
  },
  md: {
    minHeight: 44,
    padding: '12px 28px',
    fontSize: 15,
    borderRadius: 12,
    fontWeight: 700,
  },
  lg: {
    minHeight: 48,
    padding: '14px 32px',
    fontSize: 16,
    borderRadius: 12,
    fontWeight: 700,
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  disabled,
  children,
  className,
  style,
  ...rest
}: ButtonProps) {
  const primaryHover =
    variant === 'primary' && !disabled && !loading;

  return (
    <motion.button
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      whileHover={
        disabled || loading
          ? undefined
          : primaryHover
            ? { y: -2, filter: 'brightness(1.1)' }
            : variant === 'ghost'
              ? { background: 'var(--color-primary-light)' }
              : { filter: 'brightness(1.02)' }
      }
      transition={{ duration: 0.2 }}
      disabled={disabled || loading}
      className={cn('ep-button', variant === 'primary' && 'ep-button--primary', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: 'var(--font-heading)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: 14,
            height: 14,
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'ep-spin 600ms linear infinite',
          }}
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
      <style>{`@keyframes ep-spin { to { transform: rotate(360deg); } }`}</style>
    </motion.button>
  );
}

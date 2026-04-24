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

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--color-primary)',
    color: '#fff',
    border: '1px solid var(--color-primary)',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-primary)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--color-danger)',
    color: '#fff',
    border: '1px solid var(--color-danger)',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { height: 32, padding: '0 12px', fontSize: 13, borderRadius: 8 },
  md: { height: 40, padding: '0 16px', fontSize: 14, borderRadius: 10 },
  lg: { height: 48, padding: '0 20px', fontSize: 15, borderRadius: 12 },
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
  return (
    <motion.button
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      whileHover={
        disabled || loading
          ? undefined
          : {
              filter: 'brightness(1.05)',
            }
      }
      transition={{ duration: 0.12 }}
      disabled={disabled || loading}
      className={cn('ep-button', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'filter 120ms ease',
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

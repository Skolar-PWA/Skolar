import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, style, id, wrapperClassName, inputClassName, ...rest },
  ref,
) {
  const inputId = id ?? `in-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div
        className={cn('ep-input-shell', wrapperClassName)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          height: 42,
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 10,
          background: 'var(--color-surface)',
          transition: 'border-color 120ms ease',
        }}
      >
        {leftIcon && (
          <span style={{ color: 'var(--color-text-muted)', display: 'flex' }}>{leftIcon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('ep-input-el', inputClassName)}
          {...rest}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: 14,
            background: 'transparent',
            color: 'var(--color-text-primary)',
            height: '100%',
            ...style,
          }}
        />
        {rightIcon && (
          <span style={{ color: 'var(--color-text-muted)', display: 'flex' }}>{rightIcon}</span>
        )}
      </div>
      {error && (
        <div style={{ fontSize: 12, color: 'var(--color-danger)' }}>{error}</div>
      )}
      {!error && hint && (
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{hint}</div>
      )}
    </div>
  );
});

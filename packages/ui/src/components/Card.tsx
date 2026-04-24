import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  none: '0',
  sm: '12px',
  md: '20px',
  lg: '28px',
};

export function Card({
  interactive,
  padding = 'md',
  className,
  children,
  style,
  ...rest
}: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -2, boxShadow: 'var(--shadow-md)' } : undefined}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('ep-card', className)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        padding: paddingMap[padding],
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

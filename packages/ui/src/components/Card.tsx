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
      whileHover={interactive ? { y: -2 } : undefined}
      transition={{ duration: 0.18 }}
      className={cn('ep-card', className)}
      style={{
        padding: paddingMap[padding],
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

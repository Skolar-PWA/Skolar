import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'right' | 'left';
  width?: number;
  footer?: ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'right',
  width = 440,
  footer,
}: DrawerProps) {
  const xFrom = side === 'right' ? width : -width;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 90,
          }}
        >
          <motion.aside
            initial={{ x: xFrom }}
            animate={{ x: 0 }}
            exit={{ x: xFrom }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              [side]: 0,
              width: `min(100vw, ${width}px)`,
              background: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {title && (
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--color-border)',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  fontSize: 18,
                }}
              >
                {title}
              </div>
            )}
            <div style={{ padding: 24, overflow: 'auto', flex: 1 }}>{children}</div>
            {footer && (
              <div
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                }}
              >
                {footer}
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

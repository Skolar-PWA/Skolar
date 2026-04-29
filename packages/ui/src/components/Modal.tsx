import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  /** `card` = same soft shadow + no inner borders as app section cards (EduPortal). */
  variant?: 'default' | 'card';
}

const sizeMap = { sm: 420, md: 560, lg: 720 };

/** Aligns with apps/web `.section-card` layered shadow (no hairline border). */
const cardPanelShadow: CSSProperties['boxShadow'] =
  '0 0 24px -6px rgb(0 0 0 / 0.1), 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)';

export function Modal({ open, onClose, title, children, size = 'md', footer, variant = 'default' }: ModalProps) {
  const isCard = variant === 'card';
  const panelStyle: CSSProperties = isCard
    ? {
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        boxShadow: cardPanelShadow,
        border: 'none',
        width: '100%',
        maxWidth: sizeMap[size],
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }
    : {
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card, var(--shadow-md))',
        width: '100%',
        maxWidth: sizeMap[size],
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      };
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
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={panelStyle}
            role="dialog"
            aria-modal="true"
          >
            {title && (
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: isCard ? 'none' : '1px solid var(--color-border)',
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
                  borderTop: isCard ? 'none' : '1px solid var(--color-border)',
                  background: isCard ? 'var(--color-surface)' : 'var(--color-surface-2)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

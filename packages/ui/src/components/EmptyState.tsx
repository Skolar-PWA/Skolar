import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="ep-empty-state">
      {icon != null && (
        <div className="ep-empty-state__icon">{typeof icon === 'string' ? <span>{icon}</span> : icon}</div>
      )}
      <div>
        <div className="ep-empty-state__title">{title}</div>
        {description && <div className="ep-empty-state__desc">{description}</div>}
      </div>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

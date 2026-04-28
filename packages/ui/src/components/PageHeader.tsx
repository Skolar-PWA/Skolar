import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="page-top">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="page-breadcrumb">
            {breadcrumbs.map((b, i) => (
              <span key={i}>
                {b.href ? (
                  <Link to={b.href}>{b.label}</Link>
                ) : (
                  b.label
                )}
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && (
          <div style={{ fontSize: 14, color: 'var(--text-500)', marginTop: 4, fontFamily: 'var(--font-body)' }}>
            {subtitle}
          </div>
        )}
      </div>
      {action && <div className="page-actions">{action}</div>}
    </div>
  );
}

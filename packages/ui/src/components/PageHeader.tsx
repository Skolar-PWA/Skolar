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
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--color-bg)',
        paddingBlock: '20px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 16,
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: 20,
      }}
    >
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div
            style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
              marginBottom: 6,
              display: 'flex',
              gap: 4,
              flexWrap: 'wrap',
            }}
          >
            {breadcrumbs.map((b, i) => (
              <span key={i}>
                {b.href ? (
                  <a href={b.href} style={{ color: 'inherit' }}>
                    {b.label}
                  </a>
                ) : (
                  b.label
                )}
                {i < breadcrumbs.length - 1 && <span style={{ margin: '0 4px' }}>/</span>}
              </span>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>{title}</h1>
        {subtitle && (
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{subtitle}</div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

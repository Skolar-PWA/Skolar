import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  empty?: ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  empty,
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} height={48} />
        ))}
      </div>
    );
  }
  if (!rows.length) {
    return <>{empty ?? <EmptyState title="No records yet" />}</>;
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align ?? 'left',
                  width: c.width,
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <motion.tr
              key={rowKey(row)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.04, 0.4), duration: 0.2 }}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
              }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{
                    textAlign: c.align ?? 'left',
                  }}
                >
                  {c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] as ReactNode}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

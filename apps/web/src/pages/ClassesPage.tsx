import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, LoadingSkeleton, PageHeader, Badge, EmptyState } from '@eduportal/ui';
import { Users } from 'lucide-react';
import { classesService } from '../services/api/classes.service';
import { useAuthStore } from '../store/auth';

export default function ClassesPage() {
  const branchId = useAuthStore((s) => s.user?.branchId) ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['classes', branchId],
    queryFn: () => classesService.list(branchId),
    enabled: !!branchId,
  });

  return (
    <div>
      <PageHeader
        title="Classes & Sections"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Classes' }]}
      />
      {isLoading ? (
        <LoadingSkeleton height={200} />
      ) : !data?.length ? (
        <Card padding="lg">
          <EmptyState
            icon={<Users size={28} />}
            title="No classes yet"
            description="Create classes to start organising students and timetables."
          />
        </Card>
      ) : (
        <div className="grid grid-3">
          {data.map((c) => (
            <Card key={c.id} interactive padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3>{c.name}</h3>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                    Grade order {c.numericOrder}
                  </div>
                </div>
                <Badge variant="primary">
                  {c._count.sections} sections
                </Badge>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {c.sections.map((s) => (
                  <Link
                    key={s.id}
                    to={`/attendance/mark/${s.id}`}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'var(--color-surface-2)',
                      color: 'var(--color-text-primary)',
                      fontWeight: 600,
                      fontSize: 13,
                      textDecoration: 'none',
                    }}
                  >
                    {c.name} · {s.name}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

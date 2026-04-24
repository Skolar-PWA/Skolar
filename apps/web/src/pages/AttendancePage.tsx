import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button, Card, LoadingSkeleton, PageHeader, EmptyState, Badge } from '@eduportal/ui';
import { CalendarCheck, QrCode } from 'lucide-react';
import { classesService } from '../services/api/classes.service';
import { useAuthStore } from '../store/auth';

export default function AttendancePage() {
  const branchId = useAuthStore((s) => s.user?.branchId) ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['classes', branchId],
    queryFn: () => classesService.list(branchId),
    enabled: !!branchId,
  });

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Mark attendance for your class or use the QR scanner"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Attendance' }]}
        action={
          <Link to="/attendance/scan">
            <Button leftIcon={<QrCode size={14} />}>QR Scanner</Button>
          </Link>
        }
      />

      {isLoading ? (
        <LoadingSkeleton height={200} />
      ) : !data?.length ? (
        <Card padding="lg">
          <EmptyState
            icon={<CalendarCheck size={28} />}
            title="No sections yet"
            description="Create classes and sections to mark attendance."
          />
        </Card>
      ) : (
        <div className="grid grid-3">
          {data.flatMap((c) =>
            c.sections.map((s) => (
              <Link
                key={s.id}
                to={`/attendance/mark/${s.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card interactive padding="md">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3>{c.name}</h3>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        Section {s.name}
                      </div>
                    </div>
                    <Badge variant="primary">Mark today</Badge>
                  </div>
                </Card>
              </Link>
            )),
          )}
        </div>
      )}
    </div>
  );
}

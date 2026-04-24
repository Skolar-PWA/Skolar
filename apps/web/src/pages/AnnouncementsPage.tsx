import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, EmptyState, LoadingSkeleton, PageHeader, Badge } from '@eduportal/ui';
import { Megaphone, Pin } from 'lucide-react';
import { announcementsService } from '../services/api/announcements.service';
import { useAuthStore } from '../store/auth';

export default function AnnouncementsPage() {
  const branchId = useAuthStore((s) => s.user?.branchId) ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['announcements-page', branchId],
    queryFn: () => announcementsService.list(branchId),
    enabled: !!branchId,
  });

  return (
    <div>
      <PageHeader
        title="Announcements"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Announcements' }]}
      />
      {isLoading ? (
        <LoadingSkeleton height={200} />
      ) : !data?.length ? (
        <Card padding="lg">
          <EmptyState
            icon={<Megaphone size={28} />}
            title="No announcements yet"
            description="Post an update to reach teachers, parents or students."
          />
        </Card>
      ) : (
        <div className="col">
          {data.map((a) => (
            <Card key={a.id} padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <h3>
                  {a.isPinned && <Pin size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />}
                  {a.title}
                </h3>
                <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                  {format(new Date(a.postedAt), 'd MMM yyyy, h:mm a')}
                </div>
              </div>
              <div style={{ color: 'var(--color-text-secondary)', marginBottom: 10 }}>{a.body}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {a.targetRoles.map((r) => (
                  <Badge key={r} variant="neutral">{r.replace('_', ' ')}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

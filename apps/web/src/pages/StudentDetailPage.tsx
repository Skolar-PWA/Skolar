import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, Badge, Card, LoadingSkeleton, PageHeader, Tabs } from '@eduportal/ui';
import { studentsService } from '../services/api/students.service';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState('overview');
  const { data, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsService.get(id!),
    enabled: !!id,
  });

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader title="Loading…" />
        <LoadingSkeleton height={300} />
      </div>
    );
  }

  const s = data as typeof data & {
    enrollments?: Array<{
      section: { name: string; class: { name: string; academicYear?: { label: string } } };
    }>;
    parents?: Array<{ parent: { firstName: string; lastName: string; phone: string; relation: string | null } }>;
  };
  const fullName = `${s.firstName} ${s.lastName}`;
  const current = s.enrollments?.[0];

  return (
    <div>
      <PageHeader
        title={fullName}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Students', href: '/students' },
          { label: fullName },
        ]}
      />

      <Card padding="lg" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar name={fullName} src={s.photoUrl} size={72} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2>{fullName}</h2>
            <div style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
              Roll {s.rollNo ?? '—'} · QR {s.qrToken.slice(0, 12)}…
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {s.gender && <Badge variant="neutral">{s.gender}</Badge>}
              {current && (
                <Badge variant="primary">
                  {current.section.class.name} · {current.section.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'attendance', label: 'Attendance' },
          { key: 'results', label: 'Results' },
          { key: 'fees', label: 'Fees' },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div style={{ marginTop: 16 }}>
        {tab === 'overview' && (
          <div className="grid grid-2">
            <Card padding="md">
              <h3 style={{ marginBottom: 12 }}>Parents</h3>
              {s.parents && s.parents.length > 0 ? (
                s.parents.map((p) => (
                  <div key={p.parent.phone} style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600 }}>
                      {p.parent.firstName} {p.parent.lastName}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                      {p.parent.relation ?? 'Guardian'} · {p.parent.phone}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                  No parents linked yet.
                </div>
              )}
            </Card>

            <Card padding="md">
              <h3 style={{ marginBottom: 12 }}>Enrollment History</h3>
              {s.enrollments && s.enrollments.length > 0 ? (
                s.enrollments.map((e, i) => (
                  <div
                    key={i}
                    style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {e.section.class.name} · {e.section.name}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                      {e.section.class.academicYear?.label ?? 'Year'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No enrollments.</div>
              )}
            </Card>
          </div>
        )}
        {tab === 'attendance' && <Card padding="lg"><div>Attendance calendar coming soon.</div></Card>}
        {tab === 'results' && <Card padding="lg"><div>Results timeline coming soon.</div></Card>}
        {tab === 'fees' && <Card padding="lg"><div>Fee records coming soon.</div></Card>}
      </div>
    </div>
  );
}

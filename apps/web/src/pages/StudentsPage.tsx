import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  DataTable,
  Input,
  PageHeader,
  type Column,
} from '@eduportal/ui';
import { Plus, Search, Upload } from 'lucide-react';
import type { StudentDto } from '@eduportal/shared';
import { studentsService } from '../services/api/students.service';
import { useAuthStore } from '../store/auth';

type Row = StudentDto & {
  enrollments?: Array<{ section: { name: string; class: { name: string } } }>;
};

export default function StudentsPage() {
  const user = useAuthStore((s) => s.user);
  const nav = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['students', user?.branchId, page, search],
    queryFn: () =>
      studentsService.list({ branchId: user!.branchId!, page, search, limit: 25 }),
    enabled: !!user?.branchId,
  });

  const columns: Column<Row>[] = [
    {
      key: 'name',
      header: 'Student',
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={`${s.firstName} ${s.lastName}`} src={s.photoUrl} size={32} />
          <div>
            <div style={{ fontWeight: 600 }}>
              {s.firstName} {s.lastName}
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              Roll {s.rollNo ?? '—'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (s) => {
        const e = s.enrollments?.[0];
        return e ? `${e.section.class.name} · ${e.section.name}` : '—';
      },
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (s) => <Badge variant="neutral">{s.gender ?? '—'}</Badge>,
    },
    { key: 'qrToken', header: 'QR', render: (s) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.qrToken.slice(0, 8)}…</span> },
  ];

  const totalPages = (data?.meta?.totalPages as number | undefined) ?? 1;

  return (
    <div>
      <PageHeader
        title="Students"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Students' }]}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" leftIcon={<Upload size={14} />}>
              Bulk import
            </Button>
            <Button leftIcon={<Plus size={14} />}>Add student</Button>
          </div>
        }
      />

      <Card padding="sm" style={{ marginBottom: 16 }}>
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Search by name or roll number…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </Card>

      <Card padding="none">
        <DataTable
          columns={columns}
          rows={(data?.data as Row[]) ?? []}
          loading={isLoading}
          rowKey={(s) => s.id}
          onRowClick={(s) => nav(`/students/${s.id}`)}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            borderTop: '1px solid var(--color-border)',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
          }}
        >
          <div>
            Page {page} of {totalPages}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

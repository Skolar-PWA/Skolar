import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, DataTable, EmptyState, PageHeader, type Column } from '@eduportal/ui';
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
        <div className="student-cell">
          <Avatar name={`${s.firstName} ${s.lastName}`} src={s.photoUrl} size={34} />
          <div>
            <div className="student-name">
              {s.firstName} {s.lastName}
            </div>
            <div className="student-roll">Roll {s.rollNo ?? '—'}</div>
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
    {
      key: 'qrToken',
      header: 'QR',
      render: (s) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.qrToken.slice(0, 8)}…</span>
      ),
    },
  ];

  const totalPages = (data?.meta?.totalPages as number | undefined) ?? 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <PageHeader
        title="Students"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Students' }]}
        action={
          <>
            <Button variant="secondary" leftIcon={<Upload size={14} />}>
              Bulk import
            </Button>
            <Button leftIcon={<Plus size={14} />}>Add student</Button>
          </>
        }
      />

      <div className="list-toolbar">
        <div className="search-box">
          <Search aria-hidden />
          <input
            type="search"
            placeholder="Search by name or roll number…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            aria-label="Search students"
          />
        </div>
      </div>

      <div className="list-card">
        <DataTable
          columns={columns}
          rows={(data?.data as Row[]) ?? []}
          loading={isLoading}
          empty={
            <EmptyState
              icon="👨‍🎓"
              title="No students yet"
              description="Add your first student or bulk import from an Excel file."
              action={<Button leftIcon={<Plus size={14} />}>+ Add Student</Button>}
            />
          }
          rowKey={(s) => s.id}
          onRowClick={(s) => nav(`/students/${s.id}`)}
        />
        {(data?.data?.length ?? 0) > 0 && (
          <div className="table-footer">
            <div className="table-count">
              Page {page} of {totalPages}
            </div>
            <div className="pagination">
              <button
                type="button"
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

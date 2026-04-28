import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, PageHeader, Button } from '@eduportal/ui';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UserRole } from '@eduportal/shared';
import { useAuthStore } from '../store/auth';
import { branchSettingsService } from '../services/api/branchSettings.service';

const EDIT_ROLES: string[] = [
  UserRole.super_admin,
  UserRole.school_admin,
  UserRole.branch_manager,
];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const branchId = user?.branchId;
  const canViewBranch = Boolean(
    branchId && user && user.role !== UserRole.student && user.role !== UserRole.parent,
  );
  const canEdit = Boolean(canViewBranch && user && EDIT_ROLES.includes(user.role));

  const q = useQuery({
    queryKey: ['branch-settings', branchId],
    queryFn: () => branchSettingsService.get(branchId!),
    enabled: Boolean(canViewBranch && branchId),
  });

  const [deadline, setDeadline] = useState('09:30');
  const [editEnd, setEditEnd] = useState('23:59');

  useEffect(() => {
    if (q.data) {
      setDeadline(q.data.attendanceDeadlineTime);
      setEditEnd(q.data.attendanceEditWindowEnd);
    }
  }, [q.data]);

  const saveM = useMutation({
    mutationFn: () =>
      branchSettingsService.update(branchId!, {
        attendanceDeadlineTime: deadline,
        attendanceEditWindowEnd: editEnd,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['branch-settings'] });
      toast.success('Branch settings saved');
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Settings' }]}
      />
      <div className="grid grid-2">
        <Card padding="md">
          <h3 style={{ marginBottom: 12 }}>Profile</h3>
          <Row label="Name" value={user?.displayName ?? '—'} />
          <Row label="Role" value={user?.role ?? '—'} />
          <Row label="Email" value={user?.email ?? '—'} />
          <Row label="Phone" value={user?.phone ?? '—'} />
        </Card>
        <Card padding="md">
          <h3 style={{ marginBottom: 12 }}>School</h3>
          <Row label="Branch" value={user?.branchId ?? '—'} />
          <Row label="School group" value={user?.schoolGroupId ?? '—'} />
        </Card>
      </div>

      {canViewBranch && branchId && (
        <Card padding="md" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>Attendance (branch)</h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            <strong>Cutoff time</strong> is used to flag late attendance marking and to send a daily in-app
            summary after that time to the branch admin, branch manager, and attendance officer (substitute),
            including classes that are still not marked.
          </p>
          {q.isLoading ? (
            <p style={{ fontSize: 14 }}>Loading…</p>
          ) : q.isError ? (
            <p style={{ fontSize: 14, color: 'var(--color-danger)' }}>Could not load settings.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 16,
                maxWidth: 420,
              }}
            >
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Daily attendance cutoff (24h)</span>
                <input
                  type="time"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  disabled={!canEdit}
                  style={{
                    height: 44,
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    padding: '0 12px',
                    fontSize: 15,
                    maxWidth: 200,
                    opacity: canEdit ? 1 : 0.85,
                  }}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Class teachers may edit same-day attendance until (24h)</span>
                <input
                  type="time"
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  disabled={!canEdit}
                  style={{
                    height: 44,
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    padding: '0 12px',
                    fontSize: 15,
                    maxWidth: 200,
                    opacity: canEdit ? 1 : 0.85,
                  }}
                />
              </label>
              {canEdit && (
                <div>
                  <Button type="button" loading={saveM.isPending} onClick={() => saveM.mutate()}>
                    Save attendance settings
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid var(--color-border)',
        fontSize: 14,
      }}
    >
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

import { Card, PageHeader } from '@eduportal/ui';
import { useAuthStore } from '../store/auth';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
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

import { Button, Card, EmptyState, PageHeader } from '@eduportal/ui';
import { Plus, UserCog } from 'lucide-react';

export default function StaffPage() {
  return (
    <div>
      <PageHeader
        title="Staff"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Staff' }]}
        action={<Button leftIcon={<Plus size={14} />}>Add staff member</Button>}
      />
      <Card padding="lg">
        <EmptyState
          icon={<UserCog size={28} />}
          title="Staff list"
          description="Manage teachers, admins, and branch managers. Use the API /api/v1/staff endpoint — the UI will be wired up next."
        />
      </Card>
    </div>
  );
}

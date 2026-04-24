import { Card, EmptyState, PageHeader } from '@eduportal/ui';
import { BookOpenCheck } from 'lucide-react';

export default function ResultsPage() {
  return (
    <div>
      <PageHeader
        title="Results"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Results' }]}
      />
      <Card padding="lg">
        <EmptyState
          icon={<BookOpenCheck size={28} />}
          title="Results & report cards"
          description="Create an exam, enter subject marks, then release to parents. Backend endpoints are live at /api/v1/exams."
        />
      </Card>
    </div>
  );
}

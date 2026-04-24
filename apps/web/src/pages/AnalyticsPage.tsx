import { Card, EmptyState, PageHeader } from '@eduportal/ui';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Analytics' }]}
      />
      <Card padding="lg">
        <EmptyState
          icon={<BarChart3 size={28} />}
          title="Student & teacher analytics"
          description="Trends across terms, subject-by-teacher audits, and per-student performance curves — wired up once exams have historical data."
        />
      </Card>
    </div>
  );
}

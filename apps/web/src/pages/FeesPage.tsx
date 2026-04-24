import { useQuery } from '@tanstack/react-query';
import { Card, EmptyState, LoadingSkeleton, PageHeader, StatCard } from '@eduportal/ui';
import { Wallet } from 'lucide-react';
import { formatPKR } from '@eduportal/shared';
import { feesService } from '../services/api/fees.service';
import { useAuthStore } from '../store/auth';

export default function FeesPage() {
  const branchId = useAuthStore((s) => s.user?.branchId) ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['fees-outstanding', branchId],
    queryFn: () => feesService.outstanding(branchId),
    enabled: !!branchId,
  });

  return (
    <div>
      <PageHeader
        title="Fees"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Fees' }]}
      />
      {isLoading ? (
        <LoadingSkeleton height={120} />
      ) : (
        <div className="grid grid-3" style={{ marginBottom: 16 }}>
          <StatCard
            title="Total outstanding"
            value={data?.total ?? 0}
            formatter={(n) => formatPKR(n)}
          />
          <StatCard title="Overdue records" value={data?.count ?? 0} />
          <StatCard
            title="Collection rate"
            value={data && data.count ? Math.round(100 - Math.min(100, data.count)) : 100}
            suffix="%"
          />
        </div>
      )}

      <Card padding="lg">
        <EmptyState
          icon={<Wallet size={28} />}
          title="Fee management"
          description="Full fee voucher UI coming up. Backend endpoints live at /api/v1/fees."
        />
      </Card>
    </div>
  );
}

import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import {
  Card,
  StatCard,
  PageHeader,
  Badge,
  LoadingSkeleton,
  EmptyState,
} from '@eduportal/ui';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Megaphone, Pin, AlertCircle } from 'lucide-react';
import { formatPKR } from '@eduportal/shared';
import { useAuthStore } from '../store/auth';
import { attendanceService } from '../services/api/attendance.service';
import { announcementsService } from '../services/api/announcements.service';
import { feesService } from '../services/api/fees.service';

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const gridItem = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const branchId = user?.branchId ?? '';
  const today = format(new Date(), 'yyyy-MM-dd');

  const dailyQ = useQuery({
    queryKey: ['daily-by-class', branchId, today],
    queryFn: () => attendanceService.dailyByClass(branchId, today),
    enabled: !!branchId,
  });

  const annQ = useQuery({
    queryKey: ['announcements', branchId],
    queryFn: () => announcementsService.list(branchId),
    enabled: !!branchId,
  });

  const feeQ = useQuery({
    queryKey: ['fees-outstanding', branchId],
    queryFn: () => feesService.outstanding(branchId),
    enabled: !!branchId,
  });

  const attendancePct = dailyQ.data?.length
    ? Math.round(
        dailyQ.data.reduce((n, c) => n + c.percentPresent, 0) / dailyQ.data.length,
      )
    : 0;

  const totalStudents = dailyQ.data?.reduce((n, c) => n + c.total, 0) ?? 0;

  const attendanceSpark = Array.from({ length: 7 }).map((_, i) => {
    const wave = Math.sin(i * 0.9) * 6;
    return Math.round((attendancePct || 88) + wave);
  });

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.displayName?.split(' ')[0] ?? 'there'}`}
        subtitle={format(new Date(), 'EEEE, d MMM yyyy')}
      />

      <motion.div
        className="stats-grid"
        variants={grid}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={gridItem}>
          <StatCard
            title="Today's Attendance"
            value={attendancePct}
            suffix="%"
            delta={1.8}
            sparkline={attendanceSpark}
            sparklineColor="#22C55E"
          />
        </motion.div>
        <motion.div variants={gridItem}>
          <StatCard
            title="Total Students"
            value={totalStudents}
            delta={3.2}
            sparkline={[110, 112, 118, 121, 124, 128, totalStudents || 130]}
            sparklineColor="#3B82F6"
          />
        </motion.div>
        <motion.div variants={gridItem}>
          <StatCard
            title="Pending Disputes"
            value={0}
            sparkline={[2, 1, 3, 2, 1, 0, 0]}
            sparklineColor="#F59E0B"
          />
        </motion.div>
        <motion.div variants={gridItem}>
          <StatCard
            title="Outstanding Fees"
            value={feeQ.data?.total ?? 0}
            prefix=""
            formatter={(n) => formatPKR(n)}
            sparkline={[12000, 15000, 14500, 16000, 14800, 13800, feeQ.data?.total ?? 0]}
            sparklineColor="#EF4444"
          />
        </motion.div>
      </motion.div>

      <div className="dashboard-row">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'contents' }}
        >
          <Card padding="md" interactive className="chart-card-wrap">
            <div className="card-header" style={{ paddingBottom: 0 }}>
              <div>
                <div className="card-title">Today&apos;s Attendance by Class</div>
                <div className="card-subtitle">Percent present, per class</div>
              </div>
            </div>
            <div className="card-body chart-card-body">
              {dailyQ.isLoading ? (
                <LoadingSkeleton height={220} />
              ) : !dailyQ.data?.length ? (
                <EmptyState title="No classes yet" description="Add classes and students to start tracking." />
              ) : (
                <div style={{ width: '100%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyQ.data.map((d) => ({ name: d.name, value: d.percentPresent }))}>
                      <CartesianGrid vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--text-300)" fontSize={12} />
                      <YAxis stroke="var(--text-300)" fontSize={12} unit="%" domain={[0, 100]} />
                      <Tooltip formatter={(v: number) => `${v}%`} />
                      <Bar
                        dataKey="value"
                        fill="var(--color-primary)"
                        radius={[8, 8, 0, 0]}
                        animationDuration={900}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }} style={{ display: 'contents' }}>
          <Card padding="md" interactive>
            <div className="card-header" style={{ paddingBottom: 0 }}>
              <div>
                <div className="card-title">Pending Actions</div>
                <div className="card-subtitle">Things that need your attention</div>
              </div>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              {(dailyQ.data ?? [])
                .filter((c) => c.percentPresent === 0 && c.total > 0)
                .slice(0, 4)
                .map((c) => (
                  <ActionItem
                    key={c.classId}
                    icon={<AlertCircle size={18} />}
                    title={`${c.name} attendance not marked`}
                    desc={`${c.total} students waiting to be marked today`}
                    variant="warning"
                  />
                ))}
              {feeQ.data && feeQ.data.count > 0 && (
                <ActionItem
                  icon={<AlertCircle size={18} />}
                  title={`${feeQ.data.count} fee record(s) outstanding`}
                  desc={`Total ${formatPKR(feeQ.data.total)} pending`}
                  variant="danger"
                />
              )}
              {(!dailyQ.data ||
                dailyQ.data.every((c) => c.percentPresent > 0 || c.total === 0)) &&
                (!feeQ.data || feeQ.data.count === 0) && (
                  <EmptyState title="Everything's on track" description="No pending actions right now." />
                )}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="dashboard-row">
        <Card padding="md" interactive>
          <div className="card-header" style={{ paddingBottom: 0 }}>
            <div>
              <div className="card-title">Recent Announcements</div>
              <div className="card-subtitle">Latest from the school</div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            {annQ.isLoading ? (
              <LoadingSkeleton height={160} />
            ) : !annQ.data?.length ? (
              <EmptyState
                icon={<Megaphone size={24} />}
                title="No announcements yet"
                description="Post a note to reach teachers, parents or students."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {annQ.data.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: 12,
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      background: 'var(--bg-input)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                        {a.isPinned && <Pin size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />}
                        {a.title}
                      </div>
                      <span style={{ color: 'var(--text-500)', fontSize: 12 }}>
                        {format(new Date(a.postedAt), 'd MMM')}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-700)', fontSize: 13 }}>
                      {a.body.slice(0, 140)}
                      {a.body.length > 140 ? '…' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card padding="md" interactive>
          <div className="card-header" style={{ paddingBottom: 0 }}>
            <div>
              <div className="card-title">Upcoming Exams</div>
              <div className="card-subtitle">Next scheduled assessments</div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <EmptyState
              title="No upcoming exams"
              description="Create an exam from the Results page to schedule one."
            />
          </div>
        </Card>
      </div>

      <div style={{ height: 24 }} />
      <div style={{ color: 'var(--text-500)', fontSize: 12, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
        Data through {format(subDays(new Date(), 0), 'd MMM yyyy')} · EduPortal
      </div>
    </>
  );
}

function ActionItem({
  icon,
  title,
  desc,
  variant,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  variant: 'warning' | 'danger' | 'info';
}) {
  return (
    <div className={variant === 'danger' ? 'action-item action-item--danger' : 'action-item'}>
      <div className="action-item-icon">{icon}</div>
      <div className="action-item-text">
        <div className="action-item-title">{title}</div>
        <div className="action-item-sub">{desc}</div>
      </div>
      <Badge variant={variant === 'danger' ? 'danger' : 'warning'}>Action</Badge>
    </div>
  );
}

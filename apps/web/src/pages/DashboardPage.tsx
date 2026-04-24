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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

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
    <div>
      <PageHeader
        title={`Welcome back, ${user?.displayName?.split(' ')[0] ?? 'there'}`}
        subtitle={format(new Date(), "EEEE, d MMM yyyy")}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-4"
        style={{ marginBottom: 20 }}
      >
        <motion.div variants={item}>
          <StatCard
            title="Today's Attendance"
            value={attendancePct}
            suffix="%"
            delta={1.8}
            sparkline={attendanceSpark}
            sparklineColor="var(--color-success)"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Total Students"
            value={totalStudents}
            delta={3.2}
            sparkline={[110, 112, 118, 121, 124, 128, totalStudents || 130]}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Pending Disputes"
            value={0}
            sparkline={[2, 1, 3, 2, 1, 0, 0]}
            sparklineColor="var(--color-warning)"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Outstanding Fees"
            value={feeQ.data?.total ?? 0}
            prefix=""
            formatter={(n) => formatPKR(n)}
            sparkline={[12000, 15000, 14500, 16000, 14800, 13800, feeQ.data?.total ?? 0]}
            sparklineColor="var(--color-danger)"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <Card padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h3>Today&apos;s Attendance by Class</h3>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                Percent present, per class
              </div>
            </div>
          </div>
          {dailyQ.isLoading ? (
            <LoadingSkeleton height={220} />
          ) : !dailyQ.data?.length ? (
            <EmptyState title="No classes yet" description="Add classes and students to start tracking." />
          ) : (
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={dailyQ.data.map((d) => ({ name: d.name, value: d.percentPresent }))}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} unit="%" domain={[0, 100]} />
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
        </Card>

        <Card padding="md">
          <div style={{ marginBottom: 12 }}>
            <h3>Pending Actions</h3>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              Things that need your attention
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
      </div>

      <div className="grid grid-2">
        <Card padding="md">
          <div style={{ marginBottom: 12 }}>
            <h3>Recent Announcements</h3>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              Latest from the school
            </div>
          </div>
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
                    border: '1px solid var(--color-border)',
                    borderRadius: 12,
                    background: 'var(--color-surface-2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      {a.isPinned && <Pin size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />}
                      {a.title}
                    </div>
                    <span
                      style={{ color: 'var(--color-text-muted)', fontSize: 12 }}
                    >
                      {format(new Date(a.postedAt), 'd MMM')}
                    </span>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                    {a.body.slice(0, 140)}
                    {a.body.length > 140 ? '…' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="md">
          <div style={{ marginBottom: 12 }}>
            <h3>Upcoming Exams</h3>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              Next scheduled assessments
            </div>
          </div>
          <EmptyState
            title="No upcoming exams"
            description="Create an exam from the Results page to schedule one."
          />
        </Card>
      </div>

      <div style={{ height: 24 }} />
      <div style={{ color: 'var(--color-text-muted)', fontSize: 12, textAlign: 'center' }}>
        Data through {format(subDays(new Date(), 0), 'd MMM yyyy')} · EduPortal
      </div>
    </div>
  );
}

function ActionItem({
  icon,
  title,
  desc,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  variant: 'warning' | 'danger' | 'info';
}) {
  const color =
    variant === 'danger'
      ? 'var(--color-danger)'
      : variant === 'warning'
        ? 'var(--color-warning)'
        : 'var(--color-primary)';
  const bg =
    variant === 'danger'
      ? 'var(--color-danger-light)'
      : variant === 'warning'
        ? 'var(--color-warning-light)'
        : 'var(--color-primary-light)';
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        borderRadius: 10,
        background: bg,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: '#fff',
          color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{desc}</div>
      </div>
      <Badge variant={variant === 'danger' ? 'danger' : 'warning'}>Action</Badge>
    </div>
  );
}

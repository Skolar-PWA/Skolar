import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, WifiOff } from 'lucide-react';
import {
  AttendanceToggle,
  Avatar,
  Button,
  Card,
  LoadingSkeleton,
  PageHeader,
  EmptyState,
} from '@eduportal/ui';
import type { AttendanceStatus, MarkAttendanceBody } from '@eduportal/shared';
import toast from 'react-hot-toast';
import { classesService } from '../services/api/classes.service';
import { attendanceService } from '../services/api/attendance.service';
import { queueAttendance } from '../services/offline/attendanceQueue';

type StatusMap = Record<string, AttendanceStatus>;

export default function AttendanceMarkPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const nav = useNavigate();
  const qc = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [online, setOnline] = useState(navigator.onLine);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const sectionQ = useQuery({
    queryKey: ['section', sectionId],
    queryFn: () => classesService.getSection(sectionId!),
    enabled: !!sectionId,
  });

  const sessionQ = useQuery({
    queryKey: ['attendance-session', sectionId, today],
    queryFn: () => attendanceService.getSession(sectionId!, today),
    enabled: !!sectionId,
  });

  useEffect(() => {
    if (!sectionQ.data) return;
    const initial: StatusMap = {};
    const existing = sessionQ.data?.records ?? [];
    const existingMap = new Map(existing.map((r) => [r.studentId, r.status]));
    for (const e of sectionQ.data.enrollments) {
      initial[e.student.id] = existingMap.get(e.student.id) ?? 'present';
    }
    setStatuses(initial);
  }, [sectionQ.data, sessionQ.data]);

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const s of Object.values(statuses)) c[s] += 1;
    return c;
  }, [statuses]);

  const mutation = useMutation({
    mutationFn: async () => {
      const body: MarkAttendanceBody = {
        sectionId: sectionId!,
        date: today,
        records: Object.entries(statuses).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      };
      if (!online) {
        await queueAttendance(body);
        return { queued: true as const };
      }
      await attendanceService.markSession(body);
      return { queued: false as const };
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['attendance-session'] });
      setShowSuccess(true);
      setTimeout(() => {
        if (res.queued) toast.success('Queued — will sync when online');
        else toast.success('Attendance saved');
        nav('/attendance');
      }, 1200);
    },
    onError: (err) => toast.error((err as Error).message),
  });

  if (!sectionQ.data) {
    return (
      <div>
        <PageHeader title="Loading…" />
        <LoadingSkeleton height={300} />
      </div>
    );
  }

  const section = sectionQ.data;
  const studentList = section.enrollments;

  const statusColor: Record<AttendanceStatus, string> = {
    present: 'var(--color-success-light)',
    absent: 'var(--color-danger-light)',
    late: 'var(--color-warning-light)',
    excused: 'var(--color-primary-light)',
  };

  return (
    <div>
      <PageHeader
        title={`${section.class.name} · ${section.name}`}
        subtitle={format(new Date(), 'EEEE, d MMM yyyy')}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Attendance', href: '/attendance' },
          { label: `${section.class.name} · ${section.name}` },
        ]}
      />

      {!online && (
        <Card
          padding="sm"
          style={{
            marginBottom: 16,
            background: 'var(--color-warning-light)',
            border: '1px solid var(--color-warning)',
            color: 'var(--color-warning)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <WifiOff size={18} />
            <div>
              <div style={{ fontWeight: 600 }}>You&apos;re offline</div>
              <div style={{ fontSize: 13 }}>Attendance will be queued and synced when online.</div>
            </div>
          </div>
        </Card>
      )}

      {studentList.length === 0 ? (
        <Card padding="lg">
          <EmptyState title="No students" description="Enroll students in this section first." />
        </Card>
      ) : (
        <Card padding="none">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {studentList.map((e, idx) => {
              const st = statuses[e.student.id] ?? 'present';
              return (
                <motion.div
                  key={e.student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.015, 0.3) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--color-border)',
                    background: statusColor[st],
                    transition: 'background 200ms ease',
                    flexWrap: 'wrap',
                  }}
                >
                  <Avatar
                    name={`${e.student.firstName} ${e.student.lastName}`}
                    src={e.student.photoUrl}
                    size={40}
                  />
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 600 }}>
                      {e.student.firstName} {e.student.lastName}
                    </div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                      Roll {e.student.rollNo ?? '—'}
                    </div>
                  </div>
                  <AttendanceToggle
                    value={st}
                    onChange={(next) =>
                      setStatuses((cur) => ({ ...cur, [e.student.id]: next }))
                    }
                  />
                </motion.div>
              );
            })}
          </div>
        </Card>
      )}

      <div style={{ height: 88 }} />

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 16,
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge color="var(--color-success)" label={`${counts.present} Present`} />
          <Badge color="var(--color-danger)" label={`${counts.absent} Absent`} />
          <Badge color="var(--color-warning)" label={`${counts.late} Late`} />
          <Badge color="var(--color-primary)" label={`${counts.excused} Excused`} />
        </div>
        <Button
          size="lg"
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={studentList.length === 0}
        >
          Submit attendance
        </Button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 18 }}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'var(--color-success)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={56} strokeWidth={3} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 999,
        background: 'var(--color-surface-2)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
      {label}
    </span>
  );
}

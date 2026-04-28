import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, WifiOff } from 'lucide-react';
import { Button, Card, LoadingSkeleton, PageHeader } from '@eduportal/ui';
import type { AttendanceStatus } from '@eduportal/shared';
import toast from 'react-hot-toast';
import { attendanceService } from '../../services/api/attendance.service';
import { queueAttendance } from '../../services/offline/attendanceQueue';

type StatusMap = Record<string, AttendanceStatus>;

function usePastDeadline(deadline: string) {
  return useMemo(() => {
    const [h, m] = deadline.split(':').map((x) => parseInt(x, 10));
    const d = new Date();
    d.setHours(h || 9, m || 30, 0, 0);
    return Date.now() > d.getTime();
  }, [deadline]);
}

export default function MarkAttendancePage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [search] = useSearchParams();
  const date = search.get('date') ?? format(new Date(), 'yyyy-MM-dd');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

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

  const detailQ = useQuery({
    queryKey: ['attendance-detail', sectionId, date],
    queryFn: () => attendanceService.getSessionDetail(sectionId!, date),
    enabled: !!sectionId,
  });

  const afterDeadline = usePastDeadline(detailQ.data?.attendanceDeadlineTime ?? '09:30');
  const session = detailQ.data?.session;
  const section = detailQ.data?.section;
  const submitted = Boolean(session?.submittedAt);
  const locked = Boolean(session?.isLocked);
  const sessionId = session?.id;

  useEffect(() => {
    if (!section) return;
    const initial: StatusMap = {};
    const map = new Map((session?.records ?? []).map((r) => [r.studentId, r.status as AttendanceStatus]));
    for (const e of section.enrollments) {
      initial[e.student.id] = (map.get(e.student.id) as AttendanceStatus) ?? 'present';
    }
    setStatuses(initial);
  }, [section, session?.records, session?.id]);

  const openM = useMutation({
    mutationFn: () => attendanceService.openSession(sectionId!, date),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance-detail', sectionId, date] }),
    onError: (err) => toast.error((err as Error).message ?? 'Could not start attendance'),
  });

  useEffect(() => {
    openM.reset();
  }, [sectionId, date]);

  useEffect(() => {
    if (!detailQ.isSuccess || sessionId || openM.isPending || openM.isError) return;
    openM.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot open when no session; avoid openM in deps
  }, [detailQ.isSuccess, sessionId, sectionId, date]);

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const s of Object.values(statuses)) {
      if (s === 'present') c.present += 1;
      else if (s === 'absent') c.absent += 1;
      else if (s === 'late') c.late += 1;
      else if (s === 'excused') c.excused += 1;
    }
    return c;
  }, [statuses]);

  const submitM = useMutation({
    mutationFn: async () => {
      if (!sectionId) throw new Error('No section');
      const sid = sessionId;
      if (!sid) throw new Error('Session not ready');
      const records = Object.entries(statuses).map(([studentId, status]) => ({
        studentId,
        status,
        markedMethod: 'manual' as const,
      }));
      if (counts.absent > 0) {
        const ok = window.confirm(
          `${counts.absent} student(s) will be marked absent. Parents may be notified. Proceed?`,
        );
        if (!ok) throw new Error('cancel');
      }
      if (!online) {
        await queueAttendance({
          sectionId,
          date,
          records: Object.entries(statuses).map(([id, status]) => ({ studentId: id, status })),
        });
        return { offline: true as const };
      }
      await attendanceService.submitSession(sid, { records });
      return { offline: false as const };
    },
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ['attendance-detail'] });
      qc.invalidateQueries({ queryKey: ['attendance-sections'] });
      if (r?.offline) toast.success('Queued — will sync when online');
      else toast.success('Attendance submitted');
      nav('/attendance');
    },
    onError: (e) => {
      if ((e as Error).message === 'cancel') return;
      toast.error((e as Error).message);
    },
  });

  if (!detailQ.data || !section) {
    return (
      <div>
        <PageHeader title="Loading…" />
        <LoadingSkeleton height={300} />
      </div>
    );
  }

  const title = `${section.class.name} · Section ${section.name}`;

  return (
    <div className="ep-mark-attendance">
      <PageHeader
        title={title}
        subtitle={format(new Date(date), 'EEE d MMM yyyy')}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Attendance', href: '/attendance' },
          { label: 'Mark' },
        ]}
        action={
          <Link to="/attendance" style={{ textDecoration: 'none' }}>
            <Button leftIcon={<ArrowLeft size={16} />} variant="ghost" size="sm">
              Back
            </Button>
          </Link>
        }
      />

      {openM.isError && !sessionId && (
        <div className="late-banner" style={{ background: '#FEE2E2', borderColor: '#FCA5A5', color: '#991B1B' }}>
          Could not start the attendance session.{' '}
          <Button type="button" variant="secondary" size="sm" onClick={() => openM.mutate()}>
            Try again
          </Button>
        </div>
      )}

      {!online && (
        <div className="ep-attendance-offline">
          <WifiOff size={16} /> Offline — changes will sync when you reconnect
        </div>
      )}

      {afterDeadline && !submitted && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="late-banner">
          <span aria-hidden>⚠️</span> You are marking attendance past the deadline (
          {detailQ.data?.attendanceDeadlineTime ?? '09:30'}). An alert will be sent to the school admin.
        </motion.div>
      )}

      {submitted && (
        <div className="submitted-banner">
          <span aria-hidden>✓</span> Submitted
          {session?.submittedAt
            ? ` at ${new Date(session.submittedAt as string).toLocaleTimeString('en-PK', { hour: 'numeric', minute: '2-digit' })}`
            : ''}
          .
        </div>
      )}

      {locked && (
        <div className="locked-banner">
          <span aria-hidden>🔒</span> This session is locked. Contact an admin to change records.
        </div>
      )}

      <div className="ep-attendance-quick">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={locked || submitted}
          onClick={() => {
            const next: StatusMap = { ...statuses };
            for (const k of Object.keys(next)) next[k] = 'present';
            setStatuses(next);
          }}
        >
          Mark all present
        </Button>
      </div>

      <div className="ep-attendance-card-wrap">
        <Card padding="none">
          <div className="ep-attendance-list">
            <AnimatePresence>
              {section.enrollments.map((e, index) => {
                const st = e.student;
                const status = statuses[st.id] ?? 'present';
                return (
                  <motion.div
                    key={st.id}
                    className={`student-row status-${status}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <div className="student-avatar-sm">
                      {st.photoUrl ? (
                        <img src={st.photoUrl} alt="" />
                      ) : (
                        <span>
                          {st.firstName[0]}
                          {st.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div className="student-info">
                      <span className="student-fullname">
                        {st.firstName} {st.lastName}
                      </span>
                      <span className="student-roll">Roll #{st.rollNo ?? '—'}</span>
                    </div>
                    <div className="status-toggle" role="group" aria-label="Attendance">
                      {(
                        [
                          ['present', 'P', 'active-present'],
                          ['absent', 'A', 'active-absent'],
                          ['late', 'L', 'active-late'],
                          ['excused', 'E', 'active-excused'],
                        ] as const
                      ).map(([key, label, active]) => (
                        <button
                          key={key}
                          type="button"
                          className={`status-btn ${status === key ? active : ''}`}
                          disabled={locked || submitted}
                          onClick={() => setStatuses((prev) => ({ ...prev, [st.id]: key }))}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      <div className="attendance-submit-bar">
        <div className="attendance-counts">
          <span className="count-item">
            <span className="count-dot present" /> {counts.present} Present
          </span>
          <span className="count-item">
            <span className="count-dot absent" /> {counts.absent} Absent
          </span>
          <span className="count-item">
            <span className="count-dot late" /> {counts.late} Late
          </span>
          <span className="count-item">
            <span className="count-dot excused" /> {counts.excused} Excused
          </span>
        </div>
        <Button
          type="button"
          loading={submitM.isPending}
          disabled={locked || submitted || !sessionId}
          onClick={() => submitM.mutate()}
        >
          Submit attendance
        </Button>
      </div>
    </div>
  );
}

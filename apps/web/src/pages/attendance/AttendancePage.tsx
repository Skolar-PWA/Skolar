import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button, Card, LoadingSkeleton, PageHeader, EmptyState } from '@eduportal/ui';
import { CalendarCheck, FileDown, Layers, QrCode, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceService, type AttendanceSectionCard } from '../../services/api/attendance.service';
import { SelectMenu, type SelectMenuOption } from '../../components/SelectMenu';

type FilterState = 'all' | 'pending' | 'marked' | 'overdue';

function cardVariant(s: AttendanceSectionCard): 'pending' | 'overdue' | 'marked' | 'marked_late' {
  if (!s.session || !s.session.submittedAt) return s.isAfterDeadline ? 'overdue' : 'pending';
  if (s.session.isLate) return 'marked_late';
  return 'marked';
}

export default function AttendancePage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const dateDisplay = format(new Date(), 'EEEE, d MMMM yyyy');
  const { data, isLoading } = useQuery({ queryKey: ['attendance-sections'], queryFn: () => attendanceService.listSections() });
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<FilterState>('all');
  const [grade, setGrade] = useState<string>('all');
  const [pdfLoading, setPdfLoading] = useState<'idle' | 'flat' | 'grade'>('idle');

  const grades = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((d) => d.className))).sort();
  }, [data]);

  const filterOptions: SelectMenuOption[] = useMemo(
    () => [
      { value: 'all', label: 'All' },
      { value: 'pending', label: 'Pending' },
      { value: 'marked', label: 'Marked' },
      { value: 'overdue', label: 'Overdue' },
    ],
    [],
  );

  const gradeOptions = useMemo(
    () => [{ value: 'all', label: 'All Grades' }, ...grades.map((g) => ({ value: g, label: g }))],
    [grades],
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((s) => {
      const v = cardVariant(s);
      const hit =
        !q.trim() ||
        `${s.className} ${s.name}`.toLowerCase().includes(q.trim().toLowerCase());
      if (!hit) return false;
      if (grade !== 'all' && s.className !== grade) return false;
      if (filter === 'all') return true;
      if (filter === 'pending') return v === 'pending';
      if (filter === 'overdue') return v === 'overdue';
      if (filter === 'marked') return v === 'marked' || v === 'marked_late';
      return true;
    });
  }, [data, q, filter, grade]);

 
  const handleDownloadGradePdf = useCallback(async () => {
    if (!filtered.length) {
      toast.error('No sections match your filters. Adjust filters or search, then try again.');
      return;
    }
    setPdfLoading('grade');
    try {
      const { downloadAttendanceGradeSectionsPdf } = await import('./AttendancePdfDocument');
      const generatedAt = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
      await downloadAttendanceGradeSectionsPdf(filtered, { dateIso: today, dateDisplay, generatedAt });
      toast.success('Grade-wise PDF downloaded');
    } catch (e) {
      console.error(e);
      toast.error('Could not generate PDF. Please try again.');
    } finally {
      setPdfLoading('idle');
    }
  }, [filtered, today, dateDisplay]);

  const pdfBusy = pdfLoading !== 'idle';

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Mark attendance for your class or use the QR scanner"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Attendance' }]}
        action={
          <>
             <Button
              type="button"
              variant="secondary"
              leftIcon={<Layers size={14} />}
              loading={pdfLoading === 'grade'}
              disabled={isLoading || !data?.length || !filtered.length || pdfBusy}
              onClick={handleDownloadGradePdf}
            >
              Download PDF
            </Button>
            <Link to="/attendance/scan">
              <Button leftIcon={<QrCode size={14} />}>QR Scanner</Button>
            </Link>
          </>
        }
      />

      <div className="ep-attendance-toolbar">
        <p className="ep-attendance-date">{dateDisplay}</p>
        <div className="ep-attendance-filters">
          <SelectMenu
            aria-label="Filter by status"
            value={filter}
            onChange={(v) => setFilter(v as FilterState)}
            options={filterOptions}
          />
          <SelectMenu
            aria-label="Filter by grade"
            value={grade}
            onChange={setGrade}
            options={gradeOptions}
          />
        </div>
      </div>

      <div className="ep-attendance-search">
        <Search size={18} className="ep-attendance-search-icon" aria-hidden />
        <input
          className="ep-attendance-search-input"
          placeholder="Search class or section…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton height={200} />
      ) : !data?.length ? (
        <Card padding="lg">
          <EmptyState
            icon={<CalendarCheck size={28} />}
            title="No sections available"
            description="You do not have any classes assigned for attendance, or no sections exist yet."
          />
        </Card>
      ) : (
        <div className="sections-grid">
          {filtered.map((s) => (
            <SectionCard key={s.id} card={s} today={today} />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionCard({ card, today }: { card: AttendanceSectionCard; today: string }) {
  const v = cardVariant(card);
  const submitted = card.session?.submittedAt;
  const timeStr = submitted
    ? new Date(submitted).toLocaleTimeString('en-PK', { hour: 'numeric', minute: '2-digit' })
    : null;
  const summary = submitted
    ? `${card.counts.present} Present · ${card.counts.absent} Absent`
    : `${card.studentCount} students`;

  return (
    <div className={`section-card ${v}`}>
      <div className="section-card-top">
        <div>
          <div className="section-name">{card.className}</div>
          <div className="section-sub">Section {card.name}</div>
        </div>
        <span className={`section-badge section-badge--${v}`}>
          {v === 'pending' && 'Pending'}
          {v === 'overdue' && 'Overdue'}
          {v === 'marked' && 'Marked'}
          {v === 'marked_late' && 'Marked Late'}
        </span>
      </div>
      <div className="section-card-meta">
        <span>{summary}</span>
        {v === 'overdue' && <span className="overdue-dot" aria-hidden />}
      </div>
      {timeStr && <div className="section-card-time">Marked at {timeStr}</div>}
      {card.session?.isLate && v === 'marked' && (
        <div className="section-late-hint">Late submission</div>
      )}
      <div className="section-card-actions">
        {submitted ? (
          <Link to={`/attendance/mark/${card.id}?date=${today}`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="sm" fullWidth>
              View / Edit
            </Button>
          </Link>
        ) : (
          <Link to={`/attendance/mark/${card.id}?date=${today}`} style={{ textDecoration: 'none' }}>
            <Button size="sm" fullWidth>
              {v === 'overdue' ? 'Mark Now (Late)' : 'Mark today'}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

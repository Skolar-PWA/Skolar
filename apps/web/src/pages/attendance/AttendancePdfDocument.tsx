import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { AttendanceSectionCard } from '../../services/api/attendance.service';

function savePdfBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 36,
    paddingVertical: 28,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 10,
  },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  meta: { fontSize: 9, color: '#475569', marginBottom: 2 },
  tableHead: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  col1: { width: '22%' },
  col2: { width: '10%' },
  col3: { width: '14%' },
  col4: { width: '26%' },
  col5: { width: '14%' },
  col6: { width: '14%' },
  th: { fontFamily: 'Helvetica-Bold', fontSize: 8 },
  cell: { fontSize: 8 },
  footer: { marginTop: 14, fontSize: 7, color: '#94a3b8' },
});

const gradeStyles = StyleSheet.create({
  gradeBlock: { marginBottom: 14 },
  gradeTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    backgroundColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  gradeMeta: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  gTableHead: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
  },
  gTableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  gColSection: { width: '12%' },
  gColStatus: { width: '14%' },
  gColSummary: { width: '38%' },
  gColTime: { width: '12%' },
  gColBy: { width: '24%' },
  th: { fontFamily: 'Helvetica-Bold', fontSize: 8 },
  cell: { fontSize: 8 },
});

function statusLabel(s: AttendanceSectionCard): string {
  if (!s.session || !s.session.submittedAt) {
    return s.isAfterDeadline ? 'Overdue' : 'Pending';
  }
  if (s.session.isLate) return 'Marked Late';
  return 'Marked';
}

function rowSummary(s: AttendanceSectionCard): string {
  if (s.session?.submittedAt) {
    return `${s.counts.present} present · ${s.counts.absent} absent · ${s.counts.late} late · ${s.counts.excused} excused`;
  }
  return `${s.studentCount} students`;
}

function markedTime(s: AttendanceSectionCard): string {
  const submitted = s.session?.submittedAt;
  if (!submitted) return '—';
  return new Date(submitted).toLocaleTimeString('en-PK', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Sorted map: class (grade) name → sections in that class */
function groupSectionsByGrade(sections: AttendanceSectionCard[]): [string, AttendanceSectionCard[]][] {
  const sorted = [...sections].sort((a, b) => {
    const byClass = a.className.localeCompare(b.className);
    if (byClass !== 0) return byClass;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
  const map = new Map<string, AttendanceSectionCard[]>();
  for (const s of sorted) {
    const list = map.get(s.className) ?? [];
    list.push(s);
    map.set(s.className, list);
  }
  return Array.from(map.entries());
}

function gradeBlockSummary(segs: AttendanceSectionCard[]): string {
  const marked = segs.filter((s) => s.session?.submittedAt).length;
  const pending = segs.length - marked;
  return `${segs.length} section(s) · ${marked} marked · ${pending} not marked`;
}

type AttendancePdfDocumentProps = {
  sections: AttendanceSectionCard[];
  dateDisplay: string;
  generatedAt: string;
};

export function AttendancePdfDocument({ sections, dateDisplay, generatedAt }: AttendancePdfDocumentProps) {
  return (
    <Document title={`Attendance — ${dateDisplay}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Attendance overview</Text>
          <Text style={styles.meta}>
            {dateDisplay} · Generated {generatedAt}
          </Text>
          <Text style={styles.meta}>{sections.length} section(s)</Text>
        </View>
        <View style={styles.tableHead}>
          <Text style={[styles.col1, styles.th]}>Class</Text>
          <Text style={[styles.col2, styles.th]}>Section</Text>
          <Text style={[styles.col3, styles.th]}>Status</Text>
          <Text style={[styles.col4, styles.th]}>Summary</Text>
          <Text style={[styles.col5, styles.th]}>Marked at</Text>
          <Text style={[styles.col6, styles.th]}>Marked by</Text>
        </View>
        {sections.map((s) => (
          <View key={s.id} style={styles.tableRow} wrap={false}>
            <Text style={[styles.col1, styles.cell]}>{s.className}</Text>
            <Text style={[styles.col2, styles.cell]}>{s.name}</Text>
            <Text style={[styles.col3, styles.cell]}>{statusLabel(s)}</Text>
            <Text style={[styles.col4, styles.cell]}>{rowSummary(s)}</Text>
            <Text style={[styles.col5, styles.cell]}>{markedTime(s)}</Text>
            <Text style={[styles.col6, styles.cell]}>{s.session?.markedByName ?? '—'}</Text>
          </View>
        ))}
        <Text style={styles.footer}>
          Rows match the attendance list (including active filters) at export time.
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadAttendancePdf(
  sections: AttendanceSectionCard[],
  opts: { dateIso: string; dateDisplay: string; generatedAt: string },
): Promise<void> {
  const blob = await pdf(
    <AttendancePdfDocument sections={sections} dateDisplay={opts.dateDisplay} generatedAt={opts.generatedAt} />,
  ).toBlob();
  savePdfBlob(blob, `attendance-${opts.dateIso}.pdf`);
}

type AttendanceGradeSectionsPdfProps = {
  sections: AttendanceSectionCard[];
  dateDisplay: string;
  generatedAt: string;
};

export function AttendanceGradeSectionsPdfDocument({
  sections,
  dateDisplay,
  generatedAt,
}: AttendanceGradeSectionsPdfProps) {
  const byGrade = groupSectionsByGrade(sections);
  const gradeCount = byGrade.length;

  return (
    <Document title={`Attendance by grade — ${dateDisplay}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Attendance by grade and section</Text>
          <Text style={styles.meta}>
            {dateDisplay} · Generated {generatedAt}
          </Text>
          <Text style={styles.meta}>
            {gradeCount} grade(s) · {sections.length} section(s)
          </Text>
        </View>
        {byGrade.map(([className, segs]) => (
          <View key={className} style={gradeStyles.gradeBlock}>
            <Text style={gradeStyles.gradeTitle}>{className}</Text>
            <Text style={gradeStyles.gradeMeta}>{gradeBlockSummary(segs)}</Text>
            <View style={gradeStyles.gTableHead}>
              <Text style={[gradeStyles.gColSection, gradeStyles.th]}>Section</Text>
              <Text style={[gradeStyles.gColStatus, gradeStyles.th]}>Status</Text>
              <Text style={[gradeStyles.gColSummary, gradeStyles.th]}>Summary</Text>
              <Text style={[gradeStyles.gColTime, gradeStyles.th]}>Marked at</Text>
              <Text style={[gradeStyles.gColBy, gradeStyles.th]}>Marked by</Text>
            </View>
            {segs.map((s) => (
              <View key={s.id} style={gradeStyles.gTableRow} wrap={false}>
                <Text style={[gradeStyles.gColSection, gradeStyles.cell]}>{s.name}</Text>
                <Text style={[gradeStyles.gColStatus, gradeStyles.cell]}>{statusLabel(s)}</Text>
                <Text style={[gradeStyles.gColSummary, gradeStyles.cell]}>{rowSummary(s)}</Text>
                <Text style={[gradeStyles.gColTime, gradeStyles.cell]}>{markedTime(s)}</Text>
                <Text style={[gradeStyles.gColBy, gradeStyles.cell]}>{s.session?.markedByName ?? '—'}</Text>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.footer}>
          Grouped by class (grade). Data matches the attendance list (including active filters) at export time.
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadAttendanceGradeSectionsPdf(
  sections: AttendanceSectionCard[],
  opts: { dateIso: string; dateDisplay: string; generatedAt: string },
): Promise<void> {
  const blob = await pdf(
    <AttendanceGradeSectionsPdfDocument
      sections={sections}
      dateDisplay={opts.dateDisplay}
      generatedAt={opts.generatedAt}
    />,
  ).toBlob();
  savePdfBlob(blob, `attendance-by-grade-${opts.dateIso}.pdf`);
}

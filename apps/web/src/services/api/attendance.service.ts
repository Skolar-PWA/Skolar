import type {
  AttendanceSessionDto,
  AttendanceRecordDto,
  MarkAttendanceBody,
  QRScanRequest,
  QRScanResponse,
} from '@eduportal/shared';
import { api, unwrap } from './client';

export type AttendanceSectionCard = {
  id: string;
  className: string;
  name: string;
  studentCount: number;
  canMark: boolean;
  session: {
    id: string;
    submittedAt: string | null;
    isLate: boolean;
    isLocked: boolean;
    markedByName: string;
  } | null;
  counts: { present: number; absent: number; late: number; excused: number };
  isAfterDeadline: boolean;
  isDraft: boolean;
};

export const attendanceService = {
  listSections() {
    return unwrap<AttendanceSectionCard[]>(api.get('/attendance/sections'));
  },
  getSessionDetail(sectionId: string, date: string) {
    return unwrap<{
      attendanceDeadlineTime: string;
      branchId: string;
      session: (AttendanceSessionDto & { records: AttendanceRecordDto[] }) | null;
      section: {
        id: string;
        name: string;
        class: { name: string; branchId: string };
        enrollments: { student: { id: string; firstName: string; lastName: string; rollNo: string | null; photoUrl: string | null } }[];
      };
    }>(api.get(`/attendance/sections/${sectionId}/session`, { params: { date } }));
  },
  openSession(sectionId: string, date: string) {
    return unwrap<{ id: string }>(api.post('/attendance/sessions/open', { sectionId, date }));
  },
  submitSession(
    sessionId: string,
    body: {
      records: {
        studentId: string;
        status: string;
        note?: string;
        markedMethod?: string;
      }[];
    },
  ) {
    return unwrap<AttendanceSessionDto & { records: AttendanceRecordDto[] }>(
      api.post(`/attendance/sessions/${sessionId}/submit`, body),
    );
  },
  async markSession(body: MarkAttendanceBody) {
    return unwrap<AttendanceSessionDto & { records: AttendanceRecordDto[] }>(
      api.post('/attendance/sessions', body),
    );
  },
  getSession(sectionId: string, date: string) {
    return unwrap<(AttendanceSessionDto & { records: AttendanceRecordDto[] }) | null>(
      api.get('/attendance/sessions', { params: { sectionId, date } }),
    );
  },
  scan(body: QRScanRequest) {
    return unwrap<QRScanResponse>(api.post('/attendance/scan', body));
  },
  dailyByClass(branchId: string, date: string) {
    return unwrap<
      Array<{
        classId: string;
        name: string;
        total: number;
        present: number;
        percentPresent: number;
      }>
    >(api.get('/attendance/daily-by-class', { params: { branchId, date } }));
  },
};

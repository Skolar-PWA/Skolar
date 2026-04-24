import type {
  AttendanceSessionDto,
  AttendanceRecordDto,
  MarkAttendanceBody,
  QRScanRequest,
  QRScanResponse,
} from '@eduportal/shared';
import { api, unwrap } from './client';

export const attendanceService = {
  async markSession(body: MarkAttendanceBody) {
    return unwrap<AttendanceSessionDto & { records: AttendanceRecordDto[] }>(
      api.post('/attendance/sessions', body),
    );
  },
  async getSession(sectionId: string, date: string, classSubjectId?: string) {
    return unwrap<(AttendanceSessionDto & { records: AttendanceRecordDto[] }) | null>(
      api.get('/attendance/sessions', { params: { sectionId, date, classSubjectId } }),
    );
  },
  async scan(body: QRScanRequest) {
    return unwrap<QRScanResponse>(api.post('/attendance/scan', body));
  },
  async dailyByClass(branchId: string, date: string) {
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

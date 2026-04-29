import type { AttendanceStatus } from '../enums';

export interface AttendanceSessionDto {
  id: string;
  sectionId: string;
  date: string;
  isLocked: boolean;
  markedById: string;
  markedByName: string;
  submittedAt: string | null;
  isLate: boolean;
  createdAt: string;
}

export interface AttendanceRecordDto {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  note: string | null;
  markedByName: string;
  markedMethod: string;
  deviceName: string | null;
}

export interface MarkAttendanceBody {
  sectionId: string;
  date: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
  }[];
}

export interface QRScanRequest {
  qrToken: string;
  sessionId?: string;
  deviceName?: string;
}

export type QRScanResponseStatus =
  | 'marked'
  | 'already_marked'
  | 'no_session'
  | 'not_enrolled';

export interface QRScanResponse {
  student: {
    id: string;
    name: string;
    photoUrl: string | null;
    rollNo: string | null;
  };
  status: QRScanResponseStatus | 'no_active_session';
  sessionId?: string;
}

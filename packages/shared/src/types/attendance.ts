import type { AttendanceStatus, AttendanceType } from '../enums';

export interface AttendanceSessionDto {
  id: string;
  sectionId: string;
  classSubjectId: string | null;
  date: string;
  type: AttendanceType;
  isLocked: boolean;
  markedById: string;
  createdAt: string;
}

export interface AttendanceRecordDto {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  note: string | null;
  scannedVia: string | null;
}

export interface MarkAttendanceBody {
  sectionId: string;
  classSubjectId?: string;
  date: string;
  type?: AttendanceType;
  records: {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
    scannedVia?: string;
  }[];
}

export interface QRScanRequest {
  qrToken: string;
  sessionId?: string;
  deviceToken?: string;
}

export interface QRScanResponse {
  student: {
    id: string;
    name: string;
    photoUrl: string | null;
    rollNo: string | null;
  };
  status: 'marked' | 'already_marked' | 'no_active_session';
  sessionId?: string;
}

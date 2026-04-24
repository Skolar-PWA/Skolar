import type { ExamType } from '../enums';

export interface ExamDto {
  id: string;
  classId: string;
  name: string;
  type: ExamType;
  examDate: string | null;
  isReleased: boolean;
  totalWeightage: number | null;
  createdAt: string;
}

export interface CreateExamBody {
  classId: string;
  name: string;
  type?: ExamType;
  examDate?: string;
  totalWeightage?: number;
}

export interface ExamResultDto {
  id: string;
  examId: string;
  classSubjectId: string;
  studentId: string;
  marksObtained: number | null;
  totalMarks: number;
  grade: string | null;
  remarks: string | null;
  isDraft: boolean;
}

export interface BulkResultBody {
  examId: string;
  classSubjectId: string;
  totalMarks: number;
  records: {
    studentId: string;
    marksObtained: number | null;
    remarks?: string;
  }[];
  saveAsDraft?: boolean;
}

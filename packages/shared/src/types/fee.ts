import type { FeeStatus } from '../enums';

export interface FeeRecordDto {
  id: string;
  studentId: string;
  academicYearId: string;
  month: number;
  year: number;
  amountDue: number;
  amountPaid: number;
  dueDate: string | null;
  status: FeeStatus;
  paidAt: string | null;
}

export interface CreateFeeBody {
  studentId: string;
  academicYearId: string;
  month: number;
  year: number;
  amountDue: number;
  dueDate?: string;
}

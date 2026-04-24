import type { Gender } from '../enums';

export interface StudentDto {
  id: string;
  branchId: string;
  rollNo: string | null;
  firstName: string;
  lastName: string;
  dob: string | null;
  gender: Gender | null;
  photoUrl: string | null;
  qrToken: string;
  createdAt: string;
  currentSection?: {
    id: string;
    name: string;
    class: { id: string; name: string };
  } | null;
}

export interface CreateStudentBody {
  branchId: string;
  firstName: string;
  lastName: string;
  rollNo?: string;
  dob?: string;
  gender?: Gender;
  photoUrl?: string;
  sectionId?: string;
  academicYearId?: string;
  parentIds?: string[];
}

export type UpdateStudentBody = Partial<Omit<CreateStudentBody, 'branchId'>>;

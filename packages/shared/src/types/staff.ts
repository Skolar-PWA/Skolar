import type { StaffRole } from '../enums';

export interface StaffDto {
  id: string;
  branchId: string;
  role: StaffRole;
  firstName: string;
  lastName: string;
  cnic: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
  isActive: boolean;
  joiningDate: string | null;
  createdAt: string;
}

export interface CreateStaffBody {
  branchId: string;
  role: StaffRole;
  firstName: string;
  lastName: string;
  cnic: string;
  phone: string;
  email?: string;
  password?: string;
  joiningDate?: string;
  photoUrl?: string;
}

export type UpdateStaffBody = Partial<Omit<CreateStaffBody, 'branchId' | 'password'>>;

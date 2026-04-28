export const StaffRole = {
  admin: 'admin',
  branch_manager: 'branch_manager',
  teacher: 'teacher',
  attendance_substitute: 'attendance_substitute',
} as const;
export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole];

export const UserRole = {
  super_admin: 'super_admin',
  school_admin: 'school_admin',
  branch_manager: 'branch_manager',
  teacher: 'teacher',
  student: 'student',
  parent: 'parent',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Gender = {
  male: 'male',
  female: 'female',
  other: 'other',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const EnrollmentStatus = {
  active: 'active',
  transferred: 'transferred',
  graduated: 'graduated',
  dropped: 'dropped',
} as const;
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const AttendanceType = {
  daily: 'daily',
  subject_wise: 'subject_wise',
} as const;
export type AttendanceType = (typeof AttendanceType)[keyof typeof AttendanceType];

export const AttendanceStatus = {
  present: 'present',
  absent: 'absent',
  late: 'late',
  excused: 'excused',
} as const;
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export const ExamType = {
  formal: 'formal',
  monthly_test: 'monthly_test',
  assignment: 'assignment',
  project: 'project',
} as const;
export type ExamType = (typeof ExamType)[keyof typeof ExamType];

export const DisputeStatus = {
  open: 'open',
  under_review: 'under_review',
  resolved: 'resolved',
  rejected: 'rejected',
} as const;
export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];

export const FeeStatus = {
  pending: 'pending',
  partial: 'partial',
  paid: 'paid',
  overdue: 'overdue',
} as const;
export type FeeStatus = (typeof FeeStatus)[keyof typeof FeeStatus];

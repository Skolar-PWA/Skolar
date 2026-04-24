import type { UserRole } from '../enums';

export interface AnnouncementDto {
  id: string;
  branchId: string;
  postedById: string;
  targetRoles: UserRole[];
  title: string;
  body: string;
  isPinned: boolean;
  postedAt: string;
}

export interface CreateAnnouncementBody {
  branchId: string;
  targetRoles: UserRole[];
  title: string;
  body: string;
  isPinned?: boolean;
}

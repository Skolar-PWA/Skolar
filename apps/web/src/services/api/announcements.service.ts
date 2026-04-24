import type { AnnouncementDto } from '@eduportal/shared';
import { api, unwrap } from './client';

export const announcementsService = {
  async list(branchId: string) {
    return unwrap<AnnouncementDto[]>(api.get('/announcements', { params: { branchId } }));
  },
};

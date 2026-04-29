import { api, unwrap } from './client';

export type BranchSettingsDto = {
  id: string;
  branchId: string;
  attendanceDeadlineTime: string;
  attendanceEditWindowEnd: string;
};

export const branchSettingsService = {
  get(branchId: string) {
    return unwrap<BranchSettingsDto>(api.get(`/branches/${branchId}/settings`));
  },
  update(branchId: string, body: { attendanceDeadlineTime?: string; attendanceEditWindowEnd?: string }) {
    return unwrap<BranchSettingsDto>(api.patch(`/branches/${branchId}/settings`, body));
  },
};

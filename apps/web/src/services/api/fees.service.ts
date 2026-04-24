import type { FeeRecordDto } from '@eduportal/shared';
import { api, unwrap } from './client';

export const feesService = {
  async outstanding(branchId: string) {
    return unwrap<{ total: number; count: number; records: FeeRecordDto[] }>(
      api.get('/fees/outstanding', { params: { branchId } }),
    );
  },
  async forStudent(studentId: string) {
    return unwrap<FeeRecordDto[]>(api.get(`/fees/students/${studentId}`));
  },
};

import type { PaginationMeta, StudentDto } from '@eduportal/shared';
import { api, unwrap, unwrapPaged } from './client';

export interface StudentListParams {
  branchId: string;
  page?: number;
  limit?: number;
  search?: string;
  sectionId?: string;
  academicYearId?: string;
}

export const studentsService = {
  async list(params: StudentListParams) {
    const res = await unwrapPaged<StudentDto[]>(api.get('/students', { params }));
    return { data: res.data, meta: res.meta as PaginationMeta | undefined };
  },
  async get(id: string) {
    return unwrap<StudentDto>(api.get(`/students/${id}`));
  },
  async create(body: Partial<StudentDto> & { branchId: string }) {
    return unwrap<StudentDto>(api.post('/students', body));
  },
};

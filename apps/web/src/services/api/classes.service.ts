import { api, unwrap } from './client';

export interface ClassSummary {
  id: string;
  name: string;
  numericOrder: number;
  sections: Array<{ id: string; name: string; capacity: number | null }>;
  _count: { sections: number; classSubjects: number };
}

export const classesService = {
  async list(branchId: string, academicYearId?: string) {
    return unwrap<ClassSummary[]>(
      api.get('/classes', { params: { branchId, academicYearId } }),
    );
  },
  async getSection(sectionId: string) {
    return unwrap<{
      id: string;
      name: string;
      class: { id: string; name: string };
      enrollments: Array<{
        id: string;
        student: {
          id: string;
          firstName: string;
          lastName: string;
          rollNo: string | null;
          photoUrl: string | null;
        };
      }>;
    }>(api.get(`/classes/sections/${sectionId}`));
  },
};

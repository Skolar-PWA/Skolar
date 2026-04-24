import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  list(branchId: string, academicYearId?: string) {
    return this.prisma.class.findMany({
      where: { branchId, academicYearId },
      orderBy: { numericOrder: 'asc' },
      include: {
        sections: true,
        _count: { select: { sections: true, classSubjects: true } },
      },
    });
  }

  async get(id: string) {
    const c = await this.prisma.class.findUnique({
      where: { id },
      include: {
        sections: { include: { _count: { select: { enrollments: true } } } },
        classSubjects: { include: { subject: true, teacher: true } },
      },
    });
    if (!c) throw new NotFoundException('Class not found');
    return c;
  }

  create(data: {
    branchId: string;
    academicYearId: string;
    name: string;
    numericOrder: number;
  }) {
    return this.prisma.class.create({ data });
  }

  async createSection(classId: string, data: { name: string; capacity?: number }) {
    await this.get(classId);
    return this.prisma.section.create({ data: { ...data, classId } });
  }

  async assignSubject(classId: string, subjectId: string, teacherId?: string) {
    return this.prisma.classSubject.upsert({
      where: { classId_subjectId: { classId, subjectId } },
      update: { teacherId },
      create: { classId, subjectId, teacherId },
    });
  }

  async getSection(sectionId: string) {
    const s = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        class: true,
        enrollments: {
          where: { status: 'active' },
          include: { student: true },
          orderBy: { student: { firstName: 'asc' } },
        },
      },
    });
    if (!s) throw new NotFoundException('Section not found');
    return s;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AcademicYearsService {
  constructor(private readonly prisma: PrismaService) {}

  list(branchId: string) {
    return this.prisma.academicYear.findMany({
      where: { branchId },
      orderBy: { startDate: 'desc' },
    });
  }

  async active(branchId: string) {
    return this.prisma.academicYear.findFirst({
      where: { branchId, isActive: true },
    });
  }

  async get(id: string) {
    const ay = await this.prisma.academicYear.findUnique({ where: { id } });
    if (!ay) throw new NotFoundException('Academic year not found');
    return ay;
  }

  create(data: {
    branchId: string;
    label: string;
    startDate: Date;
    endDate: Date;
    isActive?: boolean;
  }) {
    return this.prisma.academicYear.create({ data });
  }

  async activate(id: string) {
    const ay = await this.get(id);
    await this.prisma.$transaction([
      this.prisma.academicYear.updateMany({
        where: { branchId: ay.branchId },
        data: { isActive: false },
      }),
      this.prisma.academicYear.update({ where: { id }, data: { isActive: true } }),
    ]);
    return this.get(id);
  }
}

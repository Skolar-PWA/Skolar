import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list(branchId: string) {
    return this.prisma.subject.findMany({
      where: { branchId },
      orderBy: { name: 'asc' },
    });
  }

  create(data: { branchId: string; name: string; code: string; isElective?: boolean }) {
    return this.prisma.subject.create({ data });
  }

  update(id: string, data: { name?: string; code?: string; isElective?: boolean }) {
    return this.prisma.subject.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.subject.delete({ where: { id } });
  }
}

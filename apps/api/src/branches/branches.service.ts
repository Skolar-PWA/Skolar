import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolGroupId?: string) {
    return this.prisma.branch.findMany({
      where: schoolGroupId ? { schoolGroupId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async get(id: string) {
    const b = await this.prisma.branch.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('Branch not found');
    return b;
  }

  create(data: {
    schoolGroupId: string;
    name: string;
    address?: string;
    city?: string;
    contact?: string;
  }) {
    return this.prisma.branch.create({ data });
  }

  update(
    id: string,
    data: { name?: string; address?: string; city?: string; contact?: string },
  ) {
    return this.prisma.branch.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.branch.delete({ where: { id } });
  }
}

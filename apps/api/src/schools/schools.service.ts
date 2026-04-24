import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.schoolGroup.findMany({
      orderBy: { createdAt: 'desc' },
      include: { branches: true },
    });
  }

  async get(id: string) {
    const group = await this.prisma.schoolGroup.findUnique({
      where: { id },
      include: { branches: true },
    });
    if (!group) throw new NotFoundException('School group not found');
    return group;
  }

  create(data: { name: string; subscriptionPlan?: string }) {
    return this.prisma.schoolGroup.create({ data });
  }

  update(id: string, data: { name?: string; subscriptionPlan?: string; isActive?: boolean }) {
    return this.prisma.schoolGroup.update({ where: { id }, data });
  }
}

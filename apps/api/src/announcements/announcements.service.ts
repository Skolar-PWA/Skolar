import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import type { UserRole } from '@eduportal/shared';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  list(branchId: string, role?: UserRole) {
    return this.prisma.announcement.findMany({
      where: {
        branchId,
        ...(role ? { targetRoles: { has: role } } : {}),
      },
      orderBy: [{ isPinned: 'desc' }, { postedAt: 'desc' }],
    });
  }

  create(data: {
    branchId: string;
    postedById: string;
    title: string;
    body: string;
    targetRoles: UserRole[];
    isPinned?: boolean;
  }) {
    return this.prisma.announcement.create({ data });
  }

  pin(id: string, isPinned: boolean) {
    return this.prisma.announcement.update({ where: { id }, data: { isPinned } });
  }
}

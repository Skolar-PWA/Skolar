import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import type { JwtPayload } from '@eduportal/shared';
import { UserRole } from '@eduportal/shared';
import { UpdateBranchSettingsDto } from './dto/branch-settings.dto';

@Injectable()
export class BranchSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** super_admin: any branch; others: only their own branch. */
  assertBranchAccess(actor: JwtPayload, branchId: string) {
    if (actor.role === UserRole.super_admin) return;
    if (!actor.branchId || actor.branchId !== branchId) {
      throw new ForbiddenException('No access to this branch');
    }
  }

  async getForBranch(branchId: string, actor: JwtPayload) {
    this.assertBranchAccess(actor, branchId);
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new NotFoundException('Branch not found');
    return this.prisma.branchSettings.upsert({
      where: { branchId },
      create: { branchId },
      update: {},
    });
  }

  async updateForBranch(branchId: string, actor: JwtPayload, dto: UpdateBranchSettingsDto) {
    this.assertBranchAccess(actor, branchId);
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new NotFoundException('Branch not found');

    return this.prisma.branchSettings.upsert({
      where: { branchId },
      create: {
        branchId,
        attendanceDeadlineTime: dto.attendanceDeadlineTime ?? '09:30',
        attendanceEditWindowEnd: dto.attendanceEditWindowEnd ?? '23:59',
      },
      update: {
        ...(dto.attendanceDeadlineTime !== undefined && {
          attendanceDeadlineTime: dto.attendanceDeadlineTime,
        }),
        ...(dto.attendanceEditWindowEnd !== undefined && {
          attendanceEditWindowEnd: dto.attendanceEditWindowEnd,
        }),
      },
    });
  }
}

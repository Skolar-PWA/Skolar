import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import type { BulkImportResult, BulkImportResultRow } from '@eduportal/shared';
import { UserRole } from '@eduportal/shared';
import { CreateStaffDto } from './dto/staff.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { paginationMeta } from '../common/dto/pagination.dto';

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async list(branchId: string, params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const where = {
      branchId,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
              { cnic: { contains: search } },
              { phone: { contains: search } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.staff.count({ where }),
      this.prisma.staff.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { data: items, meta: paginationMeta(page, limit, total) };
  }

  async get(id: string) {
    const s = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        classSubjects: { include: { class: true, subject: true } },
      },
    });
    if (!s) throw new NotFoundException('Staff not found');
    return s;
  }

  async create(body: CreateStaffDto) {
    const passwordHash = await this.auth.hashPassword(body.password ?? 'changeme123');
    const role =
      body.role === 'admin'
        ? UserRole.school_admin
        : body.role === 'branch_manager'
          ? UserRole.branch_manager
          : UserRole.teacher;
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: body.email ?? null,
          phone: body.phone,
          passwordHash,
          role,
        },
      });
      return tx.staff.create({
        data: {
          branchId: body.branchId,
          userId: user.id,
          role: body.role,
          firstName: body.firstName,
          lastName: body.lastName,
          cnic: body.cnic,
          phone: body.phone,
          email: body.email ?? null,
          photoUrl: body.photoUrl ?? null,
          joiningDate: body.joiningDate ?? null,
        },
      });
    });
  }

  async update(id: string, data: Partial<CreateStaffDto>) {
    return this.prisma.staff.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        role: data.role,
        photoUrl: data.photoUrl,
      },
    });
  }

  async bulkImport(rows: unknown[]): Promise<BulkImportResult> {
    const results: BulkImportResultRow[] = [];
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const dto = plainToInstance(CreateStaffDto, rows[i]);
      const errs = await validate(dto);
      if (errs.length > 0) {
        failed += 1;
        const first = errs[0];
        results.push({
          row: i + 1,
          status: 'failed',
          field: first.property,
          message: Object.values(first.constraints ?? {}).join('; '),
        });
        continue;
      }
      try {
        const created = await this.create(dto);
        succeeded += 1;
        results.push({ row: i + 1, status: 'succeeded', id: created.id });
      } catch (err) {
        failed += 1;
        results.push({
          row: i + 1,
          status: 'failed',
          message: (err as Error).message,
        });
      }
    }

    return { total: rows.length, succeeded, failed, results };
  }
}

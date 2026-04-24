import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from '../common/prisma/prisma.service';
import { paginationMeta } from '../common/dto/pagination.dto';
import type { BulkImportResult, BulkImportResultRow } from '@eduportal/shared';
import { CreateStudentDto, PromoteStudentsDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(branchId: string, params: {
    page: number;
    limit: number;
    search?: string;
    sectionId?: string;
    academicYearId?: string;
  }) {
    const { page, limit, search, sectionId, academicYearId } = params;
    const where = {
      branchId,
      ...(sectionId || academicYearId
        ? {
            enrollments: {
              some: {
                status: 'active' as const,
                ...(sectionId ? { sectionId } : {}),
                ...(academicYearId ? { academicYearId } : {}),
              },
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
              { rollNo: { contains: search } },
            ],
          }
        : {}),
    };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.student.count({ where }),
      this.prisma.student.findMany({
        where,
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          enrollments: {
            where: { status: 'active' },
            include: { section: { include: { class: true } } },
            take: 1,
            orderBy: { enrollmentDate: 'desc' },
          },
        },
      }),
    ]);
    return { data: items, meta: paginationMeta(page, limit, total) };
  }

  async get(id: string) {
    const s = await this.prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            section: { include: { class: { include: { academicYear: true } } } },
          },
          orderBy: { enrollmentDate: 'desc' },
        },
        parents: { include: { parent: true } },
      },
    });
    if (!s) throw new NotFoundException('Student not found');
    return s;
  }

  async getByQrToken(qrToken: string) {
    return this.prisma.student.findUnique({
      where: { qrToken },
      include: {
        enrollments: {
          where: { status: 'active' },
          include: { section: { include: { class: true } } },
          take: 1,
          orderBy: { enrollmentDate: 'desc' },
        },
      },
    });
  }

  async create(body: CreateStudentDto) {
    return this.prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          branchId: body.branchId,
          firstName: body.firstName,
          lastName: body.lastName,
          rollNo: body.rollNo ?? null,
          dob: body.dob ?? null,
          gender: body.gender ?? null,
          photoUrl: body.photoUrl ?? null,
        },
      });
      if (body.sectionId && body.academicYearId) {
        await tx.enrollment.create({
          data: {
            studentId: student.id,
            sectionId: body.sectionId,
            academicYearId: body.academicYearId,
            status: 'active',
          },
        });
      }
      if (body.parentIds?.length) {
        await tx.studentParent.createMany({
          data: body.parentIds.map((parentId) => ({ studentId: student.id, parentId })),
          skipDuplicates: true,
        });
      }
      return student;
    });
  }

  async update(id: string, data: Partial<CreateStudentDto>) {
    return this.prisma.student.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        rollNo: data.rollNo,
        dob: data.dob,
        gender: data.gender,
        photoUrl: data.photoUrl,
      },
    });
  }

  async bulkImport(rows: unknown[]): Promise<BulkImportResult> {
    const results: BulkImportResultRow[] = [];
    let succeeded = 0;
    let failed = 0;
    for (let i = 0; i < rows.length; i += 1) {
      const dto = plainToInstance(CreateStudentDto, rows[i]);
      const errs = await validate(dto);
      if (errs.length) {
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

  async promote(body: PromoteStudentsDto) {
    const created = await this.prisma.$transaction(
      body.studentIds.map((studentId) =>
        this.prisma.enrollment.create({
          data: {
            studentId,
            sectionId: body.newSectionId,
            academicYearId: body.toAcademicYearId,
            status: 'active',
          },
        }),
      ),
    );
    return { promoted: created.length };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import type { FeeStatus } from '@eduportal/shared';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  listForStudent(studentId: string) {
    return this.prisma.feeRecord.findMany({
      where: { studentId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  create(data: {
    studentId: string;
    academicYearId: string;
    month: number;
    year: number;
    amountDue: number;
    dueDate?: Date;
  }) {
    return this.prisma.feeRecord.create({ data });
  }

  async recordPayment(id: string, amountPaid: number) {
    const rec = await this.prisma.feeRecord.findUnique({ where: { id } });
    if (!rec) throw new Error('Fee record not found');
    const totalPaid = rec.amountPaid + amountPaid;
    let status: FeeStatus = 'pending';
    if (totalPaid >= rec.amountDue) status = 'paid';
    else if (totalPaid > 0) status = 'partial';
    return this.prisma.feeRecord.update({
      where: { id },
      data: {
        amountPaid: totalPaid,
        status,
        paidAt: status === 'paid' ? new Date() : null,
      },
    });
  }

  async outstanding(branchId: string) {
    const records = await this.prisma.feeRecord.findMany({
      where: {
        student: { branchId },
        status: { in: ['pending', 'partial', 'overdue'] },
      },
      include: { student: true },
    });
    const total = records.reduce((n, r) => n + (r.amountDue - r.amountPaid), 0);
    return { total, count: records.length, records };
  }
}

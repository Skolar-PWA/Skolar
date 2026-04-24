import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import type { JwtPayload, QRScanResponse } from '@eduportal/shared';
import { MarkAttendanceDto } from './dto/attendance.dto';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async markSession(body: MarkAttendanceDto, actor: JwtPayload) {
    const staff = await this.prisma.staff.findFirst({ where: { userId: actor.sub } });
    if (!staff) throw new ForbiddenException('Only staff may mark attendance');

    const date = startOfDay(body.date);

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.attendanceSession.upsert({
        where: {
          sectionId_classSubjectId_date: {
            sectionId: body.sectionId,
            classSubjectId: (body.classSubjectId ?? null) as string,
            date,
          },
        },
        update: {
          markedById: staff.id,
          type: body.type ?? 'daily',
        },
        create: {
          sectionId: body.sectionId,
          classSubjectId: body.classSubjectId ?? null,
          date,
          markedById: staff.id,
          type: body.type ?? 'daily',
        },
      });

      if (session.isLocked) throw new ForbiddenException('Session is locked');

      for (const rec of body.records) {
        await tx.attendanceRecord.upsert({
          where: { sessionId_studentId: { sessionId: session.id, studentId: rec.studentId } },
          update: { status: rec.status, note: rec.note, scannedVia: rec.scannedVia },
          create: {
            sessionId: session.id,
            studentId: rec.studentId,
            status: rec.status,
            note: rec.note,
            scannedVia: rec.scannedVia,
          },
        });
      }

      return tx.attendanceSession.findUnique({
        where: { id: session.id },
        include: { records: true },
      });
    });
  }

  async getSession(sectionId: string, date: Date, classSubjectId?: string) {
    const d = startOfDay(date);
    return this.prisma.attendanceSession.findUnique({
      where: {
        sectionId_classSubjectId_date: {
          sectionId,
          classSubjectId: (classSubjectId ?? null) as string,
          date: d,
        },
      },
      include: { records: true },
    });
  }

  async lockSession(id: string) {
    return this.prisma.attendanceSession.update({
      where: { id },
      data: { isLocked: true },
    });
  }

  async unlockSession(id: string) {
    return this.prisma.attendanceSession.update({
      where: { id },
      data: { isLocked: false },
    });
  }

  async scanQr(qrToken: string, actor: JwtPayload, sessionId?: string): Promise<QRScanResponse> {
    const student = await this.prisma.student.findUnique({
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
    if (!student) throw new NotFoundException('Unknown QR token');

    const displayName = `${student.firstName} ${student.lastName}`;

    let session = null;
    if (sessionId) {
      session = await this.prisma.attendanceSession.findUnique({ where: { id: sessionId } });
    } else {
      const activeEnrollment = student.enrollments[0];
      if (!activeEnrollment) {
        return {
          student: {
            id: student.id,
            name: displayName,
            photoUrl: student.photoUrl,
            rollNo: student.rollNo,
          },
          status: 'no_active_session',
        };
      }
      const today = startOfDay(new Date());
      session = await this.prisma.attendanceSession.findFirst({
        where: { sectionId: activeEnrollment.sectionId, date: today, classSubjectId: null },
      });
      if (!session) {
        const staff = await this.prisma.staff.findFirst({ where: { userId: actor.sub } });
        if (!staff) throw new ForbiddenException('Only staff may create sessions');
        session = await this.prisma.attendanceSession.create({
          data: {
            sectionId: activeEnrollment.sectionId,
            date: today,
            markedById: staff.id,
            type: 'daily',
          },
        });
      }
    }

    if (!session) throw new BadRequestException('Session not found');

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { sessionId_studentId: { sessionId: session.id, studentId: student.id } },
    });
    if (existing && existing.status === 'present') {
      return {
        student: {
          id: student.id,
          name: displayName,
          photoUrl: student.photoUrl,
          rollNo: student.rollNo,
        },
        status: 'already_marked',
        sessionId: session.id,
      };
    }

    await this.prisma.attendanceRecord.upsert({
      where: { sessionId_studentId: { sessionId: session.id, studentId: student.id } },
      update: { status: 'present', scannedVia: 'qr_camera' },
      create: {
        sessionId: session.id,
        studentId: student.id,
        status: 'present',
        scannedVia: 'qr_camera',
      },
    });

    return {
      student: {
        id: student.id,
        name: displayName,
        photoUrl: student.photoUrl,
        rollNo: student.rollNo,
      },
      status: 'marked',
      sessionId: session.id,
    };
  }

  async studentSummary(studentId: string, fromDate: Date, toDate: Date) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: {
        studentId,
        session: { date: { gte: startOfDay(fromDate), lte: startOfDay(toDate) } },
      },
      include: { session: true },
      orderBy: { session: { date: 'asc' } },
    });
    const totals = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const r of records) {
      totals[r.status as keyof typeof totals] += 1;
    }
    const total = records.length;
    const presentPct = total === 0 ? 0 : Math.round(((totals.present + totals.late) / total) * 100);
    return { totals, presentPct, records: records.map((r) => ({
      date: r.session.date,
      status: r.status,
      note: r.note,
    })) };
  }

  async dailyByClass(branchId: string, date: Date) {
    const d = startOfDay(date);
    const classes = await this.prisma.class.findMany({
      where: { branchId },
      include: { sections: { include: { enrollments: { where: { status: 'active' } } } } },
    });
    const result: Array<{
      classId: string;
      name: string;
      total: number;
      present: number;
      percentPresent: number;
    }> = [];
    for (const c of classes) {
      const studentCount = c.sections.reduce((n, s) => n + s.enrollments.length, 0);
      const sectionIds = c.sections.map((s) => s.id);
      const sessions = await this.prisma.attendanceSession.findMany({
        where: { sectionId: { in: sectionIds }, date: d },
        include: { records: true },
      });
      const present = sessions.reduce(
        (n, s) =>
          n + s.records.filter((r) => r.status === 'present' || r.status === 'late').length,
        0,
      );
      result.push({
        classId: c.id,
        name: c.name,
        total: studentCount,
        present,
        percentPresent: studentCount === 0 ? 0 : Math.round((present / studentCount) * 100),
      });
    }
    return result;
  }
}

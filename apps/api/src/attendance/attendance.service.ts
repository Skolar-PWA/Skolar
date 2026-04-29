import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import type { JwtPayload } from '@eduportal/shared';
import { UserRole } from '@eduportal/shared';
import { MarkedMethod, Staff, StaffRole } from '@prisma/client';
import {
  MarkAttendanceDto,
  QrScanDto,
  SubmitSessionDto,
  PatchRecordDto,
  CreateSessionDto,
} from './dto/attendance.dto';
import { AttendanceNotifyService } from './attendance-notify.service';

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseTime(t: string): { h: number; m: number } {
  const [a, b] = t.split(':').map((x) => parseInt(x, 10));
  return { h: a || 0, m: b || 0 };
}

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notify: AttendanceNotifyService,
  ) {}

  private staffName(s: Pick<Staff, 'firstName' | 'lastName'>) {
    return `${s.firstName} ${s.lastName}`.trim();
  }

  private async getStaff(actor: JwtPayload) {
    const staff = await this.prisma.staff.findFirst({
      where: { userId: actor.sub },
      include: { classTeacherOf: { include: { class: true } }, branch: true },
    });
    if (!staff) throw new ForbiddenException('Only staff may access attendance');
    return staff;
  }

  private isPlatformAdmin(role: UserRole) {
    return role === 'super_admin' || role === 'school_admin' || role === 'branch_manager';
  }

  private canMarkAllSections(actor: JwtPayload, staff: Staff): boolean {
    if (this.isPlatformAdmin(actor.role)) return true;
    return (
      staff.role === StaffRole.admin ||
      staff.role === StaffRole.branch_manager ||
      staff.role === StaffRole.attendance_substitute
    );
  }

  private canMarkSection(actor: JwtPayload, staff: Staff, sectionId: string): boolean {
    if (this.canMarkAllSections(actor, staff)) return true;
    if (staff.role === StaffRole.teacher && staff.classTeacherOfId === sectionId) return true;
    return false;
  }

  private async ensureBranchSettings(branchId: string) {
    return this.prisma.branchSettings.upsert({
      where: { branchId },
      create: { branchId },
      update: {},
    });
  }

  async isLateMarking(branchId: string, submittedAt: Date): Promise<boolean> {
    const s = await this.ensureBranchSettings(branchId);
    const { h, m } = parseTime(s.attendanceDeadlineTime);
    const deadline = new Date(submittedAt);
    deadline.setHours(h, m, 0, 0);
    return submittedAt.getTime() > deadline.getTime();
  }

  async listSections(actor: JwtPayload) {
    const staff = await this.getStaff(actor);
    const branchId = staff.branchId;
    const sections = await this.prisma.section.findMany({
      where: { class: { branchId } },
      include: {
        class: true,
        enrollments: { where: { status: 'active' } },
      },
      orderBy: [{ class: { numericOrder: 'asc' } }, { name: 'asc' }],
    });
    const today = startOfDay(new Date());
    const markAll = this.canMarkAllSections(actor, staff);
    const isClassTeacher = staff.role === StaffRole.teacher && staff.classTeacherOfId;
    const filtered = markAll
      ? sections
      : isClassTeacher
        ? sections.filter((s) => s.id === staff.classTeacherOfId)
        : [];

    const sessionRows = await this.prisma.attendanceSession.findMany({
      where: {
        sectionId: { in: filtered.map((s) => s.id) },
        date: today,
      },
      include: { records: true },
    });
    const bySection = new Map(sessionRows.map((r) => [r.sectionId, r]));
    const settings = await this.ensureBranchSettings(branchId);
    const { h, m } = parseTime(settings.attendanceDeadlineTime);
    const deadlineToday = new Date();
    deadlineToday.setHours(h, m, 0, 0);
    const isAfterDeadline = Date.now() > deadlineToday.getTime();

    return filtered.map((sec) => {
      const sess = bySection.get(sec.id) ?? null;
      const counts = { present: 0, absent: 0, late: 0, excused: 0 };
      if (sess) for (const r of sess.records) counts[r.status as keyof typeof counts] += 1;
      return {
        id: sec.id,
        className: sec.class.name,
        name: sec.name,
        studentCount: sec.enrollments.length,
        canMark: true,
        session: sess
          ? {
              id: sess.id,
              submittedAt: sess.submittedAt,
              isLate: sess.isLate,
              isLocked: sess.isLocked,
              markedByName: sess.markedByName,
            }
          : null,
        counts,
        isAfterDeadline,
        isDraft: Boolean(sess && !sess.submittedAt),
      };
    });
  }

  async getSessionDetail(sectionId: string, dateStr: string, actor: JwtPayload) {
    const staff = await this.getStaff(actor);
    const section = await this.prisma.section.findFirst({
      where: { id: sectionId, class: { branchId: staff.branchId } },
      include: {
        class: true,
        enrollments: {
          where: { status: 'active' },
          include: { student: true },
          orderBy: { student: { rollNo: 'asc' } },
        },
      },
    });
    if (!section) throw new NotFoundException('Section not found');
    if (!this.canMarkSection(actor, staff, sectionId) && !this.isPlatformAdmin(actor.role)) {
      if (staff.role !== StaffRole.teacher) throw new ForbiddenException();
    }
    const day = startOfDay(new Date(dateStr));
    const session = await this.prisma.attendanceSession.findUnique({
      where: { sectionId_date: { sectionId, date: day } },
      include: { records: { include: { student: true } } },
    });
    const settings = await this.ensureBranchSettings(section.class.branchId);
    return {
      session,
      section,
      attendanceDeadlineTime: settings.attendanceDeadlineTime,
      branchId: section.class.branchId,
    };
  }

  async createOrGetSession(body: CreateSessionDto, actor: JwtPayload) {
    const staff = await this.getStaff(actor);
    if (!this.canMarkSection(actor, staff, body.sectionId)) {
      throw new ForbiddenException('You cannot mark attendance for this section');
    }
    const day = startOfDay(new Date(body.date));
    const name = this.staffName(staff);
    const section = await this.prisma.section.findFirst({
      where: { id: body.sectionId, class: { branchId: staff.branchId } },
    });
    if (!section) throw new NotFoundException('Section not found');

    return this.prisma.attendanceSession.upsert({
      where: { sectionId_date: { sectionId: body.sectionId, date: day } },
      create: {
        sectionId: body.sectionId,
        date: day,
        markedById: staff.id,
        markedByName: name,
      },
      update: { markedById: staff.id, markedByName: name },
    });
  }

  async submitSession(sessionId: string, body: SubmitSessionDto, actor: JwtPayload) {
    const staff = await this.getStaff(actor);
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { section: { include: { class: true } } },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (!this.canMarkSection(actor, staff, session.sectionId)) throw new ForbiddenException();
    if (session.submittedAt) throw new BadRequestException('Session already submitted');
    if (session.isLocked) throw new ForbiddenException('Session is locked');

    const section = await this.prisma.section.findUnique({
      where: { id: session.sectionId },
      include: { enrollments: { where: { status: 'active' } } },
    });
    if (!section) throw new NotFoundException();
    const studentIds = new Set(section.enrollments.map((e) => e.studentId));
    for (const r of body.records) {
      if (!studentIds.has(r.studentId)) throw new BadRequestException('Invalid student in section');
    }
    if (body.records.length !== studentIds.size) {
      throw new BadRequestException('All students must have a status');
    }

    const branchId = session.section.class.branchId;
    const submittedAt = new Date();
    const late = await this.isLateMarking(branchId, submittedAt);
    const name = this.staffName(staff);

    const withStudents = await this.prisma.$transaction(async (tx) => {
      await tx.attendanceSession.update({
        where: { id: sessionId },
        data: { submittedAt, isLate: late, markedById: staff.id, markedByName: name },
      });
      const out: Awaited<ReturnType<typeof tx.attendanceRecord.upsert>>[] = [];
      for (const r of body.records) {
        const rec = await tx.attendanceRecord.upsert({
          where: { sessionId_studentId: { sessionId, studentId: r.studentId } },
          create: {
            sessionId,
            studentId: r.studentId,
            status: r.status,
            note: r.note,
            markedById: staff.id,
            markedByName: name,
            markedMethod: (r.markedMethod as MarkedMethod) ?? MarkedMethod.manual,
            deviceName: r.deviceName,
          },
          update: {
            status: r.status,
            note: r.note,
            markedById: staff.id,
            markedByName: name,
            markedMethod: (r.markedMethod as MarkedMethod) ?? MarkedMethod.manual,
            deviceName: r.deviceName,
          },
          include: { student: true },
        });
        out.push(rec);
      }
      return out;
    });

    const fullSession = await this.prisma.attendanceSession.findUnique({ where: { id: sessionId } });
    if (late) {
      await this.notify.notifyLateMarking({
        branchId,
        teacher: staff,
        section: session.section,
        submittedAt,
        deadline: (await this.ensureBranchSettings(branchId)).attendanceDeadlineTime,
      });
    }
    if (fullSession) await this.notify.notifyParentsOnSubmit(fullSession, withStudents as never);

    return this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { records: { include: { student: true } } },
    });
  }

  async patchRecord(sessionId: string, studentId: string, body: PatchRecordDto, actor: JwtPayload) {
    const staff = await this.getStaff(actor);
    const record = await this.prisma.attendanceRecord.findUnique({
      where: { sessionId_studentId: { sessionId, studentId } },
      include: { session: true, student: true },
    });
    if (!record) throw new NotFoundException();
    if (!this.canMarkSection(actor, staff, record.session.sectionId)) throw new ForbiddenException();
    if (!record.session.submittedAt) throw new BadRequestException('Session not submitted yet');
    if (record.session.isLocked && !this.isPlatformAdmin(actor.role) && staff.role !== StaffRole.admin) {
      throw new ForbiddenException('Session is locked; contact admin');
    }
    const prev = record.status;
    const sname = this.staffName(staff);
    const studentName = `${record.student.firstName} ${record.student.lastName}`.trim();
    await this.prisma.$transaction([
      this.prisma.attendanceRecord.update({
        where: { id: record.id },
        data: { status: body.status, note: body.note, markedById: staff.id, markedByName: sname },
      }),
      this.prisma.attendanceEdit.create({
        data: {
          sessionId,
          studentId,
          previousStatus: prev,
          newStatus: body.status,
          reason: body.reason,
          editedById: staff.id,
          editedByName: sname,
          studentName,
        },
      }),
    ]);
    return { ok: true };
  }

  async scanQr(dto: QrScanDto, actor: JwtPayload) {
    const staff = await this.getStaff(actor);
    const student = await this.prisma.student.findUnique({
      where: { qrToken: dto.qrToken },
      include: { enrollments: { where: { status: 'active' }, orderBy: { enrollmentDate: 'desc' }, take: 1 } },
    });
    if (!student) throw new NotFoundException('Unknown QR token');
    const en = student.enrollments[0];
    const st = {
      id: student.id,
      name: `${student.firstName} ${student.lastName}`.trim(),
      photoUrl: student.photoUrl,
      rollNo: student.rollNo,
    };
    if (!en) return { student: st, status: 'not_enrolled' as const };
    const day = startOfDay(new Date());
    let session = await this.prisma.attendanceSession.findUnique({
      where: { sectionId_date: { sectionId: en.sectionId, date: day } },
    });
    if (!session) {
      if (!this.canMarkSection(actor, staff, en.sectionId) && !this.isPlatformAdmin(actor.role)) {
        return { student: st, status: 'no_session' as const };
      }
      const nm = this.staffName(staff);
      session = await this.prisma.attendanceSession.create({
        data: {
          sectionId: en.sectionId,
          date: day,
          markedById: staff.id,
          markedByName: nm,
        },
      });
    }
    if (session.isLocked) return { student: st, status: 'no_session' as const, sessionId: session.id };
    if (!this.canMarkSection(actor, staff, en.sectionId) && !this.isPlatformAdmin(actor.role)) {
      return { student: st, status: 'no_session' as const };
    }
    if (session.submittedAt) {
      return { student: st, status: 'no_session' as const, sessionId: session.id };
    }
    const method: MarkedMethod = dto.deviceName ? MarkedMethod.qr_fixed_device : MarkedMethod.qr_camera;
    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { sessionId_studentId: { sessionId: session.id, studentId: student.id } },
    });
    if (existing && existing.status === 'present') {
      return { student: st, status: 'already_marked' as const, sessionId: session.id };
    }
    const nm = this.staffName(staff);
    await this.prisma.attendanceRecord.upsert({
      where: { sessionId_studentId: { sessionId: session.id, studentId: student.id } },
      create: {
        sessionId: session.id,
        studentId: student.id,
        status: 'present',
        markedById: staff.id,
        markedByName: nm,
        markedMethod: method,
        deviceName: dto.deviceName ?? null,
      },
      update: {
        status: 'present',
        markedById: staff.id,
        markedByName: nm,
        markedMethod: method,
        deviceName: dto.deviceName ?? null,
      },
    });
    return { student: st, status: 'marked' as const, sessionId: session.id };
  }

  async markSession(body: MarkAttendanceDto, actor: JwtPayload) {
    const staff = await this.getStaff(actor);
    if (!this.canMarkSection(actor, staff, body.sectionId)) throw new ForbiddenException();
    const day = startOfDay(new Date(body.date));
    let session = await this.prisma.attendanceSession.findUnique({
      where: { sectionId_date: { sectionId: body.sectionId, date: day } },
    });
    if (!session) {
      session = await this.createOrGetSession({ sectionId: body.sectionId, date: day.toISOString() }, actor);
    }
    if (session.submittedAt) {
      return this.prisma.attendanceSession.findUnique({
        where: { id: session.id },
        include: { records: true },
      });
    }
    return this.submitSession(
      session.id,
      {
        records: body.records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          note: r.note,
          markedMethod: 'manual' as const,
        })),
      },
      actor,
    );
  }

  async getSession(sectionId: string, date: Date) {
    const d = startOfDay(date);
    return this.prisma.attendanceSession.findUnique({
      where: { sectionId_date: { sectionId, date: d } },
      include: { records: true },
    });
  }

  async lockSession(id: string) {
    return this.prisma.attendanceSession.update({
      where: { id },
      data: { isLocked: true, lockedAt: new Date() },
    });
  }

  async unlockSession(id: string) {
    return this.prisma.attendanceSession.update({
      where: { id },
      data: { isLocked: false, lockedById: null, lockedAt: null },
    });
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
    for (const r of records) totals[r.status as keyof typeof totals] += 1;
    const total = records.length;
    const presentPct = total === 0 ? 0 : Math.round(((totals.present + totals.late) / total) * 100);
    return {
      totals,
      presentPct,
      records: records.map((r) => ({ date: r.session.date, status: r.status, note: r.note })),
    };
  }

  async dailyByClass(branchId: string, date: Date) {
    const d = startOfDay(date);
    const classes = await this.prisma.class.findMany({
      where: { branchId },
      include: { sections: { include: { enrollments: { where: { status: 'active' } } } } },
    });
    const out: { classId: string; name: string; total: number; present: number; percentPresent: number }[] = [];
    for (const c of classes) {
      const studentCount = c.sections.reduce((n, s) => n + s.enrollments.length, 0);
      const sectionIds = c.sections.map((s) => s.id);
      const sessions = await this.prisma.attendanceSession.findMany({
        where: { sectionId: { in: sectionIds }, date: d },
        include: { records: true },
      });
      const present = sessions.reduce(
        (n, s) => n + s.records.filter((r) => r.status === 'present' || r.status === 'late').length,
        0,
      );
      out.push({
        classId: c.id,
        name: c.name,
        total: studentCount,
        present,
        percentPresent: studentCount === 0 ? 0 : Math.round((present / studentCount) * 100),
      });
    }
    return out;
  }
}

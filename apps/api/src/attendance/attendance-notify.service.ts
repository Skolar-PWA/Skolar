import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import type { AttendanceRecord, AttendanceSession, Section, Staff, Student } from '@prisma/client';
import { NotificationType } from '@prisma/client';

@Injectable()
export class AttendanceNotifyService {
  constructor(private readonly prisma: PrismaService) {}

  async notifyLateMarking(params: {
    branchId: string;
    teacher: Staff;
    section: Section & { class: { name: string } };
    submittedAt: Date;
    deadline: string;
  }) {
    const { branchId, teacher, section, submittedAt, deadline } = params;
    const teacherName = `${teacher.firstName} ${teacher.lastName}`.trim();
    const sectionLabel = `${section.class.name} ${section.name}`;
    const timeStr = submittedAt.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
    const body = `⚠️ ${teacherName} marked ${sectionLabel} attendance late at ${timeStr}`;
    const title = 'Late Attendance Marking';

    const recipients = await this.prisma.staff.findMany({
      where: {
        branchId,
        role: { in: ['admin', 'branch_manager', 'attendance_substitute'] },
        isActive: true,
        userId: { not: null },
      },
      select: { userId: true },
    });
    const userIds = recipients.map((r) => r.userId!).filter(Boolean);
    if (userIds.length === 0) return;

    await this.prisma.notification.createMany({
      data: userIds.map((recipientId) => ({
        branchId,
        recipientId,
        type: NotificationType.attendance_late_marking,
        title,
        body: `${body} (deadline was ${deadline})`,
        metadata: { sectionId: section.id, teacherName } as object,
      })),
    });
  }

  /** One in-app notification per recipient after the daily cutoff, listing all classes (marked and not). */
  async notifyDeadlineDigest(params: {
    branchId: string;
    branchName: string;
    deadline: string;
    dateLabel: string;
    sectionLines: string[];
  }) {
    const { branchId, branchName, deadline, dateLabel, sectionLines } = params;
    const title = 'Attendance — after cutoff';
    const body = [
      `The attendance deadline (${deadline}) has passed for ${dateLabel} at ${branchName}.`,
      'Summary by class/section:',
      '',
      ...sectionLines,
    ].join('\n');

    const recipients = await this.prisma.staff.findMany({
      where: {
        branchId,
        role: { in: ['admin', 'branch_manager', 'attendance_substitute'] },
        isActive: true,
        userId: { not: null },
      },
      select: { userId: true },
    });
    const userIds = recipients.map((r) => r.userId!).filter(Boolean);
    if (userIds.length === 0) return;

    await this.prisma.notification.createMany({
      data: userIds.map((recipientId) => ({
        branchId,
        recipientId,
        type: NotificationType.attendance_deadline_digest,
        title,
        body,
        metadata: { branchName, dateLabel, deadline } as object,
      })),
    });
  }

  async notifyParentsOnSubmit(
    session: AttendanceSession,
    records: (AttendanceRecord & { student: Student })[],
  ) {
    const dateStr = session.date.toISOString().slice(0, 10);
    for (const rec of records) {
      if (rec.status === 'present') continue;
      const typeMap = {
        absent: NotificationType.attendance_absent_student,
        late: NotificationType.attendance_late_student,
        excused: NotificationType.attendance_excused_student,
      } as const;
      const type = typeMap[rec.status as keyof typeof typeMap];
      if (!type) continue;
      const studentName = `${rec.student.firstName} ${rec.student.lastName}`.trim();
      let body: string;
      if (rec.status === 'absent') {
        body = `📋 Attendance Update — ${studentName} was marked absent today (${dateStr}).`;
      } else if (rec.status === 'late') {
        body = `⏰ Attendance Update — ${studentName} was marked late today (${dateStr}).`;
      } else {
        body = `✅ Attendance Update — ${studentName} has an excused absence today (${dateStr}).`;
      }

      const parents = await this.prisma.studentParent.findMany({
        where: { studentId: rec.studentId },
        include: { parent: { include: { user: true } } },
      });
      for (const sp of parents) {
        const uid = sp.parent.userId;
        if (!uid) continue;
        await this.prisma.notification.create({
          data: {
            branchId: rec.student.branchId,
            recipientId: uid,
            type,
            title: 'Attendance',
            body,
            metadata: { sessionId: session.id, studentId: rec.studentId } as object,
          },
        });
      }
    }
  }
}

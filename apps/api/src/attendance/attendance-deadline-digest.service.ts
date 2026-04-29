import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
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

function countRecords(records: { status: string }[]) {
  const c = { present: 0, absent: 0, late: 0, excused: 0 };
  for (const r of records) {
    if (r.status === 'present') c.present += 1;
    else if (r.status === 'absent') c.absent += 1;
    else if (r.status === 'late') c.late += 1;
    else if (r.status === 'excused') c.excused += 1;
  }
  return c;
}

/**
 * After each branch’s daily `attendanceDeadlineTime`, send one in-app summary to
 * branch admin, branch manager, and attendance substitute (officer) listing every section’s status.
 */
@Injectable()
export class AttendanceDeadlineDigestService {
  private readonly logger = new Logger(AttendanceDeadlineDigestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notify: AttendanceNotifyService,
  ) {}

  @Cron('0 */2 * * * *')
  async runScheduledDigest() {
    try {
      await this.processAllBranches();
    } catch (e) {
      this.logger.error('Attendance digest failed', e);
    }
  }

  async processAllBranches() {
    const now = new Date();
    const today = startOfDay(now);
    const branches = await this.prisma.branch.findMany({ include: { branchSettings: true } });

    for (const branch of branches) {
      const settings =
        branch.branchSettings ??
        (await this.prisma.branchSettings.create({ data: { branchId: branch.id } }));
      const { h, m } = parseTime(settings.attendanceDeadlineTime);
      const deadline = new Date(today);
      deadline.setHours(h, m, 0, 0);
      if (now.getTime() <= deadline.getTime()) {
        continue;
      }

      let logId: string | null = null;
      try {
        const log = await this.prisma.attendanceDeadlineDigestLog.create({
          data: { branchId: branch.id, digestDate: today },
        });
        logId = log.id;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          continue;
        }
        throw e;
      }

      const sectionLines: string[] = [];
      const sections = await this.prisma.section.findMany({
        where: { class: { branchId: branch.id } },
        include: { class: true, enrollments: { where: { status: 'active' } } },
        orderBy: [{ class: { numericOrder: 'asc' } }, { name: 'asc' }],
      });
      if (sections.length === 0) {
        sectionLines.push('• No class sections found for this branch.');
      } else {
        const sectionIds = sections.map((s) => s.id);
        const sessions = await this.prisma.attendanceSession.findMany({
          where: { date: today, sectionId: { in: sectionIds } },
          include: { records: true },
        });
        const bySection = new Map(sessions.map((s) => [s.sectionId, s]));

        for (const sec of sections) {
          const label = `• ${sec.class.name} · Section ${sec.name} —`;
          if (sec.enrollments.length === 0) {
            sectionLines.push(`${label} No students enrolled`);
            continue;
          }
          const session = bySection.get(sec.id);
          if (!session) {
            sectionLines.push(`${label} Not marked`);
            continue;
          }
          if (!session.submittedAt) {
            sectionLines.push(`${label} Draft (not submitted)`);
            continue;
          }
          const c = countRecords(session.records);
          const summary = `P ${c.present}, A ${c.absent}, L ${c.late}, E ${c.excused}`;
          const late = session.isLate ? ' · late submission' : '';
          sectionLines.push(`${label} Submitted (${summary})${late}`);
        }
      }

      const dateLabel = today.toISOString().slice(0, 10);
      try {
        await this.notify.notifyDeadlineDigest({
          branchId: branch.id,
          branchName: branch.name,
          deadline: settings.attendanceDeadlineTime,
          dateLabel,
          sectionLines,
        });
      } catch (err) {
        this.logger.error(`Digest notify failed for branch ${branch.id}`, err);
        if (logId) {
          await this.prisma.attendanceDeadlineDigestLog
            .delete({ where: { id: logId } })
            .catch(() => undefined);
        }
      }
    }
  }
}

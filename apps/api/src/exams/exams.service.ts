import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { computeGrade } from '@eduportal/shared';
import { BulkResultDto, CreateExamDto, DisputeDto } from './dto/exam.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  list(classId: string) {
    return this.prisma.exam.findMany({
      where: { classId },
      orderBy: [{ examDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async get(id: string) {
    const e = await this.prisma.exam.findUnique({
      where: { id },
      include: { class: { include: { classSubjects: { include: { subject: true } } } } },
    });
    if (!e) throw new NotFoundException('Exam not found');
    return e;
  }

  create(body: CreateExamDto) {
    return this.prisma.exam.create({ data: body });
  }

  release(id: string, isReleased: boolean) {
    return this.prisma.exam.update({ where: { id }, data: { isReleased } });
  }

  async submitResults(body: BulkResultDto) {
    const { examId, classSubjectId, totalMarks, records, saveAsDraft } = body;
    return this.prisma.$transaction(async (tx) => {
      for (const r of records) {
        const marks = r.marksObtained ?? null;
        const percent = marks === null ? null : (marks / totalMarks) * 100;
        const grade = percent === null ? null : computeGrade(percent);
        await tx.examSubjectResult.upsert({
          where: {
            examId_classSubjectId_studentId: {
              examId,
              classSubjectId,
              studentId: r.studentId,
            },
          },
          update: {
            marksObtained: marks,
            totalMarks,
            grade,
            remarks: r.remarks,
            isDraft: saveAsDraft ?? true,
          },
          create: {
            examId,
            classSubjectId,
            studentId: r.studentId,
            marksObtained: marks,
            totalMarks,
            grade,
            remarks: r.remarks,
            isDraft: saveAsDraft ?? true,
          },
        });
      }
      return { submitted: records.length, isDraft: saveAsDraft ?? true };
    });
  }

  async getResultsForExamSubject(examId: string, classSubjectId: string) {
    return this.prisma.examSubjectResult.findMany({
      where: { examId, classSubjectId },
      include: { student: true },
      orderBy: { student: { firstName: 'asc' } },
    });
  }

  async getStudentResults(studentId: string) {
    return this.prisma.examSubjectResult.findMany({
      where: { studentId, isDraft: false, exam: { isReleased: true } },
      include: {
        exam: { include: { class: true } },
        classSubject: { include: { subject: true } },
      },
      orderBy: [{ exam: { examDate: 'desc' } }],
    });
  }

  async raiseDispute(body: DisputeDto, userId: string) {
    return this.prisma.resultDispute.create({
      data: {
        resultId: body.resultId,
        raisedByUserId: userId,
        reason: body.reason,
      },
    });
  }

  async listDisputes(branchId: string) {
    return this.prisma.resultDispute.findMany({
      where: { result: { student: { branchId } } },
      include: { result: { include: { student: true, exam: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

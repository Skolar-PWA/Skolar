import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '@eduportal/shared';

@Injectable()
export class ParentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  list() {
    return this.prisma.parent.findMany({
      orderBy: { firstName: 'asc' },
      include: { students: { include: { student: true } } },
    });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    relation?: string;
    password?: string;
  }) {
    const passwordHash = await this.auth.hashPassword(data.password ?? 'changeme123');
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email ?? null,
          phone: data.phone,
          passwordHash,
          role: UserRole.parent,
        },
      });
      return tx.parent.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email ?? null,
          relation: data.relation ?? null,
        },
      });
    });
  }

  linkToStudent(parentId: string, studentId: string) {
    return this.prisma.studentParent.upsert({
      where: { studentId_parentId: { studentId, parentId } },
      update: {},
      create: { studentId, parentId },
    });
  }
}

import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import type { AuthenticatedUser, JwtPayload, LoginResponse } from '@eduportal/shared';
import { REFRESH_TOKEN_TTL_SECONDS } from '@eduportal/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(identifier: string, password: string): Promise<{
    login: LoginResponse;
    refreshToken: string;
    refreshMaxAgeMs: number;
  }> {
    const isEmail = identifier.includes('@');
    const user = await this.prisma.user.findFirst({
      where: isEmail ? { email: identifier } : { phone: identifier },
      include: {
        staff: { include: { branch: true } },
        student: { include: { branch: true } },
        parent: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const branchId =
      user.staff?.branchId ?? user.student?.branchId ?? null;
    const schoolGroupId = branchId
      ? (await this.prisma.branch.findUnique({ where: { id: branchId } }))?.schoolGroupId ?? null
      : null;

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      branchId,
      schoolGroupId,
    };

    const accessToken = await this.jwt.signAsync(payload);
    const refreshToken = await this.issueRefreshToken(user.id);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const displayName =
      user.staff
        ? `${user.staff.firstName} ${user.staff.lastName}`
        : user.student
          ? `${user.student.firstName} ${user.student.lastName}`
          : user.parent
            ? `${user.parent.firstName} ${user.parent.lastName}`
            : user.email ?? user.phone ?? 'User';

    const authUser: AuthenticatedUser = {
      id: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      branchId,
      schoolGroupId,
      displayName,
      photoUrl: user.staff?.photoUrl ?? user.student?.photoUrl ?? null,
    };

    return {
      login: { accessToken, expiresIn: 15 * 60, user: authUser },
      refreshToken,
      refreshMaxAgeMs: REFRESH_TOKEN_TTL_SECONDS * 1000,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    const row = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { staff: true, student: true } } },
    });
    if (!row || row.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const branchId =
      row.user.staff?.branchId ?? row.user.student?.branchId ?? null;
    const schoolGroupId = branchId
      ? (await this.prisma.branch.findUnique({ where: { id: branchId } }))?.schoolGroupId ?? null
      : null;
    const payload: JwtPayload = {
      sub: row.userId,
      role: row.user.role,
      branchId,
      schoolGroupId,
    };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken, expiresIn: 15 * 60 };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    await this.prisma.refreshToken
      .delete({ where: { token: refreshToken } })
      .catch(() => undefined);
  }

  async issueRefreshToken(userId: string): Promise<string> {
    const token = randomUUID() + '.' + randomUUID();
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
      },
    });
    return token;
  }

  async hashPassword(plain: string): Promise<string> {
    if (plain.length < 6) throw new BadRequestException('Password too short');
    return bcrypt.hash(plain, 10);
  }
}

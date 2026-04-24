import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { REFRESH_COOKIE_NAME } from '@eduportal/shared';
import type { JwtPayload, AuthenticatedUser } from '@eduportal/shared';
import { PrismaService } from '../common/prisma/prisma.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { login, refreshToken, refreshMaxAgeMs } = await this.auth.login(
      body.identifier,
      body.password,
    );
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: refreshMaxAgeMs,
    });
    return login;
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE_NAME];
    return this.auth.refresh(token ?? '');
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE_NAME];
    await this.auth.logout(token);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@CurrentUser() payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { staff: true, student: true, parent: true },
    });
    if (!user) {
      return {
        id: payload.sub,
        role: payload.role,
        email: null,
        phone: null,
        branchId: payload.branchId,
        schoolGroupId: payload.schoolGroupId,
        displayName: 'User',
        photoUrl: null,
      };
    }
    const displayName =
      user.staff
        ? `${user.staff.firstName} ${user.staff.lastName}`
        : user.student
          ? `${user.student.firstName} ${user.student.lastName}`
          : user.parent
            ? `${user.parent.firstName} ${user.parent.lastName}`
            : user.email ?? 'User';
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      branchId: payload.branchId,
      schoolGroupId: payload.schoolGroupId,
      displayName,
      photoUrl: user.staff?.photoUrl ?? user.student?.photoUrl ?? null,
    };
  }
}

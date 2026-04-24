import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto, QrScanDto } from './dto/attendance.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '@eduportal/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Roles(UserRole.teacher, UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Post('sessions')
  markSession(@Body() body: MarkAttendanceDto, @CurrentUser() actor: JwtPayload) {
    return this.service.markSession(body, actor);
  }

  @Get('sessions')
  getSession(
    @Query('sectionId') sectionId: string,
    @Query('date') date: string,
    @Query('classSubjectId') classSubjectId?: string,
  ) {
    return this.service.getSession(sectionId, new Date(date), classSubjectId);
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Patch('sessions/:id/lock')
  lock(@Param('id') id: string) {
    return this.service.lockSession(id);
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Patch('sessions/:id/unlock')
  unlock(@Param('id') id: string) {
    return this.service.unlockSession(id);
  }

  @Roles(UserRole.teacher, UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Post('scan')
  scan(@Body() body: QrScanDto, @CurrentUser() actor: JwtPayload) {
    return this.service.scanQr(body.qrToken, actor, body.sessionId);
  }

  @Get('student/:id')
  studentSummary(
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.service.studentSummary(id, new Date(from), new Date(to));
  }

  @Get('daily-by-class')
  dailyByClass(@Query('branchId') branchId: string, @Query('date') date: string) {
    return this.service.dailyByClass(branchId, new Date(date));
  }
}

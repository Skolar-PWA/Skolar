import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import {
  MarkAttendanceDto,
  QrScanDto,
  CreateSessionDto,
  SubmitSessionDto,
  PatchRecordDto,
} from './dto/attendance.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '@eduportal/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Roles(
    UserRole.teacher,
    UserRole.branch_manager,
    UserRole.school_admin,
    UserRole.super_admin,
  )
  @Get('sections')
  listSections(@CurrentUser() actor: JwtPayload) {
    return this.service.listSections(actor);
  }

  @Roles(
    UserRole.teacher,
    UserRole.branch_manager,
    UserRole.school_admin,
    UserRole.super_admin,
  )
  @Get('sections/:sectionId/session')
  getSessionDetail(
    @Param('sectionId') sectionId: string,
    @Query('date') date: string,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.service.getSessionDetail(sectionId, date, actor);
  }

  @Roles(
    UserRole.teacher,
    UserRole.branch_manager,
    UserRole.school_admin,
    UserRole.super_admin,
  )
  @Post('sessions/open')
  openSession(@Body() body: CreateSessionDto, @CurrentUser() actor: JwtPayload) {
    return this.service.createOrGetSession(body, actor);
  }

  @Roles(
    UserRole.teacher,
    UserRole.branch_manager,
    UserRole.school_admin,
    UserRole.super_admin,
  )
  @Post('sessions/:sessionId/submit')
  submit(
    @Param('sessionId') sessionId: string,
    @Body() body: SubmitSessionDto,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.service.submitSession(sessionId, body, actor);
  }

  @Roles(
    UserRole.teacher,
    UserRole.branch_manager,
    UserRole.school_admin,
    UserRole.super_admin,
  )
  @Patch('sessions/:sessionId/records/:studentId')
  patchRecord(
    @Param('sessionId') sessionId: string,
    @Param('studentId') studentId: string,
    @Body() body: PatchRecordDto,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.service.patchRecord(sessionId, studentId, body, actor);
  }

  @Roles(
    UserRole.teacher,
    UserRole.branch_manager,
    UserRole.school_admin,
    UserRole.super_admin,
  )
  @Post('scan')
  scan(@Body() body: QrScanDto, @CurrentUser() actor: JwtPayload) {
    return this.service.scanQr(body, actor);
  }

  @Get('sessions')
  getSession(
    @Query('sectionId') sectionId: string,
    @Query('date') date: string,
  ) {
    return this.service.getSession(sectionId, new Date(date));
  }

  @Roles(
    UserRole.teacher,
    UserRole.branch_manager,
    UserRole.school_admin,
    UserRole.super_admin,
  )
  @Post('sessions')
  markSession(@Body() body: MarkAttendanceDto, @CurrentUser() actor: JwtPayload) {
    return this.service.markSession(body, actor);
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

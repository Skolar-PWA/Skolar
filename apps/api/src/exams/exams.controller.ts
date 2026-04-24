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
import { ExamsService } from './exams.service';
import { BulkResultDto, CreateExamDto, DisputeDto, ReleaseExamDto } from './dto/exam.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '@eduportal/shared';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private readonly service: ExamsService) {}

  @Get()
  list(@Query('classId') classId: string) {
    return this.service.list(classId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Roles(UserRole.teacher, UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Post()
  create(@Body() body: CreateExamDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Patch(':id/release')
  release(@Param('id') id: string, @Body() body: ReleaseExamDto) {
    return this.service.release(id, body.isReleased);
  }

  @Roles(UserRole.teacher, UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Post('results')
  submitResults(@Body() body: BulkResultDto) {
    return this.service.submitResults(body);
  }

  @Get(':id/results')
  results(@Param('id') id: string, @Query('classSubjectId') classSubjectId: string) {
    return this.service.getResultsForExamSubject(id, classSubjectId);
  }

  @Get('students/:id')
  studentResults(@Param('id') id: string) {
    return this.service.getStudentResults(id);
  }

  @Post('disputes')
  dispute(@Body() body: DisputeDto, @CurrentUser() user: JwtPayload) {
    return this.service.raiseDispute(body, user.sub);
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Get('disputes/list')
  disputes(@Query('branchId') branchId: string) {
    return this.service.listDisputes(branchId);
  }
}

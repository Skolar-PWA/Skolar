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
import { StudentsService } from './students.service';
import {
  BulkStudentDto,
  CreateStudentDto,
  PromoteStudentsDto,
  UpdateStudentDto,
} from './dto/student.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('students')
@ApiBearerAuth()
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get()
  list(
    @Query('branchId') branchId: string,
    @Query('sectionId') sectionId: string | undefined,
    @Query('academicYearId') academicYearId: string | undefined,
    @Query() q: PaginationQueryDto,
  ) {
    return this.service.list(branchId, {
      page: q.page ?? 1,
      limit: q.limit ?? 25,
      search: q.search,
      sectionId,
      academicYearId,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager, UserRole.teacher)
  @Post()
  create(@Body() body: CreateStudentDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager, UserRole.teacher)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateStudentDto) {
    return this.service.update(id, body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post('bulk-import')
  bulkImport(@Body() body: BulkStudentDto) {
    return this.service.bulkImport(body.rows);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post('promote')
  promote(@Body() body: PromoteStudentsDto) {
    return this.service.promote(body);
  }
}

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
import { StaffService } from './staff.service';
import { BulkStaffDto, CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('staff')
@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Get()
  list(@Query('branchId') branchId: string, @Query() q: PaginationQueryDto) {
    return this.service.list(branchId, {
      page: q.page ?? 1,
      limit: q.limit ?? 25,
      search: q.search,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post()
  create(@Body() body: CreateStaffDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateStaffDto) {
    return this.service.update(id, body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post('bulk-import')
  bulkImport(@Body() body: BulkStaffDto) {
    return this.service.bulkImport(body.rows);
  }
}

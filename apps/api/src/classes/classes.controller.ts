import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { ClassesService } from './classes.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

class CreateClassDto {
  @ApiProperty() @IsUUID() branchId!: string;
  @ApiProperty() @IsUUID() academicYearId!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @Type(() => Number) @IsInt() numericOrder!: number;
}

class CreateSectionDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() capacity?: number;
}

class AssignSubjectDto {
  @ApiProperty() @IsUUID() subjectId!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() teacherId?: string;
}

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassesController {
  constructor(private readonly service: ClassesService) {}

  @Get()
  list(
    @Query('branchId') branchId: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    return this.service.list(branchId, academicYearId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post()
  create(@Body() body: CreateClassDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post(':id/sections')
  createSection(@Param('id') id: string, @Body() body: CreateSectionDto) {
    return this.service.createSection(id, body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post(':id/subjects')
  assignSubject(@Param('id') id: string, @Body() body: AssignSubjectDto) {
    return this.service.assignSubject(id, body.subjectId, body.teacherId);
  }

  @Get('sections/:sectionId')
  getSection(@Param('sectionId') sectionId: string) {
    return this.service.getSection(sectionId);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { SubjectsService } from './subjects.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

class CreateSubjectDto {
  @ApiProperty() @IsUUID() branchId!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() code!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isElective?: boolean;
}

class UpdateSubjectDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() code?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isElective?: boolean;
}

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  @Get()
  list(@Query('branchId') branchId: string) {
    return this.service.list(branchId);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post()
  create(@Body() body: CreateSubjectDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateSubjectDto) {
    return this.service.update(id, body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { SchoolsService } from './schools.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

class CreateSchoolGroupDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() subscriptionPlan?: string;
}

class UpdateSchoolGroupDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() subscriptionPlan?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isActive?: boolean;
}

@ApiTags('schools')
@ApiBearerAuth()
@Controller('schools')
export class SchoolsController {
  constructor(private readonly service: SchoolsService) {}

  @Roles(UserRole.super_admin, UserRole.school_admin)
  @Get()
  list() {
    return this.service.list();
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Roles(UserRole.super_admin)
  @Post()
  create(@Body() body: CreateSchoolGroupDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateSchoolGroupDto) {
    return this.service.update(id, body);
  }
}

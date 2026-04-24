import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { AcademicYearsService } from './academic-years.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

class CreateAcademicYearDto {
  @ApiProperty() @IsUUID() branchId!: string;
  @ApiProperty() @IsString() label!: string;
  @ApiProperty() @Type(() => Date) @IsDate() startDate!: Date;
  @ApiProperty() @Type(() => Date) @IsDate() endDate!: Date;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isActive?: boolean;
}

@ApiTags('academic-years')
@ApiBearerAuth()
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly service: AcademicYearsService) {}

  @Get()
  list(@Query('branchId') branchId: string) {
    return this.service.list(branchId);
  }

  @Get('active')
  active(@Query('branchId') branchId: string) {
    return this.service.active(branchId);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post()
  create(@Body() body: CreateAcademicYearDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.activate(id);
  }
}

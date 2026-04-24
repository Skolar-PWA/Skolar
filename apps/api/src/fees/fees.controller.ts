import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { FeesService } from './fees.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

class CreateFeeDto {
  @ApiProperty() @IsUUID() studentId!: string;
  @ApiProperty() @IsUUID() academicYearId!: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) @Max(12) month!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(2000) year!: number;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) amountDue!: number;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Date) @IsDate() dueDate?: Date;
}

class PaymentDto {
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0) amountPaid!: number;
}

@ApiTags('fees')
@ApiBearerAuth()
@Controller('fees')
export class FeesController {
  constructor(private readonly service: FeesService) {}

  @Get('students/:id')
  listForStudent(@Param('id') id: string) {
    return this.service.listForStudent(id);
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Post()
  create(@Body() body: CreateFeeDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Patch(':id/pay')
  pay(@Param('id') id: string, @Body() body: PaymentDto) {
    return this.service.recordPayment(id, body.amountPaid);
  }

  @Get('outstanding')
  outstanding(@Query('branchId') branchId: string) {
    return this.service.outstanding(branchId);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ParentsService } from './parents.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

class CreateParentDto {
  @ApiProperty() @IsString() firstName!: string;
  @ApiProperty() @IsString() lastName!: string;
  @ApiProperty() @IsString() phone!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() relation?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MinLength(6) password?: string;
}

class LinkDto {
  @ApiProperty() @IsUUID() studentId!: string;
}

@ApiTags('parents')
@ApiBearerAuth()
@Controller('parents')
export class ParentsController {
  constructor(private readonly service: ParentsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post()
  create(@Body() body: CreateParentDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Post(':id/link')
  link(@Param('id') id: string, @Body() body: LinkDto) {
    return this.service.linkToStudent(id, body.studentId);
  }
}

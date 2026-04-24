import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AnnouncementsService } from './announcements.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtPayload } from '@eduportal/shared';
import { UserRole } from '@eduportal/shared';

class CreateAnnouncementDto {
  @ApiProperty() @IsUUID() branchId!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() body!: string;
  @ApiProperty({ isArray: true, enum: UserRole })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRole, { each: true })
  targetRoles!: UserRole[];
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isPinned?: boolean;
}

class PinDto {
  @ApiProperty() @IsBoolean() isPinned!: boolean;
}

@ApiTags('announcements')
@ApiBearerAuth()
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Get()
  list(@Query('branchId') branchId: string, @CurrentUser() user: JwtPayload) {
    return this.service.list(branchId, user.role);
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin, UserRole.teacher)
  @Post()
  create(@Body() body: CreateAnnouncementDto, @CurrentUser() user: JwtPayload) {
    return this.service.create({ ...body, postedById: user.sub });
  }

  @Roles(UserRole.branch_manager, UserRole.school_admin, UserRole.super_admin)
  @Patch(':id/pin')
  pin(@Param('id') id: string, @Body() body: PinDto) {
    return this.service.pin(id, body.isPinned);
  }
}

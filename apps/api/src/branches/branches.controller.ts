import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { BranchesService } from './branches.service';
import { BranchSettingsService } from './branch-settings.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '@eduportal/shared';
import { UpdateBranchSettingsDto } from './dto/branch-settings.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@eduportal/shared';

class CreateBranchDto {
  @ApiProperty() @IsUUID() schoolGroupId!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contact?: string;
  @ApiProperty({ required: false, description: 'Daily attendance cutoff (HH:mm, 24h). Default 09:30.' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  attendanceDeadlineTime?: string;
}

class UpdateBranchDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contact?: string;
}

@ApiTags('branches')
@ApiBearerAuth()
@Controller('branches')
export class BranchesController {
  constructor(
    private readonly service: BranchesService,
    private readonly branchSettings: BranchSettingsService,
  ) {}

  @Get()
  list(@Query('schoolGroupId') schoolGroupId?: string) {
    return this.service.list(schoolGroupId);
  }

  @Get(':id/settings')
  getSettings(@Param('id') id: string, @CurrentUser() actor: JwtPayload) {
    return this.branchSettings.getForBranch(id, actor);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Patch(':id/settings')
  patchSettings(
    @Param('id') id: string,
    @CurrentUser() actor: JwtPayload,
    @Body() body: UpdateBranchSettingsDto,
  ) {
    return this.branchSettings.updateForBranch(id, actor, body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin)
  @Post()
  create(@Body() body: CreateBranchDto) {
    return this.service.create(body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin, UserRole.branch_manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBranchDto) {
    return this.service.update(id, body);
  }

  @Roles(UserRole.super_admin, UserRole.school_admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

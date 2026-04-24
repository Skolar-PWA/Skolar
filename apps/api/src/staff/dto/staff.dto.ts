import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { StaffRole } from '@eduportal/shared';

export class CreateStaffDto {
  @ApiProperty() @IsUUID() branchId!: string;
  @ApiProperty({ enum: StaffRole }) @IsEnum(StaffRole) role!: StaffRole;
  @ApiProperty() @IsString() firstName!: string;
  @ApiProperty() @IsString() lastName!: string;
  @ApiProperty() @IsString() @Length(13, 15) cnic!: string;
  @ApiProperty() @IsString() phone!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MinLength(6) password?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Date) @IsDate() joiningDate?: Date;
  @ApiProperty({ required: false }) @IsOptional() @IsString() photoUrl?: string;
}

export class UpdateStaffDto {
  @ApiProperty({ required: false }) @IsOptional() @IsEnum(StaffRole) role?: StaffRole;
  @ApiProperty({ required: false }) @IsOptional() @IsString() firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lastName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() photoUrl?: string;
}

export class BulkStaffDto {
  @ApiProperty({ type: [CreateStaffDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStaffDto)
  rows!: CreateStaffDto[];
}

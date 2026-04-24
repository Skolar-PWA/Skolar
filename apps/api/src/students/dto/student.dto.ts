import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Gender } from '@eduportal/shared';

export class CreateStudentDto {
  @ApiProperty() @IsUUID() branchId!: string;
  @ApiProperty() @IsString() firstName!: string;
  @ApiProperty() @IsString() lastName!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rollNo?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Date) @IsDate() dob?: Date;
  @ApiProperty({ required: false, enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
  @ApiProperty({ required: false }) @IsOptional() @IsString() photoUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() sectionId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() academicYearId?: string;
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  parentIds?: string[];
}

export class UpdateStudentDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() lastName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() rollNo?: string;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Date) @IsDate() dob?: Date;
  @ApiProperty({ required: false, enum: Gender }) @IsOptional() @IsEnum(Gender) gender?: Gender;
  @ApiProperty({ required: false }) @IsOptional() @IsString() photoUrl?: string;
}

export class BulkStudentDto {
  @ApiProperty({ type: [CreateStudentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  rows!: CreateStudentDto[];
}

export class PromoteStudentsDto {
  @ApiProperty() @IsUUID() fromAcademicYearId!: string;
  @ApiProperty() @IsUUID() toAcademicYearId!: string;
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('all', { each: true })
  studentIds!: string[];
  @ApiProperty() @IsUUID() newSectionId!: string;
}

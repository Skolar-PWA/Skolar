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
import { AttendanceStatus, AttendanceType } from '@eduportal/shared';

class AttendanceRecordInput {
  @ApiProperty() @IsUUID() studentId!: string;
  @ApiProperty({ enum: AttendanceStatus }) @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @ApiProperty({ required: false }) @IsOptional() @IsString() note?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() scannedVia?: string;
}

export class MarkAttendanceDto {
  @ApiProperty() @IsUUID() sectionId!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() classSubjectId?: string;
  @ApiProperty({ type: Date }) @Type(() => Date) @IsDate() date!: Date;
  @ApiProperty({ required: false, enum: AttendanceType })
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;
  @ApiProperty({ type: [AttendanceRecordInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordInput)
  records!: AttendanceRecordInput[];
}

export class QrScanDto {
  @ApiProperty() @IsString() qrToken!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUUID() sessionId?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() deviceToken?: string;
}

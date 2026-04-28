import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '@eduportal/shared';

class AttendanceRecordInput {
  @ApiProperty() @IsUUID() studentId!: string;
  @ApiProperty({ enum: AttendanceStatus }) @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['manual', 'qr_camera', 'qr_fixed_device']) markedMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceName?: string;
}

/** @deprecated use submit session — kept for offline queue */
class LegacyAttendanceRecord {
  @ApiProperty() @IsUUID() studentId!: string;
  @ApiProperty({ enum: AttendanceStatus }) @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scannedVia?: string;
}

export class MarkAttendanceDto {
  @ApiProperty() @IsUUID() sectionId!: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() classSubjectId?: string;
  @ApiProperty() @IsDateString() date!: string;
  @ApiProperty({ type: [LegacyAttendanceRecord] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegacyAttendanceRecord)
  records!: LegacyAttendanceRecord[];
}

export class QrScanDto {
  @ApiProperty() @IsString() qrToken!: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() sessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceName?: string;
}

export class CreateSessionDto {
  @ApiProperty() @IsUUID() sectionId!: string;
  @ApiProperty() @IsDateString() date!: string;
}

export class SubmitSessionDto {
  @ApiProperty({ type: [AttendanceRecordInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordInput)
  records!: AttendanceRecordInput[];
}

export class PatchRecordDto {
  @ApiProperty({ enum: AttendanceStatus }) @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class UnlockSessionDto {
  @ApiProperty() @IsString() reason!: string;
}

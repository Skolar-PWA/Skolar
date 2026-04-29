import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsDbUuid } from '../../common/decorators/is-db-uuid.decorator';
import { AttendanceStatus } from '@eduportal/shared';

class AttendanceRecordInput {
  @ApiProperty() @IsDbUuid() studentId!: string;
  @ApiProperty({ enum: AttendanceStatus }) @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['manual', 'qr_camera', 'qr_fixed_device']) markedMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceName?: string;
}

/** @deprecated use submit session — kept for offline queue */
class LegacyAttendanceRecord {
  @ApiProperty() @IsDbUuid() studentId!: string;
  @ApiProperty({ enum: AttendanceStatus }) @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() scannedVia?: string;
}

export class MarkAttendanceDto {
  @ApiProperty() @IsDbUuid() sectionId!: string;
  @ApiPropertyOptional() @IsOptional() @IsDbUuid() classSubjectId?: string;
  @ApiProperty() @IsDateString() date!: string;
  @ApiProperty({ type: [LegacyAttendanceRecord] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegacyAttendanceRecord)
  records!: LegacyAttendanceRecord[];
}

export class QrScanDto {
  @ApiProperty() @IsString() qrToken!: string;
  @ApiPropertyOptional() @IsOptional() @IsDbUuid() sessionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deviceName?: string;
}

export class CreateSessionDto {
  @ApiProperty() @IsDbUuid() sectionId!: string;
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

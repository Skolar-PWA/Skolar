import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/** HH:mm 24h (branch attendance cutoff & edit window end). */
const HHMM = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export class UpdateBranchSettingsDto {
  @ApiProperty({ required: false, example: '09:30' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  @Matches(HHMM, { message: 'attendanceDeadlineTime must be HH:mm (24h)' })
  attendanceDeadlineTime?: string;

  @ApiProperty({ required: false, example: '23:59' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  @Matches(HHMM, { message: 'attendanceEditWindowEnd must be HH:mm (24h)' })
  attendanceEditWindowEnd?: string;
}

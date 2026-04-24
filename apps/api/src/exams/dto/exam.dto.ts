import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ExamType } from '@eduportal/shared';

export class CreateExamDto {
  @ApiProperty() @IsUUID() classId!: string;
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ required: false, enum: ExamType })
  @IsOptional()
  @IsEnum(ExamType)
  type?: ExamType;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Date) @IsDate() examDate?: Date;
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsInt() totalWeightage?: number;
}

class ResultRecord {
  @ApiProperty() @IsUUID() studentId!: string;
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  marksObtained?: number | null;
  @ApiProperty({ required: false }) @IsOptional() @IsString() remarks?: string;
}

export class BulkResultDto {
  @ApiProperty() @IsUUID() examId!: string;
  @ApiProperty() @IsUUID() classSubjectId!: string;
  @ApiProperty() @Type(() => Number) @IsNumber() @Min(1) totalMarks!: number;
  @ApiProperty({ type: [ResultRecord] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultRecord)
  records!: ResultRecord[];
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() saveAsDraft?: boolean;
}

export class ReleaseExamDto {
  @ApiProperty() @IsBoolean() isReleased!: boolean;
}

export class DisputeDto {
  @ApiProperty() @IsUUID() resultId!: string;
  @ApiProperty() @IsString() reason!: string;
}

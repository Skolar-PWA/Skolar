import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceNotifyService } from './attendance-notify.service';
import { AttendanceDeadlineDigestService } from './attendance-deadline-digest.service';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [StudentsModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceNotifyService, AttendanceDeadlineDigestService],
})
export class AttendanceModule {}

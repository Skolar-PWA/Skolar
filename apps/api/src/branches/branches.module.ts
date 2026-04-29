import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BranchSettingsService } from './branch-settings.service';

@Module({
  controllers: [BranchesController],
  providers: [BranchesService, BranchSettingsService],
  exports: [BranchesService, BranchSettingsService],
})
export class BranchesModule {}

import { Module } from '@nestjs/common';
import { LotteryResultsController } from './lottery-results.controller';
import { LotteryResultsService } from './lottery-results.service';

@Module({
  controllers: [LotteryResultsController],
  providers: [LotteryResultsService],
  exports: [LotteryResultsService],
})
export class LotteryResultsModule {}

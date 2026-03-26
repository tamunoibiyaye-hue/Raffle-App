import { Module } from '@nestjs/common';
import { DrawsController } from './draws.controller';
import { DrawsService } from './draws.service';
import { RafflesModule } from '../raffles/raffles.module';
import { LotteryResultsModule } from '../lottery-results/lottery-results.module';

@Module({
  imports: [RafflesModule, LotteryResultsModule],
  controllers: [DrawsController],
  providers: [DrawsService],
})
export class DrawsModule {}

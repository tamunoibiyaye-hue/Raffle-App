import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { RafflesModule } from '../raffles/raffles.module';

@Module({
  imports: [RafflesModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}

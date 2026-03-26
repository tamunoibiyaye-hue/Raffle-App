import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RafflesModule } from './raffles/raffles.module';
import { TicketsModule } from './tickets/tickets.module';
import { PaymentsModule } from './payments/payments.module';
import { LotteryResultsModule } from './lottery-results/lottery-results.module';
import { DrawsModule } from './draws/draws.module';
import { AdminModule } from './admin/admin.module';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    RafflesModule,
    TicketsModule,
    PaymentsModule,
    LotteryResultsModule,
    DrawsModule,
    AdminModule,
    DocsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

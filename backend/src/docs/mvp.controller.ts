import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('docs')
export class MvpDocsController {
  @Get('mvp')
  @Public()
  getMvpInfo() {
    return {
      name: 'Raffle App MVP API',
      description:
        'Initial API implementation for auth, raffles, tickets, payments, lottery results, draw execution, and admin backoffice.',
      seedAdmin: {
        email: 'admin@raffle.app',
        password: 'Admin1234!',
      },
      modules: [
        'auth',
        'users',
        'raffles',
        'tickets',
        'payments',
        'lottery-results',
        'draws',
        'admin',
      ],
      notes: [
        'Data persistence is currently in-memory for MVP speed.',
        'Switch StoreService to PostgreSQL repository layer for production.',
        'Card payment is simulated as immediate paid.',
        'Transfer and Yappy remain pending until webhook/manual confirmation.',
      ],
    };
  }
}

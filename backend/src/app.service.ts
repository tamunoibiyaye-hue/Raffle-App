import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; status: string; docs: string } {
    return {
      service: 'raffle-backend',
      status: 'ok',
      docs: '/docs/mvp',
    };
  }
}

import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ChargePaymentDto } from './dto/charge-payment.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';
import { OptionalJwtAuthGuard } from '../common/guards/optional-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('charge')
  @UseGuards(OptionalJwtAuthGuard)
  charge(@Body() payload: ChargePaymentDto, @CurrentUser() user?: JwtUser) {
    return this.paymentsService.charge(payload, user);
  }

  @Post('webhooks/:provider')
  @Public()
  webhook(
    @Param('provider') provider: string,
    @Body() payload: PaymentWebhookDto,
  ) {
    return this.paymentsService.handleWebhook(provider, payload);
  }
}

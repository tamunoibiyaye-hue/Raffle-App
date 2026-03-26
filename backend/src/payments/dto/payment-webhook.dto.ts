import { IsIn, IsString } from 'class-validator';
import { PAYMENT_STATUSES } from '../../common/domain';
import type { PaymentStatus } from '../../common/domain';

export class PaymentWebhookDto {
  @IsString()
  transactionId!: string;

  @IsIn(PAYMENT_STATUSES)
  status!: PaymentStatus;

  @IsString()
  providerReference!: string;
}

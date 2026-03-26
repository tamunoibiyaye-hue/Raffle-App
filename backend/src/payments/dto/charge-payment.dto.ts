import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { PAYMENT_METHODS } from '../../common/domain';
import type { PaymentMethod } from '../../common/domain';

export class ChargePaymentDto {
  @IsString()
  transactionId!: string;

  @IsIn(PAYMENT_METHODS)
  paymentMethod!: PaymentMethod;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  externalReference?: string;

  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'guestEmail must be valid',
  })
  @IsOptional()
  guestEmail?: string;

  @IsString()
  @IsOptional()
  guestLookupCode?: string;

  @IsString()
  @IsOptional()
  guestPhone?: string;
}

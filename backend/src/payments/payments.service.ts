import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { StoreService } from '../common/store.service';
import { ChargePaymentDto } from './dto/charge-payment.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { PaymentStatus, Transaction } from '../common/domain';
import { nowIso } from '../common/utils';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';

export interface PaymentChargeResponse {
  transactionId: string;
  status: PaymentStatus;
  paymentMethod: string;
  amount: number;
  externalReference?: string;
  instructions?: string;
}

@Injectable()
export class PaymentsService {
  constructor(private readonly store: StoreService) {}

  charge(payload: ChargePaymentDto, authUser?: JwtUser): PaymentChargeResponse {
    const transaction = this.findTransaction(payload.transactionId);
    if (transaction.userId) {
      if (!authUser || transaction.userId !== authUser.sub) {
        throw new UnauthorizedException(
          'You can only pay your own transaction',
        );
      }
    } else if (transaction.guestId) {
      const guest = this.store
        .getGuests()
        .find((item) => item.id === transaction.guestId);
      if (
        !guest ||
        guest.email !== payload.guestEmail?.trim().toLowerCase() ||
        guest.lookupCode !== payload.guestLookupCode?.trim().toUpperCase() ||
        guest.phone !== payload.guestPhone?.trim()
      ) {
        throw new UnauthorizedException('Guest lookup credentials are invalid');
      }
    } else {
      throw new BadRequestException('Transaction owner is invalid');
    }

    return this.chargeTransaction(transaction, {
      paymentMethod: payload.paymentMethod,
      amount: payload.amount,
      externalReference: payload.externalReference,
    });
  }

  private chargeTransaction(
    transaction: Transaction,
    payload: {
      amount?: number;
      externalReference?: string;
      paymentMethod: Transaction['paymentMethod'];
    },
  ): PaymentChargeResponse {
    if (!payload.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    }

    if (transaction.status !== 'pending') {
      throw new BadRequestException('Only pending transactions can be charged');
    }

    if (payload.amount !== undefined && payload.amount !== transaction.amount) {
      throw new BadRequestException('Amount does not match transaction total');
    }

    transaction.paymentMethod = payload.paymentMethod;
    transaction.externalReference = payload.externalReference?.trim();
    transaction.updatedAt = nowIso();

    if (payload.paymentMethod === 'card') {
      this.setTransactionStatus(transaction, 'paid');
      this.updateTicketsPaymentStatus(transaction.id, 'paid');
    } else {
      // Transfer and Yappy remain pending until manual or webhook confirmation.
      this.setTransactionStatus(transaction, 'pending');
      this.updateTicketsPaymentStatus(transaction.id, 'reserved');
    }

    return {
      transactionId: transaction.id,
      status: transaction.status,
      paymentMethod: payload.paymentMethod,
      amount: transaction.amount,
      externalReference: transaction.externalReference,
      instructions:
        payload.paymentMethod === 'card'
          ? 'Card payment approved'
          : 'Awaiting manual or webhook confirmation',
    };
  }

  handleWebhook(
    provider: string,
    payload: PaymentWebhookDto,
  ): PaymentChargeResponse {
    const transaction = this.findTransaction(payload.transactionId);
    transaction.externalReference = payload.providerReference;
    this.setTransactionStatus(transaction, payload.status);

    if (payload.status === 'paid') {
      this.updateTicketsPaymentStatus(transaction.id, 'paid');
    } else if (payload.status === 'failed' || payload.status === 'cancelled') {
      this.updateTicketsPaymentStatus(transaction.id, 'cancelled');
    }

    return {
      transactionId: transaction.id,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod ?? provider,
      amount: transaction.amount,
      externalReference: transaction.externalReference,
    };
  }

  private findTransaction(id: string): Transaction {
    const transaction = this.store
      .getTransactions()
      .find((item) => item.id === id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  private setTransactionStatus(
    transaction: Transaction,
    status: PaymentStatus,
  ): void {
    transaction.status = status;
    transaction.updatedAt = nowIso();
  }

  private updateTicketsPaymentStatus(
    transactionId: string,
    status: 'reserved' | 'paid' | 'cancelled',
  ): void {
    this.store
      .getTickets()
      .filter((ticket) => ticket.transactionId === transactionId)
      .forEach((ticket) => {
        ticket.status = status;
        ticket.updatedAt = nowIso();
      });
  }
}

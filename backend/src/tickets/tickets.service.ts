import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreService } from '../common/store.service';
import { RafflesService } from '../raffles/raffles.service';
import { CreateTicketReservationDto } from './dto/create-ticket-reservation.dto';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';
import { Ticket, Transaction } from '../common/domain';
import { generateId, nowIso, padNumber } from '../common/utils';

export interface TicketReservationResult {
  transaction: Transaction;
  tickets: Ticket[];
  guestLookupCode?: string;
  amount: number;
}

@Injectable()
export class TicketsService {
  constructor(
    private readonly store: StoreService,
    private readonly rafflesService: RafflesService,
  ) {}

  reserveForRaffle(
    raffleId: string,
    payload: CreateTicketReservationDto,
    authUser?: JwtUser,
  ): TicketReservationResult {
    const raffle = this.rafflesService.getById(raffleId);
    if (raffle.status !== 'active') {
      throw new BadRequestException(
        'Tickets can only be purchased for active raffles',
      );
    }

    if (!authUser && !payload.guest) {
      throw new BadRequestException(
        'Guest info is required for unauthenticated purchase',
      );
    }

    const allRaffleTickets = this.store
      .getTickets()
      .filter(
        (ticket) =>
          ticket.raffleId === raffleId && ticket.status !== 'cancelled',
      );
    const occupiedNumbers = new Set(
      allRaffleTickets.map((item) => item.ticketNumber),
    );

    if (allRaffleTickets.length + payload.quantity > raffle.totalTickets) {
      throw new BadRequestException('Not enough tickets available');
    }

    const now = nowIso();
    const transaction: Transaction = {
      id: generateId(),
      raffleId,
      userId: authUser?.sub,
      status: 'pending',
      amount: Number((payload.quantity * raffle.ticketPrice).toFixed(2)),
      ticketIds: [],
      createdAt: now,
      updatedAt: now,
    };

    let guestLookupCode: string | undefined;
    let guestId: string | undefined;
    if (!authUser && payload.guest) {
      const guest = this.store.upsertGuest(
        payload.guest.name,
        payload.guest.email,
        payload.guest.phone,
      );
      guestLookupCode = guest.lookupCode;
      guestId = guest.id;
      transaction.guestId = guest.id;
    }

    const selectedNumbers = (payload.selectedNumbers ?? []).map((item) =>
      item.trim().padStart(raffle.ticketNumberDigits, '0'),
    );
    if (selectedNumbers.length > payload.quantity) {
      throw new BadRequestException(
        'selectedNumbers cannot be greater than requested quantity',
      );
    }

    const seen = new Set<string>();
    for (const number of selectedNumbers) {
      if (!/^\d+$/.test(number)) {
        throw new BadRequestException(
          `Ticket number "${number}" must contain only digits`,
        );
      }

      if (number.length !== raffle.ticketNumberDigits) {
        throw new BadRequestException(
          `Ticket number "${number}" must have ${raffle.ticketNumberDigits} digits`,
        );
      }

      if (seen.has(number)) {
        throw new BadRequestException(
          `Duplicate ticket number "${number}" requested`,
        );
      }
      seen.add(number);

      if (occupiedNumbers.has(number)) {
        throw new BadRequestException(
          `Ticket number "${number}" is not available`,
        );
      }
    }

    const createdTickets: Ticket[] = [];
    selectedNumbers.forEach((number) => {
      occupiedNumbers.add(number);
      createdTickets.push(
        this.makeTicket(
          transaction.id,
          raffleId,
          number,
          authUser?.sub,
          guestId,
        ),
      );
    });

    const maxNumber = 10 ** raffle.ticketNumberDigits;
    let cursor = 0;
    while (createdTickets.length < payload.quantity) {
      if (cursor >= maxNumber) {
        throw new BadRequestException('No ticket numbers available');
      }
      const candidate = padNumber(cursor, raffle.ticketNumberDigits);
      cursor += 1;
      if (occupiedNumbers.has(candidate)) {
        continue;
      }
      occupiedNumbers.add(candidate);
      createdTickets.push(
        this.makeTicket(
          transaction.id,
          raffleId,
          candidate,
          authUser?.sub,
          guestId,
        ),
      );
    }

    transaction.ticketIds = createdTickets.map((ticket) => ticket.id);
    transaction.amount = Number(
      (createdTickets.length * raffle.ticketPrice).toFixed(2),
    );
    transaction.updatedAt = nowIso();
    this.store.getTransactions().push(transaction);
    this.store.getTickets().push(...createdTickets);

    return {
      transaction,
      tickets: createdTickets,
      guestLookupCode,
      amount: transaction.amount,
    };
  }

  getMyTickets(userId: string): Ticket[] {
    return this.store
      .getTickets()
      .filter((ticket) => ticket.buyerUserId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getGuestTickets(email: string, phone: string, code: string): Ticket[] {
    const guest = this.store
      .getGuests()
      .find(
        (item) =>
          item.email === email.trim().toLowerCase() &&
          item.phone === phone.trim() &&
          item.lookupCode === code.trim().toUpperCase(),
      );

    if (!guest) {
      throw new NotFoundException('Guest ticket lookup data is invalid');
    }

    return this.store
      .getTickets()
      .filter((ticket) => ticket.guestId === guest.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  private makeTicket(
    transactionId: string,
    raffleId: string,
    number: string,
    buyerUserId?: string,
    guestId?: string,
  ): Ticket {
    const now = nowIso();
    return {
      id: generateId(),
      raffleId,
      buyerUserId,
      guestId,
      ticketNumber: number,
      status: 'reserved',
      transactionId,
      createdAt: now,
      updatedAt: now,
    };
  }
}

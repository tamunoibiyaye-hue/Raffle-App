import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreService } from '../common/store.service';
import { LotteryResultsService } from '../lottery-results/lottery-results.service';
import { RafflesService } from '../raffles/raffles.service';
import { RaffleWinner, Ticket } from '../common/domain';
import { generateId, nowIso } from '../common/utils';

export interface DrawExecutionResult {
  raffleId: string;
  status: 'drawn';
  winningNumber: string;
  winner?: {
    ticketId: string;
    userId?: string;
    guestId?: string;
  };
}

@Injectable()
export class DrawsService {
  constructor(
    private readonly store: StoreService,
    private readonly raffleService: RafflesService,
    private readonly lotteryResultsService: LotteryResultsService,
  ) {}

  executeDraw(raffleId: string): DrawExecutionResult {
    const raffle = this.raffleService.getById(raffleId);
    if (raffle.status === 'cancelled') {
      throw new BadRequestException('Cannot draw a cancelled raffle');
    }
    if (raffle.status === 'drawn') {
      throw new BadRequestException('Raffle already drawn');
    }

    const lotteryResult = this.lotteryResultsService.getByDateAndType(
      raffle.lotteryDate,
      raffle.lotteryType,
    );

    const winningSuffix = this.extractWinningNumber(
      lotteryResult.prize1Number,
      raffle.rulePattern,
    );

    const paidTickets = this.store
      .getTickets()
      .filter(
        (ticket) => ticket.raffleId === raffle.id && ticket.status === 'paid',
      );

    const winnerTicket = paidTickets.find((ticket) =>
      ticket.ticketNumber.endsWith(winningSuffix),
    );

    const existingWinner = this.store
      .getRaffleWinners()
      .find((winner) => winner.raffleId === raffle.id);
    if (existingWinner) {
      throw new BadRequestException('Raffle already has a winner record');
    }

    const winner: RaffleWinner = {
      id: generateId(),
      raffleId: raffle.id,
      ticketId: winnerTicket?.id,
      winnerUserId: winnerTicket?.buyerUserId,
      winnerGuestId: winnerTicket?.guestId,
      winningNumber: winningSuffix,
      createdAt: nowIso(),
    };

    this.store.getRaffleWinners().push(winner);
    raffle.status = 'drawn';
    raffle.updatedAt = nowIso();

    if (winnerTicket) {
      this.notifyWinner(winnerTicket, raffle.title, winningSuffix);
      return {
        raffleId: raffle.id,
        status: 'drawn',
        winningNumber: winningSuffix,
        winner: {
          ticketId: winnerTicket.id,
          userId: winnerTicket.buyerUserId,
          guestId: winnerTicket.guestId,
        },
      };
    }

    return {
      raffleId: raffle.id,
      status: 'drawn',
      winningNumber: winningSuffix,
    };
  }

  private extractWinningNumber(
    prize1Number: string,
    rulePattern: 'last2' | 'last3' | 'last4',
  ): string {
    const digits = Number(rulePattern.replace('last', ''));
    if (!Number.isFinite(digits) || digits < 2) {
      throw new NotFoundException('Unsupported lottery matching rule');
    }
    return prize1Number.slice(-digits).padStart(digits, '0');
  }

  private notifyWinner(
    ticket: Ticket,
    raffleTitle: string,
    winningNumber: string,
  ): void {
    const message = `You won raffle "${raffleTitle}" with ticket ${winningNumber}.`;
    if (ticket.buyerUserId) {
      this.store.createNotification({
        channel: 'in_app',
        recipientUserId: ticket.buyerUserId,
        message,
      });
      this.store.createNotification({
        channel: 'email',
        recipientUserId: ticket.buyerUserId,
        message,
      });
    } else if (ticket.guestId) {
      this.store.createNotification({
        channel: 'email',
        recipientGuestId: ticket.guestId,
        message,
      });
    }
  }
}

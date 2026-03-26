import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service';
import { nowIso } from '../common/utils';

export interface ReportSummary {
  bestSellingRaffles: Array<{
    raffleId: string;
    title: string;
    soldTickets: number;
    totalSales: number;
  }>;
  totalSalesVolume: number;
  mostActiveUsers: Array<{
    userId: string;
    name: string;
    purchases: number;
  }>;
}

@Injectable()
export class AdminService {
  constructor(private readonly store: StoreService) {}

  listUsers() {
    return this.store
      .getUsers()
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        roles: user.roles,
        isOrganizerVerified: user.isOrganizerVerified,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  blockUser(userId: string, blocked: boolean) {
    const user = this.store.getUsers().find((item) => item.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isBlocked = blocked;
    user.updatedAt = nowIso();
    return {
      userId: user.id,
      isBlocked: user.isBlocked,
      updatedAt: user.updatedAt,
    };
  }

  verifyOrganizer(userId: string, verified: boolean) {
    const user = this.store.getUsers().find((item) => item.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.roles.includes('organizer')) {
      user.roles.push('organizer');
    }
    user.isOrganizerVerified = verified;
    user.updatedAt = nowIso();
    return {
      userId: user.id,
      isOrganizerVerified: user.isOrganizerVerified,
      updatedAt: user.updatedAt,
    };
  }

  listRaffles() {
    return this.store
      .getRaffles()
      .map((raffle) => {
        const paidTickets = this.store
          .getTickets()
          .filter(
            (ticket) =>
              ticket.raffleId === raffle.id && ticket.status === 'paid',
          ).length;

        const winner = this.store
          .getRaffleWinners()
          .find((item) => item.raffleId === raffle.id);
        return {
          ...raffle,
          paidTickets,
          salesAmount: Number((paidTickets * raffle.ticketPrice).toFixed(2)),
          winner,
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  listTransactions() {
    return this.store
      .getTransactions()
      .map((transaction) => ({
        ...transaction,
        tickets: this.store
          .getTickets()
          .filter((ticket) => ticket.transactionId === transaction.id),
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  reportSummary(): ReportSummary {
    const raffles = this.store.getRaffles();
    const paidTickets = this.store
      .getTickets()
      .filter((ticket) => ticket.status === 'paid');
    const paidTransactions = this.store
      .getTransactions()
      .filter((transaction) => transaction.status === 'paid');

    const bestSellingRaffles = raffles
      .map((raffle) => {
        const soldTickets = paidTickets.filter(
          (ticket) => ticket.raffleId === raffle.id,
        ).length;
        return {
          raffleId: raffle.id,
          title: raffle.title,
          soldTickets,
          totalSales: Number((soldTickets * raffle.ticketPrice).toFixed(2)),
        };
      })
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    const userPurchaseCounts = new Map<string, number>();
    paidTransactions.forEach((transaction) => {
      if (!transaction.userId) return;
      userPurchaseCounts.set(
        transaction.userId,
        (userPurchaseCounts.get(transaction.userId) ?? 0) + 1,
      );
    });

    const mostActiveUsers = Array.from(userPurchaseCounts.entries())
      .map(([userId, purchases]) => {
        const user = this.store.getUsers().find((item) => item.id === userId);
        return {
          userId,
          name: user?.name ?? 'Unknown user',
          purchases,
        };
      })
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 10);

    return {
      bestSellingRaffles,
      totalSalesVolume: Number(
        paidTransactions
          .reduce((acc, transaction) => acc + transaction.amount, 0)
          .toFixed(2),
      ),
      mostActiveUsers,
    };
  }

  listNotifications() {
    return this.store
      .getNotifications()
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

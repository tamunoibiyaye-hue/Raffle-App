import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  Guest,
  LotteryResult,
  Notification,
  Raffle,
  RaffleWinner,
  Ticket,
  Transaction,
  User,
} from './domain';
import {
  createIdentifierHash,
  generateId,
  normalizeEmail,
  nowIso,
} from './utils';

@Injectable()
export class StoreService {
  private readonly users: User[] = [];
  private readonly raffles: Raffle[] = [];
  private readonly tickets: Ticket[] = [];
  private readonly transactions: Transaction[] = [];
  private readonly lotteryResults: LotteryResult[] = [];
  private readonly raffleWinners: RaffleWinner[] = [];
  private readonly guests: Guest[] = [];
  private readonly notifications: Notification[] = [];

  constructor() {
    const now = nowIso();
    const adminPasswordHash = bcrypt.hashSync('Admin1234!', 10);

    this.users.push({
      id: generateId(),
      name: 'System Admin',
      email: 'admin@raffle.app',
      phone: '+50760000000',
      country: 'PA',
      passwordHash: adminPasswordHash,
      roles: ['admin', 'user'],
      isOrganizerVerified: true,
      isBlocked: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  getUsers(): User[] {
    return this.users;
  }

  getRaffles(): Raffle[] {
    return this.raffles;
  }

  getTickets(): Ticket[] {
    return this.tickets;
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  getLotteryResults(): LotteryResult[] {
    return this.lotteryResults;
  }

  getRaffleWinners(): RaffleWinner[] {
    return this.raffleWinners;
  }

  getGuests(): Guest[] {
    return this.guests;
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  findUserByEmail(email: string): User | undefined {
    const normalized = normalizeEmail(email);
    return this.users.find((user) => user.email === normalized);
  }

  upsertGuest(name: string, email: string, phone: string): Guest {
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = phone.trim();
    const identifierHash = createIdentifierHash(
      normalizedEmail,
      normalizedPhone,
    );
    const existing = this.guests.find(
      (guest) => guest.identifierHash === identifierHash,
    );
    const now = nowIso();

    if (existing) {
      existing.name = name.trim();
      existing.email = normalizedEmail;
      existing.phone = normalizedPhone;
      existing.updatedAt = now;
      return existing;
    }

    const guest: Guest = {
      id: generateId(),
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      lookupCode: generateId().split('-')[0].toUpperCase(),
      identifierHash,
      createdAt: now,
      updatedAt: now,
    };

    this.guests.push(guest);
    return guest;
  }

  createNotification(
    input: Omit<Notification, 'id' | 'createdAt'>,
  ): Notification {
    const notification: Notification = {
      id: generateId(),
      createdAt: nowIso(),
      ...input,
    };
    this.notifications.push(notification);
    return notification;
  }
}

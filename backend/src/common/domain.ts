export const USER_ROLES = ['user', 'organizer', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const RAFFLE_STATUSES = [
  'draft',
  'active',
  'closed',
  'drawn',
  'cancelled',
] as const;
export type RaffleStatus = (typeof RAFFLE_STATUSES)[number];

export const LOTTERY_RULE_PATTERNS = ['last2', 'last3', 'last4'] as const;
export type LotteryRulePattern = (typeof LOTTERY_RULE_PATTERNS)[number];

export const TICKET_STATUSES = ['reserved', 'paid', 'cancelled'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const PAYMENT_METHODS = ['card', 'transfer', 'yappy'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'cancelled',
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const RAFFLE_CATEGORIES = [
  'electronics',
  'clothing',
  'car',
  'food',
  'service',
  'experience',
  'other',
] as const;
export type RaffleCategory = (typeof RAFFLE_CATEGORIES)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  passwordHash: string;
  roles: UserRole[];
  isOrganizerVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  lookupCode: string;
  identifierHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Raffle {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  category: RaffleCategory;
  images: string[];
  prizeValueApprox: number;
  ticketPrice: number;
  totalTickets: number;
  ticketNumberDigits: number;
  drawDateTime: string;
  lotteryDate: string;
  lotteryType: string;
  rulePattern: LotteryRulePattern;
  termsAndConditions: string;
  status: RaffleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  raffleId: string;
  buyerUserId?: string;
  guestId?: string;
  ticketNumber: string;
  status: TicketStatus;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  raffleId: string;
  userId?: string;
  guestId?: string;
  paymentMethod?: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  externalReference?: string;
  ticketIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LotteryResult {
  id: string;
  lotteryDate: string;
  lotteryType: string;
  prize1Number: string;
  prize2Number: string;
  prize3Number: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface RaffleWinner {
  id: string;
  raffleId: string;
  ticketId?: string;
  winnerUserId?: string;
  winnerGuestId?: string;
  winningNumber: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  channel: 'in_app' | 'email';
  recipientUserId?: string;
  recipientGuestId?: string;
  message: string;
  createdAt: string;
}

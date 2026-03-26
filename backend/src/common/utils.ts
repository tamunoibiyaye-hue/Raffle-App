import { createHash, randomUUID } from 'node:crypto';

export const nowIso = (): string => new Date().toISOString();

export const generateId = (): string => randomUUID();

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const createIdentifierHash = (email: string, phone: string): string => {
  const payload = `${normalizeEmail(email)}::${phone.trim()}`;
  return createHash('sha256').update(payload).digest('hex');
};

export const padNumber = (value: number, digits: number): string =>
  value.toString().padStart(digits, '0');

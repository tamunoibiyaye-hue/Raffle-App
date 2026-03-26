export const formatCountdown = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${safe}s`;
};

export const maskPhoneForDisplay = (digits: string): string => {
  if (!digits) {
    return '+507';
  }
  return `+507 ${digits}`;
};

export const maskPhoneNumber = (digits: string): string => {
  const clean = digits.replace(/\D/g, '').slice(0, 12);
  return clean;
};

export const clampPhoneDigits = (digits: string): string =>
  digits.replace(/\D/g, '').slice(0, 12);

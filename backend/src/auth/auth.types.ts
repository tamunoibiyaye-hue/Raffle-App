import type { UserRole } from '../common/domain';

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  roles: UserRole[];
  isOrganizerVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUserResponse;
}

import type { UserRole } from '../domain';

export interface JwtUser {
  sub: string;
  email: string;
  roles: UserRole[];
}

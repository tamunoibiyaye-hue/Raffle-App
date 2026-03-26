import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StoreService } from '../../common/store.service';
import type { JwtUser } from '../../common/interfaces/jwt-user.interface';
import { normalizeEmail } from '../../common/utils';

interface JwtPayload {
  sub: string;
  email: string;
  roles: JwtUser['roles'];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly store: StoreService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-secret-key',
    });
  }

  validate(payload: JwtPayload): JwtUser {
    const user = this.store.getUsers().find((item) => item.id === payload.sub);
    if (!user || user.isBlocked) {
      throw new UnauthorizedException('Invalid token');
    }

    if (user.email !== normalizeEmail(payload.email)) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
  }
}

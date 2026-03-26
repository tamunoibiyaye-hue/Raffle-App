import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { StoreService } from '../common/store.service';
import { generateId, normalizeEmail, nowIso } from '../common/utils';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../common/domain';
import { AuthResponse, AuthUserResponse } from './auth.types';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';

@Injectable()
export class AuthService {
  private readonly tokenTtlSeconds = 60 * 60 * 24;

  constructor(
    private readonly store: StoreService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto): Promise<AuthResponse> {
    const existing = this.store.findUserByEmail(payload.email);
    if (existing) {
      throw new BadRequestException('Email is already registered');
    }

    const now = nowIso();
    const roles = RegisterDto.sanitizeRoles(payload.roles);
    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user: User = {
      id: generateId(),
      name: payload.name.trim(),
      email: normalizeEmail(payload.email),
      phone: payload.phone?.trim(),
      country: payload.country?.trim(),
      passwordHash,
      roles,
      isOrganizerVerified: false,
      isBlocked: false,
      createdAt: now,
      updatedAt: now,
    };

    this.store.getUsers().push(user);
    return this.buildAuthResponse(user);
  }

  async login(payload: LoginDto): Promise<AuthResponse> {
    const user = this.store.findUserByEmail(payload.email);
    if (!user || user.isBlocked) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  getSafeUserById(userId: string): AuthUserResponse {
    const user = this.store.getUsers().find((item) => item.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toSafeUser(user);
  }

  private buildAuthResponse(user: User): AuthResponse {
    const jwtPayload: JwtUser = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      expiresIn: this.tokenTtlSeconds,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.tokenTtlSeconds,
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: User): AuthUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: normalizeEmail(user.email),
      phone: user.phone,
      country: user.country,
      roles: [...user.roles],
      isOrganizerVerified: user.isOrganizerVerified,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

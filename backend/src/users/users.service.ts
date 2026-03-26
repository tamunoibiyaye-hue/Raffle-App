import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreService } from '../common/store.service';
import { normalizeEmail, nowIso } from '../common/utils';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthUserResponse } from '../auth/auth.types';

@Injectable()
export class UsersService {
  constructor(private readonly store: StoreService) {}

  getMe(userId: string): AuthUserResponse {
    const user = this.store.getUsers().find((item) => item.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

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

  updateMe(userId: string, payload: UpdateProfileDto): AuthUserResponse {
    const user = this.store.getUsers().find((item) => item.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (payload.name !== undefined) {
      user.name = payload.name.trim();
    }
    if (payload.phone !== undefined) {
      user.phone = payload.phone.trim();
    }
    if (payload.country !== undefined) {
      user.country = payload.country.trim();
    }
    if (payload.wantsOrganizerRole && !user.roles.includes('organizer')) {
      user.roles.push('organizer');
    }

    user.updatedAt = nowIso();
    return this.getMe(user.id);
  }
}

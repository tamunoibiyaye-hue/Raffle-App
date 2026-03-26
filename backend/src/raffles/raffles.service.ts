import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreService } from '../common/store.service';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { UpdateRaffleStatusDto } from './dto/update-raffle-status.dto';
import { Raffle } from '../common/domain';
import { generateId, nowIso } from '../common/utils';

interface RafflesFilter {
  category?: string;
  maxTicketPrice?: number;
  drawDate?: string;
  status?: string;
}

@Injectable()
export class RafflesService {
  constructor(private readonly store: StoreService) {}

  list(filters: RafflesFilter = {}): Raffle[] {
    return this.store
      .getRaffles()
      .filter((raffle) => {
        if (filters.category && raffle.category !== filters.category) {
          return false;
        }
        if (
          filters.maxTicketPrice !== undefined &&
          raffle.ticketPrice > filters.maxTicketPrice
        ) {
          return false;
        }
        if (
          filters.drawDate &&
          !raffle.drawDateTime.startsWith(filters.drawDate.trim())
        ) {
          return false;
        }
        if (filters.status && raffle.status !== filters.status) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.drawDateTime.localeCompare(b.drawDateTime));
  }

  getById(id: string): Raffle {
    const raffle = this.store.getRaffles().find((item) => item.id === id);
    if (!raffle) {
      throw new NotFoundException('Raffle not found');
    }
    return raffle;
  }

  create(user: JwtUser, payload: CreateRaffleDto): Raffle {
    const creator = this.store.getUsers().find((item) => item.id === user.sub);
    if (!creator) {
      throw new ForbiddenException('User cannot create raffles');
    }
    if (!creator.roles.includes('organizer')) {
      creator.roles.push('organizer');
      creator.updatedAt = nowIso();
    }

    const now = nowIso();
    const raffle: Raffle = {
      id: generateId(),
      organizerId: user.sub,
      title: payload.title.trim(),
      description: payload.description.trim(),
      category: payload.category,
      images: payload.images ?? [],
      prizeValueApprox: payload.prizeValueApprox,
      ticketPrice: payload.ticketPrice,
      totalTickets: payload.totalTickets,
      ticketNumberDigits: payload.ticketNumberDigits ?? 4,
      drawDateTime: payload.drawDateTime,
      lotteryDate: payload.lotteryDate.slice(0, 10),
      lotteryType: payload.lotteryType.trim(),
      rulePattern: payload.rulePattern,
      termsAndConditions: payload.termsAndConditions.trim(),
      status: payload.status ?? 'draft',
      createdAt: now,
      updatedAt: now,
    };

    this.store.getRaffles().push(raffle);
    return raffle;
  }

  update(id: string, user: JwtUser, payload: UpdateRaffleDto): Raffle {
    const raffle = this.getById(id);

    const isOwner = raffle.organizerId === user.sub;
    const isAdmin = user.roles.includes('admin');
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Only owner organizer or admin can edit');
    }

    if (raffle.status === 'closed' || raffle.status === 'drawn') {
      throw new BadRequestException('Cannot edit raffle once closed or drawn');
    }

    if (payload.title !== undefined) raffle.title = payload.title.trim();
    if (payload.description !== undefined) {
      raffle.description = payload.description.trim();
    }
    if (payload.category !== undefined) raffle.category = payload.category;
    if (payload.images !== undefined) raffle.images = payload.images;
    if (payload.prizeValueApprox !== undefined) {
      raffle.prizeValueApprox = payload.prizeValueApprox;
    }
    if (payload.ticketPrice !== undefined)
      raffle.ticketPrice = payload.ticketPrice;
    if (payload.totalTickets !== undefined)
      raffle.totalTickets = payload.totalTickets;
    if (payload.ticketNumberDigits !== undefined) {
      raffle.ticketNumberDigits = payload.ticketNumberDigits;
    }
    if (payload.drawDateTime !== undefined)
      raffle.drawDateTime = payload.drawDateTime;
    if (payload.lotteryDate !== undefined) {
      raffle.lotteryDate = payload.lotteryDate.slice(0, 10);
    }
    if (payload.lotteryType !== undefined)
      raffle.lotteryType = payload.lotteryType;
    if (payload.rulePattern !== undefined)
      raffle.rulePattern = payload.rulePattern;
    if (payload.termsAndConditions !== undefined) {
      raffle.termsAndConditions = payload.termsAndConditions.trim();
    }
    if (payload.status !== undefined) raffle.status = payload.status;

    raffle.updatedAt = nowIso();
    return raffle;
  }

  updateStatus(
    id: string,
    user: JwtUser,
    payload: UpdateRaffleStatusDto,
  ): Raffle {
    const raffle = this.getById(id);
    const isOwner = raffle.organizerId === user.sub;
    const isAdmin = user.roles.includes('admin');
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Only owner organizer or admin can update status',
      );
    }

    if (raffle.status === 'drawn' && payload.status !== 'drawn') {
      throw new BadRequestException('Cannot move raffle out of drawn status');
    }

    raffle.status = payload.status;
    raffle.updatedAt = nowIso();
    return raffle;
  }

  getByOrganizer(organizerId: string): Raffle[] {
    return this.store
      .getRaffles()
      .filter((raffle) => raffle.organizerId === organizerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

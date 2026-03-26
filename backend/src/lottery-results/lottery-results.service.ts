import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreService } from '../common/store.service';
import { CreateLotteryResultDto } from './dto/create-lottery-result.dto';
import { LotteryResult } from '../common/domain';
import { generateId, nowIso } from '../common/utils';

@Injectable()
export class LotteryResultsService {
  constructor(private readonly store: StoreService) {}

  create(payload: CreateLotteryResultDto): LotteryResult {
    const normalizedDate = payload.lotteryDate.slice(0, 10);
    const normalizedType = payload.lotteryType.trim().toLowerCase();
    const alreadyExists = this.store
      .getLotteryResults()
      .some(
        (item) =>
          item.lotteryDate === normalizedDate &&
          item.lotteryType.toLowerCase() === normalizedType,
      );
    if (alreadyExists) {
      throw new BadRequestException(
        'Lottery result already exists for this date and type',
      );
    }

    const now = nowIso();
    const result: LotteryResult = {
      id: generateId(),
      lotteryDate: normalizedDate,
      lotteryType: payload.lotteryType.trim(),
      prize1Number: payload.prize1Number.trim(),
      prize2Number: payload.prize2Number.trim(),
      prize3Number: payload.prize3Number.trim(),
      source: payload.source.trim(),
      createdAt: now,
      updatedAt: now,
    };
    this.store.getLotteryResults().push(result);
    return result;
  }

  list(filters: { date?: string; lotteryType?: string } = {}): LotteryResult[] {
    const normalizedDate = filters.date?.trim();
    const normalizedType = filters.lotteryType?.trim().toLowerCase();
    return this.store
      .getLotteryResults()
      .filter((item) => {
        if (normalizedDate && item.lotteryDate !== normalizedDate) {
          return false;
        }
        if (
          normalizedType &&
          item.lotteryType.trim().toLowerCase() !== normalizedType
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.lotteryDate.localeCompare(a.lotteryDate));
  }

  getByDateAndType(date: string, type: string): LotteryResult {
    const result = this.store
      .getLotteryResults()
      .find(
        (item) =>
          item.lotteryDate === date.slice(0, 10) &&
          item.lotteryType.toLowerCase() === type.trim().toLowerCase(),
      );
    if (!result) {
      throw new NotFoundException(
        `Lottery result not found for ${date.slice(0, 10)} / ${type}`,
      );
    }
    return result;
  }
}

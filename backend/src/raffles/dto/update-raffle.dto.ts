import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  ValidateIf,
  IsArray,
} from 'class-validator';
import {
  LOTTERY_RULE_PATTERNS,
  RAFFLE_CATEGORIES,
  RAFFLE_STATUSES,
} from '../../common/domain';
import type {
  LotteryRulePattern,
  RaffleCategory,
  RaffleStatus,
} from '../../common/domain';

export class UpdateRaffleDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  description?: string;

  @IsIn(RAFFLE_CATEGORIES)
  @IsOptional()
  category?: RaffleCategory;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  prizeValueApprox?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsOptional()
  ticketPrice?: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @IsOptional()
  totalTickets?: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(2)
  @Max(6)
  @IsOptional()
  ticketNumberDigits?: number;

  @IsDateString()
  @IsOptional()
  drawDateTime?: string;

  @IsDateString()
  @IsOptional()
  lotteryDate?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  lotteryType?: string;

  @IsIn(LOTTERY_RULE_PATTERNS)
  @IsOptional()
  rulePattern?: LotteryRulePattern;

  @IsString()
  @MinLength(10)
  @IsOptional()
  termsAndConditions?: string;

  @IsIn(RAFFLE_STATUSES)
  @IsOptional()
  status?: RaffleStatus;
}

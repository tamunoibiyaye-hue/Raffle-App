import {
  ArrayMinSize,
  IsArray,
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

export class CreateRaffleDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsIn(RAFFLE_CATEGORIES)
  category!: RaffleCategory;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  prizeValueApprox!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  ticketPrice!: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  totalTickets!: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(2)
  @Max(6)
  @IsOptional()
  ticketNumberDigits?: number;

  @IsDateString()
  drawDateTime!: string;

  @IsDateString()
  lotteryDate!: string;

  @IsString()
  @MinLength(2)
  lotteryType!: string;

  @IsIn(LOTTERY_RULE_PATTERNS)
  rulePattern!: LotteryRulePattern;

  @IsString()
  @MinLength(10)
  termsAndConditions!: string;

  @IsIn(RAFFLE_STATUSES)
  @IsOptional()
  status?: RaffleStatus;
}

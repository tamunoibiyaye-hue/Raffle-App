import { IsIn } from 'class-validator';
import { RAFFLE_STATUSES } from '../../common/domain';
import type { RaffleStatus } from '../../common/domain';

export class UpdateRaffleStatusDto {
  @IsIn(RAFFLE_STATUSES)
  status!: RaffleStatus;
}

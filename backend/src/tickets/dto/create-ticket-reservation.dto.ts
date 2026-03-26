import {
  ValidateNested,
  ValidateIf,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestInfoDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'email must be valid' })
  email!: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'phone must be a valid international format',
  })
  phone!: string;
}

export class CreateTicketReservationDto {
  @IsInt()
  @Min(1)
  quantity!: number;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  selectedNumbers?: string[];

  @ValidateNested()
  @Type(() => GuestInfoDto)
  @IsOptional()
  guest?: GuestInfoDto;
}

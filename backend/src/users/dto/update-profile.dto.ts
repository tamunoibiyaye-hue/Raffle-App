import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'phone must be a valid international format',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsBoolean()
  @IsOptional()
  wantsOrganizerRole?: boolean;
}

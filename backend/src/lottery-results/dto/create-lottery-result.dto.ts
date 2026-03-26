import { IsDateString, IsString, Matches, MinLength } from 'class-validator';

export class CreateLotteryResultDto {
  @IsDateString()
  lotteryDate!: string;

  @IsString()
  @MinLength(2)
  lotteryType!: string;

  @IsString()
  @Matches(/^\d{2,6}$/, {
    message: 'prize1Number must be a 2-6 digit number string',
  })
  prize1Number!: string;

  @IsString()
  @Matches(/^\d{2,6}$/, {
    message: 'prize2Number must be a 2-6 digit number string',
  })
  prize2Number!: string;

  @IsString()
  @Matches(/^\d{2,6}$/, {
    message: 'prize3Number must be a 2-6 digit number string',
  })
  prize3Number!: string;

  @IsString()
  @MinLength(2)
  source!: string;
}

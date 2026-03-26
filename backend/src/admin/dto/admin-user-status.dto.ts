import { IsBoolean } from 'class-validator';

export class AdminUserStatusDto {
  @IsBoolean()
  value!: boolean;
}

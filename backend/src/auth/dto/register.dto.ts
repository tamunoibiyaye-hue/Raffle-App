import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import type { UserRole } from '../../common/domain';

const REGISTERABLE_ROLES = ['user', 'organizer'] as const;
type RegisterableRole = (typeof REGISTERABLE_ROLES)[number];

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @ValidateIf((_, value: unknown) => value !== undefined && value !== '')
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: 'phone must be a valid international format',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(REGISTERABLE_ROLES, { each: true })
  @IsOptional()
  roles?: RegisterableRole[];

  static sanitizeRoles(roles?: RegisterableRole[]): UserRole[] {
    if (!roles?.length) {
      return ['user'];
    }

    const safeRoles = roles.filter((role) => REGISTERABLE_ROLES.includes(role));

    return safeRoles.length ? Array.from(new Set(safeRoles)) : ['user'];
  }
}

import { SetMetadata } from '@nestjs/common';
import { AUTH_PUBLIC_ENDPOINT } from '../../auth/constants';

export const Public = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(AUTH_PUBLIC_ENDPOINT, true);

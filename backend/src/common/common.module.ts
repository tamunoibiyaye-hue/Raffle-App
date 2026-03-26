import { Global, Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { RolesGuard } from './guards/roles.guard';
import { OptionalJwtAuthGuard } from './guards/optional-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Global()
@Module({
  providers: [StoreService, RolesGuard, OptionalJwtAuthGuard, JwtAuthGuard],
  exports: [StoreService, RolesGuard, OptionalJwtAuthGuard, JwtAuthGuard],
})
export class CommonModule {}

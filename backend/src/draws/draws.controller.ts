import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { DrawsService } from './draws.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('raffles')
export class DrawsController {
  constructor(private readonly drawsService: DrawsService) {}

  @Post(':id/draw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  execute(@Param('id') raffleId: string) {
    return this.drawsService.executeDraw(raffleId);
  }
}

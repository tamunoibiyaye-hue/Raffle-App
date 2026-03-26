import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RafflesService } from './raffles.service';
import { CreateRaffleDto } from './dto/create-raffle.dto';
import { UpdateRaffleDto } from './dto/update-raffle.dto';
import { UpdateRaffleStatusDto } from './dto/update-raffle-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';
import { Public } from '../common/decorators/public.decorator';

@Controller('raffles')
export class RafflesController {
  constructor(private readonly rafflesService: RafflesService) {}

  @Get()
  @Public()
  list(
    @Query('category') category?: string,
    @Query('maxTicketPrice') maxTicketPrice?: string,
    @Query('drawDate') drawDate?: string,
    @Query('status') status?: string,
  ) {
    return this.rafflesService.list({
      category,
      maxTicketPrice:
        maxTicketPrice !== undefined ? Number(maxTicketPrice) : undefined,
      drawDate,
      status,
    });
  }

  @Get(':id')
  @Public()
  detail(@Param('id') id: string) {
    return this.rafflesService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: JwtUser, @Body() payload: CreateRaffleDto) {
    return this.rafflesService.create(user, payload);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body() payload: UpdateRaffleDto,
  ) {
    return this.rafflesService.update(id, user, payload);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body() payload: UpdateRaffleStatusDto,
  ) {
    return this.rafflesService.updateStatus(id, user, payload);
  }
}

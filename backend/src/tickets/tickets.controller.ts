import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketReservationDto } from './dto/create-ticket-reservation.dto';
import { OptionalJwtAuthGuard } from '../common/guards/optional-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/interfaces/jwt-user.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('raffles/:id/tickets')
  @UseGuards(OptionalJwtAuthGuard)
  createReservation(
    @Param('id') raffleId: string,
    @Body() payload: CreateTicketReservationDto,
    @CurrentUser() user?: JwtUser,
  ) {
    return this.ticketsService.reserveForRaffle(raffleId, payload, user);
  }

  @Get('users/me/tickets')
  @UseGuards(JwtAuthGuard)
  getMyTickets(@CurrentUser() user: JwtUser) {
    return this.ticketsService.getMyTickets(user.sub);
  }

  @Get('guest/tickets')
  @Public()
  getGuestTickets(
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('code') code: string,
  ) {
    return this.ticketsService.getGuestTickets(email, phone, code);
  }
}

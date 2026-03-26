import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LotteryResultsService } from './lottery-results.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateLotteryResultDto } from './dto/create-lottery-result.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('lottery-results')
export class LotteryResultsController {
  constructor(private readonly lotteryResultsService: LotteryResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() payload: CreateLotteryResultDto) {
    return this.lotteryResultsService.create(payload);
  }

  @Get()
  @Public()
  list(
    @Query('date') date?: string,
    @Query('lotteryType') lotteryType?: string,
  ) {
    return this.lotteryResultsService.list({
      date,
      lotteryType,
    });
  }
}

import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminUserStatusDto } from './dto/admin-user-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Put('users/:id/block')
  blockUser(@Param('id') userId: string, @Body() payload: AdminUserStatusDto) {
    return this.adminService.blockUser(userId, payload.value);
  }

  @Put('users/:id/verify-organizer')
  verifyOrganizer(
    @Param('id') userId: string,
    @Body() payload: AdminUserStatusDto,
  ) {
    return this.adminService.verifyOrganizer(userId, payload.value);
  }

  @Get('raffles')
  listRaffles() {
    return this.adminService.listRaffles();
  }

  @Get('transactions')
  listTransactions() {
    return this.adminService.listTransactions();
  }

  @Get('reports/summary')
  reportSummary() {
    return this.adminService.reportSummary();
  }

  @Get('notifications')
  listNotifications() {
    return this.adminService.listNotifications();
  }
}

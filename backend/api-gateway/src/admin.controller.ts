import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('MATCH_SERVICE') private readonly matchClient: ClientProxy,
    @Inject('TOURNAMENT_SERVICE') private readonly tournamentClient: ClientProxy,
  ) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  getDashboardStats() {
    return { users: 1200, matches: 450, tournaments: 30 };
  }

  @Post('users/:id/ban')
  banUser(@Param('id') id: string) {
    return this.userClient.send('admin.banUser', { id });
  }

  @Post('users/:id/verify')
  verifyUser(@Param('id') id: string) {
    return this.userClient.send('admin.verifyUser', { id });
  }

  @Put('matches/:id/feature')
  featureMatch(@Param('id') id: string, @Body('isFeatured') isFeatured: boolean) {
    return this.matchClient.send('admin.featureMatch', { id, isFeatured });
  }

  @Put('tournaments/:id/feature')
  featureTournament(@Param('id') id: string, @Body('isFeatured') isFeatured: boolean) {
    return this.tournamentClient.send('admin.featureTournament', { id, isFeatured });
  }
}

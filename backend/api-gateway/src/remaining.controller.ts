import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(@Inject('ANALYTICS_SERVICE') private readonly analyticsClient: ClientProxy) {}

  @Get('compare')
  @ApiOperation({ summary: 'Compare two players' })
  compare(@Query('player1') p1: string, @Query('player2') p2: string) {
    return this.analyticsClient.send('analytics.compare', { player1: p1, player2: p2 });
  }

  @Get('match/:matchId/mvp')
  getMVP(@Param('matchId') matchId: string) {
    return this.analyticsClient.send('analytics.getMVP', { matchId });
  }

  @Post('check-achievements')
  checkAchievements(@Body() data: any) {
    return this.analyticsClient.send('analytics.checkAchievements', data);
  }

  // ... other endpoints ...
}

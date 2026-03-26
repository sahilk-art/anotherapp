import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @MessagePattern('analytics.getWagonWheel')
  async getWagonWheel(@Payload() data: any) {
    return this.analyticsService.getWagonWheel(data.matchId, data.playerId);
  }

  @MessagePattern('analytics.getMVP')
  async getMVP(@Payload() data: any) {
    return this.analyticsService.getMVP(data.matchId);
  }

  @EventPattern('ball_recorded')
  async handleBallRecorded(@Payload() data: any) {
    // Process analytics updates for the ball
    console.log('Processing analytics for ball:', data._id);
  }
}

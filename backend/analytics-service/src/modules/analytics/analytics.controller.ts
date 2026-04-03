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

  @MessagePattern('analytics.getHighlights')
  async getHighlights(@Payload() data: any) {
    return this.analyticsService.generateHighlights(data.matchId);
  }

  @MessagePattern('analytics.compare')
  async comparePlayers(@Payload() data: any) {
    return this.analyticsService.comparePlayers(data.player1, data.player2);
  }

  @MessagePattern('analytics.checkAchievements')
  async checkAchievements(@Payload() data: any) {
    return this.analyticsService.checkAchievements(data.userId, data.matchId);
  }

  @EventPattern('milestone_reached')
  async handleMilestone(@Payload() data: any) {
    console.log(`User ${data.userId} reached milestone: ${data.type}`);
  }
}

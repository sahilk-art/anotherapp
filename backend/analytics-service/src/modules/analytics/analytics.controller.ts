import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @MessagePattern('analytics.getWagonWheel')
  async getWagonWheel(@Payload() data: { matchId: string; playerId: string }): Promise<any> {
    return this.analyticsService.getWagonWheel(data.matchId, data.playerId);
  }

  @MessagePattern('analytics.getMVP')
  async getMVP(@Payload() data: { matchId: string }): Promise<any> {
    return this.analyticsService.getMVP(data.matchId);
  }

  @MessagePattern('analytics.getHighlights')
  async getHighlights(@Payload() data: { matchId: string }): Promise<any> {
    return this.analyticsService.generateHighlights(data.matchId);
  }

  @MessagePattern('analytics.compare')
  async comparePlayers(@Payload() data: { player1: string; player2: string }): Promise<any> {
    return this.analyticsService.comparePlayers(data.player1, data.player2);
  }

  @MessagePattern('analytics.checkAchievements')
  async checkAchievements(@Payload() data: { userId: string; matchId: string }): Promise<any> {
    return this.analyticsService.checkAchievements(data.userId, data.matchId);
  }

  @EventPattern('ball_recorded')
  async handleBallRecorded(@Payload() data: { matchId: string; inningsId: string; totalRuns: number }) {
    console.log('Analytics received ball_recorded event. Updating charts for match:', data.matchId);
    // Real logic to update Worm chart, Manhattan chart, and Wagon wheel would be called here
    await this.analyticsService.updateLiveCharts(data.matchId, data.inningsId);
  }

  @EventPattern('match_completed')
  async handleMatchCompleted(@Payload() data: { matchId: string; result: string }) {
    console.log('Analytics received match_completed event. Calculating final MVP for match:', data.matchId);
    await this.analyticsService.calculateFinalMVP(data.matchId);
    await this.analyticsService.generateMatchReport(data.matchId);
  }

  @EventPattern('milestone_reached')
  async handleMilestone(@Payload() data: { userId: string; type: string; value: number }) {
    console.log(`User ${data.userId} reached milestone: ${data.type} (${data.value})`);
    // Logic to store milestone achievement in analytics DB
  }
}

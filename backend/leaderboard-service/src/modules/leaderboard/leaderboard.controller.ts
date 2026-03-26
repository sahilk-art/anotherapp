import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class LeaderboardController {
  @MessagePattern('leaderboard.getGlobal')
  async getGlobal(@Payload() data: any) { return []; }

  @MessagePattern('leaderboard.getMonthly')
  async getMonthly(@Payload() data: any) { return []; }

  @MessagePattern('leaderboard.getWeekly')
  async getWeekly(@Payload() data: any) { return []; }

  @MessagePattern('leaderboard.getLocal')
  async getLocal(@Payload() data: any) { return []; }

  @MessagePattern('leaderboard.getTournament')
  async getTournament(@Payload() data: any) { return []; }
}

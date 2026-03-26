import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LeaderboardService } from './leaderboard.service';

@Controller()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @MessagePattern('leaderboard.getGlobal')
  async getGlobal(@Payload() data: any) {
    return this.leaderboardService.getGlobal(data.category);
  }

  @MessagePattern('leaderboard.getTournament')
  async getTournament(@Payload() data: any) {
    return this.leaderboardService.getTournament(data.tournamentId, data.category);
  }
}

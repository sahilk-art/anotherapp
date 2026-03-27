import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ScoringService } from './scoring.service';

@Controller()
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @MessagePattern('scoring.start')
  async start(@Payload() data: any) { return this.scoringService.start(data.matchId); }

  @MessagePattern('scoring.innings.start')
  async startInnings(@Payload() data: any) { return this.scoringService.startInnings(data.matchId, data); }

  @MessagePattern('scoring.recordBall')
  async recordBall(@Payload() data: any) { return this.scoringService.recordBall(data); }

  @MessagePattern('scoring.undoBall')
  async undoBall(@Payload() data: any) { return this.scoringService.undoBall(data.matchId); }

  @MessagePattern('scoring.syncBulk')
  async syncBulk(@Payload() data: any) { return this.scoringService.syncBulk(data.matchId, data.balls); }

  @MessagePattern('scoring.recordWicket')
  async recordWicket(@Payload() data: any) { return { success: true }; }

  @MessagePattern('scoring.recordExtras')
  async recordExtras(@Payload() data: any) { return { success: true }; }

  @MessagePattern('scoring.selectBatsman')
  async selectBatsman(@Payload() data: any) { return this.scoringService.selectBatsman(data.matchId, data); }

  @MessagePattern('scoring.selectBowler')
  async selectBowler(@Payload() data: any) { return this.scoringService.selectBowler(data.matchId, data); }

  @MessagePattern('scoring.swapBatsmen')
  async swapBatsmen(@Payload() data: any) { return this.scoringService.swapBatsmen(data.matchId); }

  @MessagePattern('scoring.retireBatsman')
  async retireBatsman(@Payload() data: any) { return { success: true }; }

  @MessagePattern('scoring.endOver')
  async endOver(@Payload() data: any) { return { success: true }; }

  @MessagePattern('scoring.endInnings')
  async endInnings(@Payload() data: any) { return { success: true }; }

  @MessagePattern('scoring.endMatch')
  async endMatch(@Payload() data: any) { return this.scoringService.endMatch(data.matchId, data); }

  @MessagePattern('scoring.abandonMatch')
  async abandonMatch(@Payload() data: any) { return { success: true }; }

  @MessagePattern('scoring.getCurrentState')
  async getCurrentState(@Payload() data: any) { return this.scoringService.getCurrentState(data.matchId); }

  @MessagePattern('scoring.addPenalty')
  async addPenalty(@Payload() data: any) { return this.scoringService.addPenalty(data.matchId, data.runs); }

  @MessagePattern('scoring.startSuperOver')
  async startSuperOver(@Payload() data: any) { return { success: true }; }
}

import { Controller, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ScoringService } from './scoring.service';
import { RecordBallDto, UndoBallDto, SelectBatsmanDto, SelectBowlerDto } from '../../../../shared/dto/scoring.dto';
import { Innings } from './schemas/innings.schema';
import { Match } from './schemas/match.schema';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @MessagePattern('scoring.start')
  async start(@Payload() data: { matchId: string }): Promise<Match> {
    return this.scoringService.start(data.matchId);
  }

  @MessagePattern('scoring.innings.start')
  async startInnings(@Payload() data: { matchId: string } & Partial<Innings>): Promise<Innings> {
    const { matchId, ...inningsData } = data;
    return this.scoringService.startInnings(matchId, inningsData);
  }

  @MessagePattern('scoring.recordBall')
  async recordBall(@Payload() data: RecordBallDto): Promise<Innings> {
    return this.scoringService.recordBall(data);
  }

  @MessagePattern('scoring.undoBall')
  async undoBall(@Payload() data: { matchId: string }): Promise<Innings | null> {
    return this.scoringService.undoBall(data.matchId);
  }

  @MessagePattern('scoring.selectBatsman')
  async selectBatsman(@Payload() data: SelectBatsmanDto): Promise<Innings> {
    return this.scoringService.selectBatsman(data);
  }

  @MessagePattern('scoring.selectBowler')
  async selectBowler(@Payload() data: SelectBowlerDto): Promise<Innings> {
    return this.scoringService.selectBowler(data);
  }

  @MessagePattern('scoring.swapBatsmen')
  async swapBatsmen(@Payload() data: { matchId: string }): Promise<Innings> {
    return this.scoringService.swapBatsmen(data.matchId);
  }

  @MessagePattern('scoring.endMatch')
  async endMatch(@Payload() data: { matchId: string; result: string }): Promise<Match> {
    return this.scoringService.endMatch(data.matchId, data.result);
  }

  @MessagePattern('scoring.getCurrentState')
  async getCurrentState(@Payload() data: { matchId: string }): Promise<Innings | null> {
    return this.scoringService.getCurrentState(data.matchId);
  }
}

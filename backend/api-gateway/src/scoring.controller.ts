import { Controller, Post, Delete, Body, Param, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Scoring')
@ApiBearerAuth()
@Controller('scoring')
export class ScoringController {
  constructor(@Inject('SCORING_SERVICE') private readonly scoringClient: ClientProxy) {}

  @Post(':matchId/start')
  @ApiOperation({ summary: 'Start scoring a match' })
  start(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.start', { matchId });
  }

  @Post(':matchId/innings/start')
  @ApiOperation({ summary: 'Start new innings' })
  startInnings(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.startInnings', { matchId, ...data });
  }

  @Post(':matchId/ball')
  @ApiOperation({ summary: 'Record a ball' })
  recordBall(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.recordBall', { matchId, ...data });
  }

  @Delete(':matchId/ball/undo')
  @ApiOperation({ summary: 'Undo last ball' })
  undoBall(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.undoBall', { matchId });
  }

  @Post(':matchId/sync-bulk')
  @ApiOperation({ summary: 'Sync bulk offline balls' })
  syncBulk(@Param('matchId') matchId: string, @Body('balls') balls: any[]) {
    return this.scoringClient.send('scoring.syncBulk', { matchId, balls });
  }

  @Post(':matchId/wicket')
  @ApiOperation({ summary: 'Record wicket' })
  recordWicket(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.recordWicket', { matchId, ...data });
  }

  @Post(':matchId/extras')
  @ApiOperation({ summary: 'Record extras' })
  recordExtras(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.recordExtras', { matchId, ...data });
  }

  @Post(':matchId/select-batsman')
  @ApiOperation({ summary: 'Select new batsman' })
  selectBatsman(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.selectBatsman', { matchId, ...data });
  }

  @Post(':matchId/select-bowler')
  @ApiOperation({ summary: 'Select new bowler' })
  selectBowler(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.selectBowler', { matchId, ...data });
  }

  @Post(':matchId/swap-batsmen')
  @ApiOperation({ summary: 'Swap striker/non-striker' })
  swapBatsmen(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.swapBatsmen', { matchId });
  }

  @Post(':matchId/retire-batsman')
  @ApiOperation({ summary: 'Retire batsman' })
  retireBatsman(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.retireBatsman', { matchId, ...data });
  }

  @Post(':matchId/end-over')
  @ApiOperation({ summary: 'End current over' })
  endOver(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.endOver', { matchId });
  }

  @Post(':matchId/innings/end')
  @ApiOperation({ summary: 'End current innings' })
  endInnings(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.endInnings', { matchId });
  }

  @Post(':matchId/end')
  @ApiOperation({ summary: 'End match' })
  endMatch(@Param('matchId') matchId: string, @Body() data: any) {
    return this.scoringClient.send('scoring.endMatch', { matchId, ...data });
  }

  @Post(':matchId/abandon')
  @ApiOperation({ summary: 'Abandon match' })
  abandonMatch(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.abandonMatch', { matchId });
  }

  @Get(':matchId/current-state')
  @ApiOperation({ summary: 'Get current scoring state' })
  getCurrentState(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.getCurrentState', { matchId });
  }

  @Post(':matchId/penalty')
  @ApiOperation({ summary: 'Add penalty runs' })
  addPenalty(@Param('matchId') matchId: string, @Body('runs') runs: number) {
    return this.scoringClient.send('scoring.addPenalty', { matchId, runs });
  }

  @Post(':matchId/super-over/start')
  @ApiOperation({ summary: 'Start super over' })
  startSuperOver(@Param('matchId') matchId: string) {
    return this.scoringClient.send('scoring.startSuperOver', { matchId });
  }
}

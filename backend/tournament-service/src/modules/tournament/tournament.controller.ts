import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { TournamentService } from './tournament.service';
import { Tournament } from './schemas/tournament.schema';
import { TournamentStatus } from '../../../../../shared/enums';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @MessagePattern('tournaments.create')
  async create(@Payload() data: Partial<Tournament>): Promise<Tournament> {
    return this.tournamentService.create(data);
  }

  @MessagePattern('tournaments.findAll')
  async findAll(@Payload() query: { status?: TournamentStatus; limit?: number; offset?: number }): Promise<Tournament[]> {
    return this.tournamentService.findAll(query);
  }

  @MessagePattern('tournaments.findOne')
  async findOne(@Payload() data: { id: string }): Promise<Tournament> {
    return this.tournamentService.findOne(data.id);
  }

  @MessagePattern('tournaments.update')
  async update(@Payload() data: { id: string } & Partial<Tournament>): Promise<Tournament> {
    const { id, ...updateData } = data;
    return this.tournamentService.update(id, updateData);
  }

  @MessagePattern('tournaments.registerTeam')
  async registerTeam(@Payload() data: { id: string; teamId: string }): Promise<Tournament> {
    return this.tournamentService.registerTeam(data.id, data.teamId);
  }

  @MessagePattern('tournaments.getPointsTable')
  async getPointsTable(@Payload() data: { id: string }): Promise<any[]> {
    return this.tournamentService.getPointsTable(data.id);
  }

  @MessagePattern('tournaments.getSchedule')
  async getSchedule(@Payload() data: { id: string }): Promise<any[]> {
    return this.tournamentService.getSchedule(data.id);
  }

  @MessagePattern('tournaments.generateSchedule')
  async generateSchedule(@Payload() data: { id: string }): Promise<Tournament> {
    return this.tournamentService.generateSchedule(data.id);
  }

  @EventPattern('match_completed')
  async handleMatchCompleted(@Payload() data: {
    tournamentId?: string;
    matchId: string;
    result: string;
    teamA: string;
    teamB: string;
    teamARuns: number;
    teamBRuns: number;
    teamAOvers: number;
    teamBOvers: number;
    teamAAllOut: boolean;
    teamBAllOut: boolean;
    winner?: string;
  }) {
    if (data.tournamentId) {
      console.log('Tournament service received match_completed event. Updating points table for tournament:', data.tournamentId);
      await this.tournamentService.updatePointsTable(data.tournamentId, {
        teamA: data.teamA,
        teamB: data.teamB,
        teamARuns: data.teamARuns,
        teamBRuns: data.teamBRuns,
        teamAOvers: data.teamAOvers,
        teamBOvers: data.teamBOvers,
        teamAAllOut: data.teamAAllOut,
        teamBAllOut: data.teamBAllOut,
        winner: data.winner,
      });
    }
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { TournamentService } from './tournament.service';

@Controller()
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @MessagePattern('tournaments.create')
  async create(@Payload() data: any) { return this.tournamentService.create(data); }

  @MessagePattern('tournaments.findAll')
  async findAll(@Payload() query: any) { return this.tournamentService.findAll(); }

  @MessagePattern('tournaments.findOne')
  async findOne(@Payload() data: any) { return this.tournamentService.findOne(data.id); }

  @MessagePattern('tournaments.update')
  async update(@Payload() data: any) { return this.tournamentService.update(data.id, data); }

  @MessagePattern('tournaments.registerTeam')
  async registerTeam(@Payload() data: any) { return this.tournamentService.registerTeam(data.id, data.teamId); }

  @MessagePattern('tournaments.getPointsTable')
  async getPointsTable(@Payload() data: any) { return this.tournamentService.getPointsTable(data.id); }

  @MessagePattern('tournaments.getSchedule')
  async getSchedule(@Payload() data: any) { return this.tournamentService.getSchedule(data.id); }

  @MessagePattern('tournaments.generateSchedule')
  async generateSchedule(@Payload() data: any) { return this.tournamentService.generateSchedule(data.id); }

  @EventPattern('match_completed')
  async handleMatchCompleted(@Payload() data: any) {
    // Update points table logic here
    console.log('Updating tournament points table for match:', data.matchId);
  }
}

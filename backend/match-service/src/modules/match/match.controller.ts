import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MatchService } from './match.service';
import { Match } from './schemas/match.schema';
import { MatchStatus, TossDecision } from '../../../../../shared/enums';
import { Innings } from './schemas/innings.schema';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @MessagePattern('matches.create')
  async create(@Payload() data: Partial<Match>): Promise<Match> {
    return this.matchService.create(data);
  }

  @MessagePattern('matches.findAll')
  async findAll(@Payload() query: { status?: MatchStatus; limit?: number; offset?: number }): Promise<Match[]> {
    return this.matchService.findAll(query);
  }

  @MessagePattern('matches.findLive')
  async findLive(): Promise<Match[]> {
    return this.matchService.findLive();
  }

  @MessagePattern('matches.findOne')
  async findOne(@Payload() data: { id: string }): Promise<Match> {
    return this.matchService.findOne(data.id);
  }

  @MessagePattern('matches.update')
  async update(@Payload() data: { id: string } & Partial<Match>): Promise<Match> {
    const { id, ...updateData } = data;
    return this.matchService.update(id, updateData);
  }

  @MessagePattern('matches.getOgMetadata')
  async getOgMetadata(@Payload() data: { id: string }): Promise<string> {
    return this.matchService.getOgMetadata(data.id);
  }

  @MessagePattern('matches.getOgImage')
  async getOgImage(@Payload() data: { id: string }): Promise<{ url: string }> {
    return this.matchService.getOgImage(data.id);
  }

  @MessagePattern('matches.exportPdf')
  async exportPdf(@Payload() data: { id: string }): Promise<{ url: string }> {
    return this.matchService.exportMatchPdf(data.id);
  }

  @MessagePattern('matches.exportExcel')
  async exportExcel(@Payload() data: { id: string }): Promise<{ url: string }> {
    return this.matchService.exportMatchExcel(data.id);
  }

  @MessagePattern('matches.getScorecard')
  async getScorecard(@Payload() data: { id: string }): Promise<Innings[]> {
    return this.matchService.getScorecard(data.id);
  }

  @MessagePattern('matches.setToss')
  async setToss(@Payload() data: { id: string; winner: string; decision: TossDecision }): Promise<Match> {
    const { id, winner, decision } = data;
    return this.matchService.setToss(id, { winner, decision });
  }

  @MessagePattern('matches.updateStatus')
  async updateStatus(@Payload() data: { id: string; status: MatchStatus }): Promise<Match> {
    return this.matchService.updateStatus(data.id, data.status);
  }
}

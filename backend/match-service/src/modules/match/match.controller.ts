import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MatchService } from './match.service';

@Controller()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @MessagePattern('matches.create')
  async create(@Payload() data: any) { return this.matchService.create(data); }

  @MessagePattern('matches.findAll')
  async findAll(@Payload() query: any) { return this.matchService.findAll(); }

  @MessagePattern('matches.findLive')
  async findLive() { return this.matchService.findLive(); }

  @MessagePattern('matches.findRecent')
  async findRecent() { return []; }

  @MessagePattern('matches.findUpcoming')
  async findUpcoming() { return []; }

  @MessagePattern('matches.search')
  async search(@Payload() data: any) { return []; }

  @MessagePattern('matches.findOne')
  async findOne(@Payload() data: any) { return this.matchService.findOne(data.id); }

  @MessagePattern('matches.update')
  async update(@Payload() data: any) { return this.matchService.update(data.id, data); }

  @MessagePattern('matches.remove')
  async remove(@Payload() data: any) { return {}; }

  @MessagePattern('matches.getScorecard')
  async getScorecard(@Payload() data: any) { return this.matchService.getScorecard(data.id); }

  @MessagePattern('matches.getInningsScorecard')
  async getInningsScorecard(@Payload() data: any) { return {}; }

  @MessagePattern('matches.getOvers')
  async getOvers(@Payload() data: any) { return []; }

  @MessagePattern('matches.getOverDetails')
  async getOverDetails(@Payload() data: any) { return {}; }

  @MessagePattern('matches.getPartnerships')
  async getPartnerships(@Payload() data: any) { return []; }

  @MessagePattern('matches.getFallOfWickets')
  async getFallOfWickets(@Payload() data: any) { return []; }

  @MessagePattern('matches.getCommentary')
  async getCommentary(@Payload() data: any) { return []; }

  @MessagePattern('matches.getHighlights')
  async getHighlights(@Payload() data: any) { return []; }

  @MessagePattern('matches.setToss')
  async setToss(@Payload() data: any) { return this.matchService.setToss(data.id, data); }

  @MessagePattern('matches.setPlayingXI')
  async setPlayingXI(@Payload() data: any) { return {}; }

  @MessagePattern('matches.updateStatus')
  async updateStatus(@Payload() data: any) { return this.matchService.updateStatus(data.id, data.status); }

  @MessagePattern('matches.setResult')
  async setResult(@Payload() data: any) { return {}; }

  @MessagePattern('matches.getShareLink')
  async getShareLink(@Payload() data: any) { return ''; }

  @MessagePattern('matches.getNearby')
  async getNearby(@Payload() data: any) { return []; }
}

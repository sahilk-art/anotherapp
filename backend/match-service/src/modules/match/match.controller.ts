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

  @MessagePattern('matches.findOne')
  async findOne(@Payload() data: any) { return this.matchService.findOne(data.id); }

  @MessagePattern('matches.getOgMetadata')
  async getOgMetadata(@Payload() data: any) { return this.matchService.getOgMetadata(data.id); }

  @MessagePattern('matches.getOgImage')
  async getOgImage(@Payload() data: any) { return this.matchService.getOgImage(data.id); }

  @MessagePattern('matches.exportPdf')
  async exportPdf(@Payload() data: any) { return this.matchService.exportMatchPdf(data.id); }
}

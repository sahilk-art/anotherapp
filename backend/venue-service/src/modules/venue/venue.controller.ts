import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VenueService } from './venue.service';

@Controller()
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @MessagePattern('venues.create')
  async create(@Payload() data: any) { return this.venueService.create(data); }

  @MessagePattern('venues.findAll')
  async findAll() { return this.venueService.findAll(); }

  @MessagePattern('venues.findOne')
  async findOne(@Payload() data: any) { return this.venueService.findOne(data.id); }

  @MessagePattern('venues.search')
  async search(@Payload() data: any) { return this.venueService.search(data.q); }
}

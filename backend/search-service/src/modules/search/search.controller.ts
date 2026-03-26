import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SearchController {
  @MessagePattern('search.universal')
  async universal(@Payload() data: any) { return []; }

  @MessagePattern('search.players')
  async players(@Payload() data: any) { return []; }

  @MessagePattern('search.teams')
  async teams(@Payload() data: any) { return []; }

  @MessagePattern('search.tournaments')
  async tournaments(@Payload() data: any) { return []; }

  @MessagePattern('search.matches')
  async matches(@Payload() data: any) { return []; }

  @MessagePattern('search.suggestions')
  async suggestions(@Payload() data: any) { return []; }

  @MessagePattern('search.getRecent')
  async getRecent(@Payload() data: any) { return []; }

  @MessagePattern('search.clearRecent')
  async clearRecent(@Payload() data: any) { return { success: true }; }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SearchService } from './search.service';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern('search.universal')
  async universal(@Payload() data: any) {
    return this.searchService.universal(data.q, data.type);
  }
}

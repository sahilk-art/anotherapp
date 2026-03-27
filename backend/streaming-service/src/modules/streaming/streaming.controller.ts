import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StreamingService } from './streaming.service';

@Controller()
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @MessagePattern('streaming.create')
  async create(@Payload() data: any) { return this.streamingService.createStream(data.matchId, data.userId); }

  @MessagePattern('streaming.start')
  async start(@Payload() data: any) { return this.streamingService.startStream(data.matchId); }

  @MessagePattern('streaming.end')
  async end(@Payload() data: any) { return this.streamingService.endStream(data.matchId); }

  @MessagePattern('streaming.findOne')
  async findOne(@Payload() data: any) { return this.streamingService.getStreamInfo(data.matchId); }

  @MessagePattern('streaming.findLive')
  async findLive() { return this.streamingService.getLiveStreams(); }
}

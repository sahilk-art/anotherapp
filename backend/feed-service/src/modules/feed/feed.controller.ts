import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FeedService } from './feed.service';

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @MessagePattern('feed.findAll')
  async findAll(@Payload() query: any) { return this.feedService.findAll(); }

  @MessagePattern('feed.getTrending')
  async getTrending(@Payload() data: any) { return this.feedService.getTrending(); }

  @MessagePattern('feed.createPost')
  async createPost(@Payload() data: any) { return this.feedService.create(data); }

  @MessagePattern('feed.likePost')
  async likePost(@Payload() data: any) { return this.feedService.likePost(data.id, data.userId); }

  @MessagePattern('feed.addComment')
  async addComment(@Payload() data: any) { return this.feedService.addComment(data.id, data); }

  @MessagePattern('feed.votePoll')
  async votePoll(@Payload() data: any) { return this.feedService.votePoll(data.id, data.optionIndex, data.userId); }
}

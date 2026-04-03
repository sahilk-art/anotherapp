import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { FeedService } from './feed.service';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @MessagePattern('feed.findAll')
  async findAll(@Payload() query: { limit?: number; offset?: number }): Promise<any[]> {
    return this.feedService.findAll();
  }

  @MessagePattern('feed.getTrending')
  async getTrending(@Payload() data: { limit?: number }): Promise<any[]> {
    return this.feedService.getTrending();
  }

  @MessagePattern('feed.createPost')
  async createPost(@Payload() data: any): Promise<any> {
    return this.feedService.create(data);
  }

  @MessagePattern('feed.likePost')
  async likePost(@Payload() data: { id: string; userId: string }): Promise<any> {
    return this.feedService.likePost(data.id, data.userId);
  }

  @MessagePattern('feed.addComment')
  async addComment(@Payload() data: { id: string; userId: string; text: string }): Promise<any> {
    return this.feedService.addComment(data.id, data);
  }

  @MessagePattern('feed.votePoll')
  async votePoll(@Payload() data: { id: string; optionIndex: number; userId: string }): Promise<any> {
    return this.feedService.votePoll(data.id, data.optionIndex, data.userId);
  }

  @EventPattern('match_started')
  async handleMatchStarted(@Payload() data: { matchId: string }) {
    console.log('Feed service received match_started event. Creating live match post for match:', data.matchId);
    await this.feedService.createLiveMatchPost(data.matchId);
  }

  @EventPattern('match_completed')
  async handleMatchCompleted(@Payload() data: { matchId: string; result: string }) {
    console.log('Feed service received match_completed event. Updating match post for match:', data.matchId);
    await this.feedService.updateMatchPostResult(data.matchId, data.result);
  }
}

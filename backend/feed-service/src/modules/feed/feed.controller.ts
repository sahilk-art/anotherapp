import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class FeedController {
  @MessagePattern('feed.findAll')
  async findAll(@Payload() query: any) { return []; }

  @MessagePattern('feed.getTrending')
  async getTrending(@Payload() data: any) { return []; }

  @MessagePattern('feed.createPost')
  async createPost(@Payload() data: any) { return {}; }

  @MessagePattern('feed.getPost')
  async getPost(@Payload() data: any) { return {}; }

  @MessagePattern('feed.updatePost')
  async updatePost(@Payload() data: any) { return {}; }

  @MessagePattern('feed.deletePost')
  async deletePost(@Payload() data: any) { return {}; }

  @MessagePattern('feed.likePost')
  async likePost(@Payload() data: any) { return {}; }

  @MessagePattern('feed.unlikePost')
  async unlikePost(@Payload() data: any) { return {}; }

  @MessagePattern('feed.getPostLikes')
  async getPostLikes(@Payload() data: any) { return []; }

  @MessagePattern('feed.addComment')
  async addComment(@Payload() data: any) { return {}; }

  @MessagePattern('feed.getComments')
  async getComments(@Payload() data: any) { return []; }

  @MessagePattern('feed.deleteComment')
  async deleteComment(@Payload() data: any) { return {}; }

  @MessagePattern('feed.sharePost')
  async sharePost(@Payload() data: any) { return {}; }

  @MessagePattern('feed.createPoll')
  async createPoll(@Payload() data: any) { return {}; }

  @MessagePattern('feed.votePoll')
  async votePoll(@Payload() data: any) { return {}; }

  @MessagePattern('feed.reportPost')
  async reportPost(@Payload() data: any) { return {}; }
}

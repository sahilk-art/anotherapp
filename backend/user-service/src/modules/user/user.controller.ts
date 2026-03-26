import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('users.findAll')
  async findAll(@Payload() query: any) { return this.userService.findAll(query); }

  @MessagePattern('users.search')
  async search(@Payload() data: any) { return this.userService.search(data.q); }

  @MessagePattern('users.findOne')
  async findOne(@Payload() data: any) { return this.userService.findOne(data.id); }

  @MessagePattern('users.getStats')
  async getStats(@Payload() data: any) { return this.userService.getStats(data.id); }

  @MessagePattern('users.getBattingStats')
  async getBattingStats(@Payload() data: any) { return {}; }

  @MessagePattern('users.getBowlingStats')
  async getBowlingStats(@Payload() data: any) { return {}; }

  @MessagePattern('users.getFieldingStats')
  async getFieldingStats(@Payload() data: any) { return {}; }

  @MessagePattern('users.getMatches')
  async getMatches(@Payload() data: any) { return []; }

  @MessagePattern('users.getTeams')
  async getTeams(@Payload() data: any) { return []; }

  @MessagePattern('users.getTournaments')
  async getTournaments(@Payload() data: any) { return []; }

  @MessagePattern('users.getAchievements')
  async getAchievements(@Payload() data: any) { return []; }

  @MessagePattern('users.getFollowers')
  async getFollowers(@Payload() data: any) { return []; }

  @MessagePattern('users.getFollowing')
  async getFollowing(@Payload() data: any) { return []; }

  @MessagePattern('users.updateProfile')
  async updateProfile(@Payload() data: any) { return this.userService.update(data.id, data); }

  @MessagePattern('users.updateAvatar')
  async updateAvatar(@Payload() data: any) { return {}; }

  @MessagePattern('users.updateCoverPhoto')
  async updateCoverPhoto(@Payload() data: any) { return {}; }

  @MessagePattern('users.updateSettings')
  async updateSettings(@Payload() data: any) { return {}; }

  @MessagePattern('users.updateFcmToken')
  async updateFcmToken(@Payload() data: any) { return {}; }

  @MessagePattern('users.follow')
  async follow(@Payload() data: any) { return this.userService.follow(data.userId, data.id); }

  @MessagePattern('users.unfollow')
  async unfollow(@Payload() data: any) { return this.userService.unfollow(data.userId, data.id); }

  @MessagePattern('users.getRecentForm')
  async getRecentForm(@Payload() data: any) { return []; }

  @MessagePattern('users.getNearby')
  async getNearby(@Payload() data: any) { return this.userService.getNearby(data); }
}

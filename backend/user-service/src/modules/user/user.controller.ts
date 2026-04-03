import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
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
  async getBattingStats(@Payload() data: any) { return this.userService.getBattingStats(data.id); }

  @MessagePattern('users.getBowlingStats')
  async getBowlingStats(@Payload() data: any) { return this.userService.getBowlingStats(data.id); }

  @MessagePattern('users.updateProfile')
  async updateProfile(@Payload() data: any) { return this.userService.update(data.id, data); }

  @MessagePattern('users.registerScorer')
  async registerScorer(@Payload() data: any) { return this.userService.registerScorer(data.userId, data.profile); }

  @MessagePattern('users.registerUmpire')
  async registerUmpire(@Payload() data: any) { return this.userService.registerUmpire(data.userId, data.profile); }

  @MessagePattern('users.findNearbyScorers')
  async findNearbyScorers(@Payload() data: any) { return this.userService.findNearbyScorers(data.lat, data.lng); }

  @MessagePattern('users.follow')
  async follow(@Payload() data: any) { return this.userService.follow(data.userId, data.id); }

  @MessagePattern('users.unfollow')
  async unfollow(@Payload() data: any) { return this.userService.unfollow(data.userId, data.id); }

  @MessagePattern('users.getNearby')
  async getNearby(@Payload() data: any) { return this.userService.getNearby(data); }

  @EventPattern('match_completed')
  async handleMatchCompleted(@Payload() data: any) {
    console.log('Updating user career stats for players in match:', data.matchId);
  }
}

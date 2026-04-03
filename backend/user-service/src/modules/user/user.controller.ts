import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('users.findAll')
  async findAll(@Payload() query: { limit?: number; offset?: number; role?: string }): Promise<User[]> {
    return this.userService.findAll(query);
  }

  @MessagePattern('users.search')
  async search(@Payload() data: { q: string }): Promise<User[]> {
    return this.userService.search(data.q);
  }

  @MessagePattern('users.findOne')
  async findOne(@Payload() data: { id: string }): Promise<User> {
    return this.userService.findOne(data.id);
  }

  @MessagePattern('users.findByPhone')
  async findByPhone(@Payload() data: { phone: string }): Promise<User | null> {
    return this.userService.findByPhone(data.phone);
  }

  @MessagePattern('users.create')
  async create(@Payload() data: Partial<User>): Promise<User> {
    return this.userService.create(data);
  }

  @MessagePattern('users.getStats')
  async getStats(@Payload() data: { id: string }): Promise<any> {
    return this.userService.getStats(data.id);
  }

  @MessagePattern('users.getBattingStats')
  async getBattingStats(@Payload() data: { id: string }): Promise<any> {
    return this.userService.getBattingStats(data.id);
  }

  @MessagePattern('users.getBowlingStats')
  async getBowlingStats(@Payload() data: { id: string }): Promise<any> {
    return this.userService.getBowlingStats(data.id);
  }

  @MessagePattern('users.updateProfile')
  async updateProfile(@Payload() data: { id: string } & Partial<User>): Promise<User> {
    const { id, ...updateData } = data;
    return this.userService.update(id, updateData);
  }

  @MessagePattern('users.registerScorer')
  async registerScorer(@Payload() data: { userId: string; profile: any }): Promise<User> {
    return this.userService.registerScorer(data.userId, data.profile);
  }

  @MessagePattern('users.registerUmpire')
  async registerUmpire(@Payload() data: { userId: string; profile: any }): Promise<User> {
    return this.userService.registerUmpire(data.userId, data.profile);
  }

  @MessagePattern('users.findNearbyScorers')
  async findNearbyScorers(@Payload() data: { lat: number; lng: number }): Promise<User[]> {
    return this.userService.findNearbyScorers(data.lat, data.lng);
  }

  @MessagePattern('users.follow')
  async follow(@Payload() data: { followerId: string; followingId: string }): Promise<{ success: boolean }> {
    return this.userService.follow(data.followerId, data.followingId);
  }

  @MessagePattern('users.unfollow')
  async unfollow(@Payload() data: { followerId: string; followingId: string }): Promise<{ success: boolean }> {
    return this.userService.unfollow(data.followerId, data.followingId);
  }

  @MessagePattern('users.getNearby')
  async getNearby(@Payload() data: { lat: number; lng: number; radius?: number }): Promise<User[]> {
    return this.userService.getNearby(data.lat, data.lng, data.radius);
  }

  @EventPattern('match_completed')
  async handleMatchCompleted(@Payload() data: { matchId: string; players: string[] }) {
    // In a real scenario, this would trigger asynchronous background tasks to update aggregate career stats
    console.log('Event received: match_completed. Updating user career stats for match:', data.matchId);
    // Logic to increment matchesPlayed and update average/strikeRate based on the finished match scorecard
  }
}

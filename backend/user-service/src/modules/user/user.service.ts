import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Follow } from './schemas/follow.schema';
import { PlayerCareerStats } from './schemas/player-career-stats.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @InjectModel(PlayerCareerStats.name) private statsModel: Model<PlayerCareerStats>,
  ) {}

  async findAll(query: any): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async search(q: string): Promise<User[]> {
    return this.userModel.find({ $text: { $search: q } }).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getStats(id: string): Promise<PlayerCareerStats> {
    const stats = await this.statsModel.findOne({ userId: id }).exec();
    if (!stats) throw new NotFoundException('Stats not found');
    return stats;
  }

  async update(id: string, data: any): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async follow(followerId: string, followingId: string) {
    const follow = new this.followModel({ follower: followerId, following: followingId });
    await follow.save();
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });
    return { success: true };
  }

  async unfollow(followerId: string, followingId: string) {
    await this.followModel.findOneAndDelete({ follower: followerId, following: followingId });
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });
    return { success: true };
  }

  async getNearby(query: any) {
    const { lat, lng, radius } = query;
    return this.userModel.find({
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius) * 1000,
        },
      },
    }).exec();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { IUser } from '../../../../shared/interfaces/entities.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll(query: { limit?: number; offset?: number; role?: string }): Promise<User[]> {
    const { limit = 20, offset = 0, role } = query;
    const filter = role ? { role } : {};
    return this.userModel.find(filter).skip(offset).limit(limit).sort({ createdAt: -1 }).exec();
  }

  async search(q: string): Promise<User[]> {
    if (!q) return [];
    return this.userModel.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).limit(20).exec();
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid User ID');
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async getStats(id: string): Promise<any> {
    const user = await this.findOne(id);
    // This would typically aggregate stats from match-service/analytics-service
    // For now, we return the embedded stats or a default object
    return (user as any).stats || { matchesPlayed: user.matchesPlayed || 0, runs: 0, wickets: 0 };
  }

  async getBattingStats(id: string) {
    const user = await this.findOne(id);
    return (user as any).stats?.batting || { totalRuns: 0, innings: 0, average: 0, strikeRate: 0 };
  }

  async getBowlingStats(id: string) {
    const user = await this.findOne(id);
    return (user as any).stats?.bowling || { totalWickets: 0, innings: 0, economy: 0, average: 0 };
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async registerScorer(userId: string, profile: any) {
    return this.update(userId, { scorerProfile: { ...profile, isRegistered: true } });
  }

  async registerUmpire(userId: string, profile: any) {
    return this.update(userId, { umpireProfile: { ...profile, isRegistered: true } });
  }

  async findNearbyScorers(lat: number, lng: number) {
    return this.userModel.find({
      'scorerProfile.isRegistered': true,
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: 50000 // 50km
        }
      }
    }).exec();
  }

  async follow(followerId: string, followingId: string) {
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });
    return { success: true };
  }

  async unfollow(followerId: string, followingId: string) {
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
    await this.userModel.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });
    return { success: true };
  }

  async getNearby(lat: number, lng: number, radius: number = 10000) {
    return this.userModel.find({
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius
        }
      }
    }).limit(20).exec();
  }
}

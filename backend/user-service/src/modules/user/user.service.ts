import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll(query: any): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async search(q: string): Promise<User[]> {
    return this.userModel.find({ fullName: new RegExp(q, 'i') }).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getStats(id: string): Promise<any> {
    return { matches: 10, runs: 350, wickets: 12 };
  }

  async update(id: string, data: any): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
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

  async getNearby(query: any) {
    return this.userModel.find().limit(10).exec();
  }
}

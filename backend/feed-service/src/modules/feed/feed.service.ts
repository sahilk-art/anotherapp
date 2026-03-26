import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feed } from './schemas/feed.schema';
import { CreateFeedDto } from './dto/create-feed.dto';

@Injectable()
export class FeedService {
  constructor(@InjectModel(Feed.name) private feedModel: Model<Feed>) {}

  async create(createFeedDto: CreateFeedDto): Promise<Feed> {
    const createdFeed = new this.feedModel(createFeedDto);
    return createdFeed.save();
  }

  async findAll(): Promise<Feed[]> {
    return this.feedModel.find().populate('author').sort({ createdAt: -1 }).exec();
  }

  async likePost(postId: string, userId: string): Promise<Feed> {
    return this.feedModel
      .findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true },
      )
      .exec();
  }
}

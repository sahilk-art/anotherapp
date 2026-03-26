import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Like } from './schemas/like.schema';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(data: any): Promise<Post> {
    const post = new this.postModel(data);
    return post.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find({ isActive: true }).populate('author').sort({ createdAt: -1 }).exec();
  }

  async getTrending(): Promise<Post[]> {
    return this.postModel.find({ isActive: true }).sort({ likesCount: -1, commentsCount: -1 }).limit(10).exec();
  }

  async likePost(postId: string, userId: string) {
    const existing = await this.likeModel.findOne({ post: postId, user: userId });
    if (existing) return { success: false, message: 'Already liked' };

    await new this.likeModel({ post: postId, user: userId }).save();
    await this.postModel.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
    return { success: true };
  }

  async addComment(postId: string, data: any) {
    const comment = new this.commentModel({ post: postId, ...data });
    await comment.save();
    await this.postModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    return comment;
  }

  async votePoll(postId: string, optionIndex: number, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post.poll) throw new Error('Post has no poll');
    if (post.poll.voters.includes(new Types.ObjectId(userId))) throw new Error('Already voted');

    post.poll.options[optionIndex].votes += 1;
    post.poll.totalVotes += 1;
    post.poll.voters.push(new Types.ObjectId(userId));
    return post.save();
  }
}

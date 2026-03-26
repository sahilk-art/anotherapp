import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PostType, MediaType, Visibility } from '../../../../shared/enums';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ type: String, enum: PostType, required: true })
  type: PostType;

  @Prop({ maxlength: 2000 })
  content?: string;

  @Prop({
    type: [{
      url: String,
      type: { type: String, enum: MediaType },
      thumbnail: String,
      aspectRatio: Number,
    }],
  })
  media: Array<{ url: string; type: MediaType; thumbnail?: string; aspectRatio?: number }>;

  @Prop({
    type: {
      question: String,
      options: [{ text: String, votes: { type: Number, default: 0 } }],
      expiresAt: Date,
      totalVotes: { type: Number, default: 0 },
      voters: [{ type: Types.ObjectId, ref: 'User' }],
    },
  })
  poll?: {
    question: string;
    options: Array<{ text: string; votes: number }>;
    expiresAt: Date;
    totalVotes: number;
    voters: Types.ObjectId[];
  };

  @Prop({ type: Types.ObjectId, ref: 'Match' })
  linkedMatch?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tournament' })
  linkedTournament?: Types.ObjectId;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  mentions: Types.ObjectId[];

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({ default: 0 })
  sharesCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, enum: Visibility, default: Visibility.PUBLIC })
  visibility: Visibility;
}

export const PostSchema = SchemaFactory.createForClass(Post);

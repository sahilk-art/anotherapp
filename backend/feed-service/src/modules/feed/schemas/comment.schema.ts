import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Post', index: true })
  post: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  parentComment?: Types.ObjectId;

  @Prop({ required: true, maxlength: 500 })
  content: string;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Follow extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  follower: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  following: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

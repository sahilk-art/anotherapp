import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Conversation', index: true })
  conversation: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  sender: Types.ObjectId;

  @Prop({ type: String, enum: ['TEXT', 'IMAGE', 'VIDEO', 'MATCH_CARD', 'SCORECARD', 'SYSTEM'], default: 'TEXT' })
  type: string;

  @Prop()
  content: string;

  @Prop({ type: Object })
  media?: { url: string; type: string; thumbnail: string };
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversation: 1, createdAt: -1 });

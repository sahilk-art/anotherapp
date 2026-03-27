import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ type: String, enum: ['DIRECT', 'TEAM_GROUP', 'TOURNAMENT_GROUP', 'MATCH_GROUP'], required: true })
  type: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  team?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tournament' })
  tournament?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Match' })
  match?: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop({ type: Object })
  lastMessage: { content: string; sender: Types.ObjectId; timestamp: Date };
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

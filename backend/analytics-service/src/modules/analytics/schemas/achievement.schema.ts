import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Achievement extends Document {
  @Prop({ unique: true, required: true }) code: string;
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop() icon: string;
  @Prop({ type: String, enum: ['BATTING', 'BOWLING', 'FIELDING', 'MILESTONE', 'SOCIAL', 'SPECIAL'] }) category: string;
  @Prop({ type: Object }) requirement: { type: string; value: number; operator: string };
  @Prop({ default: 0 }) points: number;
  @Prop({ type: String, enum: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'] }) rarity: string;
  @Prop({ default: true }) isActive: boolean;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);

@Schema({ timestamps: true })
export class UserAchievement extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' }) user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'Achievement' }) achievement: Types.ObjectId;
  @Prop({ default: Date.now }) unlockedAt: Date;
  @Prop({ type: Types.ObjectId, ref: 'Match' }) match?: Types.ObjectId;
  @Prop({ type: Object }) metadata: any;
}

export const UserAchievementSchema = SchemaFactory.createForClass(UserAchievement);

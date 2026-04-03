import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LeaderboardType, LeaderboardCategory } from '../../../shared/enums';

@Schema({ timestamps: true })
export class Leaderboard extends Document {
  @Prop({ type: String, enum: LeaderboardType, required: true })
  type: LeaderboardType;

  @Prop({ type: String, enum: LeaderboardCategory, required: true })
  category: LeaderboardCategory;

  @Prop({ type: Types.ObjectId, ref: 'Tournament' })
  tournament?: Types.ObjectId;

  @Prop({ type: Object })
  location?: { city: string; state: string; country: string };

  @Prop({ type: Object })
  period?: { startDate: Date; endDate: Date };

  @Prop({
    type: [{
      rank: Number,
      player: { type: Types.ObjectId, ref: 'User' },
      value: Number,
      matches: Number,
      team: { type: Types.ObjectId, ref: 'Team' },
      previousRank: Number,
      change: Number,
    }],
  })
  entries: Array<{
    rank: number;
    player: Types.ObjectId;
    value: number;
    matches: number;
    team: Types.ObjectId;
    previousRank: number;
    change: number;
  }>;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);

LeaderboardSchema.index({ type: 1, category: 1, tournament: 1 });

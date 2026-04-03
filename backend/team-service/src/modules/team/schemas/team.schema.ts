import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TeamMemberRole } from '../../../../../shared/enums';

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ maxlength: 5 })
  shortName: string;

  @Prop()
  logo?: string;

  @Prop()
  coverImage?: string;

  @Prop({ maxlength: 1000 })
  description?: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  captain: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  viceCaptain: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  wicketKeeper: Types.ObjectId;

  @Prop({
    type: [{
      player: { type: Types.ObjectId, ref: 'User' },
      role: { type: String, enum: TeamMemberRole },
      jerseyNumber: Number,
      joinedAt: { type: Date, default: Date.now },
    }],
  })
  members: Array<{
    player: Types.ObjectId;
    role: TeamMemberRole;
    jerseyNumber: number;
    joinedAt: Date;
  }>;

  @Prop({ type: Object })
  location: {
    city: string;
    state: string;
    country: string;
  };

  @Prop({ default: 0 })
  matchesPlayed: number;

  @Prop({ default: 0 })
  matchesWon: number;

  @Prop({ default: 0 })
  matchesLost: number;

  @Prop({ default: 0 })
  matchesTied: number;

  @Prop({ default: 0 })
  matchesDrawn: number;

  @Prop({ default: 0 })
  noResult: number;

  @Prop({ default: 0 })
  winPercentage: number;

  @Prop()
  teamColor?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: 25 })
  maxMembers: number;

  @Prop({ unique: true })
  inviteCode?: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ name: 'text' });
TeamSchema.index({ owner: 1 });
TeamSchema.index({ inviteCode: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchStatus, MatchType, BallType, PitchType, TossDecision, WinType } from '../../../shared/enums';

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop()
  matchTitle: string;

  @Prop({ type: String, enum: MatchType })
  matchType: MatchType;

  @Prop({ type: String, enum: BallType })
  ballType: BallType;

  @Prop({ type: String, enum: PitchType })
  pitchType: PitchType;

  @Prop({ type: Object })
  options: {
    totalOvers: number;
    oversPerBowler: number;
    powerPlayOvers: number;
    playersPerSide: number;
    wideRun: number;
    noBallRun: number;
    isNoBallFreeHit: boolean;
    legByeEnabled: boolean;
    byeEnabled: boolean;
  };

  @Prop({
    type: {
      team: { type: Types.ObjectId, ref: 'Team' },
      teamName: String,
      teamLogo: String,
      playingXI: [{ type: Types.ObjectId, ref: 'User' }],
      extras: {
        wides: { type: Number, default: 0 },
        noBalls: { type: Number, default: 0 },
        byes: { type: Number, default: 0 },
        legByes: { type: Number, default: 0 },
        penalty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
  })
  teamA: {
    team: Types.ObjectId;
    teamName: string;
    teamLogo: string;
    playingXI: Types.ObjectId[];
    extras: { wides: number; noBalls: number; byes: number; legByes: number; penalty: number; total: number };
  };

  @Prop({
    type: {
      team: { type: Types.ObjectId, ref: 'Team' },
      teamName: String,
      teamLogo: String,
      playingXI: [{ type: Types.ObjectId, ref: 'User' }],
      extras: {
        wides: { type: Number, default: 0 },
        noBalls: { type: Number, default: 0 },
        byes: { type: Number, default: 0 },
        legByes: { type: Number, default: 0 },
        penalty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
  })
  teamB: {
    team: Types.ObjectId;
    teamName: string;
    teamLogo: string;
    playingXI: Types.ObjectId[];
    extras: { wides: number; noBalls: number; byes: number; legByes: number; penalty: number; total: number };
  };

  @Prop({ type: Object })
  toss: {
    wonBy: Types.ObjectId;
    decision: TossDecision;
  };

  @Prop({ type: Object })
  venue: {
    name: string;
    city: string;
    ground: string;
    coordinates: { type: string; coordinates: number[] };
  };

  @Prop({ required: true })
  matchDate: Date;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop({ type: String, enum: MatchStatus, default: MatchStatus.UPCOMING })
  status: MatchStatus;

  @Prop({ default: 1 })
  currentInnings: number;

  @Prop({ type: Object })
  result: {
    winner: Types.ObjectId;
    resultText: string;
    winMargin: number;
    winType: WinType;
    manOfTheMatch: Types.ObjectId;
  };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  scorer: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  umpires: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Tournament' })
  tournament: Types.ObjectId;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  shareCount: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

MatchSchema.index({ status: 1 });
MatchSchema.index({ matchDate: -1 });
MatchSchema.index({ 'teamA.team': 1 });
MatchSchema.index({ 'teamB.team': 1 });
MatchSchema.index({ tournament: 1 });
MatchSchema.index({ createdBy: 1 });
MatchSchema.index({ 'venue.coordinates': '2dsphere' });

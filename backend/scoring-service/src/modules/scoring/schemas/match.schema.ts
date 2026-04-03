import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchStatus, MatchType, BallType, PitchType, TossDecision, WinType } from '../../../../../shared/enums';

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop() matchTitle: string;
  @Prop({ type: String, enum: MatchType }) matchType: MatchType;
  @Prop({ type: String, enum: BallType }) ballType: BallType;
  @Prop({ type: String, enum: PitchType }) pitchType: PitchType;
  @Prop({ type: Object }) options: {
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
  @Prop({ type: Object }) teamA: { team: Types.ObjectId; teamName: string; playingXI: Types.ObjectId[] };
  @Prop({ type: Object }) teamB: { team: Types.ObjectId; teamName: string; playingXI: Types.ObjectId[] };
  @Prop({ type: Object }) toss: { wonBy: Types.ObjectId; decision: TossDecision };
  @Prop({ required: true }) matchDate: Date;
  @Prop({ type: String, enum: MatchStatus, default: MatchStatus.UPCOMING }) status: MatchStatus;
  @Prop({ default: 1 }) currentInnings: number;
  @Prop({ type: Object }) result: { winner: Types.ObjectId; resultText: string; winMargin: number; winType: WinType };
  @Prop({ type: Types.ObjectId, ref: 'User' }) scorer: Types.ObjectId;

  @Prop({ type: Object })
  dlsData?: {
    isApplied: boolean;
    interruptions: Array<any>;
    revisedTarget?: number;
    parScore?: number;
    resourcesTeamA?: number;
    resourcesTeamB?: number;
  };

  @Prop({ type: Object })
  testMatchData?: {
    totalInnings: number;
    sessions: Array<any>;
    followOn: { isEnforced: boolean; trailAmount: number };
  };

  @Prop({ type: Object })
  hundredFormat?: {
    totalBalls: number;
    ballsPerSet: number;
    changeEndAfter: number;
  };
}

export const MatchSchema = SchemaFactory.createForClass(Match);

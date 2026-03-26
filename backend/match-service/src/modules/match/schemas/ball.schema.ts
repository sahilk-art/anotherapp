import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExtraType, DismissalType, ShotType, PitchLength } from '../../../../shared/enums';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Ball extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Match', index: true })
  match: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Innings', index: true })
  innings: Types.ObjectId;

  @Prop({ required: true })
  overNumber: number;

  @Prop({ required: true })
  ballNumber: number;

  @Prop({ required: true })
  ballInOver: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  batsman: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  nonStriker: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  bowler: Types.ObjectId;

  @Prop({ default: 0 })
  runs: number;

  @Prop({ default: 0 })
  batsmanRuns: number;

  @Prop({ default: 0 })
  extraRuns: number;

  @Prop({ default: 0 })
  totalRuns: number;

  @Prop({ type: String, enum: ExtraType, default: ExtraType.NONE })
  extraType: ExtraType;

  @Prop({ default: false })
  isWicket: boolean;

  @Prop({ type: Object })
  wicket: {
    type: DismissalType;
    batsman: Types.ObjectId;
    bowler: Types.ObjectId;
    fielder: Types.ObjectId;
    description: string;
  };

  @Prop({ default: false })
  isFour: boolean;

  @Prop({ default: false })
  isSix: boolean;

  @Prop({ default: false })
  isDotBall: boolean;

  @Prop({ default: false })
  isFreeHit: boolean;

  @Prop({ default: true })
  isLegal: boolean;

  @Prop({ type: String, enum: ShotType })
  shotType?: ShotType;

  @Prop()
  shotAngle?: number;

  @Prop()
  shotDistance?: number;

  @Prop({ type: Object })
  pitchMap: {
    x: number;
    y: number;
    length: PitchLength;
  };

  @Prop()
  commentary?: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: false })
  isUndone: boolean;

  @Prop({ type: Object })
  scoreBefore: { runs: number; wickets: number; overs: number };

  @Prop({ type: Object })
  scoreAfter: { runs: number; wickets: number; overs: number };
}

export const BallSchema = SchemaFactory.createForClass(Ball);

BallSchema.index({ match: 1, innings: 1, overNumber: 1, ballNumber: 1 });

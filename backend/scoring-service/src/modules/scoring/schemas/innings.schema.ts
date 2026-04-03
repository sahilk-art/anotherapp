import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InningsStatus, DismissalType } from '../../../shared/enums';

@Schema({ timestamps: true })
export class Innings extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Match', index: true })
  match: Types.ObjectId;

  @Prop({ required: true })
  inningsNumber: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Team' })
  battingTeam: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Team' })
  bowlingTeam: Types.ObjectId;

  @Prop({ default: 0 }) totalRuns: number;
  @Prop({ default: 0 }) totalWickets: number;
  @Prop({ default: 0.0 }) totalOvers: number;
  @Prop({ default: 0 }) totalBalls: number;

  @Prop({ type: Object, default: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0, total: 0 } })
  extras: { wides: number; noBalls: number; byes: number; legByes: number; penalty: number; total: number };

  @Prop({ default: 0.00 }) runRate: number;
  @Prop({ default: 0.00 }) requiredRunRate: number;
  @Prop() target?: number;

  @Prop({ type: Object })
  currentBatsmen: { striker: Types.ObjectId; nonStriker: Types.ObjectId };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  currentBowler: Types.ObjectId;

  @Prop({ type: Array, default: [] })
  battingOrder: Array<any>;

  @Prop({ type: Array, default: [] })
  bowlingOrder: Array<any>;

  @Prop({ type: Array, default: [] })
  fallOfWickets: Array<any>;

  @Prop({ type: String, enum: InningsStatus, default: InningsStatus.NOT_STARTED })
  status: InningsStatus;

  @Prop({ default: false }) isFreeHit: boolean;
}

export const InningsSchema = SchemaFactory.createForClass(Innings);

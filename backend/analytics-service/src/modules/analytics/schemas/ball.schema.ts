import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExtraType, DismissalType } from '../../../../../shared/enums';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Ball extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Match', index: true })
  match: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Innings', index: true })
  innings: Types.ObjectId;

  @Prop({ required: true }) overNumber: number;
  @Prop({ required: true }) ballNumber: number;
  @Prop({ required: true }) ballInOver: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' }) batsman: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' }) nonStriker: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' }) bowler: Types.ObjectId;

  @Prop({ default: 0 }) runs: number;
  @Prop({ default: 0 }) batsmanRuns: number;
  @Prop({ default: 0 }) extraRuns: number;
  @Prop({ default: 0 }) totalRuns: number;

  @Prop({ type: String, enum: ExtraType, default: ExtraType.NONE })
  extraType: ExtraType;

  @Prop({ default: false }) isWicket: boolean;
  @Prop({ type: Object }) wicket: { type: DismissalType; batsman: Types.ObjectId; bowler: Types.ObjectId; fielder: Types.ObjectId; description: string };

  @Prop({ default: false }) isLegal: boolean;
  @Prop({ default: false }) isFreeHit: boolean;

  @Prop({ type: Object })
  stateBefore: any;
}

export const BallSchema = SchemaFactory.createForClass(Ball);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InningsStatus, DismissalType } from '../../../../shared/enums';

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

  @Prop({ default: 0 })
  totalRuns: number;

  @Prop({ default: 0 })
  totalWickets: number;

  @Prop({ default: 0.0 })
  totalOvers: number;

  @Prop({ default: 0 })
  totalBalls: number;

  @Prop({
    type: Object,
    default: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0, total: 0 },
  })
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
    total: number;
  };

  @Prop({ default: 0.00 })
  runRate: number;

  @Prop({ default: 0.00 })
  requiredRunRate: number;

  @Prop()
  target?: number;

  @Prop({ type: Object })
  currentBatsmen: {
    striker: Types.ObjectId;
    nonStriker: Types.ObjectId;
  };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  currentBowler: Types.ObjectId;

  @Prop({
    type: [{
      batsman: { type: Types.ObjectId, ref: 'User' },
      position: Number,
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0.00 },
      isOut: { type: Boolean, default: false },
      dismissal: {
        type: { type: String, enum: DismissalType },
        bowler: { type: Types.ObjectId, ref: 'User' },
        fielder: { type: Types.ObjectId, ref: 'User' },
        description: String,
      },
      isNotOut: { type: Boolean, default: true },
      dotBalls: { type: Number, default: 0 },
      singles: { type: Number, default: 0 },
      doubles: { type: Number, default: 0 },
      triples: { type: Number, default: 0 },
      minutesBatted: Number,
    }],
  })
  battingOrder: Array<{
    batsman: Types.ObjectId;
    position: number;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    isOut: boolean;
    dismissal: { type: DismissalType; bowler: Types.ObjectId; fielder: Types.ObjectId; description: string };
    isNotOut: boolean;
    dotBalls: number;
    singles: number;
    doubles: number;
    triples: number;
    minutesBatted: number;
  }>;

  @Prop({
    type: [{
      bowler: { type: Types.ObjectId, ref: 'User' },
      overs: { type: Number, default: 0.0 },
      balls: { type: Number, default: 0 },
      maidens: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      economy: { type: Number, default: 0.00 },
      dotBalls: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      spellHistory: [{ overs: Number, runs: Number, wickets: Number }],
    }],
  })
  bowlingOrder: Array<{
    bowler: Types.ObjectId;
    overs: number;
    balls: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    dotBalls: number;
    fours: number;
    sixes: number;
    wides: number;
    noBalls: number;
    spellHistory: Array<{ overs: number; runs: number; wickets: number }>;
  }>;

  @Prop({ type: Array })
  fallOfWickets: Array<{
    wicketNumber: number;
    runs: number;
    overs: number;
    batsman: Types.ObjectId;
    bowler: Types.ObjectId;
    fielder: Types.ObjectId;
    dismissalType: string;
  }>;

  @Prop({ type: Array })
  partnerships: Array<{
    batsman1: Types.ObjectId;
    batsman2: Types.ObjectId;
    runs: number;
    balls: number;
    wicket: number;
  }>;

  @Prop({ type: Array })
  overHistory: Array<{
    overNumber: number;
    bowler: Types.ObjectId;
    runs: number;
    wickets: number;
    balls: Types.ObjectId[];
    isMaiden: boolean;
  }>;

  @Prop({ type: Object })
  powerPlay: { overs: number; runs: number; wickets: number };

  @Prop({ type: String, enum: InningsStatus, default: InningsStatus.NOT_STARTED })
  status: InningsStatus;
}

export const InningsSchema = SchemaFactory.createForClass(Innings);

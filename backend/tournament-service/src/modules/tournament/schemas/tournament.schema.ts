import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  TournamentFormat,
  MatchType,
  BallType,
  TournamentTeamStatus,
  RoundType,
  TournamentStatus,
} from '../../../../shared/enums';

@Schema({ timestamps: true })
export class Tournament extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  shortName?: string;

  @Prop()
  logo?: string;

  @Prop()
  banner?: string;

  @Prop({ maxlength: 2000 })
  description?: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  organizer: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  admins: Types.ObjectId[];

  @Prop({ type: String, enum: TournamentFormat })
  format: TournamentFormat;

  @Prop({ type: String, enum: MatchType })
  matchType: MatchType;

  @Prop({ type: String, enum: BallType })
  ballType: BallType;

  @Prop()
  totalOvers: number;

  @Prop()
  oversPerBowler: number;

  @Prop({ default: 11 })
  playersPerSide: number;

  @Prop({
    type: [{
      team: { type: Types.ObjectId, ref: 'Team' },
      group: String,
      registrationDate: { type: Date, default: Date.now },
      seedNumber: Number,
      status: { type: String, enum: TournamentTeamStatus },
    }],
  })
  teams: Array<{
    team: Types.ObjectId;
    group: string;
    registrationDate: Date;
    seedNumber: number;
    status: TournamentTeamStatus;
  }>;

  @Prop()
  maxTeams?: number;

  @Prop()
  minTeams?: number;

  @Prop({ type: [{ name: String, teams: [{ type: Types.ObjectId, ref: 'Team' }] }] })
  groups: Array<{ name: string; teams: Types.ObjectId[] }>;

  @Prop({
    type: [{
      name: String,
      type: { type: String, enum: RoundType },
      matches: [{ type: Types.ObjectId, ref: 'Match' }],
    }],
  })
  rounds: Array<{ name: string; type: RoundType; matches: Types.ObjectId[] }>;

  @Prop({
    type: [{
      match: { type: Types.ObjectId, ref: 'Match' },
      round: String,
      matchNumber: Number,
      date: Date,
      venue: String,
      teamA: { type: Types.ObjectId, ref: 'Team' },
      teamB: { type: Types.ObjectId, ref: 'Team' },
    }],
  })
  schedule: Array<{
    match: Types.ObjectId;
    round: string;
    matchNumber: number;
    date: Date;
    venue: string;
    teamA: Types.ObjectId;
    teamB: Types.ObjectId;
  }>;

  @Prop({
    type: [{
      team: { type: Types.ObjectId, ref: 'Team' },
      group: String,
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      lost: { type: Number, default: 0 },
      tied: { type: Number, default: 0 },
      noResult: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      netRunRate: { type: Number, default: 0.000 },
      runsScored: { type: Number, default: 0 },
      oversFaced: { type: Number, default: 0.0 },
      runsConceded: { type: Number, default: 0 },
      oversBowled: { type: Number, default: 0.0 },
      position: Number,
    }],
  })
  pointsTable: Array<{
    team: Types.ObjectId;
    group: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    netRunRate: number;
    runsScored: number;
    oversFaced: number;
    runsConceded: number;
    oversBowled: number;
    position: number;
  }>;

  @Prop({ type: Object, default: { win: 2, loss: 0, tie: 1, noResult: 1, bonusPoint: false } })
  pointSystem: { win: number; loss: number; tie: number; noResult: number; bonusPoint: boolean };

  @Prop({ type: [{ position: String, prize: String, amount: Number }] })
  prizes: Array<{ position: string; prize: string; amount: number }>;

  @Prop({ type: Object })
  venue: {
    name: string;
    city: string;
    state: string;
    address: string;
    coordinates: { type: string; coordinates: number[] };
  };

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  registrationDeadline?: Date;

  @Prop({ default: 0 })
  entryFee: number;

  @Prop({ type: String, enum: TournamentStatus, default: TournamentStatus.DRAFT })
  status: TournamentStatus;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  winner?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  runnerUp?: Types.ObjectId;

  @Prop({ type: [String] })
  rules: string[];

  @Prop({ type: [String] })
  sponsorLogos: string[];

  @Prop({ default: true })
  isPublic: boolean;

  @Prop()
  registrationLink?: string;

  @Prop()
  contactPhone?: string;

  @Prop()
  contactEmail?: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: 0 })
  viewCount: number;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);

TournamentSchema.index({ name: 'text' });
TournamentSchema.index({ organizer: 1 });
TournamentSchema.index({ status: 1 });
TournamentSchema.index({ startDate: -1 });
TournamentSchema.index({ 'venue.coordinates': '2dsphere' });

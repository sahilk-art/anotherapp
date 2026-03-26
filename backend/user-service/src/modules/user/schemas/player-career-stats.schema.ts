import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { updatedAt: true, createdAt: false } })
export class PlayerCareerStats extends Document {
  @Prop({ type: Types.ObjectId, required: true, unique: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Object, default: { matches: 0, innings: 0, runs: 0, ballsFaced: 0, notOuts: 0, highest: 0, highestNotOut: false, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, ducks: 0, fours: 0, sixes: 0, thirties: 0, dotBallsPlayed: 0 } })
  batting: {
    matches: number;
    innings: number;
    runs: number;
    ballsFaced: number;
    notOuts: number;
    highest: number;
    highestNotOut: boolean;
    average: number;
    strikeRate: number;
    fifties: number;
    hundreds: number;
    ducks: number;
    fours: number;
    sixes: number;
    thirties: number;
    dotBallsPlayed: number;
  };

  @Prop({ type: Object, default: { matches: 0, innings: 0, overs: 0, ballsBowled: 0, runs: 0, wickets: 0, bestBowlingWickets: 0, bestBowlingRuns: 0, average: 0, economy: 0, strikeRate: 0, fourWickets: 0, fiveWickets: 0, maidens: 0, dotBallsBowled: 0, noBalls: 0, wides: 0 } })
  bowling: {
    matches: number;
    innings: number;
    overs: number;
    ballsBowled: number;
    runs: number;
    wickets: number;
    bestBowlingWickets: number;
    bestBowlingRuns: number;
    average: number;
    economy: number;
    strikeRate: number;
    fourWickets: number;
    fiveWickets: number;
    maidens: number;
    dotBallsBowled: number;
    noBalls: number;
    wides: number;
  };

  @Prop({ type: Object, default: { catches: 0, stumpings: 0, runOuts: 0, directHits: 0 } })
  fielding: {
    catches: number;
    stumpings: number;
    runOuts: number;
    directHits: number;
  };

  @Prop({ type: [Number] })
  recentForm: number[];

  @Prop({ default: 0 })
  manOfTheMatch: number;
}

export const PlayerCareerStatsSchema = SchemaFactory.createForClass(PlayerCareerStats);

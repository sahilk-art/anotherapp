import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Innings } from './schemas/innings.schema';
import { Ball } from './schemas/ball.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Innings.name) private inningsModel: Model<Innings>,
    @InjectModel(Ball.name) private ballModel: Model<Ball>,
  ) {}

  async getWagonWheel(matchId: string, playerId?: string) {
    const query: any = { match: matchId, runs: { $gt: 0 } };
    if (playerId) query.batsman = playerId;
    return this.ballModel.find(query).select('shotAngle shotDistance runs').exec();
  }

  async getMVP(matchId: string) {
    // Basic MVP calculation based on runs, wickets, and strike rate
    const balls = await this.ballModel.find({ match: matchId }).exec();
    const scores = {};

    balls.forEach(ball => {
      scores[ball.batsman.toString()] = (scores[ball.batsman.toString()] || 0) + ball.batsmanRuns;
      if (ball.isWicket) {
        scores[ball.bowler.toString()] = (scores[ball.bowler.toString()] || 0) + 25; // 25 points for wicket
      }
    });

    const sorted = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
    return sorted.length > 0 ? { playerId: sorted[0][0], points: sorted[0][1] } : null;
  }
}

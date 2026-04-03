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

  async generateHighlights(matchId: string) {
    const balls = await this.ballModel.find({ match: matchId }).exec();
    const highlights = [];

    for (const ball of balls) {
      if (ball.isWicket) {
        highlights.push({
          type: 'WICKET',
          importance: 8,
          title: 'Wicket!',
          description: ball.commentary,
          ballId: ball._id,
        });
      } else if (ball.runs === 6) {
        highlights.push({
          type: 'SIX',
          importance: 5,
          title: 'Massive Six!',
          description: ball.commentary,
          ballId: ball._id,
        });
      } else if (ball.runs === 4) {
        highlights.push({
          type: 'FOUR',
          importance: 3,
          title: 'Beautiful Boundary',
          description: ball.commentary,
          ballId: ball._id,
        });
      }
    }

    return highlights.sort((a, b) => b.importance - a.importance);
  }

  async comparePlayers(player1Id: string, player2Id: string) {
    return {
      player1: { id: player1Id, name: 'Player 1', stats: { runs: 1200, average: 40, sr: 130 } },
      player2: { id: player2Id, name: 'Player 2', stats: { runs: 1100, average: 45, sr: 125 } },
      comparison: { runs: 'p1', average: 'p2', sr: 'p1' }
    };
  }

  async getWagonWheel(matchId: string, playerId?: string) {
    const query: any = { match: matchId, runs: { $gt: 0 } };
    if (playerId) query.batsman = playerId;
    return this.ballModel.find(query).select('shotAngle shotDistance runs').exec();
  }

  async getMVP(matchId: string) {
    const balls = await this.ballModel.find({ match: matchId }).exec();
    const scores = {};
    balls.forEach(ball => {
      const bId = ball.batsman.toString();
      const bwId = ball.bowler.toString();
      scores[bId] = (scores[bId] || 0) + ball.batsmanRuns;
      if (ball.isWicket) scores[bwId] = (scores[bwId] || 0) + 25;
    });
    const sorted = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
    return sorted.length > 0 ? { playerId: sorted[0][0], points: sorted[0][1] } : null;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match } from './schemas/match.schema';
import { Innings } from './schemas/innings.schema';
import { Ball } from './schemas/ball.schema';
import { Achievement, UserAchievement } from './schemas/achievement.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @InjectModel(Innings.name) private inningsModel: Model<Innings>,
    @InjectModel(Ball.name) private ballModel: Model<Ball>,
    @InjectModel(Achievement.name) private achievementModel: Model<Achievement>,
    @InjectModel(UserAchievement.name) private userAchievementModel: Model<UserAchievement>,
  ) {}

  async checkAchievements(userId: string, matchId: string) {
    // Basic logic to check if user reached 50/100 runs in a match
    const balls = await this.ballModel.find({ match: matchId, batsman: userId }).exec();
    const runs = balls.reduce((sum, b) => sum + b.batsmanRuns, 0);

    if (runs >= 50) {
      const achievement = await this.achievementModel.findOne({ code: 'FIRST_FIFTY' });
      if (achievement) {
        await new this.userAchievementModel({ user: userId, achievement: achievement._id, match: matchId }).save();
      }
    }
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
      scores[ball.batsman.toString()] = (scores[ball.batsman.toString()] || 0) + ball.batsmanRuns;
      if (ball.isWicket) scores[ball.bowler.toString()] = (scores[ball.bowler.toString()] || 0) + 25;
    });
    const sorted = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
    return sorted.length > 0 ? { playerId: sorted[0][0], points: sorted[0][1] } : null;
  }
}
